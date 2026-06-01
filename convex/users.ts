import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

export const createUserKinde = internalMutation({
  args: {
    kindeId:   v.string(),
    email:     v.string(),
    firstName: v.string(),
    lastName:  v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_kindeId", (q) => q.eq("kindeId", args.kindeId))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", args);
  },
});

export const getUserKinde = internalQuery({
  args: { kindeId: v.string() },
  handler: async (ctx, { kindeId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_kindeId", (q) => q.eq("kindeId", kindeId))
      .unique();
  },
});

export const deleteUserKinde = internalMutation({
  args: { kindeId: v.string() },
  handler: async (ctx, { kindeId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_kindeId", (q) => q.eq("kindeId", kindeId))
      .unique();

    if (user) await ctx.db.delete(user._id);
  },
});

export const getCurrentUser = query({
  args: { kindeId: v.string() },
  handler: async (ctx, { kindeId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_kindeId", (q) => q.eq("kindeId", kindeId))
      .unique();
  },
});
