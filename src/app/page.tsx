import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { Zap, MessageSquare, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-shimmer {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #e4e4e7 35%,
            #ffffff 50%,
            #e4e4e7 65%,
            #ffffff 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 7s linear infinite;
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-white text-zinc-900">

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <Zap className="h-4.5 w-4.5 text-zinc-950" style={{ height: 18, width: 18 }} />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                SupportMesh
              </span>
            </div>
            <LoginLink>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-4 text-xs transition-all duration-200 hover:ring-2 hover:ring-white/30 hover:ring-offset-1 hover:ring-offset-zinc-950"
              >
                Sign in
              </Button>
            </LoginLink>
          </div>
        </header>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section
          className="relative flex flex-col items-center justify-center bg-zinc-950 px-6 pt-28 pb-0 text-center text-white"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          {/* Radial glow */}
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-16">
            <div className="h-[600px] w-[800px] rounded-full bg-white/[0.03] blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-7 max-w-3xl">
            {/* Refined badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-white/75 tracking-wide">
                Powered by Claude AI and Mastra
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-6xl font-bold leading-[1.05] sm:text-7xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="hero-shimmer">Support operations,</span>
              <br />
              <span className="text-zinc-400">handled by AI</span>
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
              SupportMesh triages every ticket, drafts a response, flags
              escalations, and generates daily summaries — automatically. Your
              team reviews and sends.
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <LoginLink>
                <Button
                  size="lg"
                  className="gap-2 bg-white text-zinc-950 hover:bg-zinc-100 h-11 px-6 font-semibold"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </LoginLink>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6 border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white"
              >
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mx-auto mt-16 w-full max-w-4xl">
            <div className="relative rounded-t-xl border border-b-0 border-white/10 bg-zinc-900/80 overflow-hidden shadow-2xl">
              <div className="flex h-[280px] sm:h-[320px]">
                {/* Mock sidebar */}
                <div className="hidden sm:flex w-44 shrink-0 flex-col gap-1 border-r border-white/10 px-3 py-4">
                  <div className="mb-3 flex items-center gap-2 px-2">
                    <div className="h-5 w-5 rounded bg-white/20" />
                    <div className="h-2.5 w-20 rounded bg-white/20" />
                  </div>
                  {[
                    { w: 72, active: false },
                    { w: 52, active: true },
                    { w: 80, active: false },
                    { w: 60, active: false },
                  ].map(({ w, active }, i) => (
                    <div
                      key={i}
                      className={`flex h-8 items-center gap-2 rounded px-2 ${active ? "bg-white/10 border-l-2 border-white/40" : ""}`}
                    >
                      <div className="h-3.5 w-3.5 shrink-0 rounded bg-white/15" />
                      <div className="h-2.5 rounded bg-white/15" style={{ width: w }} />
                    </div>
                  ))}
                </div>

                {/* Mock content */}
                <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4 sm:p-5">
                  {/* Page header */}
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-36 rounded bg-white/20" />
                    <div className="h-7 w-28 rounded bg-white/10" />
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {[
                      "border-l-zinc-400",
                      "border-l-blue-500",
                      "border-l-red-500",
                      "border-l-green-500",
                    ].map((accent, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border border-white/10 bg-white/[0.04] p-3 border-l-2 ${accent}`}
                      >
                        <div className="mb-2.5 h-2 w-14 rounded bg-white/20" />
                        <div className="h-6 w-10 rounded bg-white/30" />
                      </div>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="flex-1 rounded-lg border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-4 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                      {[100, 64, 44, 44, 36, 28].map((w, i) => (
                        <div key={i} className="h-2 shrink-0 rounded bg-white/25" style={{ width: w }} />
                      ))}
                    </div>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 border-b border-white/[0.05] px-4 py-3">
                        {[88, 56, 36, 44, 30, 24].map((w, j) => (
                          <div key={j} className="h-2 shrink-0 rounded bg-white/10" style={{ width: w }} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient bleed into features */}
            <div className="pointer-events-none h-20 bg-gradient-to-b from-zinc-950 to-white" />
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                What it does
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Everything your support team does,
                <br />
                automated
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              {[
                {
                  icon: Zap,
                  title: "Instant triage",
                  label: "Powered by Claude Haiku",
                  body: "Every ticket is classified by category, priority, and sentiment the moment it arrives. No manual sorting, no backlog of unread tickets.",
                },
                {
                  icon: MessageSquare,
                  title: "AI draft responses",
                  label: "Informed by your knowledge base",
                  body: "Claude drafts a professional reply for every ticket, drawing directly from your knowledge base entries. Your team edits and sends — or sends as-is.",
                },
                {
                  icon: BarChart3,
                  title: "Daily summaries",
                  label: "Generated on demand or on schedule",
                  body: "A full summary of your queue — volume, trends, escalations, and long-running tickets — lands in your dashboard whenever you need it.",
                },
              ].map(({ icon: Icon, title, label, body }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 border-l-2 border-zinc-200 pl-6 py-1 sm:flex-row sm:gap-10"
                >
                  <div className="flex shrink-0 items-start gap-3 sm:w-52">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-base font-semibold leading-tight text-zinc-900 pt-1">
                      {title}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
                    <span className="text-xs text-zinc-400">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-zinc-50 px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-16 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              From ticket to resolved, in minutes
            </h2>

            <div className="relative">
              {/* Connecting line */}
              <div
                className="pointer-events-none absolute hidden h-px bg-zinc-200 sm:block"
                style={{ top: 32, left: "14%", right: "14%" }}
              />

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                {[
                  {
                    n: "1",
                    title: "Customer submits",
                    body: "Via your unique link or API — no account needed for the customer.",
                  },
                  {
                    n: "2",
                    title: "Claude triages",
                    body: "Classification, sentiment analysis, priority scoring, and a full draft response.",
                  },
                  {
                    n: "3",
                    title: "Team reviews and sends",
                    body: "Edit the draft in one click, mark resolved, or escalate — all from the dashboard.",
                  },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex flex-col gap-5">
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-200 bg-zinc-50 text-3xl font-bold text-zinc-300">
                      {n}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
                      <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Submission methods ──────────────────────────────────────────── */}
        <section className="bg-zinc-900 px-6 py-24 text-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-3xl font-semibold tracking-tight sm:text-4xl">
              Multiple ways to submit tickets
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  title: "Web form",
                  badge: "No auth",
                  badgeCls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  desc: "Share your unique link with customers. Zero friction, no account required.",
                  code: "/submit/[orgCode]",
                },
                {
                  title: "REST API",
                  badge: "API key",
                  badgeCls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  desc: "Integrate with your existing tools, webhooks, or backend systems.",
                  code: "POST /api/v1/tickets",
                },
                {
                  title: "MCP tools",
                  badge: "MCP",
                  badgeCls: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                  desc: "Expose ticket submission to AI agents via the Model Context Protocol.",
                  code: "submit_ticket",
                },
              ].map(({ title, badge, badgeCls, desc, code }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${badgeCls}`}
                    >
                      {badge}
                    </span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-zinc-400">{desc}</p>
                  <code className="block rounded bg-white/10 px-3 py-2 font-mono text-xs text-zinc-300">
                    {code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="bg-zinc-950 px-6 py-28 text-center text-white">
          <div className="mx-auto max-w-2xl flex flex-col items-center gap-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to automate your
              <br />
              support operations?
            </h2>
            <LoginLink>
              <Button
                size="lg"
                className="h-12 gap-2 bg-white px-8 text-zinc-950 hover:bg-zinc-100 font-semibold"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </LoginLink>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-500">
              <span>✓ Free to start</span>
              <span>✓ No credit card</span>
              <span>✓ Multi-tenant by default</span>
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} SupportMesh &middot; Built with{" "}
          <Link href="https://mastra.ai" className="transition-colors hover:text-zinc-300">
            Mastra
          </Link>
          {", "}
          <Link href="https://kinde.com" className="transition-colors hover:text-zinc-300">
            Kinde
          </Link>
          {", and "}
          <Link href="https://convex.dev" className="transition-colors hover:text-zinc-300">
            Convex
          </Link>
        </footer>
      </div>
    </>
  );
}
