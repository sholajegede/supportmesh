import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { triageAgent } from "@/lib/mastra/agents/triage-agent";

export const dynamic = "force-dynamic";

function validateApiKey(req: Request): boolean {
  const configuredKey = process.env.SUPPORTMESH_API_KEY;
  if (!configuredKey) return true; // demo mode — no key configured

  const authHeader = req.headers.get("authorization") ?? "";
  const headerKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const urlKey = new URL(req.url).searchParams.get("apiKey");

  return headerKey === configuredKey || urlKey === configuredKey;
}

export async function POST(req: Request) {
  try {
    if (!validateApiKey(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orgCode, customerEmail, subject, body: ticketBody } = body;

    if (!orgCode || !customerEmail || !subject || !ticketBody) {
      return NextResponse.json(
        { error: "Missing required fields: orgCode, customerEmail, subject, body" },
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
    if (!validateApiKey(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orgCode = searchParams.get("orgCode");

    if (!orgCode) {
      return NextResponse.json(
        { error: "Missing required query param: orgCode" },
        { status: 400 }
      );
    }

    const tickets = await fetchQuery(api.tickets.getTicketsByOrg, { orgCode });
    return NextResponse.json({ tickets });
  } catch (err) {
    console.error("[v1/tickets GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
