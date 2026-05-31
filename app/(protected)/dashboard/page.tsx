"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  }

  let rawRole = "user";
  if (user?.role) {
    if (typeof user.role === "string") {
      rawRole = user.role;
    } else {
      rawRole = String(user.role);
    }
  }
  const role = rawRole.toLowerCase();

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "owner":
      return <OwnerDashboard />;
    default:
      return <UserDashboard />;
  }
}
