import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Plus, BookOpen, LogOut, Building2 } from "lucide-react";

const KB_ENTRIES = [
  { title: "Slack Integration Troubleshooting Guide",  updated: "2026-06-01" },
  { title: "Notification Queue Status and Recovery",   updated: "2026-05-28" },
  { title: "Billing FAQ — Invoice Generation",         updated: "2026-05-20" },
];

export default async function SettingsPage() {
  const { getUser, getOrganization } = getKindeServerSession();
  const [user, org] = await Promise.all([getUser(), getOrganization()]);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your organization and knowledge base.
        </p>
      </div>

      {/* Organization card */}
      <Card className="shadow-none">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <Building2 className="h-4 w-4 text-zinc-400" />
            Organization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Org Name
              </span>
              <span className="text-sm font-medium text-zinc-800">
                {org?.orgName ?? "Acme Corporation"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Org Code
              </span>
              <span className="font-mono text-sm text-zinc-600">
                {org?.orgCode ?? "org_acme_demo"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Account Owner
              </span>
              <span className="text-sm text-zinc-800">
                {user?.given_name && user?.family_name
                  ? `${user.given_name} ${user.family_name}`
                  : user?.email ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Plan
              </span>
              <div>
                <Badge className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs">
                  Pro
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge base */}
      <Card className="shadow-none">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              Knowledge Base
            </CardTitle>
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-0 divide-y divide-zinc-100">
          {KB_ENTRIES.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <span className="text-sm font-medium text-zinc-800">{entry.title}</span>
              <span className="text-xs text-zinc-400">Updated {entry.updated}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900">Sign out</p>
          <p className="text-xs text-zinc-500">
            You will be redirected to the login page.
          </p>
        </div>
        <LogoutLink>
          <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </LogoutLink>
      </div>
    </div>
  );
}
