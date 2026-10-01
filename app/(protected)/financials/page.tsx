"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles, TransactionType } from "@/graphql/generated/graphql";
import { AlertCircle, ArrowUpRight, IndianRupee, RotateCcw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetLibraryOrdersQuery } from "@/graphql/order/hooks";

type FlatTransaction = {
  id: string;
  orderId: string;
  bookName: string;
  type: TransactionType | null;
  amount: number;
  date: Date | null;
  paymentStatus: string | null;
};

export default function OwnerFinancialsPage() {
  const { user, isLoading } = useAuth();
  const {
    fetchLibraryOrders,
    libraryOrdersData,
    libraryOrdersLoading,
    libraryOrdersError,
  } = useGetLibraryOrdersQuery();

  useEffect(() => {
    fetchLibraryOrders();
  }, [fetchLibraryOrders]);

  const transactions: FlatTransaction[] = useMemo(() => {
    const flat: FlatTransaction[] = [];
    for (const o of libraryOrdersData) {
      for (const t of o.transactions || []) {
        if (!t) continue;
        flat.push({
          id: t.id || `${o.id}-${flat.length}`,
          orderId: o.id || "",
          bookName: o.book?.name || "Unknown Book",
          type: t.transactionType,
          amount: (t.amount || 0) / 100,
          date: t.transactionDate ? new Date(t.transactionDate as string) : null,
          paymentStatus: t.paymentStatus,
        });
      }
    }
    return flat.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }, [libraryOrdersData]);

  const totalRevenue = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const revenueByMonth = useMemo(() => {
    const buckets = new Map<string, { rentals: number; purchases: number }>();
    for (const t of transactions) {
      if (!t.date) continue;
      const key = t.date.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
      const bucket = buckets.get(key) || { rentals: 0, purchases: 0 };
      if (t.type === TransactionType.Borrow) bucket.rentals += t.amount;
      else if (t.type === TransactionType.Purchase) bucket.purchases += t.amount;
      buckets.set(key, bucket);
    }
    return Array.from(buckets.entries()).map(([name, v]) => ({ name, ...v }));
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (user?.role?.type !== User_Roles.LibraryOwner) {
    return <Forbidden />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Charts & Balances */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Revenue Breakdown
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Actual earnings by month, split by rentals vs. purchases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueByMonth.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-zinc-500 text-sm">
                {libraryOrdersLoading
                  ? ""
                  : "No transactions recorded yet."}
              </div>
            ) : (
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByMonth}>
                    <defs>
                      <linearGradient
                        id="colorRentals"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient
                        id="colorPurchases"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#52525b"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#52525b"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#3f3f46",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rentals"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorRentals)"
                    />
                    <Area
                      type="monotone"
                      dataKey="purchases"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorPurchases)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-emerald-400 font-medium">
                Total Revenue
              </CardDescription>
              <CardTitle className="text-4xl text-white font-bold">
                $
                {totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-emerald-400 text-sm mt-2">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>Across {transactions.length} transactions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400 font-medium">
                Library Balance
              </CardDescription>
              <CardTitle className="text-2xl text-white font-bold">
                ${(user?.library_owned?.balance ?? 0).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-zinc-500 text-sm mt-2">
                <IndianRupee className="h-4 w-4 mr-1" />
                <span>As recorded on your library account</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white text-lg font-semibold">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {libraryOrdersLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : libraryOrdersError ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">
                Couldn&apos;t load transactions
              </p>
              <p className="text-zinc-500 text-sm mb-4 break-all">
                {libraryOrdersError.message}
              </p>
              <button
                onClick={() => fetchLibraryOrders()}
                className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-zinc-400">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Book</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.slice(0, 20).map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {tx.bookName}
                      </td>
                      <td className="px-6 py-4 text-zinc-300 capitalize">
                        {tx.type?.toLowerCase() || "—"}
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-400">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {tx.date ? tx.date.toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            tx.paymentStatus?.toLowerCase() === "completed" ||
                            tx.paymentStatus?.toLowerCase() === "succeeded"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {tx.paymentStatus || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
