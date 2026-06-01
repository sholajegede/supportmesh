import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth({
  publicPaths: ["/", "/login", "/api/auth", "/_next", "/favicon.ico"],
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
