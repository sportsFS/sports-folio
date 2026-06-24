import { mutation } from "./_generated/server";
import { PRODUCTS } from "./productData";
import { requireAdmin } from "./auth";

export const migrate = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

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
