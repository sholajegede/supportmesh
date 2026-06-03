# SupportMesh

AI-powered support operations platform with multi-tenant isolation.

## What it is

SupportMesh is support infrastructure for teams where tickets come from AI agents and automated systems, not just people typing into forms. A Mastra triage agent running Claude Haiku processes every ticket the moment it arrives -- via web form, REST API, or MCP tool call -- classifying it by category and priority, scoring customer sentiment, searching the organisation's knowledge base, drafting a response, and checking whether the ticket needs escalating. The result is in the dashboard in seconds.

The platform is built for teams where CI pipelines, monitoring agents, and AI coding assistants are first-class ticket sources. Every submission channel is authenticated and org-scoped: the customer web form validates the org in the URL, the REST API derives the org from a per-org API key, and the MCP server binds the authenticated orgCode to every tool call so callers cannot access another organisation's data.

The platform is built for teams that run multiple products or customer segments under one account. Every piece of data — tickets, knowledge base entries, daily summaries, and users — is scoped to a Kinde Organization code (`org_code`). Agents receive that code in the request, pass it through every tool call, and Convex enforces it at the query level, so no Organization can ever read another's data.

What makes SupportMesh technically interesting is the combination of pieces: Mastra orchestrates the agent tool loops, Convex provides real-time reactive data with built-in identity verification, Kinde handles auth and multi-tenancy via JWT claims, and the MCP server at `/api/mcp` exposes ticket operations to external AI agents — so SupportMesh itself can be a tool inside a larger agentic workflow.

## Tech stack

