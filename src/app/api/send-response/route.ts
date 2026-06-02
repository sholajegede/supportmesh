import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, to, subject, draftResponse, orgCode } = body;

    if (!ticketId || !to || !subject || !draftResponse || !orgCode) {
      return NextResponse.json(
        { error: "Missing required fields: ticketId, to, subject, draftResponse, orgCode" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "SupportMesh <noreply@supportmesh.ai>",
      to: [to],
      subject: `Re: ${subject}`,
      text: draftResponse,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-response]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
