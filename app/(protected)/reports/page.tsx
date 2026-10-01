"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles } from "@/graphql/generated/graphql";
import { AlertCircle, AlertTriangle, Building, CheckCircle2, RotateCcw, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetLibrariesQuery } from "@/graphql/library/hooks";
import { useGetUsersQuery } from "@/graphql/user/hooks";

type Finding = {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium";
};

export default function AdminReportsPage() {
  const { user, isLoading } = useAuth();
  const {
    data: librariesData,
    loading: librariesLoading,
    error: librariesError,
    refetch: refetchLibraries,
  } = useGetLibrariesQuery();
  const { fetchUsers, usersData, usersLoading, usersError } =
    useGetUsersQuery();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const libraries = useMemo(
    () => (librariesData?.getLibraries ?? []).filter((lib) => !!lib?.id),
    [librariesData],
  );

  // This is a data-integrity report derived from what the platform actually
  // has on file — there's no fraud/dispute reporting system in the backend
  // yet, so real, useful findings are surfaced here instead of invented ones.
  const findings: Finding[] = useMemo(() => {
    const list: Finding[] = [];

    const missingAddress = libraries.filter((lib) => !lib?.address?.trim());
    if (missingAddress.length > 0) {
      list.push({
        id: "lib-address",
        title: `${missingAddress.length} ${missingAddress.length === 1 ? "library is" : "libraries are"} missing an address`,
        description: missingAddress
          .map((lib) => lib?.name || "Untitled Library")
          .join(", "),
        severity: "medium",
      });
    }

    const negativeBalance = libraries.filter((lib) => (lib?.balance ?? 0) < 0);
    if (negativeBalance.length > 0) {
      list.push({
        id: "lib-balance",
        title: `${negativeBalance.length} ${negativeBalance.length === 1 ? "library has" : "libraries have"} a negative balance`,
        description: negativeBalance
          .map((lib) => lib?.name || "Untitled Library")
          .join(", "),
        severity: "high",
      });
    }

    const missingEmail = usersData.filter((u) => !u?.email?.trim());
    if (missingEmail.length > 0) {
      list.push({
        id: "user-email",
        title: `${missingEmail.length} ${missingEmail.length === 1 ? "user is" : "users are"} missing an email address`,
        description: missingEmail
          .map((u) => u?.name || "Unnamed User")
          .join(", "),
        severity: "medium",
      });
    }

    return list;
  }, [libraries, usersData]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (user?.role?.type !== User_Roles.Admin) {
    return <Forbidden />;
  }

  const loading = librariesLoading || usersLoading;
  const error = librariesError || usersError;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Platform Data Report
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Data-integrity findings across {libraries.length}{" "}
          {libraries.length === 1 ? "library" : "libraries"} and{" "}
          {usersData.length} {usersData.length === 1 ? "user" : "users"}.
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
          <p className="text-zinc-300 font-medium mb-1">
            Couldn&apos;t generate the report
          </p>
          <p className="text-zinc-500 text-sm mb-4 break-all">
            {error.message}
          </p>
          <button
            onClick={() => {
              refetchLibraries();
              fetchUsers();
            }}
            className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      ) : findings.length === 0 ? (
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardContent className="p-10 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-zinc-300 font-medium">
              No data-integrity issues found
            </p>
            <p className="text-zinc-500 text-sm max-w-md">
              Every library and user record on file has the required
              information filled in.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {findings.map((finding) => (
            <Card
              key={finding.id}
              className="bg-zinc-900/50 border-white/5 backdrop-blur-xl"
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    finding.severity === "high"
                      ? "bg-rose-500/10 text-rose-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {finding.id.startsWith("user") ? (
                    <Users className="h-5 w-5" />
                  ) : finding.severity === "high" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <Building className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium">{finding.title}</p>
                  <p className="text-zinc-400 text-sm mt-1 truncate">
                    {finding.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
