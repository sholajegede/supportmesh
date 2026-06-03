"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Code2, LayoutDashboard, LogOut, Menu, Settings, Ticket, Users, Zap } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  givenName: string | null;
  email: string | null;
}

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets",        href: "/dashboard/tickets",    icon: Ticket },
  { label: "Knowledge Base", href: "/dashboard/knowledge",  icon: BookOpen },
  { label: "Customers",      href: "/dashboard/customers",  icon: Users },
  { label: "Developer",      href: "/dashboard/developer",  icon: Code2 },
  { label: "Settings",       href: "/dashboard/settings",   icon: Settings },
];

function initials(name: string | null, email: string | null): string {
  const first  = name  ? name[0].toUpperCase()                       : "";
  const second = email ? email.split("@")[1]?.[0]?.toUpperCase() ?? "" : "";
  if (first && second) return first + second;
  if (first)  return first + first;
  if (email)  return email.slice(0, 2).toUpperCase();
  return "??";
}

export function Sidebar({ givenName, email }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-zinc-100 bg-white transition-transform duration-200",
          "lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            SupportMesh
          </span>
        </div>

        <Separator />

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-zinc-100 text-zinc-900 border-l-2 border-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <Separator />
        <div className="flex items-center gap-3 px-4 py-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-zinc-200 text-xs font-semibold text-zinc-700">
              {initials(givenName, email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900">
              {givenName ?? "User"}
            </p>
            <p className="truncate text-xs text-zinc-500">{email ?? ""}</p>
          </div>
          <LogoutLink>
            <button
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </LogoutLink>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-30 flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4 text-zinc-600" />
      </button>
    </>
  );
}
