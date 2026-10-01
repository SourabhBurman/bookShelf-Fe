"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import MyLoading from "@/components/myLoading";

// Routes under (protected) that are still browsable by a logged-out
// visitor — the catalog itself is public, everything else needs a session.
const PUBLIC_PATH_PREFIXES = ["/books"];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicPath = PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  useEffect(() => {
    if (!isLoading && !user && !isPublicPath) {
      router.push("/login");
    }
  }, [user, isLoading, isPublicPath, router]);

  if (isLoading || (!user && !isPublicPath)) {
    return <MyLoading />;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
