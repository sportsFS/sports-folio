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
    stockQuantity: v.optional(v.number()),
    reservedQuantity: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  }).index("by_category", ["category"]),
  users: defineTable({
    clerkId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
  }).index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),
  otps: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    type: v.union(v.literal("register"), v.literal("reset")),
    name: v.optional(v.string()),
    hashedPassword: v.optional(v.string()),
  }).index("by_email", ["email"]),
  sessions: defineTable({
    token: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  }).index("by_token", ["token"])
    .index("by_userId", ["userId"]),
  loginAttempts: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
  orders: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    items: v.array(v.object({
      productId: v.union(v.string(), v.number()),
      name: v.string(),
      price: v.number(),
      qty: v.number(),
    })),
    total: v.number(),
    shippingAmount: v.optional(v.number()),
    shippingAddress: v.optional(v.object({
      name: v.string(),
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      country: v.string(),
    })),
    status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")),
    createdAt: v.string(),
    stripeSessionId: v.optional(v.string()),
    paymentStatus: v.optional(v.union(v.literal("pending"), v.literal("paid"), v.literal("failed"))),
    paymentIntent: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    reservationExpiresAt: v.optional(v.number()),
    inventoryStatus: v.optional(v.union(
      v.literal("reserved"),
      v.literal("sold"),
      v.literal("released"),
      v.literal("error")
    )),
    deliveredAt: v.optional(v.string()),
    returnRequest: v.optional(v.object({
      type: v.union(v.literal("exchange"), v.literal("replacement")),
      reason: v.string(),
      status: v.union(
        v.literal("requested"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("received"),
        v.literal("completed")
      ),
      requestedAt: v.string(),
      updatedAt: v.optional(v.string()),
      adminNote: v.optional(v.string()),
    })),
  }).index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
  processedWebhooks: defineTable({
    eventId: v.string(),
    processedAt: v.number(),
  }).index("by_eventId", ["eventId"]),
  otpAttempts: defineTable({
    email: v.string(),
    type: v.union(v.literal("register"), v.literal("reset")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
