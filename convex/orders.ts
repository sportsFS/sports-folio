import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { sendEmail } from "./email";
import { requireAdmin, requireCurrentUser } from "./auth";

const RETURN_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

async function releaseReservation(ctx: any, order: any) {
  if (order.inventoryStatus !== "reserved") return;
  for (const item of order.items) {
    if (typeof item.productId !== "string") continue;
    const product = await ctx.db.get(item.productId as any);
    if (!product) continue;
    await ctx.db.patch(product._id, {
      reservedQuantity: Math.max(0, (product.reservedQuantity ?? 0) - item.qty),
    });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]!);
}

async function cleanupExpiredReservations(ctx: any) {
  const stale = await ctx.db.query("orders")
    .withIndex("by_status", (q: any) => q.eq("status", "pending"))
    .collect();

  let cleaned = 0;
  for (const order of stale) {
    const createdAt = new Date(order.createdAt).getTime();
    const expiredAt = order.reservationExpiresAt ?? createdAt + 30 * 60 * 1000;
    if (expiredAt < Date.now() && order.paymentStatus !== "paid") {
      await releaseReservation(ctx, order);
      await ctx.db.patch(order._id, { status: "cancelled", paymentStatus: "failed", inventoryStatus: "released" });
      cleaned++;
    }
  }
  return { cleaned };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
      const caller = await requireCurrentUser(ctx);
      if (caller.role === "admin") {
       const orders = await ctx.db.query("orders").order("desc").take(200);
       return orders.map(o => ({
         id: o._id, userId: o.userId, userName: o.userName, items: o.items,
         total: o.total, shippingAmount: o.shippingAmount, shippingAddress: o.shippingAddress, status: o.status, createdAt: o.createdAt,
         paymentStatus: o.paymentStatus, paymentIntent: o.paymentIntent, stripeSessionId: o.stripeSessionId, trackingNumber: o.trackingNumber,
         inventoryStatus: o.inventoryStatus, deliveredAt: o.deliveredAt, returnRequest: o.returnRequest,
       }));
     }
        const orders = await ctx.db
          .query("orders")
          .withIndex("by_userId", q => q.eq("userId", caller._id))
          .order("desc")
          .take(50);
        return orders.map(o => ({
          id: o._id, userId: o.userId, userName: o.userName, items: o.items,
          total: o.total, shippingAmount: o.shippingAmount, shippingAddress: o.shippingAddress, status: o.status, createdAt: o.createdAt,
           paymentStatus: o.paymentStatus, paymentIntent: o.paymentIntent, stripeSessionId: o.stripeSessionId, trackingNumber: o.trackingNumber,
           inventoryStatus: o.inventoryStatus, deliveredAt: o.deliveredAt, returnRequest: o.returnRequest,
         }));
  },
});

