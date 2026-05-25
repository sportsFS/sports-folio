import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "sportsfolio-salt-2024");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
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
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", args.email.toLowerCase().trim()))
      .first();
    if (!user) {
      throw new Error("No account found with this email");
    }
    const hashed = await hashPassword(args.password);
    if (user.password !== hashed) {
      throw new Error("Incorrect password");
    }
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  },
});
