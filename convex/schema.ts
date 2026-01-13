import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
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
    visits: v.number(),
    qr_code_scans: v.number(),
    edit_token: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_edit_token", ["edit_token"]),
});