| Technology | Role |
|---|---|
| [Next.js 16](https://nextjs.org) | Full-stack React framework — app router, server components, API routes |
| [Mastra](https://mastra.ai) | Agent orchestration framework — manages tool loops and agent instructions |
| [Claude Haiku (`claude-haiku-4-5`)](https://anthropic.com) | LLM powering both the triage and summary agents via the Anthropic API |
| [Kinde](https://kinde.com) | Authentication, Organization management, and JWT-based multi-tenancy |
| [Convex](https://convex.dev) | Real-time database with server functions and identity verification |
| [Resend](https://resend.com) | Transactional email — sends drafted responses to customers |
| [shadcn/ui](https://ui.shadcn.com) | Component library built on Radix UI and Tailwind CSS |
| TypeScript | End-to-end type safety across Next.js and Convex |

## Features

- **AI triage** — every ticket is automatically classified (billing, technical, account, feature_request, general), assigned a priority (low / medium / high / critical), given a sentiment score (positive / neutral / negative / frustrated), and given a draft response informed by the org's knowledge base
- **Escalation detection** — the triage agent runs a dedicated escalation check and flags tickets that need immediate attention, recording the reason
- **Slack notifications** — when a ticket is triaged, a Block Kit message is posted to the org's configured Incoming Webhook with the subject, priority, sentiment, and a direct link to the ticket
- **Ticket assignment** — any ticket can be assigned to a team member by name from the ticket detail view; the assignee is shown in the ticket list and can be cleared with one click
- **Customer profiles** — `/dashboard/customers` lists every unique customer email with their ticket count and last activity; clicking through shows all tickets from that customer
- **Multi-tenant data isolation** — all data is scoped to a Kinde `org_code`; Convex identity verification enforces org boundaries on every query and mutation
- **Customer ticket submission** at `/submit/[orgCode]` — a public form customers can use without an account; supports white-label branding (brand name and color) configured per org
- **White-label branding** — orgs can set a brand name and primary color from Settings; the customer submission page uses both, replacing the SupportMesh logo and button color
- **REST API** at `POST /api/v1/tickets` — submit tickets from external systems or webhooks
- **MCP server** at `/api/mcp` — exposes `submit_ticket`, `get_org_tickets`, and `get_ticket` tools for AI agent consumption via the Model Context Protocol
- **Daily summary agent** — on demand, fetches all org tickets, counts by status, identifies the top categories, determines overall sentiment, and surfaces long-running (open / in-progress) tickets
- **Knowledge base CRUD** — per-org entries that the triage agent searches when drafting responses; managed from the dashboard
- **Knowledge base seeding** — a seed mutation ships with the repo; run `npx convex run seed:seedKnowledgeBase '{"orgCode":"your_code"}'` to populate 30 categorised production-quality entries covering triage, API usage, Slack setup, MCP configuration, billing, troubleshooting, and branding
- **Knowledge base categories** — entries are tagged by category (getting-started, triage, workflow, api, mcp, notifications, security, branding, troubleshooting); the knowledge base page shows a category filter row
- **Resend email integration** — send AI-drafted responses directly to the customer's email from the ticket detail view
- **Per-org API keys** — each Organization generates their own API keys from the dashboard; keys are cryptographically bound to the org server-side, so callers cannot access another org's data even with a valid key
- **Developer page** — `/dashboard/developer` provides full API documentation including curl examples, MCP connection config for Claude Desktop and Claude Code, available tool schemas, and the customer submission URL for the authenticated org

## Architecture

Multi-tenancy flows through the entire stack in a single consistent pattern. When a user authenticates via Kinde, their JWT contains an `org_code` claim. In browser-side components, `useKindeBrowserClient().getClaim("org_code")` extracts it; in server-side contexts, `getKindeServerSession()` does the same. That `org_code` is passed as an explicit argument to every Mastra agent invocation, carried through every tool call (knowledge search, escalation check, result save), and used as the filter in every Convex query — `getTicketsByOrg`, `getKnowledgeByOrg`, and so on. Convex's server-side identity verification adds a second layer of enforcement, ensuring the value in a tool call matches the authenticated session before any data is read or written.

## Kinde auth provider for Mastra

SupportMesh includes a community-built Kinde auth provider for Mastra
that validates Kinde JWTs at the agent middleware layer. The provider
is implemented in `src/lib/mastra/auth.ts` and exposes three things:

- `MastraAuthKinde` — a `MastraAuthProvider` subclass that verifies
  tokens against Kinde's JWKS endpoint (`/.well-known/jwks`), handles
  both user tokens and M2M tokens (client credentials), and supports
  `allowedOrgCodes` to restrict agent access to specific organisations
- `KindeClaims` — the typed JWT payload shape including `sub`,
  `org_code`, and `gty`
- `validateKindeToken(token)` — a utility that validates a Bearer token
  and returns the bound `{ orgCode, sub }` or null on failure

The Mastra instance in `src/lib/mastra/index.ts` registers
`MastraAuthKinde` as the server-level auth provider:

```typescript
export const mastra = new Mastra({
  agents: { triageAgent, summaryAgent },
  server: process.env.KINDE_DOMAIN
    ? {
        auth: new MastraAuthKinde({
          domain: process.env.KINDE_DOMAIN,
        }),
      }
    : undefined,
});
```

The summary agent route uses `validateKindeToken` directly to enforce
that `orgCode` is always derived from the verified JWT — never from the
request body:

```typescript
const identity = await validateKindeToken(token);
if (!identity) {
  return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
}
const { orgCode } = identity; // from the JWT, not the client
```

The standalone community package that this implementation is based on
is at [github.com/sholajegede/mastra-auth-kinde](https://github.com/sholajegede/mastra-auth-kinde).
It follows the same `MastraAuthProvider` convention as the official
Auth0 and Clerk providers. If you are running Mastra as a standalone
server rather than embedded in Next.js, install it directly:

```bash
npm install github:sholajegede/mastra-auth-kinde
```

## API Keys

SupportMesh uses per-org API keys for programmatic access via the REST API and MCP server. Each key is generated by an authenticated org admin and stored in Convex bound to that org's code. When a request arrives at `/api/v1/tickets` or `/api/mcp`, the server looks up the key, extracts the bound `orgCode`, and uses that for all data operations — the caller cannot override it.

To generate a key: log into the dashboard, go to **Developer**, click **Generate API Key**, add an optional label, and copy the key from the dialog. It is shown only once. Keys can be revoked at any time from the same page.

## Slack notifications

Each Organization can configure a Slack Incoming Webhook to receive a notification every time a ticket is triaged. The notification includes the ticket subject, priority, sentiment, the customer's email address, and a button that links directly to the ticket in the dashboard.

To configure: go to **Settings**, paste your Incoming Webhook URL into the **Slack webhook URL** field, and click **Save**. Get the URL from your Slack app's Incoming Webhooks page at `api.slack.com/apps`.

## Customer profiles

The **Customers** section of the dashboard lists every unique customer email that has submitted a ticket to your Organization, along with the total number of tickets and the date of their most recent submission. Clicking a customer opens a filtered view of all their tickets.

## White-label branding

The customer submission page at `/submit/[orgCode]` can be customised per Organization. From **Settings → Submission page branding**, set a **Brand name** (shown as the page header instead of "SupportMesh") and a **Brand color** (applied to the logo background and the submit button). Customers see your brand, not SupportMesh's.

## Knowledge base

The knowledge base is the primary way to improve AI draft response quality. Every knowledge base entry you add is searched each time a ticket arrives. Entries that match the ticket subject inform the draft response.

Entries are organised by category: getting-started, triage, workflow, api, mcp, notifications, security, branding, and troubleshooting. The knowledge base page in the dashboard shows a category filter so you can browse entries by topic.

To seed 30 production-quality sample entries covering all categories:

```bash
npx convex run seed:seedKnowledgeBase '{"orgCode":"your_org_code"}'
```

The seed is idempotent. Running it on an org that already has more than 5 entries will skip without inserting anything.

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

   This opens a browser to create or link a Convex project and writes `NEXT_PUBLIC_CONVEX_URL` into your `.env.local` automatically. Once the deployment is created, also set `NEXT_PUBLIC_CONVEX_SITE_URL` to your Convex HTTP actions base URL — it has the same deployment name but uses the `.convex.site` domain:

   ```
   NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-deployment>.convex.site
   ```

5. **Configure the Kinde webhook**

   In your Kinde dashboard, add a webhook pointing to:

   ```
   https://<your-deployment>.convex.site/kinde
   ```

   This is `NEXT_PUBLIC_CONVEX_SITE_URL` + `/kinde`. It keeps user records in sync between Kinde and Convex.

6. **Start the Next.js dev server**

   ```bash
   npm run dev
   ```

   The app will be running at [http://localhost:3000](http://localhost:3000).

7. **Seed the knowledge base (optional)**

   Populate your org's knowledge base with 30 sample entries covering common support topics:

   ```bash
   npx convex run seed:seedKnowledgeBase '{"orgCode":"your_org_code"}'
   ```

   Replace `your_org_code` with your actual org code from Settings. The seed will skip if the org already has more than 5 entries.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `KINDE_CLIENT_ID` | ✅ | Kinde OAuth app client ID — found in your Kinde dashboard under Applications |
| `KINDE_CLIENT_SECRET` | ✅ | Kinde OAuth app client secret |
| `KINDE_ISSUER_URL` | ✅ | Your Kinde tenant domain (e.g. `https://myapp.kinde.com`) — used to construct the JWKS URL for verifying Kinde webhook JWTs |
| `KINDE_DOMAIN` | ✅ | Same value as `KINDE_ISSUER_URL` — used by the Mastra auth integration |
| `KINDE_SITE_URL` | ✅ | URL of this Next.js app — used by the Kinde SDK for OAuth callbacks (use `http://localhost:3000` for local dev) |
| `KINDE_POST_LOGOUT_REDIRECT_URL` | ✅ | Where Kinde redirects after logout |
| `KINDE_POST_LOGIN_REDIRECT_URL` | ✅ | Where Kinde redirects after a successful login |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key — used by the `@ai-sdk/anthropic` provider powering the triage and summary agents |
| `NEXT_PUBLIC_CONVEX_URL` | ✅ | Convex deployment URL — written automatically by `npx convex dev` |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | ✅ | Convex HTTP actions base URL (e.g. `https://your-deployment.convex.site`) — the Kinde webhook endpoint is at `${NEXT_PUBLIC_CONVEX_SITE_URL}/kinde` |
| `CONVEX_DEPLOYMENT` | — | Set automatically by `npx convex deploy` and `npx convex dev`; do not fill in manually |
| `RESEND_API_KEY` | ⬜ | Resend API key for sending email responses to customers |

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
Authorization: Bearer <YOUR_ORG_API_KEY>

{
  "subject": "Cannot log in to my account",
  "body": "I've been locked out since yesterday...",
  "customerEmail": "customer@example.com"
}
```

Generate your API key from Dashboard → Developer → API Keys. The key is bound to your Organization — no `orgCode` needed in the request body.

**REST API** — retrieve all tickets for your org:

```http
GET /api/v1/tickets
Authorization: Bearer <YOUR_ORG_API_KEY>
```

Returns:

```json
{
  "tickets": [
    {
      "_id": "...",
      "subject": "Cannot log in to my account",
      "body": "I've been locked out since yesterday...",
      "customerEmail": "customer@example.com",
      "category": "account",
      "priority": "high",
      "sentiment": "frustrated",
      "status": "open",
      "draftResponse": "...",
      "escalationReason": null,
      "_creationTime": 1234567890000
    }
  ]
}
```

Tickets are returned in descending order by creation time. The org is derived from your API key — no `orgCode` needed in the request.

**MCP server** — for AI agents and agent workflows:

```
POST /api/mcp
```

The MCP server exposes three tools:

| Tool | Description |
|---|---|
| `submit_ticket` | Create and triage a new ticket |
| `get_org_tickets` | List all tickets for an Organization |
| `get_ticket` | Fetch a single ticket by ID |

**Authentication:** include your API key as `Authorization: Bearer sm_yourkey` on all POST requests to `/api/mcp`. Generate keys from Dashboard → Developer → API Keys.

## Deploying

The recommended deployment target is [Vercel](https://vercel.com). Push the repository to GitHub, import it in Vercel, and add all environment variables from `.env.example` in the Vercel project settings.

Convex is deployed separately:

```bash
npx convex deploy
```

This pushes your Convex schema and server functions to the production deployment. Update `NEXT_PUBLIC_CONVEX_URL` in Vercel to match the production Convex URL if it differs from your development deployment.

## License

MIT
