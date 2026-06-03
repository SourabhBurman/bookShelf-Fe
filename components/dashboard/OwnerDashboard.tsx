"use client";

import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  AlertTriangle,
  BookOpen,
  IndianRupee,
  PieChart,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
  { name: "Aug", revenue: 4500 },
  { name: "Sep", revenue: 5300 },
  { name: "Oct", revenue: 5800 },
  { name: "Nov", revenue: 6000 },
  { name: "Dec", revenue: 7500 },
];

const activityData = [
  { name: "Mon", rentals: 24, returns: 10 },
  { name: "Tue", rentals: 13, returns: 18 },
  { name: "Wed", rentals: 38, returns: 25 },
  { name: "Thu", rentals: 39, returns: 14 },
  { name: "Fri", rentals: 48, returns: 32 },
  { name: "Sat", rentals: 68, returns: 40 },
  { name: "Sun", rentals: 52, returns: 38 },
];

const pendingReturns = [
  {
    id: "R102",
    user: "Alice Walker",
    book: "Dune",
    due: "Today",
    daysOverdue: 0,
  },
  {
    id: "R098",
    user: "John Smith",
    book: "Atomic Habits",
    due: "Yesterday",
    daysOverdue: 1,
  },
  {
    id: "R085",
    user: "Emma Davis",
    book: "The Midnight Library",
    due: "3 days ago",
    daysOverdue: 3,
  },
];

export function OwnerDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-zinc-400 animate-pulse text-sm">
            Authorizing library console...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Banner Warning / Alert if needed */}
      <div className="mb-8 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400" />
          <p className="text-sm font-medium text-rose-200">
            You have <span className="font-bold text-rose-400">3 books</span>{" "}
            heavily overdue. Processing automated penalties is recommended.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-rose-500/50 text-rose-400 hover:bg-rose-500/20"
        >
          Review Pending Returns
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="$12,450"
          icon={<IndianRupee className="h-6 w-6" />}
          variant="emerald"
          trend={15.2}
          trendLabel="vs last month"
        />
        <StatCard
          title="Active Rentals"
          value="342"
          icon={<TrendingUp className="h-6 w-6" />}
          variant="purple"
          trend={5.4}
        />
        <StatCard
          title="Total Books"
          value="4,821"
          icon={<BookOpen className="h-6 w-6" />}
          variant="blue"
        />
        <StatCard
          title="Active Members"
          value="1,204"
          icon={<Users className="h-6 w-6" />}
          variant="amber"
          trend={2.1}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Revenue Analytics
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Monthly earnings overview across all rentals and sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#3f3f46",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#a78bfa" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Bar Chart */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Weekly Activity
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Rentals vs Returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
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
                  />
                  <Tooltip
                    cursor={{ fill: "#27272a" }}
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#3f3f46",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="rentals" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returns" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Tables and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Returns List */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-lg font-semibold">
                  Pending Returns
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Recent rentals awaiting return.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Borrower
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Book
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Status / Due
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-right"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReturns.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-zinc-300 font-medium">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 text-white">{item.user}</td>
                      <td className="px-6 py-4 text-zinc-300">{item.book}</td>
                      <td className="px-6 py-4">
                        {item.daysOverdue > 0 ? (
                          <span className="bg-rose-500/10 text-rose-400 py-1 px-2.5 rounded-full text-xs font-medium border border-rose-500/20">
                            Overdue ({item.daysOverdue}d)
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 py-1 px-2.5 rounded-full text-xs font-medium border border-amber-500/20">
                            {item.due}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 bg-transparent text-white border-white/10 hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/50"
                        >
                          Mark Returned
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="w-full justify-start h-12 bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 transition-colors border border-white/5">
              <BookOpen className="mr-3 h-5 w-5" /> Add New Book
            </Button>
            <Button className="w-full justify-start h-12 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors border border-white/5">
              <Users className="mr-3 h-5 w-5" /> Register Member
            </Button>
            <Button className="w-full justify-start h-12 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-colors border border-white/5">
              <AlertTriangle className="mr-3 h-5 w-5" /> View Low Stock
            </Button>

            <div className="mt-6 p-4 rounded-xl border border-white/5 bg-gradient-to-br from-purple-900/30 to-indigo-900/30">
              <h4 className="font-semibold text-white mb-2">Need Help?</h4>
              <p className="text-sm text-zinc-400 mb-4">
                Contact the super admin for billing or technical support.
              </p>
              <Button
                size="sm"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
