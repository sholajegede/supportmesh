import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

const BASE_URL = "https://supportmesh-agent.vercel.app";

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

    // Fire Slack notification if org has a webhook configured
    const org = await fetchQuery(api.orgs.getOrgByCode, { orgCode });
    const slackWebhookUrl = (org as { slackWebhookUrl?: string } | null)?.slackWebhookUrl;
    if (slackWebhookUrl) {
      try {
        await fetch(slackWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `New ticket: ${subject}`,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*${subject}*\nPriority: *${priority}* · Sentiment: *${sentiment}*\nFrom: ${customerEmail}`,
                },
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: { type: "plain_text", text: "View ticket" },
                    url: `${BASE_URL}/dashboard/tickets/${ticketId}`,
                  },
                ],
              },
            ],
          }),
        });
      } catch (err) {
        console.error("Slack notification failed:", err);
      }
    }

    return { ticketId };
  },
});
