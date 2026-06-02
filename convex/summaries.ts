import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { ConvexError, v } from "convex/values";

export const saveSummary = mutation({
  args: {
    orgCode: v.string(),
    date: v.string(),
    totalTickets: v.number(),
    openTickets: v.number(),
    resolvedTickets: v.number(),
    escalatedTickets: v.number(),
    topCategories: v.array(v.string()),
    avgSentiment: v.string(),
    longRunningTickets: v.array(v.string()),
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
      .query("summaries")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", args.orgCode))
      .filter((q) => q.eq(q.field("date"), args.date))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("summaries", args);
  },
});

export const getSummaryByOrgAndDate = query({
  args: {
    orgCode: v.string(),
    date: v.string(),
  },
  handler: async (ctx, { orgCode, date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }
    return await ctx.db
      .query("summaries")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", orgCode))
      .filter((q) => q.eq(q.field("date"), date))
      .unique();
  },
});
