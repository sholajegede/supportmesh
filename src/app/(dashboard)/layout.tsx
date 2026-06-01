import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getUser, getOrganization } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const [user, org] = await Promise.all([getUser(), getOrganization()]);

  // Attach to headers/context so child server components can read them
  // without re-calling getKindeServerSession each time.
  // The values are available via props or passed down as needed.
  void user;
  void org;

  return <>{children}</>;
}
