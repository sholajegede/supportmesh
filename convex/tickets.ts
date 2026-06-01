import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const createTicket = mutation({
  args: {
    orgCode: v.string(),
    subject: v.string(),
    body: v.string(),
    customerEmail: v.string(),
    status: v.string(),
    priority: v.string(),
    sentiment: v.optional(v.string()),
    category: v.optional(v.string()),
    draftResponse: v.optional(v.string()),
    escalationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tickets", args);
  },
});

export const updateTicket = mutation({
  args: {
    id: v.id("tickets"),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    sentiment: v.optional(v.string()),
    category: v.optional(v.string()),
    draftResponse: v.optional(v.string()),
    escalationReason: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

export const updateTicketStatus = mutation({
  args: {
    id: v.id("tickets"),
    status: v.string(),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const getTicketsByOrg = query({
  args: { orgCode: v.string() },
  handler: async (ctx, { orgCode }) => {
    return await ctx.db
      .query("tickets")
      .filter((q) => q.eq(q.field("orgCode"), orgCode))
      .order("desc")
      .collect();
  },
});

export const getTicketById = query({
  args: { id: v.id("tickets") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
