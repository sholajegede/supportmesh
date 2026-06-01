import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const ESCALATION_KEYWORDS = [
  "legal",
  "lawyer",
  "sue",
  "lawsuit",
  "data loss",
  "security breach",
  "hack",
  "outage",
  "down for hours",
];

const FRUSTRATION_PHRASES = ["extremely frustrated", "this is unacceptable"];
const CHURN_PHRASES = ["cancel", "refund"];

export const checkEscalationTool = createTool({
  id: "check-escalation",
  description:
    "Check whether a ticket should be escalated based on its content",
  inputSchema: z.object({
    subject: z.string(),
    body: z.string(),
    priority: z.string(),
  }),
  execute: async ({ subject, body, priority }) => {
    const subjectLower = subject.toLowerCase();
    const bodyLower = body.toLowerCase();
    const combined = `${subjectLower} ${bodyLower}`;

    if (priority === "critical") {
      return { shouldEscalate: true, reason: "Ticket priority is critical" };
    }

    for (const keyword of ESCALATION_KEYWORDS) {
      if (combined.includes(keyword)) {
        return {
          shouldEscalate: true,
          reason: `Ticket contains escalation keyword: "${keyword}"`,
        };
      }
    }

    const hasFrustration = FRUSTRATION_PHRASES.some((p) =>
      bodyLower.includes(p)
    );
    const hasChurn = CHURN_PHRASES.some((p) => bodyLower.includes(p));
    if (hasFrustration && hasChurn) {
      return {
        shouldEscalate: true,
        reason: "Customer expressing frustration with cancellation or refund intent",
      };
    }

    return { shouldEscalate: false, reason: null };
  },
});
