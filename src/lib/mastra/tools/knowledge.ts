import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const searchKnowledgeTool = createTool({
  id: "search-knowledge",
  description:
    "Search the org's knowledge base for entries relevant to a ticket",
  inputSchema: z.object({
    orgCode: z.string().describe("The organization code"),
    query: z.string().describe("Search query derived from the ticket subject"),
  }),
  execute: async ({ orgCode, query }) => {
    const entries = await fetchQuery(api.knowledge.getKnowledgeByOrg, {
      orgCode,
    });

    const words = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const scored = entries
      .map((entry) => {
        const haystack = `${entry.title} ${entry.content}`.toLowerCase();
        const matches = words.filter((w) => haystack.includes(w)).length;
        return { entry, matches };
      })
      .filter(({ matches }) => matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 3)
      .map(({ entry }) => ({
        title: entry.title,
        content: entry.content,
      }));

    return { entries: scored };
  },
});