export const placeOrderInternal = internalMutation({
  args: {
    userId: v.id("users"),
    userName: v.string(),
    items: v.array(v.object({
      productId: v.string(),
      name: v.string(),
      price: v.number(),
      qty: v.number(),
    })),
    total: v.number(),
    shippingAmount: v.number(),
    reservationExpiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      const product: any = await ctx.db.get(item.productId as any);
      if (!product || !(product.isActive ?? true) || product.price <= 0) throw new Error(`${item.name} is not available`);
      const stockQuantity = product.stockQuantity ?? 0;
      const reservedQuantity = product.reservedQuantity ?? 0;
      if (stockQuantity - reservedQuantity < item.qty) throw new Error(`${item.name} does not have enough stock`);
      await ctx.db.patch(product._id, { reservedQuantity: reservedQuantity + item.qty });
    }

    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      userName: args.userName,
      items: args.items,
      total: args.total,
      shippingAmount: args.shippingAmount,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      stripeSessionId: undefined,
      paymentIntent: undefined,
      reservationExpiresAt: args.reservationExpiresAt,
      inventoryStatus: "reserved",
    });
    try {
      const user = await ctx.db.get(args.userId);
      if (user) {
        await sendEmail("hello@sportsfolio.store", `New Order #${orderId} - SPORTSFOLIO (pending payment)`,
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#1a1a1a">New Order Received (Awaiting Payment)</h2>
            <p style="color:#555"><strong>${args.userName}</strong> started order #${orderId}</p>
            <p style="color:#999;font-size:0.85rem">Payment status: Pending</p>
          </div>`);
      }
    } catch (e) {
      console.error("Failed to send pending payment email:", e);
    }
    return orderId;
  },
});

export const setStripeSession = internalMutation({
  args: {
    orderId: v.id("orders"),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { stripeSessionId: args.stripeSessionId });
  },
});

export const releaseCheckoutReservation = internalMutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order || order.paymentStatus === "paid") return;
    await releaseReservation(ctx, order);
    await ctx.db.patch(args.orderId, {
      status: "cancelled",
      paymentStatus: "failed",
      inventoryStatus: "released",
    });
  },
});

export const cancelOrder = mutation({
  args: {
    id: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    if (order.userId !== user._id && user.role !== "admin") throw new Error("Unauthorized");
    if (order.status !== "pending") throw new Error("Cannot cancel an order that is already shipped or delivered");
    if (order.paymentStatus === "paid") throw new Error("Paid orders cannot be cancelled. Request an exchange or replacement after delivery.");
    if (order.stripeSessionId) throw new Error("This checkout is still active and cannot be cancelled manually.");
    await releaseReservation(ctx, order);
    await ctx.db.patch(args.id, { status: "cancelled", paymentStatus: "failed", inventoryStatus: "released" });
    try {
      const user = await ctx.db.get(order.userId);
      if (user) {
        await sendEmail(user.email, "Order Cancelled - SPORTSFOLIO",
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#1a1a1a">Order Cancelled</h2>
            <p style="color:#555">Your order #${args.id} has been cancelled.</p>
          </div>`);
      }
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered")),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    const patch: any = { status: args.status };
    if (args.status === "delivered" && order.status !== "delivered") patch.deliveredAt = new Date().toISOString();
    if (args.trackingNumber !== undefined) patch.trackingNumber = args.trackingNumber;
    await ctx.db.patch(args.id, patch);
    try {
      const user = await ctx.db.get(order.userId);
      if (user) {
        if (args.status === "shipped") {
          const trackingHtml = args.trackingNumber
            ? `<p style="color:#555;margin-top:12px"><strong>Tracking Number:</strong> ${args.trackingNumber}</p>`
            : "";
          await sendEmail(user.email, "Your order has shipped! - SPORTSFOLIO",
            `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
              <h2 style="color:#1a1a1a">📦 Your order is on its way!</h2>
              <p style="color:#555">Order #${args.id}</p>
              <p style="color:#999;font-size:0.85rem">Status: <strong>SHIPPED</strong></p>
              ${trackingHtml}
            </div>`);
        } else if (args.status === "delivered") {
          await sendEmail(user.email, "Order delivered! - SPORTSFOLIO",
            `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
              <h2 style="color:#1a1a1a">✅ Your order has been delivered. Enjoy!</h2>
              <p style="color:#555">Order #${args.id}</p>
              <p style="color:#999;font-size:0.85rem">Status: <strong>DELIVERED</strong></p>
            </div>`);
        }
      }
    } catch (e) {
      console.error("Failed to send status email:", e);
    }
  },
});

export const processStripeEvent = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.union(v.literal("checkout.session.completed"), v.literal("checkout.session.expired")),
    orderId: v.optional(v.string()),
    paymentIntent: v.optional(v.string()),
    shippingAddress: v.optional(v.object({
      name: v.string(),
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      country: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("processedWebhooks")
      .withIndex("by_eventId", q => q.eq("eventId", args.eventId))
      .first();
    if (existing) return { processed: false };

    if (args.orderId) {
      const order: any = await ctx.db.get(args.orderId as any);
      if (order) {
        if (args.eventType === "checkout.session.expired" && order.paymentStatus !== "paid") {
          await releaseReservation(ctx, order);
          await ctx.db.patch(args.orderId as any, {
            status: "cancelled",
            paymentStatus: "failed",
            inventoryStatus: "released",
          });
        } else if (args.eventType === "checkout.session.completed" && order.paymentStatus !== "paid") {
          let inventoryError = order.inventoryStatus !== "reserved";
          const requestedByProduct = new Map<string, number>();
          const inventoryUpdates: Array<{ product: any; quantity: number }> = [];
          if (!inventoryError) {
            for (const item of order.items) {
              if (typeof item.productId !== "string") {
                inventoryError = true;
                break;
              }
              requestedByProduct.set(item.productId, (requestedByProduct.get(item.productId) ?? 0) + item.qty);
            }
          }
          if (!inventoryError) {
            for (const [productId, quantity] of requestedByProduct) {
              const product: any = await ctx.db.get(productId as any);
              const stockQuantity = product?.stockQuantity ?? 0;
              const reservedQuantity = product?.reservedQuantity ?? 0;
              if (!product || stockQuantity < quantity || reservedQuantity < quantity) {
                inventoryError = true;
                break;
              }
              inventoryUpdates.push({ product, quantity });
            }
          }
          if (!inventoryError) {
            for (const { product, quantity } of inventoryUpdates) {
              await ctx.db.patch(product._id, {
                stockQuantity: product.stockQuantity - quantity,
                reservedQuantity: product.reservedQuantity - quantity,
              });
            }
          }
          await ctx.db.patch(args.orderId as any, {
            status: "pending",
            paymentStatus: "paid",
            paymentIntent: args.paymentIntent,
            shippingAddress: args.shippingAddress,
            inventoryStatus: inventoryError ? "error" : "sold",
          });
          try {
            const user: any = await ctx.db.get(order.userId);
            if (user) {
              const itemsHtml = order.items.map((i: any) =>
                `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(i.name)}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td></tr>`
              ).join("");
              await sendEmail(user.email, "Payment Confirmed - SPORTSFOLIO",
                `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
                  <h2 style="color:#1a1a1a">Payment Received!</h2>
                  <p style="color:#555">Thanks ${escapeHtml(order.userName)}, your payment of $${order.total.toFixed(2)} has been confirmed.</p>
                  <p style="color:#999;font-size:0.85rem">Order #${args.orderId}</p>
                  <table style="width:100%;border-collapse:collapse;margin:16px 0">
                    <tr style="background:#f4f4f4"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr>
                    ${itemsHtml}
                  </table>
                  <p style="font-size:1.2rem;font-weight:bold;text-align:right">Total: $${order.total.toFixed(2)}</p>
                  <p style="color:#555;margin-top:16px">We'll notify you when your order ships!</p>
                </div>`);
            }
          } catch (e) {
            console.error("Failed to send payment confirmation email:", e);
          }
        }
      }
    }

    await ctx.db.insert("processedWebhooks", {
      eventId: args.eventId,
      processedAt: Date.now(),
    });

    return { processed: true };
  },
});

