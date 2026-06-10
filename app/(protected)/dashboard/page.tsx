"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MyLoading from "@/components/myLoading";
import { User_Roles } from "@/graphql/generated/graphql";

import LibrarySetupPage from "@/app/(protected)/inventory/setup/page";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <MyLoading />;
  }

  if (!user) {
    redirect("/login");
  }

  const role = user?.role?.type;

  switch (role) {
    case User_Roles.Admin:
      return <AdminDashboard />;
    case User_Roles.LibraryOwner:
      if (!user.library_owned) {
        return <LibrarySetupPage />;
      }
      return <OwnerDashboard />;
    default:
      return <UserDashboard />;
  }
}
