import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { Check, Minus, Zap } from "lucide-react";

type PricingFeature = { text: string; included: boolean };

const plans: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  cta: React.ReactNode;
  highlight: boolean;
}[] = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Everything you need to get started.",
    highlight: false,
    features: [
      { text: "1 organisation", included: true },
      { text: "100 tickets per month", included: true },
      { text: "AI triage and draft responses", included: true },
      { text: "Customer submission URL", included: true },
      { text: "REST API and MCP access", included: true },
      { text: "1 team member", included: true },
      { text: "Slack notifications", included: false },
      { text: "Team inbox with assignments", included: false },
      { text: "Customer profiles", included: false },
      { text: "Knowledge base (unlimited entries)", included: false },
      { text: "Priority support", included: false },
    ],
    cta: (
      <LoginLink>
        <Button variant="outline" className="w-full">
          Get started
        </Button>
      </LoginLink>
    ),
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For growing teams that need more.",
    highlight: true,
    features: [
      { text: "Unlimited tickets", included: true },
      { text: "Slack notifications", included: true },
      { text: "Team inbox with assignments", included: true },
      { text: "Customer profiles", included: true },
      { text: "Knowledge base (unlimited entries)", included: true },
      { text: "10 team members", included: true },
      { text: "Priority support", included: true },
      { text: "White-label submission page", included: false },
      { text: "Custom domain", included: false },
      { text: "SSO and SAML", included: false },
      { text: "SLA tracking and alerts", included: false },
    ],
    cta: (
      <LoginLink>
        <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
          Start free trial
        </Button>
      </LoginLink>
    ),
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for large organisations.",
    highlight: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "White-label submission page", included: true },
      { text: "Custom domain", included: true },
      { text: "SSO and SAML", included: true },
      { text: "SLA tracking and alerts", included: true },
      { text: "Dedicated Slack channel", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Custom integrations", included: true },
    ],
    cta: (
      <Button variant="outline" className="w-full" asChild>
        <a href="mailto:hello@supportmesh.app">Contact us</a>
      </Button>
    ),
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
              <Zap style={{ height: 18, width: 18 }} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
              SupportMesh
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Home
            </Link>
            <LoginLink>
              <Button size="sm" className="h-8 px-4 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
                Sign in
              </Button>
            </LoginLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Pricing
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            Start free. Scale when you need to.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col gap-6 rounded-xl p-6 ${
                  plan.highlight
                    ? "border-2 border-zinc-900 bg-white"
                    : "border border-zinc-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-semibold text-white">
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-zinc-900">{plan.name}</p>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-zinc-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-base font-normal text-zinc-500">{plan.period}</span>
                    )}
                  </p>
                  <p className="mt-1.5 text-sm text-zinc-500">{plan.description}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                      ) : (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-zinc-200" />
                      )}
                      <span className={f.included ? "text-zinc-700" : "text-zinc-300"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div>{plan.cta}</div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-zinc-400">
            All plans include AI triage powered by Claude Haiku, multi-tenant
            isolation, and the MCP server.{" "}
            <a
              href="mailto:hello@supportmesh.app"
              className="underline hover:text-zinc-700 transition-colors"
            >
              Questions? Email us.
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-white px-6 py-6 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} SupportMesh &middot;{" "}
        <Link href="/" className="hover:text-zinc-700 transition-colors">
          Home
        </Link>
      </footer>
    </div>
  );
}
