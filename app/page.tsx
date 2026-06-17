"use client";

import { useAuth } from "@/context/AuthContext";
import MyLoading from "@/components/myLoading";
import { DashboardShell } from "@/components/layout/DashboardShell";
import LandingPage from "@/components/landing/LandingPage";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { User_Roles } from "@/graphql/generated/graphql";
import LibrarySetupPage from "@/app/(protected)/inventory/setup/page";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <MyLoading />;
  }

  if (!user) {
    return <LandingPage />;
  }

  const role = user?.role?.type;
  
  let DashboardContent = null;
  switch (role) {
    case User_Roles.Admin:
      DashboardContent = <AdminDashboard />;
      break;
    case User_Roles.LibraryOwner:
      if (!user.library_owned) {
        DashboardContent = <LibrarySetupPage />;
      } else {
        DashboardContent = <OwnerDashboard />;
      }
      break;
    default:
      DashboardContent = <UserDashboard />;
      break;
  }

  return (
    <DashboardShell>
      {DashboardContent}
    </DashboardShell>
  );
}
