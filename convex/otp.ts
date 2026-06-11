import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { hashPassword } from "./crypto";
import { sendEmail } from "./email";
import { generateToken } from "./sessions";
import { internal } from "./_generated/api";

function generateOtp(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] % 900000 + 100000).toString();
}

function validatePassword(password: string): void {
  if (password.length < 8) throw new Error("Password must be at least 8 characters");
  if (!/[a-zA-Z]/.test(password)) throw new Error("Password must contain at least one letter");
  if (!/[0-9]/.test(password)) throw new Error("Password must contain at least one number");
}

async function recordOtpFailure(ctx: any, email: string, type: "register" | "reset") {
  await ctx.db.insert("otpAttempts", { email, type, createdAt: Date.now() });
}

async function assertOtpAttemptsAllowed(ctx: any, email: string, type: "register" | "reset") {
  const attempts = await ctx.db
    .query("otpAttempts")
    .withIndex("by_email", (q: any) => q.eq("email", email))
    .collect();
  const recent = attempts.filter((a: any) => a.type === type && Date.now() - a.createdAt < 5 * 60 * 1000);
  if (recent.length >= 5) throw new Error("Too many invalid code attempts. Please request a new code.");
}

async function clearOtpAttempts(ctx: any, email: string, type: "register" | "reset") {
  const attempts = await ctx.db
    .query("otpAttempts")
    .withIndex("by_email", (q: any) => q.eq("email", email))
    .collect();
  for (const attempt of attempts) {
    if (attempt.type === type) await ctx.db.delete(attempt._id);
  }
}

export const sendOtp = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const recentOtps = await ctx.db
      .query("otps")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();
    const recentCount = recentOtps.filter(o => Date.now() - o.expiresAt < 5 * 60 * 1000).length;
    if (recentCount >= 3) throw new Error("Too many requests. Please wait a few minutes and try again.");
    validatePassword(args.password);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();
    if (existing) throw new Error("An account with this email already exists");
    const oldOtps = await ctx.db
      .query("otps")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();
    for (const otp of oldOtps) await ctx.db.delete(otp._id);
    const code = generateOtp();
    await ctx.db.insert("otps", {
      email,
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
      type: "register",
      name: args.name.trim(),
      hashedPassword: await hashPassword(args.password),
    });
    await sendEmail(
      email,
      "Verify your email - Sports Folio Store",
      `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Verify your email</h2>
        <p style="color: #555;">Your verification code is:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; font-size: 2rem; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${code}</div>
        <p style="color: #999; font-size: 0.85rem;">This code expires in 5 minutes.</p>
      </div>`
    );
  },
});

export const verifyOtp = mutation({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const otpRecord = await ctx.db
      .query("otps")
      .withIndex("by_email", q => q.eq("email", email))
      .first();
    if (!otpRecord) throw new Error("No verification code found. Please request a new one.");
    if (Date.now() > otpRecord.expiresAt) {
      await ctx.db.delete(otpRecord._id);
      throw new Error("Verification code has expired. Please request a new one.");
    }
    await assertOtpAttemptsAllowed(ctx, email, "register");
    if (otpRecord.code !== args.code) {
      await recordOtpFailure(ctx, email, "register");
      throw new Error("Invalid verification code.");
    }
    const userId = await ctx.db.insert("users", {
      name: otpRecord.name!,
      email,
      password: otpRecord.hashedPassword!,
      role: "user",
    });
    await ctx.db.delete(otpRecord._id);
    await clearOtpAttempts(ctx, email, "register");
    const token = generateToken();
    await ctx.db.insert("sessions", {
      token,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });
    return { token, id: userId, name: otpRecord.name!, email, role: "user" as const };
  },
});

export const sendResetOtp = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const recentOtps = await ctx.db
      .query("otps")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();
    const recentCount = recentOtps.filter(o => Date.now() - o.expiresAt < 5 * 60 * 1000).length;
    if (recentCount >= 3) throw new Error("Too many requests. Please wait a few minutes and try again.");
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();
    if (!user) return;
    const oldOtps = await ctx.db
      .query("otps")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();
    for (const otp of oldOtps) await ctx.db.delete(otp._id);
    const code = generateOtp();
    await ctx.db.insert("otps", {
      email,
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
      type: "reset",
    });
    await sendEmail(email, "Reset your password - Sports Folio Store",
      `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1a1a1a">Reset your password</h2>
        <p style="color:#555">Your password reset code is:</p>
        <div style="background:#f4f4f4;padding:20px;text-align:center;border-radius:8px;font-size:2rem;font-weight:bold;letter-spacing:8px;color:#1a1a1a">${code}</div>
        <p style="color:#999;font-size:0.85rem">This code expires in 5 minutes.</p>
      </div>`);
  },
});

export const resetPassword = mutation({
  args: {
    email: v.string(),
    code: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const otpRecord = await ctx.db
      .query("otps")
      .withIndex("by_email", q => q.eq("email", email))
      .first();
    if (!otpRecord) throw new Error("No reset code found. Please request a new one.");
    if (Date.now() > otpRecord.expiresAt) {
      await ctx.db.delete(otpRecord._id);
      throw new Error("Reset code has expired. Please request a new one.");
    }
    if (otpRecord.type !== "reset") throw new Error("Invalid reset code.");
    await assertOtpAttemptsAllowed(ctx, email, "reset");
    if (otpRecord.code !== args.code) {
      await recordOtpFailure(ctx, email, "reset");
      throw new Error("Invalid reset code.");
    }
    validatePassword(args.newPassword);
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();
    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { password: await hashPassword(args.newPassword) });
    await ctx.db.delete(otpRecord._id);
    await clearOtpAttempts(ctx, email, "reset");
    await ctx.runMutation(internal.sessions.clearUserSessions, { userId: user._id });
    await sendEmail(email, "Password Reset Successful - Sports Folio Store",
      `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1a1a1a">Password Reset Successful</h2>
        <p style="color:#555">Your password has been changed.</p>
      </div>`);
  },
});
