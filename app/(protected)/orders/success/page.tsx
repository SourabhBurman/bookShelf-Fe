"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useGetOrdersQuery } from "@/graphql/order/hooks";

export default function OrderSuccessPage() {
  const { fetchOrders, ordersData, ordersLoading, ordersError } =
    useGetOrdersQuery();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // createPaymentIntent doesn't return an order id, so there's nothing to
  // look up directly. As the closest real confirmation available, we show
  // whichever order has the most recent transaction on file.
  const latestOrder = useMemo(() => {
    let newest: (typeof ordersData)[number] | null = null;
    let newestTime = -Infinity;
    for (const o of ordersData) {
      for (const t of o.transactions || []) {
        if (!t?.transactionDate) continue;
        const time = new Date(t.transactionDate as string).getTime();
        if (time > newestTime) {
          newestTime = time;
          newest = o;
        }
      }
    }
    return newest;
  }, [ordersData]);

  const verified = !ordersLoading && !ordersError && !!latestOrder;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
      {ordersLoading ? (
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-8" />
      ) : verified ? (
        <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-12 w-12 text-green-400" />
        </div>
      ) : (
        <div className="h-24 w-24 rounded-full bg-amber-500/20 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
          <AlertTriangle className="h-12 w-12 text-amber-400" />
        </div>
      )}

      <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
        {ordersLoading
          ? "Confirming your order..."
          : verified
            ? "Payment Successful!"
            : "We couldn't confirm your order yet"}
      </h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        {ordersLoading
          ? "Checking your order history for the transaction we just placed."
          : verified
            ? `"${latestOrder?.book?.name || "Your book"}" is now tracked in your orders.`
            : "Your payment may still be processing, or something went wrong recording it. Check your order history in a moment — if it's still missing, contact support."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/orders" className="flex-1">
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg">
            View My Orders
          </Button>
        </Link>
        <Link href="/books" className="flex-1">
          <Button
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 text-zinc-300"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse More
          </Button>
        </Link>
      </div>
    </div>
  );
}
