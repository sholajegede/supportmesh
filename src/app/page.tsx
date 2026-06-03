import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, MessageSquare, Zap } from "lucide-react";

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
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <Zap className="text-zinc-950" style={{ height: 18, width: 18 }} />
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
            {/* Technology pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { name: "Mastra",    dot: "bg-orange-400" },
                { name: "Kinde",     dot: "bg-purple-400" },
                { name: "Convex",    dot: "bg-yellow-400" },
                { name: "Claude AI", dot: "bg-red-400" },
              ].map(({ name, dot }) => (
                <div
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 backdrop-blur-sm"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                  <span className="text-xs font-medium text-white/75 tracking-wide">
                    {name}
                  </span>
                </div>
              ))}
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
              escalations, and fires Slack alerts. Built for teams where support
              tickets come from AI agents and CI pipelines, not just people.
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
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-36 rounded bg-white/20" />
                    <div className="h-7 w-28 rounded bg-white/10" />
                  </div>
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

            {/* Gradient bleed */}
            <div className="pointer-events-none h-20 bg-gradient-to-b from-zinc-950 to-white" />
          </div>
        </section>

        {/* ── Powered-by bar ───────────────────────────────────────────────── */}
        <section className="border-y border-zinc-800 bg-zinc-900 py-5">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-500 shrink-0">
                Built on open infrastructure
              </p>
              <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
                {[
                  { name: "Mastra",  role: "Agent orchestration" },
                  { name: "Kinde",   role: "Auth and multi-tenancy" },
                  { name: "Convex",  role: "Real-time database" },
                ].map(({ name, role }) => (
                  <div key={name} className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-medium text-zinc-300">{name}</span>
                    <span className="text-xs text-zinc-600">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-5xl">
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
                  body: "Every ticket is classified by category, priority, and sentiment within seconds of arrival. Works whether the ticket came from a customer, a webhook, or an AI agent.",
                },
                {
                  icon: MessageSquare,
                  title: "AI draft responses",
                  label: "Informed by your knowledge base",
                  body: "Claude drafts a professional reply for every ticket, informed by your organisation's knowledge base. Edit and send, or send as-is.",
                },
                {
                  icon: Bell,
                  title: "Slack notifications",
                  label: "Per-org webhook configuration",
                  body: "When a ticket lands, your team gets notified in Slack with the subject, priority, and a direct link. No dashboard staring required.",
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
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-16 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              From ticket to resolved, in minutes
            </h2>

            <div className="relative">
              <div
                className="pointer-events-none absolute hidden h-px bg-zinc-200 sm:block"
                style={{ top: 32, left: "14%", right: "14%" }}
              />
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                {[
                  {
                    n: "1",
                    title: "Submitted from anywhere",
                    body: "Via your unique customer link, the REST API, or an AI agent calling the submit_ticket MCP tool. No account required for the submitter.",
                  },
                  {
                    n: "2",
                    title: "Claude triages",
                    body: "Classification, sentiment analysis, priority scoring, and a full draft response — all within seconds.",
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

        {/* ── Agent-native channels ────────────────────────────────────────── */}
        <section className="bg-zinc-950 px-6 py-24 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for teams where humans are not<br className="hidden sm:block" /> the only senders
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                AI agents, CI pipelines, and monitoring systems can all submit
                tickets. SupportMesh is the support layer for the agentic web.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  title: "Web form",
                  badge: "No auth",
                  badgeCls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  desc: "/submit/[orgCode] — share with customers. White-label with your organisation's name.",
                  code: "/submit/org_yourcode",
                },
                {
                  title: "REST API",
                  badge: "API key",
                  badgeCls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  desc: "POST /api/v1/tickets from any system, webhook, or backend service. The org is derived from your key.",
                  code: "POST /api/v1/tickets",
                },
                {
                  title: "MCP tools",
                  badge: "MCP",
                  badgeCls: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                  desc: "AI agents call submit_ticket via the Model Context Protocol. Claude Code, Claude Desktop, other Mastra agents.",
                  code: "tool: submit_ticket",
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

            {/* Terminal code block */}
            <div className="mt-8 rounded-xl border border-zinc-700 bg-zinc-900 p-5 font-mono text-sm">
              <p className="text-zinc-600 mb-3">{"// Claude Code submitting a ticket via MCP"}</p>
              <p className="text-zinc-300 mb-1">
                {">"}{" "}
                <span className="text-zinc-300">
                  &quot;Submit a support ticket: build failing on main,
                </span>
              </p>
              <p className="text-zinc-300 mb-4 pl-4">
                3 auth tests broken since the last deploy&quot;
              </p>
              <p className="text-zinc-500 mb-1">Calling submit_ticket...</p>
              <p className="text-emerald-400 mb-0.5">
                Ticket triaged: Priority HIGH · Sentiment FRUSTRATED
              </p>
              <p className="text-emerald-400">Slack notification sent to #support</p>
            </div>
          </div>
        </section>

        {/* ── Tech stack ──────────────────────────────────────────────────── */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Open infrastructure
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Three purpose-built tools doing one job each
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  initial: "M",
                  iconBg: "bg-orange-500",
                  name: "Mastra",
                  role: "Agent orchestration",
                  desc: "The triage agent, summary agent, and MCP server are all built on Mastra. It manages the tool loop, handles retries, and keeps the agent context clean.",
                  href: "https://mastra.ai",
                  linkLabel: "mastra.ai",
                },
                {
                  initial: "K",
                  iconBg: "bg-purple-500",
                  name: "Kinde",
                  role: "Auth and multi-tenancy",
                  desc: "Every organisation is isolated via a JWT org_code claim. No organisation ever sees another's data. Authentication, user management, and tenant isolation in one SDK.",
                  href: "https://kinde.com",
                  linkLabel: "kinde.com",
                },
                {
                  initial: "C",
                  iconBg: "bg-yellow-500",
                  name: "Convex",
                  role: "Real-time database",
                  desc: "Tickets appear in your dashboard the moment the agent processes them. Convex's reactive queries mean no polling, no refresh, and server-side identity verification on every query.",
                  href: "https://convex.dev",
                  linkLabel: "convex.dev",
                },
              ].map(({ initial, iconBg, name, role, desc, href, linkLabel }) => (
                <div
                  key={name}
                  className="flex flex-col gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white ${iconBg}`}
                    >
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{name}</p>
                      <p className="text-xs text-zinc-500">{role}</p>
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-zinc-500">{desc}</p>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
                  >
                    {linkLabel}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────────────────────────── */}
        <section className="bg-zinc-50 px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Pricing
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-3 text-base text-zinc-500">Start free. Scale when you need to.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Free */}
              <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Free</p>
                  <p className="mt-1 text-3xl font-bold text-zinc-900">
                    $0<span className="text-base font-normal text-zinc-500">/mo</span>
                  </p>
                </div>
                <ul className="flex flex-col gap-2.5 text-sm text-zinc-600">
                  {[
                    "1 organisation",
                    "100 tickets per month",
                    "AI triage and draft responses",
                    "Customer submission URL",
                    "REST API and MCP access",
                    "1 team member",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-zinc-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <LoginLink>
                  <Button variant="outline" className="w-full">
                    Get started
                  </Button>
                </LoginLink>
              </div>

              {/* Pro */}
              <div className="flex flex-col gap-6 rounded-xl border-2 border-zinc-900 bg-white p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-semibold text-white">
                    Most popular
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Pro</p>
                  <p className="mt-1 text-3xl font-bold text-zinc-900">
                    $49<span className="text-base font-normal text-zinc-500">/mo</span>
                  </p>
                </div>
                <ul className="flex flex-col gap-2.5 text-sm text-zinc-600">
                  {[
                    "Unlimited tickets",
                    "Slack notifications",
                    "Team inbox with assignments",
                    "Customer profiles",
                    "Knowledge base (unlimited entries)",
                    "10 team members",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-zinc-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <LoginLink>
                  <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
                    Start free trial
                  </Button>
                </LoginLink>
              </div>

              {/* Enterprise */}
              <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Enterprise</p>
                  <p className="mt-1 text-3xl font-bold text-zinc-900">
                    Custom
                  </p>
                </div>
                <ul className="flex flex-col gap-2.5 text-sm text-zinc-600">
                  {[
                    "Everything in Pro",
                    "White-label submission page",
                    "Custom domain",
                    "SSO and SAML",
                    "SLA tracking and alerts",
                    "Dedicated Slack channel",
                    "Unlimited team members",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-zinc-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:hello@supportmesh.app">Contact us</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="bg-zinc-950 px-6 py-28 text-center text-white">
          <div className="mx-auto max-w-5xl flex flex-col items-center gap-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The support layer your agentic
              <br />
              stack was missing
            </h2>
            <p className="text-base text-zinc-400">Free to start. No credit card required.</p>
            <LoginLink>
              <Button
                size="lg"
                className="h-12 gap-2 bg-white px-8 text-zinc-950 hover:bg-zinc-100 font-semibold"
              >
                Get started free
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
