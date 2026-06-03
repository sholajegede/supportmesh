# SupportMesh

AI-powered support operations platform with multi-tenant isolation.

## What it is

SupportMesh automates the repetitive work of a support queue. When a ticket arrives — via web form, REST API, or MCP tool call — a Mastra triage agent running Claude Haiku classifies it by category and priority, scores the customer's sentiment, searches your organisation's knowledge base, drafts a response under 150 words, and checks whether the ticket needs escalating. The result lands in your dashboard in seconds, ready for a human to review, edit, and send.

The platform is built for teams that run multiple products or customer segments under one account. Every piece of data — tickets, knowledge base entries, daily summaries, and users — is scoped to a Kinde organisation code (`org_code`). Agents receive that code in the request, pass it through every tool call, and Convex enforces it at the query level, so no organisation can ever read another's data.

What makes SupportMesh technically interesting is the combination of pieces: Mastra orchestrates the agent tool loops, Convex provides real-time reactive data with built-in identity verification, Kinde handles auth and multi-tenancy via JWT claims, and the MCP server at `/api/mcp` exposes ticket operations to external AI agents — so SupportMesh itself can be a tool inside a larger agentic workflow.

## Tech stack

| Technology | Role |
|---|---|
| [Next.js 16](https://nextjs.org) | Full-stack React framework — app router, server components, API routes |
| [Mastra](https://mastra.ai) | Agent orchestration framework — manages tool loops and agent instructions |
| [Claude Haiku (`claude-haiku-4-5`)](https://anthropic.com) | LLM powering both the triage and summary agents via the Anthropic API |
| [Kinde](https://kinde.com) | Authentication, organisation management, and JWT-based multi-tenancy |
| [Convex](https://convex.dev) | Real-time database with server functions and identity verification |
| [Resend](https://resend.com) | Transactional email — sends drafted responses to customers |
| [shadcn/ui](https://ui.shadcn.com) | Component library built on Radix UI and Tailwind CSS |
| TypeScript | End-to-end type safety across Next.js and Convex |

## Features

- **AI triage** — every ticket is automatically classified (billing, technical, account, feature_request, general), assigned a priority (low / medium / high / critical), given a sentiment score (positive / neutral / negative / frustrated), and given a draft response informed by the org's knowledge base
- **Escalation detection** — the triage agent runs a dedicated escalation check and flags tickets that need immediate attention, recording the reason
- **Multi-tenant data isolation** — all data is scoped to a Kinde `org_code`; Convex identity verification enforces org boundaries on every query and mutation
- **Customer ticket submission** at `/submit/[orgCode]` — a public form customers can use without an account
- **REST API** at `POST /api/v1/tickets` — submit tickets from external systems or webhooks
- **MCP server** at `/api/mcp` — exposes `submit_ticket`, `get_org_tickets`, and `get_ticket` tools for AI agent consumption via the Model Context Protocol
- **Daily summary agent** — on demand, fetches all org tickets, counts by status, identifies the top categories, determines overall sentiment, and surfaces long-running (open / in-progress) tickets
- **Knowledge base CRUD** — per-org entries that the triage agent searches when drafting responses; managed from the dashboard
- **Resend email integration** — send AI-drafted responses directly to the customer's email from the ticket detail view
- **M2M / system-actor support** — background workflows can authenticate via API key (`SUPPORTMESH_API_KEY`) without a user session

## Architecture

Multi-tenancy flows through the entire stack in a single consistent pattern. When a user authenticates via Kinde, their JWT contains an `org_code` claim. In browser-side components, `useKindeBrowserClient().getClaim("org_code")` extracts it; in server-side contexts, `getKindeServerSession()` does the same. That `org_code` is passed as an explicit argument to every Mastra agent invocation, carried through every tool call (knowledge search, escalation check, result save), and used as the filter in every Convex query — `getTicketsByOrg`, `getKnowledgeByOrg`, and so on. Convex's server-side identity verification adds a second layer of enforcement, ensuring the value in a tool call matches the authenticated session before any data is read or written.

## Getting started

### Prerequisites

- Node.js 22+
- A [Kinde](https://kinde.com) account and application
- A [Convex](https://convex.dev) account
- An [Anthropic](https://console.anthropic.com) API key
- A [Resend](https://resend.com) account _(optional — required only for sending email responses)_

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/sholajegede/supportmesh.git
   cd supportmesh
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Copy and fill in environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Open `.env.local` and fill in all values (see [Environment variables](#environment-variables) below).

4. **Start the Convex development server**

   ```bash
   npx convex dev
   ```

   This opens a browser to create or link a Convex project and writes `NEXT_PUBLIC_CONVEX_URL` into your `.env.local` automatically.

5. **Configure the Kinde webhook**

   In your Kinde dashboard, add a webhook pointing to your Convex HTTP endpoint:

   ```
   https://<your-deployment>.convex.site/kinde
   ```

   This keeps user records in sync between Kinde and Convex.

6. **Start the Next.js dev server**

   ```bash
   npm run dev
   ```

   The app will be running at [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `KINDE_CLIENT_ID` | ✅ | Kinde OAuth app client ID — found in your Kinde dashboard under Applications |
| `KINDE_CLIENT_SECRET` | ✅ | Kinde OAuth app client secret |
| `KINDE_ISSUER_URL` | ✅ | Your Kinde tenant domain (e.g. `https://myapp.kinde.com`) |
| `KINDE_SITE_URL` | ✅ | URL of this Next.js app — use `http://localhost:3000` for local dev |
| `KINDE_POST_LOGOUT_REDIRECT_URL` | ✅ | Where Kinde redirects after logout |
| `KINDE_POST_LOGIN_REDIRECT_URL` | ✅ | Where Kinde redirects after a successful login |
| `KINDE_DOMAIN` | ✅ | Same value as `KINDE_ISSUER_URL` — used by the Kinde management API client |
| `KINDE_AUDIENCE` | ✅ | Kinde API audience — found in your Kinde dashboard under APIs |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key for the Mastra AI agents |
| `NEXT_PUBLIC_CONVEX_URL` | ✅ | Convex deployment URL — written automatically by `npx convex dev` |
| `RESEND_API_KEY` | ⬜ | Resend API key for sending email responses to customers |
| `SUPPORTMESH_API_KEY` | ⬜ | Optional key for the public REST API and MCP server. When set, all requests must include `Authorization: Bearer <key>` or `?apiKey=<key>`. Leave empty for demo mode (no key required). |

## Submitting tickets

There are three ways to get a ticket into SupportMesh. All three trigger the same triage agent pipeline.

**Web form** — share the URL with customers:

```
https://your-app.com/submit/[orgCode]
```

No account is required for the customer.

**REST API** — from any backend system or webhook:

```http
POST /api/v1/tickets
Content-Type: application/json
Authorization: Bearer <SUPPORTMESH_API_KEY>

{
  "subject": "Cannot log in to my account",
  "body": "I've been locked out since yesterday...",
  "customerEmail": "customer@example.com",
  "orgCode": "your_org_code"
}
```

**MCP server** — for AI agents and agent workflows:

```
POST /api/mcp
```

The MCP server exposes three tools:

| Tool | Description |
|---|---|
| `submit_ticket` | Create and triage a new ticket |
| `get_org_tickets` | List all tickets for an organisation |
| `get_ticket` | Fetch a single ticket by ID |

## Deploying

The recommended deployment target is [Vercel](https://vercel.com). Push the repository to GitHub, import it in Vercel, and add all environment variables from `.env.example` in the Vercel project settings.

Convex is deployed separately:

```bash
npx convex deploy
```

This pushes your Convex schema and server functions to the production deployment. Update `NEXT_PUBLIC_CONVEX_URL` in Vercel to match the production Convex URL if it differs from your development deployment.

## License

MIT
