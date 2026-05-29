import { action } from "./_generated/server";
import { v } from "convex/values";

export const uploadImage = action({
  args: { file: v.bytes() },
  handler: async (ctx, args) => {
    const blob = new Blob([args.file]);
    const storageId = await ctx.storage.store(blob);
    const url = ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Failed to get upload URL");
    return url;
  },
});
