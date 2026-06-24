import { internalQuery, mutation, query } from "./_generated/server";
import { isAdminEmail, requireAdmin, requireCurrentUser, requireIdentity } from "./auth";

export const ensureCurrent = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const email = identity.email?.toLowerCase().trim();
    if (!email) throw new Error("A verified email address is required");

    const name = identity.name?.trim() || email.split("@")[0];
    const existingByClerk = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .first();

    if (existingByClerk) {
      const role = isAdminEmail(email) ? "admin" as const : existingByClerk.role;
      await ctx.db.patch(existingByClerk._id, { name, email, role, password: undefined });
      return { id: existingByClerk._id, name, email, role };
    }

    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (existingByEmail) {
      const role = isAdminEmail(email) ? "admin" as const : existingByEmail.role;
      await ctx.db.patch(existingByEmail._id, {
        clerkId: identity.subject,
        name,
        email,
        role,
        password: undefined,
      });
      return { id: existingByEmail._id, name, email, role };
    }

    const role = isAdminEmail(email) ? "admin" as const : "user" as const;
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name,
      email,
      role,
    });
    return { id: userId, name, email, role };
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  },
});

export const currentForAction = internalQuery({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    return users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role }));
  },
});
