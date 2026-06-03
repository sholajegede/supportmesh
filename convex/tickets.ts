import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { ConvexError, v } from "convex/values";

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
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== args.orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }
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
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const ticket = await ctx.db.get(id);
      if (ticket) {
        const identityOrgCode = identity["org_code"] as string | undefined;
        if (identityOrgCode && identityOrgCode !== ticket.orgCode) {
          throw new ConvexError("Unauthorized: org_code mismatch");
        }
      }
    }
    await ctx.db.patch(id, patch);
  },
});

export const updateTicketStatus = mutation({
  args: {
    id: v.id("tickets"),
    status: v.string(),
  },
  handler: async (ctx, { id, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const ticket = await ctx.db.get(id);
      if (ticket) {
        const identityOrgCode = identity["org_code"] as string | undefined;
        if (identityOrgCode && identityOrgCode !== ticket.orgCode) {
          throw new ConvexError("Unauthorized: org_code mismatch");
        }
      }
    }
    await ctx.db.patch(id, { status });
  },
});

export const assignTicket = mutation({
  args: {
    id: v.id("tickets"),
    assignedTo: v.string(),
    assignedName: v.string(),
  },
  handler: async (ctx, { id, assignedTo, assignedName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const ticket = await ctx.db.get(id);
      if (ticket) {
        const identityOrgCode = identity["org_code"] as string | undefined;
        if (identityOrgCode && identityOrgCode !== ticket.orgCode) {
          throw new ConvexError("Unauthorized: org_code mismatch");
        }
      }
    }
    await ctx.db.patch(id, { assignedTo, assignedName });
  },
});

export const unassignTicket = mutation({
  args: { id: v.id("tickets") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const ticket = await ctx.db.get(id);
      if (ticket) {
        const identityOrgCode = identity["org_code"] as string | undefined;
        if (identityOrgCode && identityOrgCode !== ticket.orgCode) {
          throw new ConvexError("Unauthorized: org_code mismatch");
        }
      }
    }
    await ctx.db.patch(id, { assignedTo: undefined, assignedName: undefined });
  },
});

export const getTicketsByOrg = query({
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
      .query("tickets")
      .filter((q) => q.eq(q.field("orgCode"), orgCode))
      .order("desc")
      .collect();
  },
});

export const getTicketById = query({
  args: { id: v.id("tickets") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    const ticket = await ctx.db.get(id);
    if (identity && ticket) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== ticket.orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }
    return ticket;
  },
});

export const getTicketsByCustomerEmail = query({
  args: { orgCode: v.string(), customerEmail: v.string() },
  handler: async (ctx, { orgCode, customerEmail }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const identityOrgCode = identity["org_code"] as string | undefined;
      if (identityOrgCode && identityOrgCode !== orgCode) {
        throw new ConvexError("Unauthorized: org_code mismatch");
      }
    }
    return await ctx.db
      .query("tickets")
      .filter((q) =>
        q.and(
          q.eq(q.field("orgCode"), orgCode),
          q.eq(q.field("customerEmail"), customerEmail)
        )
      )
      .order("desc")
      .collect();
  },
});
