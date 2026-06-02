"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertTriangle, BookOpen, Send, CheckCircle2 } from "lucide-react";
import type { TicketPriority, SentimentScore, TicketStatus } from "@/types";

const priorityCls: Record<TicketPriority, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high:     "bg-orange-50 text-orange-700 border-orange-200",
  medium:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  low:      "bg-zinc-100 text-zinc-600 border-zinc-200",
};
const sentimentCls: Record<SentimentScore, string> = {
  frustrated: "bg-red-50 text-red-700 border-red-200",
  negative:   "bg-orange-50 text-orange-700 border-orange-200",
  neutral:    "bg-zinc-100 text-zinc-600 border-zinc-200",
  positive:   "bg-green-50 text-green-700 border-green-200",
};
const statusCls: Record<TicketStatus, string> = {
  escalated:   "bg-red-50 text-red-700 border-red-200",
  open:        "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-yellow-50 text-yellow-700 border-yellow-200",
  resolved:    "bg-green-50 text-green-700 border-green-200",
};

const TICKET = {
  id: "t8",
  subject: "Slack integration stopped sending notifications",
  body: `Hi support team,

We've been using SupportMesh's Slack integration for the past 3 months and it's been working perfectly. However, since yesterday morning (around 09:00 UTC) we have completely stopped receiving any notifications in our #support-alerts channel.

I've checked our Slack workspace permissions and the bot is still installed and has the correct scopes. Our webhook URL is still valid — I tested it manually and it returned a 200 OK. The issue seems to be on the SupportMesh side.

This is affecting our entire support team's ability to respond to urgent tickets in real time. We have SLAs with our enterprise clients and this outage is putting us in breach of those agreements.

Could you please investigate this urgently? We need this resolved within the next 2 hours.

Thanks,
Carlos`,
  customerEmail: "carlos@acme.io",
  orgCode: "org_acme",
  status: "escalated" as TicketStatus,
  priority: "critical" as TicketPriority,
  sentiment: "frustrated" as SentimentScore,
  category: "technical",
  draftResponse: `Hi Carlos,

Thank you for reaching out and I completely understand the urgency here. I can see this is directly impacting your team's ability to meet your SLAs, and I'm treating this as our highest priority.

I've escalated this to our infrastructure team immediately. Our logs show an issue with the Slack notification queue that began at 08:47 UTC yesterday, which aligns with what you're experiencing.

We're deploying a fix now and expect full notification delivery to resume within 30–45 minutes. I'll keep you updated every 15 minutes until it's resolved.

Apologies for the disruption to your workflow.

Best,
SupportMesh Team`,
  escalationReason: "Customer reported active SLA breach risk with enterprise clients. Critical priority. System-level issue confirmed on our end.",
  createdAt: "2026-06-02T08:14:00Z",
  updatedAt: "2026-06-02T09:30:00Z",
};

const KB_MATCHES = [
  {
    title: "Slack Integration Troubleshooting Guide",
    content: "Common issues with Slack integration include expired OAuth tokens, revoked bot permissions, and webhook URL changes. Always verify the webhook endpoint returns 200 before investigating server-side.",
  },
  {
    title: "Notification Queue Status and Recovery",
    content: "If customers report missing notifications, check the notification queue dashboard. Queue backlogs over 500 items trigger automatic throttling. Manual queue flush may be required for critical accounts.",
  },
];

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-zinc-500">{label}</span>
      {children}
    </div>
  );
}

export default function TicketDetailPage() {
  const [draft, setDraft] = useState(TICKET.draftResponse);

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Back */}
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Tickets
      </Link>

      {/* Subject */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{TICKET.subject}</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {TICKET.customerEmail} &middot; Opened{" "}
          {new Date(TICKET.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left — 60% */}
        <div className="col-span-3 flex flex-col gap-5">
          {/* Body */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Customer Message
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700">
                {TICKET.body}
              </pre>
            </CardContent>
          </Card>

          {/* Draft response */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                AI Draft Response
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 flex flex-col gap-4">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-[200px] resize-none text-sm text-zinc-700 leading-relaxed border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400"
              />
              <div className="flex items-center gap-3">
                <Button className="gap-2">
                  <Send className="h-3.5 w-3.5" />
                  Send Response
                </Button>
                <Button variant="outline" className="gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark Resolved
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — 40% */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Meta */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 divide-y divide-zinc-100">
              <MetaRow label="Status">
                <Badge variant="outline" className={`capitalize text-xs font-medium ${statusCls[TICKET.status]}`}>
                  {TICKET.status.replace("_", " ")}
                </Badge>
              </MetaRow>
              <MetaRow label="Priority">
                <Badge variant="outline" className={`capitalize text-xs font-medium ${priorityCls[TICKET.priority]}`}>
                  {TICKET.priority}
                </Badge>
              </MetaRow>
              <MetaRow label="Sentiment">
                <Badge variant="outline" className={`capitalize text-xs font-medium ${sentimentCls[TICKET.sentiment]}`}>
                  {TICKET.sentiment}
                </Badge>
              </MetaRow>
              <MetaRow label="Category">
                <span className="text-sm font-medium text-zinc-700 capitalize">
                  {TICKET.category}
                </span>
              </MetaRow>
            </CardContent>
          </Card>

          {/* Escalation warning */}
          {TICKET.status === "escalated" && (
            <Card className="shadow-none border-red-200 bg-red-50/50">
              <CardHeader className="px-5 py-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  Escalated
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-sm text-red-600 leading-relaxed">
                  {TICKET.escalationReason}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Knowledge base */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <BookOpen className="h-4 w-4 text-zinc-400" />
                Knowledge Base Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-0 divide-y divide-zinc-100">
              {KB_MATCHES.map((entry, i) => (
                <div key={i} className="py-4">
                  <p className="text-sm font-medium text-zinc-800">{entry.title}</p>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed line-clamp-3">
                    {entry.content}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
