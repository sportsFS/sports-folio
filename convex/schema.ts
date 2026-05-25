import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
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
  }),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
  }).index("by_email", ["email"]),
  otps: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    type: v.union(v.literal("register"), v.literal("reset")),
    name: v.optional(v.string()),
    hashedPassword: v.optional(v.string()),
  }).index("by_email", ["email"]),
  orders: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    items: v.array(v.object({
      productId: v.number(),
      name: v.string(),
      price: v.number(),
      qty: v.number(),
    })),
    total: v.number(),
    status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")),
    createdAt: v.string(),
  }),
});
