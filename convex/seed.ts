import { internalMutation } from "./_generated/server";
import { PRODUCTS } from "./productData";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingProduct = await ctx.db.query("products").first();
    if (existingProduct) return;

    for (const product of PRODUCTS) {
      await ctx.db.insert("products", product);
    }
  },
});
