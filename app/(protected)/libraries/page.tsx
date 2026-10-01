"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminLibraries } from "@/components/libraries/AdminLibraries";
import { UserLibraries } from "@/components/libraries/UserLibraries";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles } from "@/graphql/generated/graphql";

export default function UnifiedLibrariesPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  switch (user?.role?.type) {
    case User_Roles.Admin:
      return <AdminLibraries />;
    case User_Roles.LibraryOwner:
      return <Forbidden />;
    default:
      return <UserLibraries />;
  }
}
