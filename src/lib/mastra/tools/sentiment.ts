import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const getOrgTicketsTool = createTool({
  id: "get-org-tickets",
  description: "Get recent tickets for an org (used by the summary agent)",
  inputSchema: z.object({
    orgCode: z.string().describe("The organisation code to fetch tickets for"),
  }),
  execute: async ({ orgCode }) => {
    const tickets = await fetchQuery(api.tickets.getTicketsByOrg, { orgCode });
    return { tickets };
  },
});
