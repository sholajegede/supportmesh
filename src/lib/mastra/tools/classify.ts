import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const saveTriageResultTool = createTool({
  id: "save-triage-result",
  description: "Save the completed triage analysis for a ticket to the database",
  inputSchema: z.object({
    orgCode: z.string(),
    subject: z.string(),
    body: z.string(),
    customerEmail: z.string(),
    priority: z.string(),
    category: z.string(),
    sentiment: z.string(),
    draftResponse: z.string(),
    shouldEscalate: z.boolean(),
    escalationReason: z.string().optional(),
  }),
  execute: async ({
    orgCode,
    subject,
    body,
    customerEmail,
    priority,
    category,
    sentiment,
    draftResponse,
    shouldEscalate,
    escalationReason,
  }) => {
    const ticketId = await fetchMutation(api.tickets.createTicket, {
      orgCode,
      subject,
      body,
      customerEmail,
      status: shouldEscalate ? "escalated" : "open",
      priority,
      category,
      sentiment,
      draftResponse,
      escalationReason: escalationReason ?? undefined,
    });

    return { ticketId };
  },
});
