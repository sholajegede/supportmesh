import { Mastra } from "@mastra/core";
import { triageAgent } from "./agents/triage-agent";
import { summaryAgent } from "./agents/summary-agent";
import { MastraAuthKinde } from "./auth";

// MastraAuthKinde validates Kinde JWTs via JWKS and extracts org_code.
// See src/lib/mastra/auth.ts.

// Guard: only instantiate MastraAuthKinde when KINDE_DOMAIN is present at
// runtime. During Next.js build the env var is absent and the URL constructor
// would throw, so we skip auth configuration in that case.
export const mastra = new Mastra({
  agents: {
    triageAgent,
    summaryAgent,
  },
  server: process.env.KINDE_DOMAIN
    ? {
        auth: new MastraAuthKinde({
          domain: process.env.KINDE_DOMAIN,
        }),
      }
    : undefined,
  logger: false,
});
