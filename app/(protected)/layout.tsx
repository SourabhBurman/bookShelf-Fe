"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import MyLoading from "@/components/myLoading";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <MyLoading />;
  }

  // return children;
  return <DashboardShell>{children}</DashboardShell>;
}
