"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

type OrgData = {
  orgName: string;
  brandName?: string;
  brandColor?: string;
} | null | undefined;

export default function SubmitTicketPage() {
  const params = useParams<{ orgCode: string }>();
  const orgCode = params?.orgCode ?? "";

  const org = useQuery(api.orgs.getOrgByCode, orgCode ? { orgCode } : "skip") as OrgData;

  const [state, setState]           = useState<FormState>("idle");
  const [email, setEmail]           = useState("");
  const [subject, setSubject]       = useState("");
  const [message, setMessage]       = useState("");
  const [errorMsg, setErrorMsg]     = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const isLoading = state === "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/agents/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body: message,
          customerEmail: email,
          orgCode,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Request failed");
      }
      setSubmittedEmail(email);
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrorMsg("");
    setSubmittedEmail("");
  }

  // Loading
  if (org === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  // Not found
  if (org === null) {
    return (
      <div className="min-h-screen bg-background flex items-start justify-center px-4 pt-16 pb-12">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              SupportMesh
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-4 py-8">
            <h1 className="text-2xl font-semibold text-zinc-900">Invalid submission link</h1>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              This support link is not valid. Please contact the company that sent
              you here to get the correct link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const displayName = org.brandName ?? "SupportMesh";
  const brandColor  = org.brandColor ?? null;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 pt-16 pb-12">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: brandColor ?? "#18181b" }}
          >
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            {displayName}
          </span>
        </div>

        {state === "success" ? (
          /* Success state */
          <div className="flex flex-col items-center text-center gap-5 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-200">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Ticket submitted</h1>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed max-w-sm">
                We&apos;ll get back to you at{" "}
                <span className="font-medium text-zinc-700">{submittedEmail}</span>{" "}
                shortly. Our support team typically responds within a few hours.
              </p>
            </div>
            <Button variant="outline" onClick={reset}>
              Submit another ticket
            </Button>
          </div>
        ) : (
          /* Form */
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-semibold text-zinc-900">
                Submit a request to {org.orgName}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500">
                Fill in the details below and our team will get back to you as
                soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">
                  Your email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please describe the issue in detail…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={20}
                  disabled={isLoading}
                  className="min-h-[200px] resize-none"
                />
              </div>

              {state === "error" && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2.5">
                  {errorMsg || "Failed to submit ticket. Please try again."}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2"
                style={brandColor ? { backgroundColor: brandColor, color: "#ffffff", borderColor: brandColor } : undefined}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Submitting…" : "Submit ticket"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
