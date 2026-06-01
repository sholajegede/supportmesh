"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

type Tab = "all" | TicketStatus;

const ALL_TICKETS = [
  { id: "t8",  customer: "carlos@acme.io",      subject: "Slack integration stopped sending notifications", category: "technical",       priority: "critical" as TicketPriority, sentiment: "frustrated" as SentimentScore, status: "escalated"   as TicketStatus, created: "2h ago" },
  { id: "t6",  customer: "billing@globex.com",   subject: "Incorrect charge on account — urgent",           category: "billing",         priority: "high"     as TicketPriority, sentiment: "frustrated" as SentimentScore, status: "escalated"   as TicketStatus, created: "3h ago" },
  { id: "t1",  customer: "dev@widgets.co",       subject: "API rate limit exceeded on production endpoint", category: "technical",       priority: "high"     as TicketPriority, sentiment: "negative"   as SentimentScore, status: "open"        as TicketStatus, created: "4h ago" },
  { id: "t4",  customer: "amy@startup.io",       subject: "Two-factor authentication not working",         category: "account",         priority: "high"     as TicketPriority, sentiment: "negative"   as SentimentScore, status: "open"        as TicketStatus, created: "5h ago" },
  { id: "t9",  customer: "ops@enterprise.com",   subject: "Password reset email not arriving",             category: "account",         priority: "medium"   as TicketPriority, sentiment: "negative"   as SentimentScore, status: "open"        as TicketStatus, created: "5h ago" },
  { id: "t2",  customer: "finance@corp.net",     subject: "Unable to generate invoice for last billing",   category: "billing",         priority: "medium"   as TicketPriority, sentiment: "negative"   as SentimentScore, status: "open"        as TicketStatus, created: "6h ago" },
  { id: "t5",  customer: "admin@megacorp.com",   subject: "Dashboard loading slowly for enterprise plan",  category: "technical",       priority: "medium"   as TicketPriority, sentiment: "neutral"    as SentimentScore, status: "in_progress" as TicketStatus, created: "8h ago" },
  { id: "t10", customer: "it@solutions.io",      subject: "White-label custom domain setup not working",   category: "technical",       priority: "medium"   as TicketPriority, sentiment: "neutral"    as SentimentScore, status: "in_progress" as TicketStatus, created: "10h ago" },
  { id: "t7",  customer: "hello@smallbiz.com",   subject: "How do I add more team members?",              category: "general",         priority: "low"      as TicketPriority, sentiment: "positive"   as SentimentScore, status: "resolved"    as TicketStatus, created: "1d ago" },
  { id: "t3",  customer: "data@analytics.co",    subject: "Feature request: bulk export to CSV",          category: "feature_request", priority: "low"      as TicketPriority, sentiment: "positive"   as SentimentScore, status: "resolved"    as TicketStatus, created: "1d ago" },
];

export default function TicketsPage() {
  const [tab, setTab] = useState<Tab>("all");

  const filtered =
    tab === "all" ? ALL_TICKETS : ALL_TICKETS.filter((t) => t.status === tab);

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900">Tickets</h1>
        <Badge variant="secondary" className="text-sm font-medium">
          {ALL_TICKETS.length}
        </Badge>
      </div>

      {/* Filter tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="h-9">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card className="shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Subject</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs">Priority</TableHead>
              <TableHead className="text-xs">Sentiment</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-zinc-400">
                  No tickets in this category.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-zinc-50/60">
                  <TableCell className="text-sm text-zinc-500 max-w-[140px] truncate">
                    <Link href={`/tickets/${t.id}`} className="block hover:underline">
                      {t.customer}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[220px] font-medium text-zinc-800">
                    <Link href={`/tickets/${t.id}`} className="block truncate hover:underline">
                      {t.subject}
                    </Link>
                  </TableCell>
                  <TableCell className="capitalize text-sm text-zinc-500">
                    {t.category.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize text-xs font-medium ${priorityCls[t.priority]}`}>
                      {t.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize text-xs font-medium ${sentimentCls[t.sentiment]}`}>
                      {t.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize text-xs font-medium ${statusCls[t.status]}`}>
                      {t.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-400">{t.created}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
