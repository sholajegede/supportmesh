import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { ConvexError, v } from "convex/values";

export const upsertOrg = mutation({
  args: {
    orgCode: v.string(),
    orgName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== args.orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }
    const existing = await ctx.db
      .query("orgs")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", args.orgCode))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { orgName: args.orgName });
      return existing._id;
    }

    return await ctx.db.insert("orgs", args);
  },
});

export const getOrgByCode = query({
  args: { orgCode: v.string() },
  handler: async (ctx, { orgCode }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }
    return await ctx.db
      .query("orgs")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", orgCode))
      .unique();
  },
});
