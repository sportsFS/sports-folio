import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { sendEmail } from "./email";
import { requireAdminByToken, requireUserByToken } from "./sessions";

export const list = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
      const caller = await requireUserByToken(ctx, args.token);
      if (caller.role === "admin") {
       const orders = await ctx.db.query("orders").order("desc").take(200);
       return orders.map(o => ({
         id: o._id, userId: o.userId, userName: o.userName, items: o.items,
         total: o.total, status: o.status, createdAt: o.createdAt,
         paymentStatus: o.paymentStatus, paymentIntent: o.paymentIntent, stripeSessionId: o.stripeSessionId, trackingNumber: o.trackingNumber,
       }));
     }
        const orders = await ctx.db
          .query("orders")
          .withIndex("by_userId", q => q.eq("userId", caller._id))
          .order("desc")
          .take(50);
        return orders.map(o => ({
          id: o._id, userId: o.userId, userName: o.userName, items: o.items,
          total: o.total, status: o.status, createdAt: o.createdAt,
           paymentStatus: o.paymentStatus, paymentIntent: o.paymentIntent, stripeSessionId: o.stripeSessionId, trackingNumber: o.trackingNumber,
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
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      userName: args.userName,
      items: args.items,
      total: args.total,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      stripeSessionId: undefined,
      paymentIntent: undefined,
    });
    try {
      const user = await ctx.db.get(args.userId);
      if (user) {
        await sendEmail("hello@sportsfolio.store", `New Order #${orderId} - Sports Folio Store (pending payment)`,
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

export const fulfillOrder = internalMutation({
  args: {
    orderId: v.id("orders"),
    paymentIntent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(args.orderId, {
      paymentStatus: "paid",
      paymentIntent: args.paymentIntent,
    });
    try {
      const user = await ctx.db.get(order.userId);
      if (user) {
        const itemsHtml = order.items.map(i =>
          `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td></tr>`
        ).join("");
        await sendEmail(user.email, "Payment Confirmed - Sports Folio Store",
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#1a1a1a">Payment Received!</h2>
            <p style="color:#555">Thanks ${order.userName}, your payment of $${order.total.toFixed(2)} has been confirmed.</p>
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
  },
});

export const placeOrder = mutation({
  args: {
    token: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      qty: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await requireUserByToken(ctx, args.token);
    if (args.items.length === 0) throw new Error("Cart is empty");
    if (args.items.length > 50) throw new Error("Too many cart items");

    const items = [];
    let total = 0;
    for (const item of args.items) {
      if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 25) {
        throw new Error("Invalid quantity");
      }
      const product = await ctx.db.get(item.productId);
      if (!product) throw new Error("Product not found");
      if (product.price <= 0) throw new Error(`${product.name} is not available for checkout`);
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
      });
      total += product.price * item.qty;
    }

    const orderId = await ctx.db.insert("orders", {
      userId: user._id,
      userName: user.name,
      items,
      total: Number(total.toFixed(2)),
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentStatus: undefined,
      stripeSessionId: undefined,
      paymentIntent: undefined,
    });
    try {
      const itemsHtml = items.map(i =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td></tr>`
      ).join("");
      await sendEmail(user.email, "Order Confirmed - Sports Folio Store",
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#1a1a1a">Order Confirmed!</h2>
          <p style="color:#555">Thanks ${user.name}, your order has been placed.</p>
          <p style="color:#999;font-size:0.85rem">Order #${orderId}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f4f4f4"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr>
            ${itemsHtml}
          </table>
          <p style="font-size:1.2rem;font-weight:bold;text-align:right">Total: $${total.toFixed(2)}</p>
        </div>`);
      await sendEmail("hello@sportsfolio.store", `New Order #${orderId} - Sports Folio Store`,
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#1a1a1a">New Order Received</h2>
          <p style="color:#555"><strong>${user.name}</strong> placed order #${orderId}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f4f4f4"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr>
            ${itemsHtml}
          </table>
          <p style="font-size:1.2rem;font-weight:bold;text-align:right">Total: $${total.toFixed(2)}</p>
        </div>`);
    } catch (e) {
      console.error("Failed to send order emails:", e);
    }
    return orderId;
  },
});

export const cancelOrder = mutation({
  args: {
    id: v.id("orders"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUserByToken(ctx, args.token);
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    if (order.userId !== user._id && user.role !== "admin") throw new Error("Unauthorized");
    if (order.status !== "pending") throw new Error("Cannot cancel an order that is already shipped or delivered");
    await ctx.db.patch(args.id, { status: "cancelled" });
    try {
      const user = await ctx.db.get(order.userId);
      if (user) {
        await sendEmail(user.email, "Order Cancelled - Sports Folio Store",
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
    token: v.string(),
    id: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered")),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminByToken(ctx, args.token);
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    const patch: any = { status: args.status };
    if (args.trackingNumber !== undefined) patch.trackingNumber = args.trackingNumber;
    await ctx.db.patch(args.id, patch);
    try {
      const user = await ctx.db.get(order.userId);
      if (user) {
        if (args.status === "shipped") {
          const trackingHtml = args.trackingNumber
            ? `<p style="color:#555;margin-top:12px"><strong>Tracking Number:</strong> ${args.trackingNumber}</p>`
            : "";
          await sendEmail(user.email, "Your order has shipped! - Sports Folio Store",
            `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
              <h2 style="color:#1a1a1a">📦 Your order is on its way!</h2>
              <p style="color:#555">Order #${args.id}</p>
              <p style="color:#999;font-size:0.85rem">Status: <strong>SHIPPED</strong></p>
              ${trackingHtml}
            </div>`);
        } else if (args.status === "delivered") {
          await sendEmail(user.email, "Order delivered! - Sports Folio Store",
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
    orderId: v.optional(v.string()),
    paymentIntent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("processedWebhooks")
      .withIndex("by_eventId", q => q.eq("eventId", args.eventId))
      .first();
    if (existing) return { processed: false };

    if (args.orderId) {
      const order: any = await ctx.db.get(args.orderId as any);
      if (order) {
        await ctx.db.patch(args.orderId as any, {
          paymentStatus: "paid",
          paymentIntent: args.paymentIntent,
        });
        try {
          const user: any = await ctx.db.get(order.userId);
          if (user) {
            const itemsHtml = order.items.map((i: any) =>
              `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td></tr>`
            ).join("");
            await sendEmail(user.email, "Payment Confirmed - Sports Folio Store",
              `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
                <h2 style="color:#1a1a1a">Payment Received!</h2>
                <p style="color:#555">Thanks ${order.userName}, your payment of $${order.total.toFixed(2)} has been confirmed.</p>
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

    await ctx.db.insert("processedWebhooks", {
      eventId: args.eventId,
      processedAt: Date.now(),
    });

    return { processed: true };
  },
});

export const cleanupStaleOrders = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminByToken(ctx, args.token);

    const cutoff = Date.now() - 30 * 60 * 1000;
    const stale = await ctx.db.query("orders")
      .withIndex("by_status", q => q.eq("status", "pending"))
      .collect();

    let cleaned = 0;
    for (const order of stale) {
      const createdAt = new Date(order.createdAt).getTime();
      if (createdAt < cutoff && !order.stripeSessionId) {
        await ctx.db.patch(order._id, { status: "cancelled" });
        cleaned++;
      }
    }
    return { cleaned };
  },
});
