"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  CircleX,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useGetPaymentStatusQuery } from "@/graphql/order/hooks";
import { PaymentStatus } from "@/graphql/generated/graphql";

const POLL_INTERVAL_MS = 3000;
// Card payments settle within seconds; past this, stop polling and tell
// the user they'll be notified instead (the socket push still lands here
// if they stay on the page).
const GIVE_UP_AFTER_MS = 60000;

type View = "missing" | "pending" | "slow" | "paid" | "failed" | "error";

function SuccessIcon({ view }: { view: View }) {
  if (view === "pending") {
    return (
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-8" />
    );
  }
  if (view === "paid") {
    return (
      <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
        <CheckCircle2 className="h-12 w-12 text-green-400" />
      </div>
    );
  }
  if (view === "failed") {
    return (
      <div className="h-24 w-24 rounded-full bg-rose-500/20 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
        <CircleX className="h-12 w-12 text-rose-400" />
      </div>
    );
  }
  const Icon = view === "slow" ? Clock : AlertTriangle;
  return (
    <div className="h-24 w-24 rounded-full bg-amber-500/20 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
      <Icon className="h-12 w-12 text-amber-400" />
    </div>
  );
}

function OrderSuccessContent() {
  // Set by the checkout modal, or by Stripe itself when a payment method
  // redirects back to return_url.
  const paymentIntentId = useSearchParams().get("payment_intent");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!paymentIntentId) return;
    const timer = setTimeout(() => setTimedOut(true), GIVE_UP_AFTER_MS);
    return () => clearTimeout(timer);
  }, [paymentIntentId]);

  // Stripe.js already accepted the payment by the time we get here, but
  // only the backend's webhook settles it — wait for that. A live
  // `payment_status` socket push refetches this query instantly; polling
  // covers a dropped socket or a reload.
  const [settled, setSettled] = useState(false);
  const { paymentStatus, paymentStatusError } = useGetPaymentStatusQuery(
    paymentIntentId,
    settled || timedOut ? 0 : POLL_INTERVAL_MS,
  );
  const status = paymentStatus?.paymentStatus;
  const isSettled =
    status === PaymentStatus.Paid || status === PaymentStatus.Failed;
  if (isSettled !== settled) {
    setSettled(isSettled);
  }

  let view: View;
  if (!paymentIntentId) view = "missing";
  else if (status === PaymentStatus.Paid) view = "paid";
  else if (status === PaymentStatus.Failed) view = "failed";
  else if (paymentStatusError && !paymentStatus) view = "error";
  else if (timedOut) view = "slow";
  else view = "pending";

  const bookName = paymentStatus?.bookName || "Your book";
  const copy: Record<View, { title: string; body: string }> = {
    pending: {
      title: "Confirming your payment...",
      body: "Waiting for the payment provider to confirm. This usually takes a few seconds.",
    },
    slow: {
      title: "Still processing",
      body: "Your payment hasn't been confirmed yet. Some payment methods take a few minutes — we'll notify you as soon as it's settled, so you can safely leave this page.",
    },
    paid: {
      title: "Payment Successful!",
      body: `"${bookName}" is now tracked in your orders.`,
    },
    failed: {
      title: "Payment failed",
      body: `The payment for "${bookName}" didn't go through, so the order was cancelled. You can try again from the book's page.`,
    },
    error: {
      title: "We couldn't find this payment",
      body: "Check your order history in a moment — if it's still missing, contact support.",
    },
    missing: {
      title: "No payment to confirm",
      body: "Open your order history to see the status of your orders.",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
      <SuccessIcon view={view} />

      <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
        {copy[view].title}
      </h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">{copy[view].body}</p>

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

export default function OrderSuccessPage() {
  // useSearchParams needs a Suspense boundary so the route can still be
  // prerendered (see Next's useSearchParams docs).
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
