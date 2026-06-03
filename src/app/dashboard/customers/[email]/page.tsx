"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Inbox } from "lucide-react";
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

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function CustomerDetailPage() {
  const params = useParams<{ email: string }>();
  const customerEmail = params?.email ?? "";

  const { getClaim } = useKindeBrowserClient();
  const orgCode = getClaim("org_code")?.value as string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tickets = useQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api as any).tickets.getTicketsByCustomerEmail,
    orgCode && customerEmail ? { orgCode, customerEmail } : "skip"
  );

  const isLoading = tickets === undefined;

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Back */}
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Customers
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-zinc-900 break-all">
          {customerEmail}
        </h1>
        {isLoading ? (
          <Skeleton className="h-5 w-8 rounded-full" />
        ) : (
          <Badge variant="secondary" className="text-sm font-medium shrink-0">
            {tickets?.length ?? 0} {tickets?.length === 1 ? "ticket" : "tickets"}
          </Badge>
        )}
      </div>

      {/* Table */}
      <Card className="shadow-none">
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
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                </TableRow>
              ))
            ) : !tickets || tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-8 w-8 text-zinc-300" />
                    <span className="text-sm text-zinc-400">No tickets from this customer.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((t: {
                _id: string;
                subject: string;
                category?: string;
                priority: string;
                sentiment?: string;
                status: string;
                _creationTime: number;
              }) => (
                <TableRow key={String(t._id)} className="cursor-pointer hover:bg-zinc-50/60">
                  <TableCell className="max-w-[240px] font-medium text-zinc-800">
                    <Link
                      href={`/dashboard/tickets/${t._id}`}
                      className="block truncate hover:underline"
                    >
                      {t.subject}
                    </Link>
                  </TableCell>
                  <TableCell className="capitalize text-sm text-zinc-500">
                    {(t.category ?? "general").replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs font-medium ${priorityCls[t.priority as TicketPriority]}`}
                    >
                      {t.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {t.sentiment ? (
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs font-medium ${sentimentCls[t.sentiment as SentimentScore]}`}
                      >
                        {t.sentiment}
                      </Badge>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs font-medium ${statusCls[t.status as TicketStatus]}`}
                    >
                      {t.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-400">
                    {timeAgo(t._creationTime)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/customers">← Back to all customers</Link>
        </Button>
      </div>
    </div>
  );
}
