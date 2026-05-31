"use client";

import { ApolloWrapper } from "@/context/ApolloWrapper";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return <ApolloWrapper>{children}</ApolloWrapper>;
}
