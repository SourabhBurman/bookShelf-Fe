"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Users,
  Building,
  ShieldCheck,
  BookUser,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useGetLibrariesQuery } from "@/graphql/library/hooks";
import { useGetUsersQuery } from "@/graphql/user/hooks";
import { User_Roles } from "@/graphql/generated/graphql";

const ROLE_BAR_COLORS: Record<string, string> = {
  Admins: "#f43f5e",
  Owners: "#f59e0b",
  Readers: "#8b5cf6",
};

export function AdminDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
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

  const roleCounts = useMemo(() => {
    const counts = { Admin: 0, Owner: 0, Reader: 0 };
    for (const u of usersData) {
      if (u?.role?.type === User_Roles.Admin) counts.Admin += 1;
      else if (u?.role?.type === User_Roles.LibraryOwner) counts.Owner += 1;
      else if (u?.role?.type === User_Roles.Reader) counts.Reader += 1;
    }
    return counts;
  }, [usersData]);

  const roleChartData = [
    { name: "Admins", count: roleCounts.Admin },
    { name: "Owners", count: roleCounts.Owner },
    { name: "Readers", count: roleCounts.Reader },
  ];

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-zinc-400 animate-pulse text-sm">
            Authorizing admin console...
          </p>
        </div>
      </div>
    );
  }

  if (librariesLoading || usersLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (librariesError || usersError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-rose-500/20">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Couldn&apos;t load platform data
        </h2>
        <p className="text-zinc-400 max-w-md mb-8">
          We had trouble fetching libraries or users from our servers.
          <br />
          <span className="text-rose-400/80 text-sm mt-2 block break-all">
            Error: {(librariesError || usersError)?.message}
          </span>
        </p>
        <button
          onClick={() => {
            refetchLibraries();
            fetchUsers();
          }}
          className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Libraries"
          value={libraries.length.toString()}
          icon={<Building className="h-6 w-6" />}
          variant="purple"
        />
        <StatCard
          title="Total Users"
          value={usersData.length.toString()}
          icon={<Users className="h-6 w-6" />}
          variant="blue"
        />
        <StatCard
          title="Library Owners"
          value={roleCounts.Owner.toString()}
          icon={<ShieldCheck className="h-6 w-6" />}
          variant="amber"
        />
        <StatCard
          title="Readers"
          value={roleCounts.Reader.toString()}
          icon={<BookUser className="h-6 w-6" />}
          variant="emerald"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Role Distribution Chart */}
        <Card className="xl:col-span-2 bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              User Base Breakdown
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Registered users by role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roleChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#27272a" }}
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#3f3f46",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {roleChartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={ROLE_BAR_COLORS[entry.name]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Libraries Directory */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Registered Libraries
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {libraries.length}{" "}
              {libraries.length === 1 ? "library" : "libraries"} on the
              platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
            {libraries.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No libraries have been onboarded yet.
              </p>
            ) : (
              libraries.slice(0, 5).map((lib) => (
                <div
                  key={lib?.id}
                  className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className="rounded-full p-1.5 bg-purple-500/20 text-purple-400 shrink-0">
                    <Building className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {lib?.name || "Untitled Library"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {lib?.address || "No address on file"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="ghost"
              className="w-full text-purple-400 hover:text-purple-300"
              asChild
            >
              <Link href="/libraries">Manage All Libraries</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
