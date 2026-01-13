import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const storeImageUrl = mutation({
  args: { id: v.id("profiles"), storageId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { profile_image: args.storageId });
    return args.storageId;
  },
});
