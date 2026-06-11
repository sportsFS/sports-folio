import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { PRODUCTS } from "./productData";

export const migrate = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const caller = await ctx.db.get(args.userId);
    if (!caller || caller.role !== "admin") throw new Error("Unauthorized: admin access required");

    const existing = await ctx.db.query("products").collect();
    const existingByName = new Map(existing.map(p => [p.name, p]));

    let inserted = 0, updated = 0;

    for (const product of PRODUCTS) {
      const match = existingByName.get(product.name);
      if (match) {
        await ctx.db.patch(match._id, product);
        updated++;
      } else {
        await ctx.db.insert("products", product);
        inserted++;
      }
    }

    return { inserted, updated, total: PRODUCTS.length };
  },
});
