"use client";

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
  ShieldAlert,
  Activity,
  Building,
  Globe,
  CheckCircle2,
  XCircle,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const platformGrowth = [
  { month: "Jan", libraries: 120, users: 4000 },
  { month: "Feb", libraries: 135, users: 5500 },
  { month: "Mar", libraries: 160, users: 8000 },
  { month: "Apr", libraries: 180, users: 12000 },
  { month: "May", libraries: 210, users: 16500 },
  { month: "Jun", libraries: 280, users: 24000 },
];

const pendingLibraries = [
  {
    name: "Downtown Public Library",
    location: "New York, NY",
    requested: "2 hours ago",
    status: "Reviewing",
  },
  {
    name: "Tech University Hub",
    location: "San Francisco, CA",
    requested: "5 hours ago",
    status: "Reviewing",
  },
  {
    name: "Community Books Archive",
    location: "Austin, TX",
    requested: "1 day ago",
    status: "Needs More Info",
  },
];

export function AdminDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
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

  return (
    <>
      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Libraries"
          value="280"
          icon={<Building className="h-6 w-6" />}
          variant="purple"
          trend={12.5}
        />
        <StatCard
          title="Active Users"
          value="24.2k"
          icon={<Users className="h-6 w-6" />}
          variant="blue"
          trend={18.2}
        />
        <StatCard
          title="Platform MRR"
          value="$145.2k"
          icon={<Activity className="h-6 w-6" />}
          variant="emerald"
          trend={22.4}
        />
        <StatCard
          title="System Health"
          value="99.9%"
          icon={<CheckCircle2 className="h-6 w-6" />}
          variant="amber"
          trendLabel="All systems normal"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Growth Chart */}
        <Card className="xl:col-span-2 bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Platform Growth
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Total onboarded libraries vs active users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={platformGrowth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#3f3f46",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="libraries"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-zinc-400">Total Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-zinc-400">Total Libraries</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Activity Feed */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            <div className="flex gap-4 items-start p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="mt-0.5 rounded-full p-1.5 bg-rose-500/20 text-rose-400 shrink-0">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  Suspicious Activity Detected
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Multiple failed admin logins from IP 192.168.1.5
                </p>
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                  10 mins ago
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="mt-0.5 rounded-full p-1.5 bg-emerald-500/20 text-emerald-400 shrink-0">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  Database Backup Complete
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Weekly snapshot securely stored in AWS S3.
                </p>
                <p className="text-xs text-zinc-500 mt-2 font-mono">1 hr ago</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="mt-0.5 rounded-full p-1.5 bg-amber-500/20 text-amber-400 shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  API Latency Spike
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  GraphQL endpoints returned p99 800ms.
                </p>
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                  3 hrs ago
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="ghost"
              className="w-full text-purple-400 hover:text-purple-300"
            >
              View All Logs
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Library Approvals Table */}
      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-4 border-b border-white/5">
          <div>
            <CardTitle className="text-white text-lg font-semibold">
              Library Verification Queue
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Review and approve new library registrations.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              className="w-full pl-9 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
              placeholder="Search applications..."
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Library Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingLibraries.map((lib, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Building className="h-4 w-4 text-zinc-400" />
                      </div>
                      {lib.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{lib.location}</td>
                    <td className="px-6 py-4 text-zinc-400">{lib.requested}</td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-500/10 text-amber-400 py-1 px-2.5 rounded-full text-xs font-medium border border-amber-500/20">
                        {lib.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
