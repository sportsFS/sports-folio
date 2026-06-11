import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export function generateToken(): string {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return Array.from(buf).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function requireUserByToken(ctx: any, token: string) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();
  if (!session) throw new Error("Unauthorized");
  const expiresAt = session.expiresAt ?? session.createdAt + SESSION_TTL_MS;
  if (Date.now() > expiresAt) {
    throw new Error("Session expired");
  }
  const user = await ctx.db.get(session.userId);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdminByToken(ctx: any, token: string) {
  const user = await requireUserByToken(ctx, token);
  if (user.role !== "admin") throw new Error("Unauthorized: admin access required");
  return user;
}

export const validate = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (!session) return null;
    const expiresAt = session.expiresAt ?? session.createdAt + SESSION_TTL_MS;
    if (Date.now() > expiresAt) return null;
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

export const create = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const token = generateToken();
    await ctx.db.insert("sessions", {
      token,
      userId: args.userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    return token;
  },
});

export const requireUserForAction = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUserByToken(ctx, args.token);
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  },
});

export const requireAdminForAction = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAdminByToken(ctx, args.token);
    return { id: user._id, name: user.name, email: user.email, role: user.role };
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
