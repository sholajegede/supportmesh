import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, MessageSquare, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
              <Zap className="h-4 w-4 text-zinc-950" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              SupportMesh
            </span>
          </div>
          <LoginLink>
            <Button size="sm" variant="secondary" className="h-8 text-xs px-4">
              Sign in
            </Button>
          </LoginLink>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 py-32 text-center text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[700px] rounded-full bg-white/[0.03] blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-6 max-w-3xl">
          <Badge
            variant="secondary"
            className="bg-white/10 text-white/80 border-white/10 hover:bg-white/10 text-xs px-3 py-1"
          >
            Powered by Claude AI and Mastra
          </Badge>

          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Support operations,
            <br />
            handled by AI
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-zinc-400">
            SupportMesh triages every ticket, drafts a response, flags
            escalations, and generates daily summaries — automatically. Your
            team reviews and sends.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <LoginLink>
              <Button size="lg" className="gap-2 bg-white text-zinc-950 hover:bg-zinc-100 h-11 px-6">
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
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant triage",
                body: "Every ticket is classified by category, priority, and sentiment the moment it arrives. No manual sorting.",
              },
              {
                icon: MessageSquare,
                title: "AI draft responses",
                body: "Claude drafts a professional reply for every ticket, informed by your knowledge base. Your team edits and sends.",
              },
              {
                icon: BarChart3,
                title: "Daily summaries",
                body: "A summary of your queue lands in your dashboard every morning — volume, trends, escalations, and long-running tickets.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            From ticket to resolved, in minutes
          </h2>
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
              <div key={n} className="flex flex-col gap-4">
                <span className="text-4xl font-bold text-zinc-200">{n}</span>
                <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Submission methods ──────────────────────────────────────────── */}
      <section className="bg-zinc-900 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-semibold tracking-tight sm:text-4xl">
            Multiple ways to submit tickets
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "Web form",
                desc: "Share your unique link with customers. Zero friction, no account required.",
                code: "/submit/[orgCode]",
              },
              {
                title: "REST API",
                desc: "Integrate with your existing tools, webhooks, or backend systems.",
                code: "POST /api/v1/tickets",
              },
              {
                title: "MCP tools",
                desc: "Expose submission to AI agents via the Model Context Protocol.",
                code: "submit_ticket",
              },
            ].map(({ title, desc, code }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-400">{desc}</p>
                <code className="rounded bg-white/10 px-2 py-1 text-xs text-zinc-300">
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
              className="h-12 gap-2 bg-white px-8 text-zinc-950 hover:bg-zinc-100"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </LoginLink>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-500">
        SupportMesh &middot; Built with{" "}
        <Link href="https://mastra.ai" className="hover:text-zinc-300 transition-colors">Mastra</Link>
        {", "}
        <Link href="https://kinde.com" className="hover:text-zinc-300 transition-colors">Kinde</Link>
        {", and "}
        <Link href="https://convex.dev" className="hover:text-zinc-300 transition-colors">Convex</Link>
      </footer>
    </div>
  );
}
