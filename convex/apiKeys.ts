import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const generateApiKey = mutation({
  args: { orgCode: v.string(), label: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== args.orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }

    const rawKey = "sm_" + crypto.randomUUID().replace(/-/g, "");

    await ctx.db.insert("apiKeys", {
      orgCode: args.orgCode,
      keyHash: rawKey,
      label: args.label,
      createdAt: Date.now(),
    });

    return { key: rawKey };
  },
});

export const getApiKeysByOrg = query({
  args: { orgCode: v.string() },
  handler: async (ctx, { orgCode }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }

    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", orgCode))
      .collect();

    return keys.map((k) => ({
      _id: k._id,
      label: k.label,
      createdAt: k.createdAt,
      orgCode: k.orgCode,
      keyPreview: k.keyHash.slice(0, 8) + "...",
    }));
  },
});

export const revokeApiKey = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, { id }) => {
    const key = await ctx.db.get(id);
    if (!key) throw new ConvexError("API key not found");

    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== key.orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }

    await ctx.db.delete(id);
  },
});

// Public so it can be called from Next.js API routes via fetchQuery.
// The key itself is the secret — knowing an orgCode without a key grants nothing.
export const validateApiKeyForOrg = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const record = await ctx.db
      .query("apiKeys")
      .withIndex("by_keyHash", (q) => q.eq("keyHash", key))
      .unique();

    if (!record) return null;
    return { orgCode: record.orgCode, _id: record._id };
  },
});
