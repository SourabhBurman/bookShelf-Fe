"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LibraryBig, Menu, User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getNavItemsByRole } from "@/lib/navigation";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  children: React.ReactNode;
  userTitle?: string;
  userRoleLabel?: string;
}

export function DashboardShell({
  children,
  userTitle = "Dashboard",
}: DashboardShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  const finalUserName =
    (user?.name || user?.email || "Guest").charAt(0).toUpperCase() +
    (user?.name || user?.email || "Guest").slice(1);
  const finalRoleLabel = user?.role?.displayName;

  // Use the provided navItems, or fallback to the centralized list based on role if empty
  const activeNavItems = getNavItemsByRole(user?.role?.type);

  // Derive title from pathname
  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/inventory": "Library Inventory",
    "/orders": "Rentals & History",
    "/financials": "Financial Analytics",
    "/members": "Library Members",
    "/settings": "Settings",
    "/health": "System Health",
    "/users": "User Management",
    "/reports": "System Reports",
    "/libraries": "Nearby Libraries",
    "/saved": "Saved Books",
  };

  let displayTitle = routeTitles[pathname] || "Dashboard";
  if (pathname.startsWith("/books/")) {
    displayTitle = "Book Details";
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-50 font-sans selection:bg-purple-500/30">
      {/* Background gradients for that deep space aesthetic */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] mix-blend-screen pointer-events-none" />

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-zinc-950/50 backdrop-blur-xl lg:flex z-50">
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <LibraryBig className="h-5 w-5 text-purple-400" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-purple-400 transition-colors">
              BookShelf
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <div className="px-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {finalRoleLabel} Panel
          </div>
          <nav className="grid items-start gap-2">
            {activeNavItems.map((item, index) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <div key={index}>
                  <Link
                    href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-zinc-800/50 hover:text-white transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/20",
                    isActive
                      ? "bg-purple-500/10 text-purple-400"
                      : "text-zinc-400",
                  )}
                >
                  <div
                    className={cn(
                      "mr-3 bg-transparent transition-colors",
                      isActive
                        ? "text-purple-400"
                        : "text-zinc-400 group-hover:text-purple-400",
                    )}
                  >
                    {item.icon}
                  </div>
                  {item.title}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border border-white/5 flex-1 min-w-0">
            <div className="h-9 w-9 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
              <User className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">
                {finalUserName}
              </span>
              <span className="text-xs text-zinc-400 truncate">
                {finalRoleLabel}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-white/5 shrink-0"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex w-full flex-col flex-1 min-w-0 overflow-y-auto overscroll-none">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>

          {/* Separator */}
          <div className="h-6 w-px bg-white/10 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6 justify-between lg:justify-end">
            {/* Dynamic Heading based on current route context, hidden on mobile logic */}
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight text-white sm:block">
                {displayTitle}
              </h1>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute top-1 right-2 inline-flex items-center justify-center h-2 w-2 rounded-full bg-rose-500 ring-2 ring-zinc-950" />
              </Button>

              <div
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10"
                aria-hidden="true"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-zinc-400 hover:text-rose-400 rounded-full hover:bg-rose-500/10 h-8 w-8 flex items-center justify-center"
                title="Log Out"
              >
                <LogOut
                  className="h-5 w-5 animate-in fade-in duration-300"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
