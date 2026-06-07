import { mutation } from "./_generated/server";
import { hashPassword } from "./crypto";
import { PRODUCTS } from "./productData";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", "admin@sportsfolio.com"))
      .first();
    if (existing) return;

    const hashed = await hashPassword("admin123");
    await ctx.db.insert("users", {
      name: "Admin",
      email: "admin@sportsfolio.com",
      password: hashed,
      role: "admin",
    });

    for (const product of PRODUCTS) {
      await ctx.db.insert("products", product);
    }
  },
});
