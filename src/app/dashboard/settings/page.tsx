"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { api } from "../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, BookOpen, Building2, Code2, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, getOrganization } = useKindeBrowserClient();
  const org = getOrganization();
  const orgCode = org?.orgCode ?? undefined;

  const knowledge = useQuery(
    api.knowledge.getKnowledgeByOrg,
    orgCode ? { orgCode } : "skip"
  );

  return (
    <div className="flex flex-col gap-8 p-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your organization and knowledge base.
        </p>
      </div>

      {/* Organisation card */}
      <Card className="shadow-none">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <Building2 className="h-4 w-4 text-zinc-400" />
            Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Org Name
              </span>
              <span className="text-sm font-medium text-zinc-800">
                {org?.orgName ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Org Code
              </span>
              <span className="font-mono text-sm text-zinc-600">
                {org?.orgCode ?? "—"}
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

      {/* Knowledge base + Developer — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5 flex flex-col gap-4">
            <p className="text-sm text-zinc-600">
              {knowledge === undefined
                ? "Loading…"
                : `${knowledge.length} ${knowledge.length === 1 ? "entry" : "entries"} in your knowledge base`}
            </p>
            <Link
              href="/dashboard/knowledge"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-800 hover:text-zinc-600 transition-colors"
            >
              Manage
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <Code2 className="h-4 w-4 text-zinc-400" />
              Developer
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5 flex flex-col gap-4">
            <p className="text-sm text-zinc-600">
              Manage API keys, REST API, and MCP server docs.
            </p>
            <Link
              href="/dashboard/developer"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-800 hover:text-zinc-600 transition-colors"
            >
              Developer settings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Sign out */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900">Sign out</p>
          <p className="text-xs text-zinc-500">
            You will be redirected to the login page.
          </p>
        </div>
        <LogoutLink>
          <Button
            variant="outline"
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </LogoutLink>
      </div>
    </div>
  );
}