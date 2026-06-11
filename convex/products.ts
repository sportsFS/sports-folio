import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminByToken } from "./sessions";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").take(200);
    return products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      image: p.image,
      category: p.category,
      rating: p.rating,
      reviews: p.reviews,
      badge: p.badge,
      badgeClass: p.badgeClass,
    }));
  },
});

export const getCheckoutItems = internalQuery({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      qty: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) throw new Error("Cart is empty");
    if (args.items.length > 50) throw new Error("Too many cart items");

    const lineItems = [];
    let total = 0;
    for (const item of args.items) {
      if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 25) {
        throw new Error("Invalid quantity");
      }
      const product = await ctx.db.get(item.productId);
      if (!product) throw new Error("Product not found");
      if (product.price <= 0) throw new Error(`${product.name} is not available for checkout`);
      lineItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
      });
      total += product.price * item.qty;
    }

    return { lineItems, total: Number(total.toFixed(2)) };
  },
});

export const add = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    image: v.string(),
    category: v.string(),
    rating: v.number(),
    reviews: v.optional(v.number()),
    badge: v.optional(v.string()),
    badgeClass: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminByToken(ctx, args.token);
    const { token, ...fields } = args;
    const id = await ctx.db.insert("products", fields);
    return id;
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("products"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    oldPrice: v.optional(v.number()),
    image: v.optional(v.string()),
    category: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    badge: v.optional(v.string()),
    badgeClass: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminByToken(ctx, args.token);
    const { token, id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await requireAdminByToken(ctx, args.token);
    await ctx.db.delete(args.id);
  },
});
