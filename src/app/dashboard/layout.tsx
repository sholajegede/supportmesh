import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { Sidebar } from "@/components/sidebar";

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

  // Upsert the org into Convex on every login so it stays in sync.
  // Non-fatal: Convex may be unavailable during cold starts or local dev.
  if (org?.orgCode) {
    await fetchMutation(api.orgs.upsertOrg, {
      orgCode: org.orgCode,
      orgName: org.orgName || org.orgCode,
    }).catch(() => {});
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar
        givenName={user?.given_name ?? null}
        email={user?.email ?? null}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
