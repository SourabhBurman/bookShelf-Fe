"use client";

import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";

export function Forbidden() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="h-24 w-24 rounded-full bg-rose-500/10 flex items-center justify-center mb-8 border border-rose-500/20 shadow-[0_0_50px_-12px_rgba(244,63,94,0.3)]">
        <ShieldAlert className="h-12 w-12 text-rose-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
        Access Denied
      </h2>
      <p className="text-zinc-400 max-w-md mb-8 text-lg">
        You do not have the required permissions to view this sector of the
        platform. If you believe this is an error, contact system
        administration.
      </p>
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-8 h-12 shadow-xl shadow-purple-500/20"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return to Dashboard
      </Button>
    </div>
  );
}
