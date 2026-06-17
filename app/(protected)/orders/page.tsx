"use client";

import MyLoading from "@/components/myLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatus, TransactionType } from "@/graphql/generated/graphql";
import { useGetOrdersQuery } from "@/graphql/order/hooks";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  History,
  Library,
} from "lucide-react";
import { useEffect } from "react";

export default function UserOrdersPage() {
  const { fetchOrders, ordersLoading, ordersError, ordersData } =
    useGetOrdersQuery();

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

  const pastOrders = ordersData
    .filter(
      (o) =>
        o.current_status === OrderStatus.Returned ||
        o.current_status === OrderStatus.Purchased ||
        o.transactions?.[0]?.transactionType === TransactionType.Purchase,
    )
    .map((o) => ({
      id: o.id || "",
      bookTitle: o.book?.name || "Unknown Book",
      returnDate: o.transactions?.[0]?.transactionDate
        ? new Date(
            o.transactions[0].transactionDate as Date,
          ).toLocaleDateString()
        : "N/A",
      status:
        o.current_status === OrderStatus.Purchased ? "Purchased" : "Returned",
      fee: o.transactions?.[0]?.amount
        ? `₹${o.transactions[0].amount / 100}`
        : "N/A",
    }));

  return (
    <div className="flex flex-col gap-10">
      {/* Active Rentals */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Active Rentals
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {activeRentals.map((rental) => (
            <Card
              key={rental.id}
              className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden group hover:border-purple-500/30 transition-colors"
            >
              <CardContent className="p-0 flex flex-col sm:flex-row h-full">
                <div className="sm:w-32 h-40 sm:h-auto shrink-0 relative">
                  <img
                    src={rental.image}
                    alt={rental.bookTitle}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent sm:bg-gradient-to-t" />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {rental.bookTitle}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                          rental.status === "Overdue"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {rental.status === "Overdue" ? (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        ) : null}
                        {rental.dueIn}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">{rental.author}</p>
                    <p className="text-zinc-500 text-xs mt-2 flex items-center">
                      <Library className="mr-1 h-3 w-3" /> {rental.library}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600 text-white flex-1"
                    >
                      Read Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-white/10 hover:bg-white/5 text-white"
                    >
                      Return
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Order History */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <History className="h-6 w-6 text-zinc-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Order History
          </h2>
        </div>

        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Book</th>
                    <th className="px-6 py-4 font-medium">Return Date</th>
                    <th className="px-6 py-4 font-medium">Fee</th>
                    <th className="px-6 py-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pastOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-zinc-400 font-medium">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-zinc-500" />
                          <span className="text-white font-medium">
                            {order.bookTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {order.returnDate}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{order.fee}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          <CheckCircle2 className="mr-1.5 h-3 w-3" />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
