import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const addKnowledgeEntry = mutation({
  args: {
    orgCode: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("knowledgeBase", args);
  },
});

export const getKnowledgeByOrg = query({
  args: { orgCode: v.string() },
  handler: async (ctx, { orgCode }) => {
    return await ctx.db
      .query("knowledgeBase")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", orgCode))
      .collect();
  },
});
