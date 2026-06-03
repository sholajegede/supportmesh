"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen, Building2, Key, Loader2, LogOut, Plus, Trash2 } from "lucide-react";

// api.apiKeys is typed at runtime once `npx convex dev` regenerates api.d.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiKeysRef = (api as any).apiKeys;

export default function SettingsPage() {
  const { user, getOrganization } = useKindeBrowserClient();
  const org = getOrganization();
  const orgCode = org?.orgCode ?? undefined;

  const knowledge = useQuery(
    api.knowledge.getKnowledgeByOrg,
    orgCode ? { orgCode } : "skip"
  );

  // API Keys
  const apiKeys = useQuery(
    apiKeysRef.getApiKeysByOrg,
    orgCode ? { orgCode } : "skip"
  );
  const generateKey = useMutation(apiKeysRef.generateApiKey);
  const revokeKey   = useMutation(apiKeysRef.revokeApiKey);

  // Generate key form state
  const [showGenerate, setShowGenerate] = useState(false);
  const [newKeyLabel, setNewKeyLabel]   = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Newly generated key shown once in dialog
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  // Revoke confirm (two-click pattern)
  const [confirmId, setConfirmId]   = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleGenerateKey(e: React.FormEvent) {
    e.preventDefault();
    if (!orgCode) return;
    setIsGenerating(true);
    try {
      const result = await generateKey({
        orgCode,
        label: newKeyLabel.trim() || undefined,
      });
      setRevealedKey(result.key);
      setNewKeyLabel("");
      setShowGenerate(false);
      toast.success("API key generated");
    } catch {
      toast.error("Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleRevokeClick(id: string) {
    if (confirmId === id) {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      setConfirmId(null);
      setRevokingId(id);
      revokeKey({ id: id as Id<"apiKeys"> })
        .then(() => toast.success("API key revoked"))
        .catch(() => toast.error("Failed to revoke API key"))
        .finally(() => setRevokingId(null));
    } else {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      setConfirmId(id);
      confirmTimerRef.current = setTimeout(() => setConfirmId(null), 3000);
    }
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="flex flex-col gap-8 p-8 max-w-2xl">
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
              Organization Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Org Name</span>
                <span className="text-sm font-medium text-zinc-800">
                  {org?.orgName ?? "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Org Code</span>
                <span className="font-mono text-sm text-zinc-600">
                  {org?.orgCode ?? "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Account Owner</span>
                <span className="text-sm text-zinc-800">
                  {user?.given_name && user?.family_name
                    ? `${user.given_name} ${user.family_name}`
                    : user?.email ?? "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Plan</span>
                <div>
                  <Badge className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs">Pro</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge base summary */}
        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5 flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              {knowledge === undefined
                ? "Loading…"
                : `${knowledge.length} ${knowledge.length === 1 ? "entry" : "entries"} in your knowledge base`}
            </p>
            <Link
              href="/dashboard/knowledge"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-800 hover:text-zinc-600 transition-colors"
            >
              Manage Knowledge Base
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* API Keys card */}
        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                <Key className="h-4 w-4 text-zinc-400" />
                API Keys
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                onClick={() => setShowGenerate((v) => !v)}
              >
                <Plus className="h-3.5 w-3.5" />
                Generate API Key
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-0">
            {/* Inline generate form */}
            {showGenerate && (
              <form
                onSubmit={handleGenerateKey}
                className="border-b border-zinc-100 py-4 flex flex-col gap-3"
              >
                <p className="text-sm font-medium text-zinc-700">New API key</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Label (optional)"
                    value={newKeyLabel}
                    onChange={(e) => setNewKeyLabel(e.target.value)}
                    disabled={isGenerating}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" disabled={isGenerating} className="gap-1.5 shrink-0">
                    {isGenerating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isGenerating ? "Generating…" : "Generate"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-zinc-500 shrink-0"
                    onClick={() => { setShowGenerate(false); setNewKeyLabel(""); }}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Loading */}
            {apiKeys === undefined && (
              <div className="divide-y divide-zinc-100">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-4">
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-7 w-7 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {apiKeys !== undefined && apiKeys.length === 0 && !showGenerate && (
              <p className="py-6 text-sm text-zinc-400 text-center">
                No API keys yet. Generate one above.
              </p>
            )}

            {/* Key list */}
            {apiKeys !== undefined && apiKeys.length > 0 && (
              <div className="divide-y divide-zinc-100">
                {apiKeys.map((k: { _id: string; label?: string; createdAt: number; keyPreview: string }) => {
                  const isRevoking = revokingId === k._id;
                  const isConfirm  = confirmId === k._id;
                  return (
                    <div key={k._id} className="flex items-center justify-between py-4 gap-4">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">
                            {k.keyPreview}
                          </code>
                          {k.label && (
                            <span className="text-sm text-zinc-600 truncate">{k.label}</span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-400">Created {formatDate(k.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isConfirm && !isRevoking && (
                          <span className="text-xs text-red-600 font-medium">Confirm?</span>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-7 w-7 ${isConfirm ? "text-red-600 hover:text-red-700" : "text-zinc-400 hover:text-red-600"}`}
                          onClick={() => handleRevokeClick(k._id)}
                          disabled={isRevoking}
                        >
                          {isRevoking ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API key usage note */}
        <p className="text-xs text-zinc-400 -mt-4">
          Use your API key to access the MCP server and REST API. Include it as:{" "}
          <code className="font-mono">Authorization: Bearer sm_yourkey</code>
        </p>

        <Separator />

        {/* Sign out */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900">Sign out</p>
            <p className="text-xs text-zinc-500">You will be redirected to the login page.</p>
          </div>
          <LogoutLink>
            <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </LogoutLink>
        </div>
      </div>

      {/* Reveal key dialog — shown once after generation */}
      <Dialog open={revealedKey !== null} onOpenChange={() => setRevealedKey(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>API key generated</DialogTitle>
            <DialogDescription>
              Copy this key now. It will not be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
            <code className="block break-all font-mono text-sm text-zinc-800">
              {revealedKey}
            </code>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                if (revealedKey) {
                  navigator.clipboard.writeText(revealedKey);
                  toast.success("Copied to clipboard");
                }
              }}
            >
              Copy key
            </Button>
            <Button onClick={() => setRevealedKey(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
