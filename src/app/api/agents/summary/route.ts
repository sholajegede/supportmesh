import { NextResponse } from "next/server";
import { summaryAgent } from "@/lib/mastra/agents/summary-agent";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orgCode, date } = body;

    if (!orgCode || !date) {
      return NextResponse.json(
        { error: "Missing required fields: orgCode, date" },
        { status: 400 }
      );
    }

    const result = await summaryAgent.generate(
      `Generate the daily summary for org ${orgCode} on ${date}`
    );

    return NextResponse.json({ success: true, message: result.text });
  } catch (err) {
    console.error("[summary] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
