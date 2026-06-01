import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const saveDailySummaryTool = createTool({
  id: "save-daily-summary",
  description: "Save the daily org summary to the database",
  inputSchema: z.object({
    orgCode: z.string(),
    date: z.string().describe("ISO date string YYYY-MM-DD"),
    totalTickets: z.number(),
    openTickets: z.number(),
    resolvedTickets: z.number(),
    escalatedTickets: z.number(),
    topCategories: z.array(z.string()),
    avgSentiment: z.string(),
    longRunningTickets: z.array(z.string()),
  }),
  execute: async (args) => {
    const summaryId = await fetchMutation(api.summaries.saveSummary, args);
    return { summaryId };
  },
});
