import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { PRODUCTS } from "./productData";

export const migrate = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const caller = await ctx.db.get(args.userId);
    if (!caller || caller.role !== "admin") throw new Error("Unauthorized: admin access required");

    const existing = await ctx.db.query("products").collect();
    for (const p of existing) {
      await ctx.db.delete(p._id);
    }

    for (const product of PRODUCTS) {
      await ctx.db.insert("products", product);
    }

    return { inserted: PRODUCTS.length, deleted: existing.length };
  },
});
