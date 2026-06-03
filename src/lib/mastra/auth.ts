import { createRemoteJWKSet, jwtVerify } from "jose";
import { MastraAuthProvider } from "@mastra/core/server";
import type { HonoRequest } from "hono";

export interface KindeClaims {
  sub?: string;
  org_code?: string;
  gty?: string[];
  [key: string]: unknown;
}

export class MastraAuthKinde extends MastraAuthProvider<KindeClaims> {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly allowedOrgCodes?: string[];

  constructor(options: { domain: string; allowedOrgCodes?: string[] }) {
    super({ name: "kinde" });
    this.jwks = createRemoteJWKSet(
      new URL(`${options.domain}/.well-known/jwks`)
    );
    this.allowedOrgCodes = options.allowedOrgCodes;
  }

  async authenticateToken(
    token: string,
    _request: HonoRequest
  ): Promise<KindeClaims | null> {
    try {
      const { payload } = await jwtVerify(token, this.jwks);
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

// Validates a Kinde Bearer token and returns the org_code claim.
// Returns null if the token is missing, malformed, or fails verification.
export async function validateKindeToken(
  token: string
): Promise<{ orgCode: string; sub: string } | null> {
  if (!process.env.KINDE_DOMAIN) return null;
  try {
    const jwks = createRemoteJWKSet(
      new URL(`${process.env.KINDE_DOMAIN}/.well-known/jwks`)
    );
    const { payload } = await jwtVerify(token, jwks);
    const claims = payload as KindeClaims;
    if (!claims.org_code) return null;
    return { orgCode: claims.org_code, sub: claims.sub ?? "" };
  } catch {
    return null;
  }
}
