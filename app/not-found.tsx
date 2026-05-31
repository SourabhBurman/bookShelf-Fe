"use client";

import Link from "next/link";
import { Ghost, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-zinc-950 items-center justify-center p-4 selection:bg-purple-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent blur-xl rounded-3xl" />

        <div className="relative bg-zinc-900/50 border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-purple-900/10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
            <div className="relative h-24 w-24 bg-zinc-950 border border-white/10 rounded-full flex items-center justify-center shadow-inner">
              <Ghost className="h-10 w-10 text-purple-400 animate-pulse" />
            </div>

            {/* 404 Badge */}
            <div className="absolute -bottom-2 -right-2 bg-zinc-950 border border-white/10 px-3 py-1 rounded-full shadow-lg">
              <span className="text-sm font-mono font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                404
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-zinc-400 mb-8 max-w-[280px] leading-relaxed">
            The page you&apos;re looking for has vanished into the void or never
            existed at all.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25">
                <Home className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
