import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { triageAgent } from "@/lib/mastra/agents/triage-agent";
import { validateApiKeyFromRequest } from "@/lib/api-key";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const validation = await validateApiKeyFromRequest(req);
    if (!validation.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customerEmail, subject, body: ticketBody } = body;
    // orgCode is derived from the API key — never trusted from request body
    const orgCode = validation.orgCode;

    if (!customerEmail || !subject || !ticketBody) {
      return NextResponse.json(
        { error: "Missing required fields: customerEmail, subject, body" },
        { status: 400 }
      );
    }

    const result = await triageAgent.generate(
      `Triage this support ticket for org ${orgCode}:
From: ${customerEmail}
Subject: ${subject}
Message: ${ticketBody}`
    );

    return NextResponse.json({ success: true, message: result.text });
  } catch (err) {
    console.error("[v1/tickets POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const validation = await validateApiKeyFromRequest(req);
    if (!validation.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // orgCode is derived from the API key — never trusted from query params
    const orgCode = validation.orgCode;

    const tickets = await fetchQuery(api.tickets.getTicketsByOrg, { orgCode });
    return NextResponse.json({ tickets });
  } catch (err) {
    console.error("[v1/tickets GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
