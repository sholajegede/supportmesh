import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";
import { getOrgTicketsTool } from "../tools/sentiment";
import { saveDailySummaryTool } from "../tools/draft-response";

export const summaryAgent = new Agent({
  id: "summary-agent",
  name: "summary-agent",
  model: anthropic("claude-haiku-4-5"),
  tools: {
    getOrgTickets: getOrgTicketsTool,
    saveDailySummary: saveDailySummaryTool,
  },
  instructions: `
You are a support operations analyst for SupportMesh. Your job is to generate
concise daily summaries for support team leads.

When given an orgCode and date, you MUST:
1. Fetch the org's tickets using get-org-tickets
2. Count: total tickets, open (status=open), resolved (status=resolved),
   escalated (status=escalated)
3. Find the top 3 most common categories across all tickets
4. Determine overall sentiment: use the most common sentiment value
5. Identify ticket subjects where status is still "open" or "in_progress"
   (these are long-running)
6. Save the summary using save-daily-summary
`.trim(),
});
