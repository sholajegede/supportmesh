import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
  async function proxy(_req: NextRequest) {},
  {
    loginPage: "/login",
    isReturnToCurrentPage: true,
    publicPaths: [
      "/",
      "/login",
      "/pricing",
      "/api/auth",
      "/_next",
      "/favicon.ico",
      "/submit",
      "/api/v1",
      "/api/mcp",
      "/api/agents/triage",
    ],
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
