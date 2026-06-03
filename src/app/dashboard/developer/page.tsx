"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clipboard,
  Code2,
  Key,
  Link2,
  Loader2,
  Plus,
  Server,
  Trash2,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiKeysRef = (api as any).apiKeys;

const BASE_URL = "https://supportmesh-agent.vercel.app";

function CodeBlock({ code }: { code: string }) {
  function handleCopy() {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="relative">
      <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
        title="Copy"
      >
        <Clipboard className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function DeveloperPage() {
  const { getOrganization } = useKindeBrowserClient();
  const org = getOrganization();
  const orgCode = org?.orgCode ?? undefined;

  // API Keys
  const apiKeys = useQuery(
    apiKeysRef.getApiKeysByOrg,
    orgCode ? { orgCode } : "skip"
  );
  const generateKey = useMutation(apiKeysRef.generateApiKey);
  const revokeKey = useMutation(apiKeysRef.revokeApiKey);

  const [showGenerate, setShowGenerate] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Submission URL copy
  const submissionUrl = orgCode
    ? `${BASE_URL}/submit/${orgCode}`
    : `${BASE_URL}/submit/<orgCode>`;

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
          <h1 className="text-2xl font-semibold text-zinc-900">Developer</h1>
          <p className="mt-1 text-sm text-zinc-500">
            API keys, REST API, MCP server, and integration docs.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Row 1: Customer Submission URL (left) + API Keys (right) */}

          {/* ── Customer Submission URL ── */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                <Link2 className="h-4 w-4 text-zinc-400" />
                Customer Submission URL
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-5 flex flex-col gap-3">
              <p className="text-sm text-zinc-500">
                Share this link with your customers. No account is required —
                they fill in their name, email, and message, and the triage
                agent processes it automatically.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 min-w-0 truncate font-mono text-xs text-zinc-700 bg-zinc-100 px-3 py-2 rounded-md border border-zinc-200">
                  {submissionUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 shrink-0 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(submissionUrl);
                    toast.success("URL copied to clipboard");
                  }}
                >
                  <Clipboard className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── API Keys ── */}
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
              {showGenerate && (
                <form
                  onSubmit={handleGenerateKey}
                  className="border-b border-zinc-100 py-4 flex flex-col gap-3"
                >
                  <p className="text-sm font-medium text-zinc-700">
                    New API key
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Label (optional)"
                      value={newKeyLabel}
                      onChange={(e) => setNewKeyLabel(e.target.value)}
                      disabled={isGenerating}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isGenerating}
                      className="gap-1.5 shrink-0"
                    >
                      {isGenerating && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      {isGenerating ? "Generating…" : "Generate"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-zinc-500 shrink-0"
                      onClick={() => {
                        setShowGenerate(false);
                        setNewKeyLabel("");
                      }}
                      disabled={isGenerating}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {apiKeys === undefined && (
                <div className="divide-y divide-zinc-100">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-7 w-7 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {apiKeys !== undefined &&
                apiKeys.length === 0 &&
                !showGenerate && (
                  <p className="py-6 text-sm text-zinc-400 text-center">
                    No API keys yet. Generate one above.
                  </p>
                )}

              {apiKeys !== undefined && apiKeys.length > 0 && (
                <div className="divide-y divide-zinc-100">
                  {apiKeys.map(
                    (k: {
                      _id: string;
                      label?: string;
                      createdAt: number;
                      keyPreview: string;
                    }) => {
                      const isRevoking = revokingId === k._id;
                      const isConfirm = confirmId === k._id;
                      return (
                        <div
                          key={k._id}
                          className="flex items-center justify-between py-4 gap-4"
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">
                                {k.keyPreview}
                              </code>
                              {k.label && (
                                <span className="text-sm text-zinc-600 truncate">
                                  {k.label}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-zinc-400">
                              Created {formatDate(k.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isConfirm && !isRevoking && (
                              <span className="text-xs text-red-600 font-medium">
                                Confirm?
                              </span>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`h-7 w-7 ${
                                isConfirm
                                  ? "text-red-600 hover:text-red-700"
                                  : "text-zinc-400 hover:text-red-600"
                              }`}
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
                    }
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Row 2: MCP Server (left) + REST API (right) */}

          {/* ── MCP Server ── */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                <Server className="h-4 w-4 text-zinc-400" />
                MCP Server
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-5 flex flex-col gap-6">
              <p className="text-sm text-zinc-500">
                SupportMesh exposes a Model Context Protocol server at{" "}
                <code className="font-mono text-zinc-700">/api/mcp</code>.
                Connect any MCP-compatible AI agent to manage tickets
                programmatically.
              </p>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Available tools
                </p>
                <div className="border border-zinc-200 rounded-lg overflow-hidden text-sm">
                  <div className="grid grid-cols-[auto_1fr] divide-y divide-zinc-100">
                    {[
                      {
                        tool: "submit_ticket",
                        desc: "Create and triage a new support ticket",
                      },
                      {
                        tool: "get_org_tickets",
                        desc: "List all tickets for your organisation",
                      },
                      {
                        tool: "get_ticket",
                        desc: "Fetch a single ticket by ID",
                      },
                    ].map(({ tool, desc }) => (
                      <>
                        <div
                          key={`tool-${tool}`}
                          className="px-4 py-2.5 bg-zinc-50 border-r border-zinc-100"
                        >
                          <code className="font-mono text-xs text-zinc-700">
                            {tool}
                          </code>
                        </div>
                        <div
                          key={`desc-${tool}`}
                          className="px-4 py-2.5 text-zinc-600"
                        >
                          {desc}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Claude Desktop config
                </p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "supportmesh": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${BASE_URL}/api/mcp",
        "--header",
        "Authorization: Bearer sm_yourkey"
      ]
    }
  }
}`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Test with curl
                </p>
                <CodeBlock
                  code={`curl -X POST ${BASE_URL}/api/mcp \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sm_yourkey" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'`}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── REST API ── */}
          <Card className="shadow-none">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                <Code2 className="h-4 w-4 text-zinc-400" />
                REST API
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-5 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-zinc-900 text-white text-xs font-mono px-2 py-0.5 rounded">
                    POST
                  </Badge>
                  <code className="text-xs font-mono text-zinc-700">
                    /api/v1/tickets
                  </code>
                </div>
                <p className="text-sm text-zinc-500">
                  Submit a new support ticket. The triage agent processes it
                  immediately and returns the enriched ticket.
                </p>
                <CodeBlock
                  code={`curl -X POST ${BASE_URL}/api/v1/tickets \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sm_yourkey" \\
  -d '{
    "subject": "Cannot log in to my account",
    "body": "I have been locked out since yesterday.",
    "customerEmail": "customer@example.com"
  }'`}
                />
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide mt-1">
                  Response
                </p>
                <CodeBlock
                  code={`{
  "ticketId": "jd7abc123...",
  "status": "triaged"
}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-zinc-400">
          Include your key as:{" "}
          <code className="font-mono">Authorization: Bearer sm_yourkey</code>
        </p>
      </div>

      {/* Reveal key dialog */}
      <Dialog
        open={revealedKey !== null}
        onOpenChange={() => setRevealedKey(null)}
      >
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