import { mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

const ENTRIES = [
  {
    category: "getting-started",
    title: "Getting started with SupportMesh",
    content:
      "After signing in, your dashboard shows all tickets for your organisation. To start receiving tickets, share your customer submission URL found at /dashboard/developer under Customer Submission URL. You can also submit tickets via the REST API or MCP tools. The AI triage agent processes every ticket automatically within seconds of submission, classifying it by category, priority, and customer sentiment, then drafting a suggested response.",
  },
  {
    category: "getting-started",
    title: "How to share your customer submission link",
    content:
      "Each organisation has a unique public submission URL at /submit/[orgCode]. Customers can use this link to submit support tickets without creating an account. Find your submission URL on the Developer page in the dashboard. Share it directly with customers, embed it in your product's help menu, or link it from your documentation. The URL validates that it belongs to a real organisation before showing the submission form.",
  },
  {
    category: "getting-started",
    title: "Understanding your organisation code",
    content:
      "Your organisation code is a unique identifier that scopes all your data in SupportMesh. It appears in your customer submission URL, in API responses, and in Convex database records. You can find it in Settings under Organisation Settings. Every ticket, knowledge base entry, and summary belongs exclusively to your organisation. No other organisation can access your data, even if they know your org code, because the system also verifies authentication.",
  },
  {
    category: "triage",
    title: "How AI ticket triage works",
    content:
      "When a ticket arrives, the triage agent runs automatically. It searches your knowledge base for relevant entries, classifies the ticket into one of five categories (billing, technical, account, feature request, or general), assigns a priority level (low, medium, high, or critical), scores the customer sentiment (positive, neutral, negative, or frustrated), checks whether the ticket meets escalation criteria, and drafts a response using knowledge base matches. The full triage result is available in the ticket detail view within seconds.",
  },
  {
    category: "triage",
    title: "Ticket priority levels explained",
    content:
      "SupportMesh uses four priority levels. Low means the issue has a workaround and is not blocking the customer. Medium means the issue is affecting the customer's workflow but the product is still usable. High means the customer cannot complete a key task and is actively impacted. Critical means the customer is completely blocked or experiencing data loss. Priority is assigned by the AI based on the language and urgency in the ticket, not just keywords.",
  },
  {
    category: "triage",
    title: "Sentiment scores explained",
    content:
      "Every ticket receives a sentiment score: positive, neutral, negative, or frustrated. Positive means the customer is engaged and not distressed. Neutral means the customer is matter-of-fact and not showing strong emotion. Negative means the customer is dissatisfied or expressing disappointment. Frustrated means the customer is actively distressed, using urgent language, or has expressed that they have tried multiple times without success. Frustrated tickets are prioritised in the queue and are more likely to trigger escalation.",
  },
  {
    category: "triage",
    title: "Ticket categories explained",
    content:
      "Tickets are classified into five categories. Billing covers payment issues, subscription questions, invoices, and refund requests. Technical covers bugs, errors, crashes, performance problems, and integration failures. Account covers login issues, password resets, profile changes, and access problems. Feature request covers suggestions for new functionality or improvements to existing features. General covers everything else including questions, compliments, and unclear requests. Categories help route tickets to the right team member.",
  },
  {
    category: "triage",
    title: "Understanding ticket escalation",
    content:
      "A ticket is escalated when the triage agent determines that it requires immediate human attention based on severity, urgency, or context. Triggers include data loss mentions, complete product outages, multiple failed attempts over time, financial impact statements, and explicit requests for a manager or supervisor. Escalated tickets appear with a red badge in the ticket list and an escalation reason in the ticket detail. They are sorted to the top of the queue by default.",
  },
  {
    category: "workflow",
    title: "How to send a response to a customer",
    content:
      "Open the ticket from the dashboard and review the AI draft in the Draft Response section. Edit the draft if needed, then click Send Response. This sends the reply to the customer's email address using Resend. The ticket status updates to In Progress after sending. If you want to send without editing, the draft is ready to send as written. After the customer issue is resolved, click Mark Resolved to close the ticket.",
  },
  {
    category: "workflow",
    title: "Ticket status progression",
    content:
      "Tickets move through four statuses. Open means the ticket has been triaged and is waiting for a team member to respond. In Progress means a response has been sent and the issue is being worked on. Escalated means the ticket has been flagged for immediate attention. Resolved means the issue has been closed. You can update ticket status manually from the ticket detail view. The Tickets page shows filter tabs for each status so you can view your queue by stage.",
  },
  {
    category: "workflow",
    title: "How to assign a ticket to a team member",
    content:
      "Open the ticket detail view and find the Assigned To field in the Ticket Details panel on the right side. Enter the team member's name and click Save. The assignment is visible in the ticket list so the whole team knows who owns each ticket. Assigning tickets prevents duplicate work and makes it clear who is responsible for following up. Currently, assignment uses a display name. Full user directory integration is on the roadmap.",
  },
  {
    category: "knowledge-base",
    title: "How the AI uses knowledge base entries",
    content:
      "When a ticket arrives, the triage agent searches your knowledge base for entries whose title or content matches words from the ticket subject. The top three matching entries are used to inform the draft response. The more specific and detailed your knowledge base entries are, the better the draft responses will be. Entries that describe specific error messages, step-by-step solutions, and common workarounds give the AI the most useful material to work with.",
  },
  {
    category: "knowledge-base",
    title: "Best practices for writing knowledge base entries",
    content:
      "Write each entry to answer one specific question or describe one specific solution. Use the title to state the problem or topic clearly, as if a customer asked it as a question. In the content, be specific: include exact error messages if relevant, numbered steps for solutions, and any conditions that apply. Avoid vague language. Entries that say 'contact support for help' are not useful to the AI. Entries that say 'to fix this error, go to Settings > Integrations and click Reconnect' give the AI actionable material.",
  },
  {
    category: "knowledge-base",
    title: "How to improve AI draft response quality",
    content:
      "Draft quality improves directly with knowledge base coverage. If you receive a ticket and the AI draft does not match the issue well, add a knowledge base entry that addresses that specific topic. The next similar ticket will get a better draft. Review your resolved tickets weekly and identify common questions that are not yet in the knowledge base. Over time, a well-maintained knowledge base means the AI draft can be sent with minimal editing for the majority of tickets.",
  },
  {
    category: "summaries",
    title: "Running a daily summary",
    content:
      "Click Run Daily Summary on the dashboard to generate a summary of your current ticket queue. The summary agent analyses all your open, in-progress, escalated, and resolved tickets and produces a structured overview: total ticket counts by status, the most common ticket categories, the overall sentiment distribution, and a list of tickets that have been open or in progress for an extended period. Use the daily summary to start your support shift, brief your team, or identify patterns in customer issues.",
  },
  {
    category: "summaries",
    title: "What the daily summary includes",
    content:
      "The daily summary contains six sections: total ticket count broken down by status, top three ticket categories by volume, average sentiment across all recent tickets, a list of tickets flagged for long handling time, escalation count and reasons, and a short narrative overview generated by Claude. The summary is generated on demand and reflects the state of your queue at the moment you run it. It is not stored automatically but can be regenerated any time.",
  },
  {
    category: "notifications",
    title: "Setting up Slack notifications",
    content:
      "Go to Settings and find the Slack Webhook URL field under Organisation Settings. Paste your Slack Incoming Webhook URL and click Save. To create a webhook, go to your Slack workspace settings, open Apps, search for Incoming Webhooks, and create a new webhook for the channel you want tickets to appear in. Once configured, every triaged ticket will send a Slack message with the ticket subject, priority, customer sentiment, and a direct link to the ticket in SupportMesh.",
  },
  {
    category: "notifications",
    title: "Slack notification format",
    content:
      "Each Slack notification shows the ticket subject as the message title, followed by priority and sentiment on the same line, the customer email address, and a View ticket button that links directly to the ticket detail page in SupportMesh. Notifications fire immediately after the triage agent finishes processing, typically within a few seconds of the ticket being submitted. Notifications go to the specific Slack channel configured in your webhook URL.",
  },
  {
    category: "notifications",
    title: "Troubleshooting missing Slack notifications",
    content:
      "If Slack notifications are not arriving, first confirm your webhook URL is saved in Settings. Webhook URLs start with https://hooks.slack.com/services/ and contain three slash-separated tokens. If the URL looks correct, verify the webhook is still active in your Slack workspace settings by testing it with a direct POST. If the channel was deleted or the app was removed from Slack, the webhook will fail silently. You will need to create a new webhook and update the URL in SupportMesh Settings.",
  },
  {
    category: "api",
    title: "Getting started with the REST API",
    content:
      "The REST API is at /api/v1/tickets. It requires an API key for authentication. Generate a key from the Developer page in the dashboard. Include the key in all requests as a Bearer token: Authorization: Bearer sm_yourkey. The API supports POST to submit a ticket for triage and GET to retrieve all tickets for your organisation. Your org code is derived automatically from the API key, so you do not need to include it in the request body.",
  },
  {
    category: "api",
    title: "How to submit a ticket via the REST API",
    content:
      "Send a POST request to /api/v1/tickets with your API key in the Authorization header. The request body needs three fields: customerEmail (the submitter's email), subject (a brief description), and body (the full message). Do not include orgCode in the body. The server reads the org from your API key. The response returns the triage result as a message string. The ticket is immediately available in your dashboard and triggers a Slack notification if configured.",
  },
  {
    category: "api",
    title: "How to retrieve tickets via the REST API",
    content:
      "Send a GET request to /api/v1/tickets with your API key in the Authorization header. The response returns a JSON object with a tickets array. Each ticket includes the Convex document ID, subject, body, customer email, category, priority, sentiment, status, draft response, escalation reason if applicable, and creation timestamp. Tickets are returned in descending order by creation time. There is no pagination in the current version.",
  },
  {
    category: "api",
    title: "Managing API keys",
    content:
      "API keys are generated from the Developer page in your dashboard. Each key is displayed once at the time of creation and cannot be retrieved again. Keys begin with sm_ followed by a random string. If you lose a key, revoke it and generate a new one. Each key is bound to your organisation at the server level. A caller using your key cannot access another organisation's data, and you cannot use another organisation's key to access your data. Revoked keys stop working immediately.",
  },
  {
    category: "mcp",
    title: "Setting up the MCP server with Claude Code",
    content:
      "Add SupportMesh to Claude Code by editing your MCP configuration file. The server URL is https://supportmesh-agent.vercel.app/api/mcp. Include your API key as a Bearer token in the headers. Once connected, Claude Code can call three tools: submit_ticket to create and triage a new ticket, get_org_tickets to list all tickets for your organisation, and get_ticket to fetch a single ticket by its ID. Tools are authenticated via your API key, so your org is always correctly scoped.",
  },
  {
    category: "mcp",
    title: "MCP tools available in SupportMesh",
    content:
      "The SupportMesh MCP server exposes three tools. submit_ticket takes orgCode, customerEmail, subject, and body and returns the triage result. get_org_tickets takes orgCode and returns all tickets for the organisation. get_ticket takes ticketId and returns the full ticket document including the AI draft response. All tools require a valid API key in the Authorization header. The orgCode argument in tools is overridden by the org bound to your API key for security.",
  },
  {
    category: "mcp",
    title: "Using MCP to build agentic workflows",
    content:
      "The SupportMesh MCP server lets other AI agents delegate support triage to SupportMesh. A Claude Code agent can detect an error in a codebase and call submit_ticket to log it automatically. A monitoring system can call the REST API when an alert fires. A customer-facing chatbot can escalate to SupportMesh when it cannot answer a question. This is the core use case: support tickets that come from systems, not just people. Each ticket is triaged and available in the dashboard regardless of how it was submitted.",
  },
  {
    category: "security",
    title: "How data isolation works between organisations",
    content:
      "Every piece of data in SupportMesh is tagged with your org code at the point of creation. Tickets, knowledge base entries, summaries, and API keys all carry your org code as a field. Every database query filters on this field. On top of that, Convex verifies your authentication token against the org code on every request from a browser client. A user authenticated as Organisation A cannot query Organisation B's data even by crafting a request with a different org code. API keys are bound to a specific org at the database level.",
  },
  {
    category: "security",
    title: "API key security best practices",
    content:
      "Treat API keys as passwords. Do not embed them in client-side code, public repositories, or browser-accessible files. Use them only in server-side environments, CI pipelines, and trusted automation. Generate a separate key for each integration so you can revoke one without affecting others. If a key is exposed, revoke it immediately from the Developer page and generate a replacement. Keys are stored in the database and checked on every API request, so revocation takes effect instantly.",
  },
  {
    category: "branding",
    title: "How to white-label the customer submission page",
    content:
      "Go to Settings and find the Branding section. Enter your organisation or product name in the Brand Name field. When set, your customer submission page at /submit/[orgCode] will display your brand name instead of SupportMesh. You can also set a brand color that applies to the submit button on the form. This is useful if you share the submission link directly with your customers and want the experience to feel like part of your product rather than a third-party tool.",
  },
  {
    category: "troubleshooting",
    title: "Ticket submitted but not appearing in dashboard",
    content:
      "If a ticket was submitted but is not in the dashboard, first check the Convex real-time connection. The dashboard uses live subscriptions, so a brief network interruption can cause a display lag. Refresh the page. If the ticket is still missing, open the Convex dashboard and check the tickets table directly using your org code as a filter. If the ticket is in Convex but not showing in the app, it may be a query index issue. If the ticket is not in Convex at all, the submission may have failed before the triage agent ran.",
  },
  {
    category: "troubleshooting",
    title: "AI draft response is generic or unhelpful",
    content:
      "Generic draft responses usually mean the knowledge base has no entries relevant to the ticket topic. The triage agent can only reference information you have added to the knowledge base. To improve drafts for a specific topic, add one or more knowledge base entries that address it directly. Include exact product-specific language, step-by-step instructions, and the kinds of details a support agent would need to resolve the issue. After adding entries, the next similar ticket should produce a noticeably better draft.",
  },
];

export const seedKnowledgeBase = mutation({
  args: { orgCode: v.string() },
  handler: async (ctx, { orgCode }) => {
    const existing = await ctx.db
      .query("knowledgeBase")
      .withIndex("by_orgCode", (q) => q.eq("orgCode", orgCode))
      .collect();

    if (existing.length > 5) {
      return { skipped: true };
    }

    for (const entry of ENTRIES) {
      await ctx.db.insert("knowledgeBase", {
        orgCode,
        title: entry.title,
        content: entry.content,
        category: entry.category,
      });
    }

    return { seeded: ENTRIES.length };
  },
});
