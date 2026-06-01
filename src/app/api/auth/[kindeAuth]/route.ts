import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

// Force dynamic so Next.js never tries to statically render this route.
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ kindeAuth: string }> }
) {
  return handleAuth()(req, ctx);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ kindeAuth: string }> }
) {
  return handleAuth()(req, ctx);
}
