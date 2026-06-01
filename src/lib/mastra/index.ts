import { Mastra } from "@mastra/core";
import { triageAgent } from "./agents/triage-agent";
import { summaryAgent } from "./agents/summary-agent";
import { MastraAuthProvider } from "@mastra/core/server";
import type { HonoRequest } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";

// @TODO-scope/auth-kinde is installed from github:sholajegede/mastra-auth-kinde
// but the repo only ships README + package.json — no dist directory.
// This inline class implements the identical public API documented in that README.
// Replace with `import { MastraAuthKinde } from "@TODO-scope/auth-kinde"` once
// the package ships a built dist.

interface KindeClaims {
  sub?: string;
  org_code?: string;
  gty?: string[];
  [key: string]: unknown;
}

class MastraAuthKinde extends MastraAuthProvider<KindeClaims> {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly audience?: string | string[];
  private readonly allowedOrgCodes?: string[];

  constructor(options: {
    domain: string;
    audience?: string | string[];
    allowedOrgCodes?: string[];
  }) {
    super({ name: "kinde" });
    this.jwks = createRemoteJWKSet(
      new URL(`${options.domain}/.well-known/jwks`)
    );
    this.audience = options.audience;
    this.allowedOrgCodes = options.allowedOrgCodes;
  }

  async authenticateToken(
    token: string,
    _request: HonoRequest
  ): Promise<KindeClaims | null> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        ...(this.audience ? { audience: this.audience } : {}),
      });
      return payload as KindeClaims;
    } catch {
      return null;
    }
  }

  authorizeUser(user: KindeClaims, _request: HonoRequest): boolean {
    if (this.allowedOrgCodes?.length && user.org_code) {
      return this.allowedOrgCodes.includes(user.org_code);
    }
    return true;
  }
}

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
