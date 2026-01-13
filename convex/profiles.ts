import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return profile;
  },
});

export const getByEditToken = query({
  args: { editToken: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_edit_token", (q) => q.eq("edit_token", args.editToken))
      .first();
    return profile;
  },
});

export const create = mutation({
  args: {
    full_name: v.string(),
    job_title: v.string(),
    company: v.string(),
    profile_image: v.optional(v.string()),
    bio: v.string(),
    email: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    social_links: v.optional(v.object({
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      github: v.optional(v.string()),
      instagram: v.optional(v.string()),
      mastodon: v.optional(v.string()),
      bluesky: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      signal: v.optional(v.string()),
      telegram: v.optional(v.string()),
    })),
    custom_theme: v.optional(v.object({
      primary_color: v.optional(v.string()),
      background_color: v.optional(v.string()),
    })),
    slug: v.string(),
    edit_token: v.string(),
  },
  handler: async (ctx, args) => {
    const profileId = await ctx.db.insert("profiles", {
      ...args,
      visits: 0,
      qr_code_scans: 0,
    });
    return profileId;
  },
});

export const update = mutation({
  args: {
    id: v.id("profiles"),
    full_name: v.string(),
    job_title: v.string(),
    company: v.string(),
    profile_image: v.optional(v.string()),
    bio: v.string(),
    email: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    social_links: v.optional(v.object({
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      github: v.optional(v.string()),
      instagram: v.optional(v.string()),
      mastodon: v.optional(v.string()),
      bluesky: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      signal: v.optional(v.string()),
      telegram: v.optional(v.string()),
    })),
    custom_theme: v.optional(v.object({
      primary_color: v.optional(v.string()),
      background_color: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
    return id;
  },
});

export const incrementVisits = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) return null;
    await ctx.db.patch(args.id, { visits: profile.visits + 1 });
    return profile.visits + 1;
  },
});

export const incrementQRScans = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) return null;
    await ctx.db.patch(args.id, { qr_code_scans: profile.qr_code_scans + 1 });
    return profile.qr_code_scans + 1;
  },
});
