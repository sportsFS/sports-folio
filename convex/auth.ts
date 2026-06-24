const ADMIN_EMAIL = "sportsfoliostore@gmail.com";

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().trim() === ADMIN_EMAIL;
}

export async function requireIdentity(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity;
}

export async function requireCurrentUser(ctx: any) {
  const identity = await requireIdentity(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .first();
  if (!user) throw new Error("User profile not initialized");
  return user;
}

export async function requireAdmin(ctx: any) {
  const user = await requireCurrentUser(ctx);
  if (user.role !== "admin") throw new Error("Unauthorized: admin access required");
  return user;
}
