import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { searchKnowledgeTool } from "../tools/knowledge";
import { checkEscalationTool } from "../tools/escalate";
import { saveTriageResultTool } from "../tools/classify";

export const triageAgent = new Agent({
  id: "triage-agent",
  name: "triage-agent",
  model: openai("gpt-4o-mini"),
  tools: {
    searchKnowledge: searchKnowledgeTool,
    checkEscalation: checkEscalationTool,
    saveTriageResult: saveTriageResultTool,
  },
  instructions: `
You are a support operations agent for SupportMesh. Your job is to triage
incoming support tickets for a specific organisation.

When given a ticket, you MUST do all of the following in order:
1. Classify it into one of: billing, technical, account, feature_request, general
2. Assign a priority: low, medium, high, or critical
   - critical: system down, data loss, security issue
   - high: significant functionality broken, multiple users affected
   - medium: partial impact, single user
   - low: general questions, feature requests, cosmetic issues
3. Assess sentiment: positive, neutral, negative, or frustrated
4. Search the knowledge base using search-knowledge with the ticket subject as
   the query and the orgCode provided
5. Draft a clear, empathetic, professional response that addresses the issue.
   Reference the knowledge base results if relevant. Keep it under 150 words.
6. Use check-escalation to determine if the ticket needs escalating
7. Save everything using save-triage-result

Always pass the orgCode you received to every tool that requires it.
`.trim(),
});
