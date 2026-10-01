"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Forbidden } from "@/components/ui/Forbidden";
import { useAuth } from "@/context/AuthContext";
import { User_Roles } from "@/graphql/generated/graphql";
import { useGetLibrariesQuery } from "@/graphql/library/hooks";
import { useGetUsersQuery } from "@/graphql/user/hooks";
import { StatCard } from "@/components/ui/StatCard";
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Database,
  Server,
  Users,
} from "lucide-react";

export default function AdminHealthPage() {
  const { user, isLoading } = useAuth();
  const {
    data: librariesData,
    loading: librariesLoading,
    error: librariesError,
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

  const zeroBalanceLibraries = useMemo(
    () => libraries.filter((lib) => (lib?.balance ?? 0) === 0).length,
    [libraries],
  );

  const avgBalance = useMemo(() => {
    if (libraries.length === 0) return 0;
    const total = libraries.reduce((sum, lib) => sum + (lib?.balance ?? 0), 0);
    return total / libraries.length;
  }, [libraries]);

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

  const services = [
    {
      key: "libraries",
      name: "Libraries API",
      icon: Building,
      loading: librariesLoading,
      error: librariesError,
    },
    {
      key: "users",
      name: "Users API",
      icon: Users,
      loading: usersLoading,
      error: usersError,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Platform Status</h2>
        <p className="text-zinc-400 text-sm mt-1">
          There&apos;s no infrastructure-monitoring backend yet, so this
          reflects the real status of the GraphQL queries this dashboard
          depends on, plus a snapshot of library data on file.
        </p>
      </div>

      {/* Live Service Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((svc) => {
          const Icon = svc.icon;
          const isDegraded = !!svc.error;
          const isChecking = svc.loading;
          return (
            <div
              key={svc.key}
              className={`rounded-xl p-4 flex items-center gap-4 border ${
                isDegraded
                  ? "bg-rose-500/10 border-rose-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20"
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  isDegraded ? "bg-rose-500/20" : "bg-emerald-500/20"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isDegraded ? "text-rose-400" : "text-emerald-400"}`}
                />
              </div>
              <div className="min-w-0">
                <p
                  className={`font-semibold ${isDegraded ? "text-rose-400" : "text-emerald-400"}`}
                >
                  {svc.name}
                </p>
                <p className="text-zinc-400 text-sm truncate">
                  {isChecking
                    ? "Checking..."
                    : isDegraded
                      ? `Degraded — ${svc.error?.message}`
                      : "Operational"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Data Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Registered Libraries"
          value={librariesLoading ? "—" : libraries.length.toString()}
          icon={<Building className="h-6 w-6" />}
          variant="purple"
        />
        <StatCard
          title="Registered Users"
          value={usersLoading ? "—" : usersData.length.toString()}
          icon={<Server className="h-6 w-6" />}
          variant="blue"
        />
        <StatCard
          title="Avg. Library Balance"
          value={librariesLoading ? "—" : `$${avgBalance.toFixed(2)}`}
          icon={<Database className="h-6 w-6" />}
          variant="emerald"
        />
      </div>

      {/* Zero-balance callout */}
      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
            {zeroBalanceLibraries > 0 ? (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
            Library Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300 text-sm">
            {librariesLoading
              ? "Checking library balances..."
              : zeroBalanceLibraries === 0
                ? "Every library on the platform has a non-zero balance recorded."
                : `${zeroBalanceLibraries} of ${libraries.length} ${libraries.length === 1 ? "library has" : "libraries have"} a $0.00 balance on file.`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
