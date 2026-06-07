import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export function generateToken(): string {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return Array.from(buf).map(b => b.toString(16).padStart(2, "0")).join("");
}

export const validate = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (!session) return null;
    const user = await ctx.db.get(session.userId);
    if (!user) return null;
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (session) await ctx.db.delete(session._id);
  },
});

export const clearUserSessions = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .collect();
    for (const s of sessions) await ctx.db.delete(s._id);
  },
});
