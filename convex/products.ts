import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function requireAdmin(ctx: any, userId: string) {
  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") throw new Error("Unauthorized: admin access required");
}

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

export const add = mutation({
  args: {
    userId: v.id("users"),
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
    await requireAdmin(ctx, args.userId);
    const { userId, ...fields } = args;
    const id = await ctx.db.insert("products", fields);
    return id;
  },
});

export const update = mutation({
  args: {
    userId: v.id("users"),
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
    await requireAdmin(ctx, args.userId);
    const { userId, id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    userId: v.id("users"),
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.userId);
    await ctx.db.delete(args.id);
  },
});
