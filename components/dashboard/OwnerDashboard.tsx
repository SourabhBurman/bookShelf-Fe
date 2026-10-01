"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  AlertCircle,
  AlertTriangle,
  BookOpen,
  IndianRupee,
  RotateCcw,
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
import { useGetLibraryOrdersQuery } from "@/graphql/order/hooks";
import { useGetBooksByLibraryQuery } from "@/graphql/book/hooks";
import { OrderStatus } from "@/graphql/generated/graphql";

export function OwnerDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    fetchLibraryOrders,
    libraryOrdersData,
    libraryOrdersLoading,
    libraryOrdersError,
  } = useGetLibraryOrdersQuery();
  const {
    getBooksByLibrary,
    libraryBooksData,
    libraryBooksLoading,
    libraryBooksError,
  } = useGetBooksByLibraryQuery();

  const libraryId = user?.library_owned?.id;

  useEffect(() => {
    fetchLibraryOrders();
  }, [fetchLibraryOrders]);

  useEffect(() => {
    if (libraryId) getBooksByLibrary({ variables: { id: libraryId } });
  }, [libraryId, getBooksByLibrary]);

  // Date.now() is impure, so "now" is captured in an effect (and refreshed
  // periodically) rather than read directly during render. The first tick is
  // deferred via setTimeout so state is only ever set from a callback, never
  // synchronously in the effect body.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timeout = setTimeout(tick, 0);
    const interval = setInterval(tick, 60_000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const activeOrders = useMemo(
    () =>
      libraryOrdersData.filter(
        (o) => o.current_status === OrderStatus.Borrowed,
      ),
    [libraryOrdersData],
  );

  const overdueOrders = useMemo(
    () =>
      now === null
        ? []
        : activeOrders.filter(
            (o) =>
              o.expectedReturnDate &&
              new Date(o.expectedReturnDate as string).getTime() < now,
          ),
    [activeOrders, now],
  );

  const totalRevenue = useMemo(() => {
    const cents = libraryOrdersData.reduce((sum, o) => {
      const orderTotal = (o.transactions || []).reduce(
        (s, t) => s + (t?.amount || 0),
        0,
      );
      return sum + orderTotal;
    }, 0);
    return cents / 100;
  }, [libraryOrdersData]);

  const booksInStock = useMemo(
    () =>
      libraryBooksData.reduce((sum, b) => sum + (b?.quantityAvailable || 0), 0),
    [libraryBooksData],
  );

  const revenueByMonth = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const o of libraryOrdersData) {
      for (const t of o.transactions || []) {
        if (!t?.transactionDate || !t.amount) continue;
        const d = new Date(t.transactionDate as string);
        const key = d.toLocaleDateString(undefined, {
          month: "short",
          year: "2-digit",
        });
        buckets.set(key, (buckets.get(key) || 0) + t.amount / 100);
      }
    }
    return Array.from(buckets.entries()).map(([name, revenue]) => ({
      name,
      revenue: Math.round(revenue * 100) / 100,
    }));
  }, [libraryOrdersData]);

  const statusBreakdown = useMemo(() => {
    const counts = { Borrowed: 0, Purchased: 0, Returned: 0 };
    for (const o of libraryOrdersData) {
      if (o.current_status === OrderStatus.Borrowed) counts.Borrowed += 1;
      else if (o.current_status === OrderStatus.Purchased)
        counts.Purchased += 1;
      else if (o.current_status === OrderStatus.Returned)
        counts.Returned += 1;
    }
    return [
      { name: "Borrowed", count: counts.Borrowed },
      { name: "Purchased", count: counts.Purchased },
      { name: "Returned", count: counts.Returned },
    ];
  }, [libraryOrdersData]);

  if (isAuthLoading || !user) {
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

  if (libraryOrdersLoading || libraryBooksLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (libraryOrdersError || libraryBooksError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-rose-500/20">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Couldn&apos;t load your library data
        </h2>
        <p className="text-zinc-400 max-w-md mb-8">
          <span className="text-rose-400/80 text-sm mt-2 block break-all">
            Error: {(libraryOrdersError || libraryBooksError)?.message}
          </span>
        </p>
        <button
          onClick={() => {
            fetchLibraryOrders();
            if (libraryId) getBooksByLibrary({ variables: { id: libraryId } });
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
      {/* Overdue Warning Banner */}
      {overdueOrders.length > 0 && (
        <div className="mb-8 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <p className="text-sm font-medium text-rose-200">
              You have{" "}
              <span className="font-bold text-rose-400">
                {overdueOrders.length}{" "}
                {overdueOrders.length === 1 ? "book" : "books"}
              </span>{" "}
              overdue for return.
            </p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<IndianRupee className="h-6 w-6" />}
          variant="emerald"
        />
        <StatCard
          title="Active Rentals"
          value={activeOrders.length.toString()}
          icon={<TrendingUp className="h-6 w-6" />}
          variant="purple"
        />
        <StatCard
          title="Titles in Catalog"
          value={libraryBooksData.length.toString()}
          icon={<BookOpen className="h-6 w-6" />}
          variant="blue"
        />
        <StatCard
          title="Books in Stock"
          value={booksInStock.toString()}
          icon={<Users className="h-6 w-6" />}
          variant="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Revenue Over Time
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Actual earnings from rentals and purchases, by month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueByMonth.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm">
                No transactions recorded yet.
              </div>
            ) : (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueByMonth}
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
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
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
            )}
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Order Status
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Borrowed, purchased, and returned orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusBreakdown}
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
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Pending Returns and Quick Actions */}
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
                  Active rentals awaiting return. Only the borrower can mark
                  their own order returned.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
                asChild
              >
                <Link href="/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeOrders.length === 0 ? (
              <div className="p-10 text-center text-zinc-400 text-sm">
                No active rentals right now.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Book
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Borrower
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Due
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOrders.slice(0, 8).map((order) => {
                      const isOverdue =
                        now !== null &&
                        order.expectedReturnDate &&
                        new Date(order.expectedReturnDate as string).getTime() <
                          now;
                      return (
                        <tr
                          key={order.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-white">
                            {order.book?.name || "Unknown Book"}
                          </td>
                          <td className="px-6 py-4 text-zinc-300">
                            {order.user?.name || "Unknown Borrower"}
                          </td>
                          <td className="px-6 py-4">
                            {isOverdue ? (
                              <span className="bg-rose-500/10 text-rose-400 py-1 px-2.5 rounded-full text-xs font-medium border border-rose-500/20">
                                Overdue
                              </span>
                            ) : (
                              <span className="bg-amber-500/10 text-amber-400 py-1 px-2.5 rounded-full text-xs font-medium border border-amber-500/20">
                                {order.expectedReturnDate
                                  ? new Date(
                                      order.expectedReturnDate as string,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
            <Button
              asChild
              className="w-full justify-start h-12 bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 transition-colors border border-white/5"
            >
              <Link href="/inventory">
                <BookOpen className="mr-3 h-5 w-5" /> Manage Inventory
              </Link>
            </Button>
            <Button
              asChild
              className="w-full justify-start h-12 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors border border-white/5"
            >
              <Link href="/members">
                <Users className="mr-3 h-5 w-5" /> View Members
              </Link>
            </Button>
            <Button
              asChild
              className="w-full justify-start h-12 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-colors border border-white/5"
            >
              <Link href="/financials">
                <IndianRupee className="mr-3 h-5 w-5" /> View Financials
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
