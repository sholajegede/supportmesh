"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertTriangle, BookOpen, Send, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
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

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-zinc-500">{label}</span>
      {children}
    </div>
  );
}

const BACK = (
  <Link
    href="/dashboard/tickets"
    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors w-fit"
  >
    <ArrowLeft className="h-3.5 w-3.5" />
    All Tickets
  </Link>
);

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // All hooks declared before any conditional early returns
  const ticket = useQuery(
    api.tickets.getTicketById,
    id ? { id: id as Id<"tickets"> } : "skip"
  );

  // Use ticket.orgCode once loaded; "skip" while loading/not-found
  const knowledge = useQuery(
    api.knowledge.getKnowledgeByOrg,
    ticket != null ? { orgCode: ticket.orgCode } : "skip"
  );

  const markResolved  = useMutation(api.tickets.updateTicketStatus);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignTicket  = useMutation((api as any).tickets.assignTicket);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unassignTicket = useMutation((api as any).tickets.unassignTicket);

  const [isResolving, setIsResolving]   = useState(false);
  const [isSending, setIsSending]       = useState(false);
  const [draft, setDraft]               = useState<string | undefined>(undefined);
  const [assignInput, setAssignInput]   = useState("");
  const [isAssigning, setIsAssigning]   = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  async function handleMarkResolved() {
    if (!ticket || ticket.status === "resolved") return;
    setIsResolving(true);
    try {
      await markResolved({ id: ticket._id, status: "resolved" });
      toast.success("Ticket marked as resolved");
    } catch {
      toast.error("Failed to update ticket status");
    } finally {
      setIsResolving(false);
    }
  }

  async function handleSendResponse() {
    if (!ticket) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/send-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: String(ticket._id),
          to: ticket.customerEmail,
          subject: ticket.subject,
          draftResponse: displayDraft,
          orgCode: ticket.orgCode,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success(`Response sent to ${ticket.customerEmail}`);
      if (ticket.status !== "resolved" && ticket.status !== "escalated") {
        await markResolved({ id: ticket._id, status: "in_progress" });
      }
    } catch {
      toast.error("Failed to send — try again");
    } finally {
      setIsSending(false);
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!ticket || !assignInput.trim()) return;
    setIsAssigning(true);
    try {
      await assignTicket({
        id: ticket._id,
        assignedTo: assignInput.trim(),
        assignedName: assignInput.trim(),
      });
      toast.success("Ticket assigned");
      setAssignInput("");
      setShowAssignForm(false);
    } catch {
      toast.error("Failed to assign ticket");
    } finally {
      setIsAssigning(false);
    }
  }

  async function handleUnassign() {
    if (!ticket) return;
    setIsAssigning(true);
    try {
      await unassignTicket({ id: ticket._id });
      toast.success("Ticket unassigned");
    } catch {
      toast.error("Failed to unassign ticket");
    } finally {
      setIsAssigning(false);
    }
  }

  const displayDraft = draft !== undefined ? draft : (ticket?.draftResponse ?? "");

  // ── Loading ────────────────────────────────────────────────────────────────
  if (ticket === undefined) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {BACK}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-5">
            <Card className="shadow-none">
              <CardHeader className="border-b px-5 py-4">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="px-5 py-4 flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader className="border-b px-5 py-4">
                <Skeleton className="h-4 w-36" />
              </CardHeader>
              <CardContent className="px-5 py-4">
                <Skeleton className="h-[200px] w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
            <Card className="shadow-none">
              <CardHeader className="border-b px-5 py-4">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent className="px-5 divide-y divide-zinc-100">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (ticket === null) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {BACK}
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-lg font-medium text-zinc-800">Ticket not found</p>
          <p className="text-sm text-zinc-500">
            This ticket may have been deleted or you don&apos;t have access to it.
          </p>
          <Link href="/dashboard/tickets">
            <Button variant="outline" size="sm" className="mt-2">
              Back to Tickets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── KB match computation (ticket is loaded) ────────────────────────────────
  const kbWords = ticket.subject
    .toLowerCase()
    .split(/\s+/)
    .filter((w: string) => w.length > 3);

  const kbMatches = knowledge
    ? knowledge
        .map((entry) => {
          const haystack = `${entry.title} ${entry.content}`.toLowerCase();
          const hits = kbWords.filter((w: string) => haystack.includes(w)).length;
          return { entry, hits };
        })
        .filter(({ hits }) => hits > 0)
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 3)
        .map(({ entry }) => entry)
    : null;

  // ── Loaded ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-8">
      {BACK}

      {/* Subject */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{ticket.subject}</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {ticket.customerEmail} &middot; Opened{" "}
          {new Date(ticket._creationTime).toLocaleString("en-US", {
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
                {ticket.body}
              </pre>
            </CardContent>
          </Card>

          {/* Draft response */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Sparkles className="h-3 w-3" />AI
                </Badge>
                AI Draft Response
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 flex flex-col gap-4">
              <Textarea
                value={displayDraft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-[200px] resize-none text-sm text-zinc-700 leading-relaxed border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400"
              />
              <div className="flex items-center gap-3">
                <Button className="gap-2" onClick={handleSendResponse} disabled={isSending}>
                  {isSending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {isSending ? "Sending…" : "Send Response"}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleMarkResolved}
                  disabled={isResolving || ticket.status === "resolved"}
                >
                  {isResolving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {ticket.status === "resolved" ? "Resolved" : "Mark Resolved"}
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
                <Badge variant="outline" className={`capitalize text-xs font-medium ${statusCls[ticket.status as TicketStatus]}`}>
                  {ticket.status.replace("_", " ")}
                </Badge>
              </MetaRow>
              <MetaRow label="Priority">
                <Badge variant="outline" className={`capitalize text-xs font-medium ${priorityCls[ticket.priority as TicketPriority]}`}>
                  {ticket.priority}
                </Badge>
              </MetaRow>
              <MetaRow label="Sentiment">
                {ticket.sentiment ? (
                  <Badge variant="outline" className={`capitalize text-xs font-medium ${sentimentCls[ticket.sentiment as SentimentScore]}`}>
                    {ticket.sentiment}
                  </Badge>
                ) : (
                  <span className="text-xs text-zinc-400">—</span>
                )}
              </MetaRow>
              <MetaRow label="Category">
                <span className="text-sm font-medium text-zinc-700 capitalize">
                  {ticket.category ?? "general"}
                </span>
              </MetaRow>
              {/* Assignment */}
              <div className="py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-zinc-500">Assigned to</span>
                  {(ticket as { assignedName?: string }).assignedName ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-zinc-700">
                        {(ticket as { assignedName?: string }).assignedName}
                      </span>
                      <button
                        onClick={handleUnassign}
                        disabled={isAssigning}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                        title="Unassign"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAssignForm((v) => !v)}
                      className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      {showAssignForm ? "Cancel" : "Assign"}
                    </button>
                  )}
                </div>
                {showAssignForm && !(ticket as { assignedName?: string }).assignedName && (
                  <form onSubmit={handleAssign} className="flex gap-1.5 mt-1">
                    <Input
                      placeholder="Name or email"
                      value={assignInput}
                      onChange={(e) => setAssignInput(e.target.value)}
                      disabled={isAssigning}
                      className="h-7 text-xs"
                    />
                    <Button type="submit" size="sm" disabled={isAssigning || !assignInput.trim()} className="h-7 text-xs px-2">
                      Save
                    </Button>
                  </form>
                )}
                {!(ticket as { assignedName?: string }).assignedName && !showAssignForm && (
                  <span className="text-xs text-zinc-400">Unassigned</span>
                )}
              </div>
              <MetaRow label="Org Code">
                <span className="font-mono text-xs text-zinc-700">
                  {ticket.orgCode}
                </span>
              </MetaRow>
            </CardContent>
          </Card>

          {/* Escalation warning */}
          {ticket.status === "escalated" && (
            <Card className="shadow-none border-red-200 bg-red-50/50">
              <CardHeader className="px-5 py-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  Escalated
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-sm text-red-600 leading-relaxed">
                  {ticket.escalationReason ?? "This ticket has been escalated for immediate attention."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Knowledge base matches */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <BookOpen className="h-4 w-4 text-zinc-400" />
                Knowledge Base Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-0 divide-y divide-zinc-100">
              {/* Loading */}
              {knowledge === undefined && (
                <>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="py-4 flex flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  ))}
                </>
              )}

              {/* Empty KB */}
              {knowledge !== undefined && knowledge.length === 0 && (
                <p className="py-5 text-xs text-zinc-400 text-center">
                  No knowledge base entries yet.{" "}
                  <Link href="/dashboard/settings" className="underline hover:text-zinc-600">
                    Add entries in Settings.
                  </Link>
                </p>
              )}

              {/* KB has entries but no matches */}
              {knowledge !== undefined && knowledge.length > 0 && kbMatches !== null && kbMatches.length === 0 && (
                <p className="py-5 text-xs text-zinc-400 text-center">
                  No relevant entries found for this ticket.
                </p>
              )}

              {/* Matches */}
              {kbMatches !== null && kbMatches.map((entry, i) => (
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
