// Force dynamic so Next.js never tries to statically render this route.
export const dynamic = "force-dynamic";

// Dynamic imports ensure the Kinde server module (and its config validation
// that requires KINDE_ISSUER_URL) is only loaded at request time, not during
// the build's page-data collection step where env vars are absent.
export async function GET(
  req: Request,
  ctx: { params: Promise<{ kindeAuth: string }> }
) {
  const { handleAuth } = await import("@kinde-oss/kinde-auth-nextjs/server");
  return handleAuth()(req, ctx);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ kindeAuth: string }> }
) {
  const { handleAuth } = await import("@kinde-oss/kinde-auth-nextjs/server");
  return handleAuth()(req, ctx);
}
