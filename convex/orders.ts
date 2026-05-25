import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    userId: v.optional(v.id("users")),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.isAdmin) {
      const orders = await ctx.db.query("orders").collect();
      return orders.map(o => ({
        id: o._id,
        userId: o.userId,
        userName: o.userName,
        items: o.items,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      }));
    }
    if (!args.userId) return [];
    const orders = await ctx.db
      .query("orders")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();
    return orders.map(o => ({
      id: o._id,
      userId: o.userId,
      userName: o.userName,
      items: o.items,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }));
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
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      userName: args.userName,
      items: args.items,
      total: args.total,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return orderId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
