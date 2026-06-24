import { action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { requireAdmin } from "./auth";

export const uploadImage = action({
  args: { file: v.bytes(), contentType: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.runQuery(internal.upload.requireAdminForUpload, {});
    if (args.file.byteLength > 5 * 1024 * 1024) throw new Error("File too large (max 5MB)");
    const contentType = args.contentType || "application/octet-stream";
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(contentType)) {
      throw new Error("Unsupported image type");
    }
    const blob = new Blob([args.file], { type: contentType });
    const storageId = await ctx.storage.store(blob);
    const url = ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Failed to get upload URL");
    return url;
  },
});

export const requireAdminForUpload = internalQuery({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return true;
  },
});
