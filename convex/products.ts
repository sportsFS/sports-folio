import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";
import { PRODUCTS } from "./productData";

function productView(product: any) {
  const stockQuantity = product.stockQuantity ?? 0;
  const reservedQuantity = product.reservedQuantity ?? 0;
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    image: product.image,
    category: product.category,
    rating: product.rating,
    reviews: product.reviews,
    badge: product.badge,
    badgeClass: product.badgeClass,
    description: product.description,
    stockQuantity,
    reservedQuantity,
    availableQuantity: Math.max(0, stockQuantity - reservedQuantity),
    isActive: product.isActive ?? true,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").take(200);
    return products.filter(product => product.isActive ?? true).map(productView);
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return (await ctx.db.query("products").take(200)).map(productView);
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
      const availableQuantity = (product.stockQuantity ?? 0) - (product.reservedQuantity ?? 0);
      if (!(product.isActive ?? true) || product.price <= 0) throw new Error(`${product.name} is not available for checkout`);
      if (availableQuantity < item.qty) throw new Error(`${product.name} only has ${Math.max(0, availableQuantity)} available`);
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

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    if (await ctx.db.query("products").first()) return { inserted: 0 };
    for (const product of PRODUCTS) await ctx.db.insert("products", product);
    return { inserted: PRODUCTS.length };
  },
});

export const add = mutation({
  args: {
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
    stockQuantity: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (!Number.isInteger(args.stockQuantity) || args.stockQuantity < 0) throw new Error("Stock must be a non-negative whole number");
    const id = await ctx.db.insert("products", { ...args, reservedQuantity: 0 });
    return id;
  },
});

export const update = mutation({
  args: {
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
    stockQuantity: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    const product = await ctx.db.get(id);
    if (!product) throw new Error("Product not found");
    if (fields.stockQuantity !== undefined) {
      if (!Number.isInteger(fields.stockQuantity) || fields.stockQuantity < 0) throw new Error("Stock must be a non-negative whole number");
      if (fields.stockQuantity < (product.reservedQuantity ?? 0)) throw new Error("Stock cannot be lower than the quantity reserved in active checkouts");
    }
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    if ((product.reservedQuantity ?? 0) > 0) throw new Error("Product has stock reserved in an active checkout");
    await ctx.db.delete(args.id);
  },
});
