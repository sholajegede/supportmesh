import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Inbox, Clock, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import type { TicketPriority, SentimentScore, TicketStatus } from "@/types";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

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

const RECENT = [
  { id: "t8", subject: "Slack integration stopped sending notifications", category: "technical",   priority: "critical" as TicketPriority, sentiment: "frustrated" as SentimentScore, status: "escalated"   as TicketStatus, created: "2h ago" },
  { id: "t1", subject: "API rate limit exceeded on production endpoint",    category: "technical",   priority: "high"     as TicketPriority, sentiment: "negative"   as SentimentScore, status: "open"        as TicketStatus, created: "4h ago" },
  { id: "t2", subject: "Unable to generate invoice for last billing cycle", category: "billing",     priority: "medium"   as TicketPriority, sentiment: "negative"   as SentimentScore, status: "open"        as TicketStatus, created: "6h ago" },
  { id: "t5", subject: "Dashboard loading slowly for enterprise plan",      category: "technical",   priority: "medium"   as TicketPriority, sentiment: "neutral"    as SentimentScore, status: "in_progress" as TicketStatus, created: "8h ago" },
  { id: "t3", subject: "Feature request: bulk export to CSV",               category: "feature_request", priority: "low" as TicketPriority, sentiment: "positive"   as SentimentScore, status: "resolved"    as TicketStatus, created: "1d ago" },
];

const STATS = [
  { label: "Total Tickets", value: 24, icon: Inbox,         color: "text-zinc-600" },
  { label: "Open",          value: 11, icon: Clock,         color: "text-blue-600" },
  { label: "Escalated",     value:  3, icon: AlertTriangle, color: "text-red-600"  },
  { label: "Resolved",      value: 10, icon: CheckCircle2,  color: "text-green-600" },
];

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {greeting()}, {user?.given_name ?? "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Here&apos;s what&apos;s happening with your support queue today.
          </p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Run Daily Summary
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
              <CardTitle className="text-sm font-medium text-zinc-500">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-900">{value}</p>
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
            {RECENT.map((t) => (
              <TableRow key={t.id} className="cursor-pointer hover:bg-zinc-50/60">
                <TableCell className="max-w-[260px] truncate font-medium text-zinc-800">
                  {t.subject}
                </TableCell>
                <TableCell className="capitalize text-zinc-500 text-sm">{t.category.replace("_", " ")}</TableCell>
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
                <TableCell className="text-zinc-400 text-sm">{t.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
