"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { api } from "../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
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
import { Users } from "lucide-react";

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function CustomersPage() {
  const { getClaim } = useKindeBrowserClient();
  const orgCode = getClaim("org_code")?.value as string | undefined;

  const tickets = useQuery(
    api.tickets.getTicketsByOrg,
    orgCode ? { orgCode } : "skip"
  );

  const isLoading = tickets === undefined;

  // Deduplicate by email, compute ticket count and most recent date
  const customers = tickets
    ? Object.values(
        tickets.reduce<
          Record<string, { email: string; count: number; latest: number }>
        >((acc, t) => {
          const existing = acc[t.customerEmail];
          if (existing) {
            existing.count += 1;
            if (t._creationTime > existing.latest) {
              existing.latest = t._creationTime;
            }
          } else {
            acc[t.customerEmail] = {
              email: t.customerEmail,
              count: 1,
              latest: t._creationTime,
            };
          }
          return acc;
        }, {})
      ).sort((a, b) => b.latest - a.latest)
    : [];

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900">Customers</h1>
        {isLoading ? (
          <Skeleton className="h-5 w-8 rounded-full" />
        ) : (
          <Badge variant="secondary" className="text-sm font-medium">
            {customers.length}
          </Badge>
        )}
      </div>

      {/* Table */}
      <Card className="shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-xs">Tickets</TableHead>
              <TableHead className="text-xs">Last ticket</TableHead>
              <TableHead className="text-xs"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-8 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-zinc-300" />
                    <span className="text-sm text-zinc-400">No customers yet.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.email} className="hover:bg-zinc-50/60">
                  <TableCell className="font-medium text-zinc-800">
                    {c.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {c.count}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-400">
                    {timeAgo(c.latest)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/customers/${encodeURIComponent(c.email)}`}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                      View →
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
