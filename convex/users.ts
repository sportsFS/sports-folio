import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { hashPassword } from "./crypto";

function validatePassword(password: string): void {
  if (password.length < 8) throw new Error("Password must be at least 8 characters");
  if (!/[a-zA-Z]/.test(password)) throw new Error("Password must contain at least one letter");
  if (!/[0-9]/.test(password)) throw new Error("Password must contain at least one number");
}

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    validatePassword(args.password);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", args.email.toLowerCase().trim()))
      .first();
    if (existing) {
      throw new Error("An account with this email already exists");
    }
    const hashed = await hashPassword(args.password);
    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email: args.email.toLowerCase().trim(),
      password: hashed,
      role: "user",
    });
    return { id: userId, name: args.name.trim(), email: args.email.toLowerCase().trim(), role: "user" as const };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  rateLimiter: { kind: "token bucket", maxTokens: 5, refillRate: 1 },
  handler: async (ctx, args) => {
    await ctx.rateLimiter.rateLimit();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", args.email.toLowerCase().trim()))
      .first();
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const hashed = await hashPassword(args.password);
    if (user.password !== hashed) {
      throw new Error("Invalid email or password");
    }
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  },
});