export const cleanupStaleOrders = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return cleanupExpiredReservations(ctx);
  },
});

export const cleanupExpiredReservationsInternal = internalMutation({
  args: {},
  handler: cleanupExpiredReservations,
});

export const requestReturn = mutation({
  args: {
    id: v.id("orders"),
    type: v.union(v.literal("exchange"), v.literal("replacement")),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const order = await ctx.db.get(args.id);
    if (!order || order.userId !== user._id) throw new Error("Order not found");
    if (order.paymentStatus !== "paid" || order.status !== "delivered") throw new Error("Returns can be requested only after a paid order is delivered");
    if (order.returnRequest) throw new Error("A return request already exists for this order");
    const reason = args.reason.trim();
    if (reason.length < 10 || reason.length > 1000) throw new Error("Please provide a reason between 10 and 1000 characters");
    const deliveredAt = new Date(order.deliveredAt ?? order.createdAt).getTime();
    if (!Number.isFinite(deliveredAt) || Date.now() - deliveredAt > RETURN_WINDOW_MS) throw new Error("The 30-day return window has ended");

    const requestedAt = new Date().toISOString();
    await ctx.db.patch(args.id, {
      returnRequest: { type: args.type, reason, status: "requested", requestedAt },
    });
    try {
      await sendEmail("hello@sportsfolio.store", `${args.type === "exchange" ? "Exchange" : "Replacement"} requested - Order #${args.id}`,
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto"><h2>Return request received</h2><p><strong>${escapeHtml(order.userName)}</strong> requested a ${args.type} for order #${args.id}.</p><p>${escapeHtml(reason)}</p></div>`);
    } catch (error) {
      console.error("Failed to send return request email:", error);
    }
  },
});

export const updateReturnRequest = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(v.literal("requested"), v.literal("approved"), v.literal("rejected"), v.literal("received"), v.literal("completed")),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const order = await ctx.db.get(args.id);
    if (!order?.returnRequest) throw new Error("Return request not found");
    const adminNote = args.adminNote?.trim();
    if (adminNote && adminNote.length > 500) throw new Error("Admin note must be 500 characters or fewer");
    const returnRequest = {
      ...order.returnRequest,
      status: args.status,
      updatedAt: new Date().toISOString(),
      adminNote: adminNote || order.returnRequest.adminNote,
    };
    await ctx.db.patch(args.id, { returnRequest });
    try {
      const user = await ctx.db.get(order.userId);
      if (user) {
        const noteHtml = returnRequest.adminNote ? `<p><strong>Note:</strong> ${escapeHtml(returnRequest.adminNote)}</p>` : "";
        await sendEmail(user.email, `Return request ${args.status} - SPORTSFOLIO`,
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto"><h2>Return request updated</h2><p>Your ${returnRequest.type} request for order #${args.id} is now <strong>${args.status}</strong>.</p>${noteHtml}<p>No cash refunds are provided except where required by law.</p></div>`);
      }
    } catch (error) {
      console.error("Failed to send return update email:", error);
    }
  },
});
