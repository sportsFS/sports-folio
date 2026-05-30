import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { sendEmail } from "./email";

export const list = query({
  args: {
    userId: v.optional(v.id("users")),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.isAdmin) {
      const orders = await ctx.db.query("orders").order("desc").limit(200).collect();
      return orders.map(o => ({
        id: o._id,
        userId: o.userId,
        userName: o.userName,
        items: o.items,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        paymentStatus: o.paymentStatus,
        paymentIntent: o.paymentIntent,
        stripeSessionId: o.stripeSessionId,
      }));
    }
    if (!args.userId) return [];
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .order("desc")
      .limit(50)
      .collect();
    return orders.map(o => ({
      id: o._id,
      userId: o.userId,
      userName: o.userName,
      items: o.items,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      paymentStatus: o.paymentStatus,
      paymentIntent: o.paymentIntent,
      stripeSessionId: o.stripeSessionId,
    }));
  },
});

export const placeOrderInternal = internalMutation({
  args: {
    userId: v.id("users"),
    userName: v.string(),
    items: v.array(v.object({
      productId: v.number(),
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
    userId: v.id("users"),
    userName: v.string(),
    items: v.array(v.object({
      productId: v.number(),
      name: v.string(),
      price: v.number(),
      qty: v.number(),
    })),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Unauthorized: user not found");
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      userName: args.userName,
      items: args.items,
      total: args.total,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentStatus: undefined,
      stripeSessionId: undefined,
      paymentIntent: undefined,
    });
    try {
      const itemsHtml = args.items.map(i =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td></tr>`
      ).join("");
      await sendEmail(user.email, "Order Confirmed - Sports Folio Store",
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#1a1a1a">Order Confirmed!</h2>
          <p style="color:#555">Thanks ${args.userName}, your order has been placed.</p>
          <p style="color:#999;font-size:0.85rem">Order #${orderId}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f4f4f4"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr>
            ${itemsHtml}
          </table>
          <p style="font-size:1.2rem;font-weight:bold;text-align:right">Total: $${args.total.toFixed(2)}</p>
        </div>`);
      await sendEmail("hello@sportsfolio.store", `New Order #${orderId} - Sports Folio Store`,
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#1a1a1a">New Order Received</h2>
          <p style="color:#555"><strong>${args.userName}</strong> placed order #${orderId}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f4f4f4"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr>
            ${itemsHtml}
          </table>
          <p style="font-size:1.2rem;font-weight:bold;text-align:right">Total: $${args.total.toFixed(2)}</p>
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
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    if (order.userId !== args.userId) throw new Error("Unauthorized");
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
    userId: v.id("users"),
    id: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered")),
  },
  handler: async (ctx, args) => {
    const caller = await ctx.db.get(args.userId);
    if (!caller || caller.role !== "admin") throw new Error("Unauthorized: admin access required");
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(args.id, { status: args.status });
    try {
      const user = await ctx.db.get(order.userId);
      if (user) {
        const subject = args.status === "shipped" ? "Your order has shipped! - Sports Folio Store" : "Order delivered! - Sports Folio Store";
        const message = args.status === "shipped" ? "Your order is on its way!" : "Your order has been delivered. Enjoy!";
        const emoji = args.status === "shipped" ? "📦" : "✅";
        await sendEmail(user.email, subject,
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#1a1a1a">${emoji} ${message}</h2>
            <p style="color:#555">Order #${args.id}</p>
            <p style="color:#999;font-size:0.85rem">Status: <strong>${args.status.toUpperCase()}</strong></p>
          </div>`);
      }
    } catch (e) {
      console.error("Failed to send status email:", e);
    }
  },
});
