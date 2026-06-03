import { NextResponse } from "next/server";
import { summaryAgent } from "@/lib/mastra/agents/summary-agent";
import { validateKindeToken } from "@/lib/mastra/auth";

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

    // Validate the Kinde JWT and extract org_code from the token.
    // The orgCode is never trusted from the request body.
    const identity = await validateKindeToken(token);
    if (!identity) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Missing required field: date" },
        { status: 400 }
      );
    }

    // orgCode comes from the verified JWT, not the request body
    const { orgCode } = identity;

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
