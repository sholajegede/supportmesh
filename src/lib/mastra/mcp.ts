import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp";
import { fetchQuery } from "convex/nextjs";
import { z } from "zod";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { triageAgent } from "./agents/triage-agent";

// Creates a fresh McpServer with all tools registered.
// Must be called per-request in stateless mode to avoid shared state
// across concurrent Next.js invocations.
function buildServer(): McpServer {
  const server = new McpServer({
    name: "SupportMesh MCP",
    version: "1.0.0",
  });

  server.tool(
    "submit_ticket",
    "Submit a support ticket to be triaged by AI",
    {
      orgCode:       z.string().describe("Organisation code"),
      customerEmail: z.string().email().describe("Customer's email address"),
      subject:       z.string().describe("Brief subject line"),
      body:          z.string().describe("Full ticket message body"),
    },
    async ({ orgCode, customerEmail, subject, body }) => {
      const result = await triageAgent.generate(
        `Triage this support ticket for org ${orgCode}:
From: ${customerEmail}
Subject: ${subject}
Message: ${body}`
      );
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: true, message: result.text }),
          },
        ],
      };
    }
  );

  server.tool(
    "get_org_tickets",
    "Get all tickets for an organisation",
    {
      orgCode: z.string().describe("Organisation code"),
    },
    async ({ orgCode }) => {
      const tickets = await fetchQuery(api.tickets.getTicketsByOrg, { orgCode });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ tickets }),
          },
        ],
      };
    }
  );

  server.tool(
    "get_ticket",
    "Get a specific ticket by ID",
    {
      ticketId: z.string().describe("Convex ticket document ID"),
    },
    async ({ ticketId }) => {
      const ticket = await fetchQuery(api.tickets.getTicketById, {
        id: ticketId as Id<"tickets">,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(ticket),
          },
        ],
      };
    }
  );

  return server;
}

export async function handleMcpRequest(req: Request): Promise<Response> {
  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  });
  await server.connect(transport);
  return transport.handleRequest(req);
}
