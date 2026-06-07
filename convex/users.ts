import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { hashPassword, verifyPassword } from "./crypto";
import { generateToken } from "./sessions";

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
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    const recentAttempts = await ctx.db
      .query("loginAttempts")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();
    const recentCount = recentAttempts.filter(a => Date.now() - a.createdAt < 60000).length;
    if (recentCount >= 5) throw new Error("Too many login attempts. Please try again later.");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();
    if (!user) {
      await ctx.db.insert("loginAttempts", { email, createdAt: Date.now() });
      throw new Error("Invalid email or password");
    }
    const valid = await verifyPassword(args.password, user.password);
    if (!valid) {
      await ctx.db.insert("loginAttempts", { email, createdAt: Date.now() });
      throw new Error("Invalid email or password");
    }

    const token = generateToken();
    await ctx.db.insert("sessions", {
      token,
      userId: user._id,
      createdAt: Date.now(),
    });

    const oldAttempts = await ctx.db
      .query("loginAttempts")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();
    for (const a of oldAttempts) await ctx.db.delete(a._id);

    return { token, id: user._id, name: user.name, email: user.email, role: user.role };
  },
});
