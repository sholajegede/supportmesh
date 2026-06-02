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

export const updateKnowledgeEntry = mutation({
  args: {
    id: v.id("knowledgeBase"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { id, title, content }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const entry = await ctx.db.get(id);
      if (entry) {
        const identityOrgCode = identity["org_code"] as string | undefined;
        if (identityOrgCode && identityOrgCode !== entry.orgCode) {
          throw new ConvexError("Unauthorized: org_code mismatch");
        }
      }
    }
    await ctx.db.patch(id, { title, content });
  },
});

export const deleteKnowledgeEntry = mutation({
  args: { id: v.id("knowledgeBase") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const entry = await ctx.db.get(id);
      if (entry) {
        const identityOrgCode = identity["org_code"] as string | undefined;
        if (identityOrgCode && identityOrgCode !== entry.orgCode) {
          throw new ConvexError("Unauthorized: org_code mismatch");
        }
      }
    }
    const entry = await ctx.db.get(id);
    if (entry) await ctx.db.delete(id);
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
