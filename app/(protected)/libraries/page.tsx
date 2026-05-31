"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminLibraries } from "@/components/libraries/AdminLibraries";
import { UserLibraries } from "@/components/libraries/UserLibraries";
import { Forbidden } from "@/components/ui/Forbidden";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function UnifiedLibrariesPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  let role = "user";
  if (user?.role) {
    role = typeof user.role === "string" ? user.role : String(user.role.type || user.role).toLowerCase();
  }

  if (role === "admin") {
    return <AdminLibraries />;
  }
  
  if (role === "user") {
    return <UserLibraries />;
  }

  // Owners shouldn't access the global libraries page, they have /inventory
  return (
    <DashboardShell navItems={[]} userTitle="Unauthorized">
      <Forbidden />
    </DashboardShell>
  );
}
