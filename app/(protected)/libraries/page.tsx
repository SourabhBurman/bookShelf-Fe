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
    if (typeof user.role === "string") {
      role = user.role;
    } else if (user.role.type) {
      role = user.role.type;
    } else {
      role = String(user.role);
    }
  }
  role = role.toLowerCase();

  switch (role) {
    case "admin":
      return <AdminLibraries />;
    case "owner":
      return <Forbidden />;
    default:
      return <UserLibraries />;
  }
}
