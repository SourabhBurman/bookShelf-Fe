"use client";

import MyLoading from "@/components/myLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderStatus } from "@/graphql/generated/graphql";
import { useGetOrdersQuery } from "@/graphql/order/hooks";
import {
  BookOpen,
  CheckCircle2,
  ListFilter,
  Clock,
  ArrowRight,
  Receipt,
  AlertTriangle,
  Library,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function UserOrdersPage() {
  const { fetchOrders, ordersLoading, ordersError, ordersData } =
    useGetOrdersQuery();

  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PAST">("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  if (ordersLoading) return <MyLoading />;
  if (ordersError?.message)
    return <div>Error fetching orders: {ordersError?.message}</div>;

  const activeRentals = ordersData
    .filter((o) => o.current_status === OrderStatus.Borrowed)
    .map((o) => {
      let dueIn = "N/A";
      let status = "Active";
      if (o.expectedReturnDate) {
        const diffTime =
          new Date(o.expectedReturnDate as Date).getTime() -
          new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          dueIn = "Overdue";
          status = "Overdue";
        } else {
          dueIn = `${diffDays} days`;
        }
      }
      return {
        id: o.id || "",
        bookTitle: o.book?.name || "Unknown Book",
        author: o.book?.author || "Unknown Author",
        library: "Local Library",
        dueIn,
        status,
        image:
          o.book?.coverImage ||
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
      };
    });

  const allOrders = ordersData.map((o) => {
    const isActive = o.current_status === OrderStatus.Borrowed;
    return {
      id: o.id || "",
      bookTitle: o.book?.name || "Unknown Book",
      status: o.current_status,
      isActive,
      date: isActive
        ? o.expectedReturnDate
          ? new Date(o.expectedReturnDate as Date).toLocaleDateString()
          : "N/A"
        : o.transactions?.[0]?.transactionDate
          ? new Date(
              o.transactions[0].transactionDate as Date,
            ).toLocaleDateString()
          : "N/A",
      fee: o.transactions?.[0]?.amount
        ? `₹${o.transactions[0].amount / 100}`
        : "N/A",
      transactions: o.transactions || [],
    };
  });

  const filteredOrders = allOrders.filter((o) => {
    if (filter === "ACTIVE") return o.isActive;
    if (filter === "PAST") return !o.isActive;
    return true;
  });

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-20 pt-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-transparent blur-3xl -z-10" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-900/20 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Library className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight">
              My Library
            </h2>
          </div>
          <p className="text-zinc-400 text-sm pl-[3.25rem]">
            Manage your active rentals and review your past reading journey.
          </p>
        </div>
      </div>

      {/* Active Rentals Horizontal Scroll */}
      {activeRentals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Currently Reading
            </h3>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {activeRentals.map((rental) => (
              <Card
                key={rental.id}
                className="bg-zinc-900/40 border-white/5 backdrop-blur-xl overflow-hidden group hover:border-purple-500/30 hover:shadow-[0_4px_20px_rgba(168,85,247,0.1)] transition-all min-w-[320px] max-w-[320px] snap-center shrink-0"
              >
                <CardContent className="p-4 flex gap-4 h-full">
                  <div className="w-20 shrink-0 relative rounded-md overflow-hidden shadow-lg border border-white/10">
                    <img
                      src={rental.image}
                      alt={rental.bookTitle}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h3 className="text-sm font-bold text-white truncate mb-0.5 group-hover:text-purple-300 transition-colors">
                        {rental.bookTitle}
                      </h3>
                      <p className="text-zinc-400 text-xs truncate">
                        {rental.author}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                          rental.status === "Overdue"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                        }`}
                      >
                        {rental.status === "Overdue" ? (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        ) : null}
                        {rental.dueIn}
                      </span>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5"
                      >
                        Read
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Slick Table Container for All Orders */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-zinc-400" />
            All Orders List
          </h3>

          {/* Slick Pill Filter */}
          <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/10 shadow-inner overflow-hidden relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter("ALL")}
              className={`rounded-full px-4 h-8 transition-all duration-300 text-xs font-medium ${
                filter === "ALL"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-600"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter("ACTIVE")}
              className={`rounded-full px-4 h-8 transition-all duration-300 text-xs font-medium ${
                filter === "ACTIVE"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-600"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Active
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter("PAST")}
              className={`rounded-full px-4 h-8 transition-all duration-300 text-xs font-medium ${
                filter === "PAST"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-600"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Past
            </Button>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="text-xs text-zinc-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-2 font-semibold">Order ID</th>
                <th className="px-5 py-2 font-semibold">Book Title</th>
                <th className="px-5 py-2 font-semibold">Date (Due/Return)</th>
                <th className="px-5 py-2 font-semibold text-center">Status</th>
                <th className="px-5 py-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="group bg-zinc-900/40 hover:bg-zinc-800/60 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative"
                >
                  <td className="px-5 py-3 text-zinc-400 font-medium whitespace-nowrap border-y border-l border-white/5 group-hover:border-purple-500/20 first:rounded-l-xl transition-colors relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-purple-500 group-hover:h-3/4 transition-all duration-300 rounded-r-full opacity-0 group-hover:opacity-100" />
                    <span className="font-mono text-[11px] bg-black/40 px-2 py-1 rounded text-zinc-300 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                      {order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-5 py-3 border-y border-white/5 group-hover:border-purple-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-md bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-colors">
                        <BookOpen className="h-3.5 w-3.5 text-zinc-400 group-hover:text-purple-400" />
                      </div>
                      <span className="text-white font-medium tracking-tight group-hover:text-purple-100 transition-colors">
                        {order.bookTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-400 whitespace-nowrap border-y border-white/5 group-hover:border-purple-500/20 transition-colors">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center border-y border-white/5 group-hover:border-purple-500/20 transition-colors">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm shadow-sm transition-all uppercase tracking-wider ${
                        order.isActive
                          ? "bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)] group-hover:bg-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] group-hover:bg-emerald-500/20"
                      }`}
                    >
                      {order.isActive ? (
                        <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="mr-1.5 h-3 w-3" />
                      )}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right border-y border-r border-white/5 group-hover:border-purple-500/20 last:rounded-r-xl transition-colors">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 text-zinc-300 border border-white/10 hover:border-purple-500/30 transition-all rounded-md group/btn"
                        >
                          <ListFilter className="mr-1.5 h-3.5 w-3.5" />
                          Transactions
                          <ArrowRight className="ml-1.5 h-3 w-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-950/95 backdrop-blur-2xl border-white/10 text-white sm:max-w-lg shadow-[0_0_50px_rgba(168,85,247,0.15)] rounded-2xl">
                        <DialogHeader className="border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                              <Receipt className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                              <DialogTitle className="text-xl">
                                Transaction History
                              </DialogTitle>
                              <DialogDescription className="text-zinc-400 mt-1">
                                Timeline for{" "}
                                <span className="text-white font-medium">
                                  {order.bookTitle}
                                </span>
                              </DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>

                        <div className="mt-6 flex flex-col gap-4 px-2">
                          {order.transactions &&
                          order.transactions.length > 0 ? (
                            <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pb-4">
                              {order.transactions.map((t, idx) => {
                                const isLatest = idx === 0;
                                return (
                                  <div
                                    key={idx}
                                    className="relative pl-8 group/timeline"
                                  >
                                    <div
                                      className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 transition-colors ${isLatest ? "bg-zinc-900 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]" : "bg-zinc-900 border-zinc-600 group-hover/timeline:border-purple-500/50"}`}
                                    />

                                    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 group-hover/timeline:bg-white/[0.04] transition-colors relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/timeline:opacity-100 transition-opacity" />

                                      <div className="flex items-center justify-between relative z-10">
                                        <span className="font-bold text-white capitalize tracking-tight text-base">
                                          {t?.transactionType?.toLowerCase()}
                                        </span>
                                        {t?.amount ? (
                                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md text-sm border border-emerald-500/20 shadow-sm flex items-center gap-1">
                                            ₹{t.amount / 100}
                                          </span>
                                        ) : null}
                                      </div>
                                      <span className="text-sm text-zinc-500 font-medium flex items-center gap-1.5 relative z-10">
                                        <Clock className="h-3.5 w-3.5" />
                                        {t?.transactionDate
                                          ? new Date(
                                              t?.transactionDate as string,
                                            ).toLocaleString(undefined, {
                                              dateStyle: "medium",
                                              timeStyle: "short",
                                            })
                                          : "Unknown date"}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                              <Receipt className="h-8 w-8 text-zinc-600 mb-3" />
                              <h3 className="text-zinc-300 font-medium">
                                No Transactions Found
                              </h3>
                              <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                                There are no recorded transactions for this
                                order yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                        <BookOpen className="h-8 w-8 text-zinc-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-300">
                        No orders found
                      </h3>
                      <p className="text-zinc-500 mt-1">
                        There are no orders matching your current filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
