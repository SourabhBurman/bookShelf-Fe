import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
      <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
        <CheckCircle2 className="h-12 w-12 text-green-400" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
        Payment Successful!
      </h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        Your transaction was processed successfully. The library has been notified and your book is now tracked in your orders.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/orders" className="flex-1">
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg">
            View My Orders
          </Button>
        </Link>
        <Link href="/books" className="flex-1">
          <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-zinc-300">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse More
          </Button>
        </Link>
      </div>
    </div>
  );
}
