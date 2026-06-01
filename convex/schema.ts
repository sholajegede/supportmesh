import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tickets: defineTable({
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
  }),

  orgs: defineTable({
    orgCode: v.string(),
    orgName: v.string(),
  }).index("by_orgCode", ["orgCode"]),

  knowledgeBase: defineTable({
    orgCode: v.string(),
    title: v.string(),
    content: v.string(),
  }).index("by_orgCode", ["orgCode"]),

  summaries: defineTable({
    orgCode: v.string(),
    date: v.string(),
    totalTickets: v.number(),
    openTickets: v.number(),
    resolvedTickets: v.number(),
    escalatedTickets: v.number(),
    topCategories: v.array(v.string()),
    avgSentiment: v.string(),
    longRunningTickets: v.array(v.string()),
  }).index("by_orgCode", ["orgCode"]),

  users: defineTable({
    kindeId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
  }).index("by_kindeId", ["kindeId"]),
});
