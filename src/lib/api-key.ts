import { fetchQuery } from "convex/nextjs";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { api } from "../../convex/_generated/api";

export type ApiKeyValidation =
  | { valid: true; orgCode: string }
  | { valid: false; orgCode: null };

export async function validateApiKeyFromRequest(
  req: Request
): Promise<ApiKeyValidation> {
  const authHeader = req.headers.get("authorization") ?? "";
  const headerKey = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const urlKey = new URL(req.url).searchParams.get("apiKey");
  const key = headerKey ?? urlKey;

  if (!key) return { valid: false, orgCode: null };

  // api.apiKeys is present at runtime once convex dev regenerates types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const record = await fetchQuery((api as any).apiKeys.validateApiKeyForOrg, { key });
  if (!record) return { valid: false, orgCode: null };

  return { valid: true, orgCode: record.orgCode };
}
