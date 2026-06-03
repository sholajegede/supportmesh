"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Inbox, Clock, AlertTriangle, CheckCircle2, Sparkles, Loader2, ArrowRight } from "lucide-react";
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

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(creationTime: number): string {
  const diffMs = Date.now() - creationTime;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { user, getClaim, getToken } = useKindeBrowserClient();
  const orgCode = getClaim("org_code")?.value as string | undefined;

  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryText, setSummaryText]           = useState("");
  const [summaryOpen, setSummaryOpen]           = useState(false);

  const tickets = useQuery(
    api.tickets.getTicketsByOrg,
    orgCode ? { orgCode } : "skip"
  );

  const isLoading = tickets === undefined;

  const total     = tickets?.length ?? 0;
  const open      = tickets?.filter((t) => t.status === "open").length ?? 0;
  const escalated = tickets?.filter((t) => t.status === "escalated").length ?? 0;
  const resolved  = tickets?.filter((t) => t.status === "resolved").length ?? 0;

  const recent = tickets?.slice(0, 5) ?? [];

  const STATS = [
    { label: "Total Tickets", value: total,     icon: Inbox,         color: "text-zinc-600",  accent: "border-l-zinc-400"  },
    { label: "Open",          value: open,      icon: Clock,         color: "text-blue-600",  accent: "border-l-blue-500"  },
    { label: "Escalated",     value: escalated, icon: AlertTriangle, color: "text-red-600",   accent: "border-l-red-500"   },
    { label: "Resolved",      value: resolved,  icon: CheckCircle2,  color: "text-green-600", accent: "border-l-green-500" },
  ];

  async function handleRunSummary() {
    if (!orgCode) return;
    setIsSummaryLoading(true);
    try {
      const token = getToken();
      const date = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/agents/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ date }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setSummaryText(data.message ?? "Summary generated.");
      setSummaryOpen(true);
    } catch {
      toast.error("Failed to generate summary — try again");
    } finally {
      setIsSummaryLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              {greeting()}, {user?.given_name ?? "there"} 👋
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Here&apos;s what&apos;s happening with your support queue today.
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={handleRunSummary}
            disabled={isSummaryLoading || !orgCode}
          >
            {isSummaryLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isSummaryLoading ? "Generating…" : "Run Daily Summary"}
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon, color, accent }) => (
            <Card key={label} className={`shadow-none border-l-2 ${accent}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                <CardTitle className="text-sm font-medium text-zinc-500">{label}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-zinc-900">{value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent tickets */}
        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-base font-semibold text-zinc-900">
              Recent Tickets
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto -mx-px sm:mx-0">
            <div className="min-w-[600px] sm:min-w-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Subject</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Priority</TableHead>
                <TableHead className="text-xs">Sentiment</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  </TableRow>
                ))
              ) : recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-zinc-400">
                    No tickets yet. Tickets will appear here once triage runs.
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((t) => (
                  <TableRow key={String(t._id)} className="cursor-pointer hover:bg-zinc-50/60">
                    <TableCell className="max-w-[260px] truncate font-medium text-zinc-800">
                      {t.subject}
                    </TableCell>
                    <TableCell className="capitalize text-zinc-500 text-sm">
                      {(t.category ?? "general").replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize text-xs font-medium ${priorityCls[t.priority as TicketPriority]}`}>
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {t.sentiment ? (
                        <Badge variant="outline" className={`capitalize text-xs font-medium ${sentimentCls[t.sentiment as SentimentScore]}`}>
                          {t.sentiment}
                        </Badge>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize text-xs font-medium ${statusCls[t.status as TicketStatus]}`}>
                        {t.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {timeAgo(t._creationTime)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
            </div>
          </div>
        </Card>
        <div className="flex justify-end">
          <Link
            href="/dashboard/tickets"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            View all tickets
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Daily Summary Dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-2xl flex flex-col max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Daily Summary — {todayLabel()}</DialogTitle>
            <DialogDescription>
              AI-generated support operations summary for your Organization.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto rounded-md border border-zinc-100 bg-zinc-50 px-4 py-3">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700">
              {summaryText}
            </pre>
          </div>
          <DialogFooter>
            <Button onClick={() => setSummaryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
