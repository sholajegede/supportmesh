import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { ConvexError, v } from "convex/values";

export const addKnowledgeEntry = mutation({
  args: {
    orgCode: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== args.orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }
    return await ctx.db.insert("knowledgeBase", args);
  },
});

export const getKnowledgeByOrg = query({
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
      .query("knowledgeBase")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", orgCode))
      .collect();
  },
});
