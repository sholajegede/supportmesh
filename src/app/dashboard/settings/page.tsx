"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Bell, BookOpen, Building2, CheckCircle2, Circle, Code2, Paintbrush } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const orgsRef = (api as any).orgs;

type OrgData = {
  slackWebhookUrl?: string;
  brandName?: string;
  brandColor?: string;
} | null | undefined;

export default function SettingsPage() {
  const { user, getOrganization } = useKindeBrowserClient();
  const org = getOrganization();
  const orgCode = org?.orgCode ?? undefined;

  const knowledge = useQuery(
    api.knowledge.getKnowledgeByOrg,
    orgCode ? { orgCode } : "skip"
  );

  const orgData = useQuery(
    api.orgs.getOrgByCode,
    orgCode ? { orgCode } : "skip"
  ) as OrgData;

  // Slack webhook
  const updateSlack = useMutation(orgsRef.updateOrgSlackWebhook);
  const [slackInput, setSlackInput] = useState("");
  const [isSavingSlack, setIsSavingSlack] = useState(false);

  // Branding
  const updateBranding = useMutation(orgsRef.updateOrgBranding);
  const [brandNameInput, setBrandNameInput] = useState("");
  const [brandColorInput, setBrandColorInput] = useState("#000000");
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  async function handleSaveSlack(e: React.FormEvent) {
    e.preventDefault();
    if (!orgCode || !slackInput.trim()) return;
    setIsSavingSlack(true);
    try {
      await updateSlack({ orgCode, slackWebhookUrl: slackInput.trim() });
      toast.success("Slack webhook saved");
      setSlackInput("");
    } catch {
      toast.error("Failed to save Slack webhook");
    } finally {
      setIsSavingSlack(false);
    }
  }

  async function handleSaveBranding(e: React.FormEvent) {
    e.preventDefault();
    if (!orgCode) return;
    setIsSavingBranding(true);
    try {
      await updateBranding({
        orgCode,
        brandName: brandNameInput.trim() || undefined,
        brandColor: brandColorInput || undefined,
      });
      toast.success("Branding saved");
      setBrandNameInput("");
    } catch {
      toast.error("Failed to save branding");
    } finally {
      setIsSavingBranding(false);
    }
  }

  const slackConfigured = Boolean(orgData?.slackWebhookUrl);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* ROW 1: Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your organization, notifications, and branding.
        </p>
      </div>

      {/* ROW 2: Organization info — full width */}
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

      {/* ROW 3: Slack + Branding — two columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Slack card */}
        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <Bell className="h-4 w-4 text-zinc-400" />
              Slack notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5">
            <form onSubmit={handleSaveSlack} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="slack-webhook" className="text-sm font-medium text-zinc-700">
                  Slack webhook URL
                </Label>
                {slackConfigured ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Configured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <Circle className="h-3.5 w-3.5" />
                    Not configured
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackInput}
                  onChange={(e) => setSlackInput(e.target.value)}
                  disabled={isSavingSlack}
                  className="flex-1 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingSlack || !slackInput.trim()}
                  className="shrink-0"
                >
                  {isSavingSlack ? "Saving…" : "Save"}
                </Button>
              </div>
              <p className="text-xs text-zinc-400">
                Get this from your Slack app&apos;s Incoming Webhooks page. A
                notification is sent each time a ticket is triaged.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Branding card */}
        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <Paintbrush className="h-4 w-4 text-zinc-400" />
              Submission page branding
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5">
            <form onSubmit={handleSaveBranding} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="brand-name" className="text-sm font-medium text-zinc-700">
                    Brand name
                  </Label>
                  <Input
                    id="brand-name"
                    placeholder={org?.orgName ?? "Your brand name"}
                    value={brandNameInput}
                    onChange={(e) => setBrandNameInput(e.target.value)}
                    disabled={isSavingBranding}
                    className="text-sm"
                  />
                  {orgData?.brandName && (
                    <span className="text-xs text-zinc-500">
                      Current: <span className="font-medium">{orgData.brandName}</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="brand-color" className="text-sm font-medium text-zinc-700">
                    Brand color
                  </Label>
                  <div className="flex gap-2 items-center">
                    <input
                      title="Choose your brand color"
                      id="brand-color"
                      type="color"
                      value={brandColorInput}
                      onChange={(e) => setBrandColorInput(e.target.value)}
                      disabled={isSavingBranding}
                      className="h-9 w-14 cursor-pointer rounded border border-zinc-200 p-0.5"
                    />
                    <span className="font-mono text-xs text-zinc-500">{brandColorInput}</span>
                  </div>
                  {orgData?.brandColor && (
                    <span className="text-xs text-zinc-500">
                      Current:{" "}
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-zinc-200 align-middle"
                        style={{ backgroundColor: orgData.brandColor }}
                      />{" "}
                      <span className="font-mono">{orgData.brandColor}</span>
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-zinc-400">
                Your customers will see this on your{" "}
                <code className="font-mono">/submit/[orgCode]</code> page.
              </p>
              <div>
                <Button type="submit" size="sm" disabled={isSavingBranding}>
                  {isSavingBranding ? "Saving…" : "Save branding"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* ROW 4: Knowledge Base + Developer — two columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

    </div>
  );
}
