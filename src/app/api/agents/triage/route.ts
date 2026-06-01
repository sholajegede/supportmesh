import { NextResponse } from "next/server";
import { triageAgent } from "@/lib/mastra/agents/triage-agent";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, body: ticketBody, customerEmail, orgCode } = body;

    if (!subject || !ticketBody || !customerEmail || !orgCode) {
      return NextResponse.json(
        { error: "Missing required fields: subject, body, customerEmail, orgCode" },
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
    console.error("[triage] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
