"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building,
  Search,
  BookOpen,
  ArrowRight,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetLibrariesQuery } from "@/graphql/library/hooks";

type LibraryRow = { id: string; name: string; address: string };

export function UserLibraries() {
  const { data, loading, error, refetch } = useGetLibrariesQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const libraries: LibraryRow[] = useMemo(() => {
    return (data?.getLibraries ?? [])
      .filter((lib): lib is NonNullable<typeof lib> => !!lib?.id)
      .map((lib) => ({
        id: lib.id as string,
        name: lib.name || "Untitled Library",
        address: lib.address || "Address not listed",
      }));
  }, [data]);

  const filteredLibraries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return libraries;
    return libraries.filter(
      (lib) =>
        lib.name.toLowerCase().includes(q) ||
        lib.address.toLowerCase().includes(q),
    );
  }, [libraries, searchTerm]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-rose-500/20">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Couldn&apos;t load libraries
        </h2>
        <p className="text-zinc-400 max-w-md mb-8">
          We had trouble fetching libraries from our servers. Please try
          again or check back later.
          <br />
          <span className="text-rose-400/80 text-sm mt-2 block break-all">
            Error: {error.message}
          </span>
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl p-6 sm:p-10 bg-gradient-to-br from-purple-900/30 via-zinc-900 to-zinc-950">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Libraries{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            on BookShelf
          </span>
        </h2>
        <p className="text-zinc-300 max-w-xl text-lg mb-8">
          Browse every library on the platform and start borrowing from
          their collections.
        </p>

        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search libraries by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-zinc-950/80 border-white/20 text-white placeholder:text-zinc-400 rounded-2xl focus-visible:ring-purple-500/50 text-md shadow-xl backdrop-blur-xl"
          />
        </div>
      </div>

      {/* Library Cards Grid */}
      {filteredLibraries.length === 0 ? (
        <div className="py-20 text-center text-zinc-400">
          {searchTerm
            ? "No libraries match your search."
            : "No libraries are on the platform yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLibraries.map((lib) => (
            <Card
              key={lib.id}
              className="h-full bg-zinc-900/40 border-white/5 backdrop-blur-xl overflow-hidden group hover:border-purple-500/40 transition-colors duration-300 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]"
            >
              <div className="h-32 w-full relative flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <Building className="h-12 w-12 text-purple-400/60" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {lib.name}
                </h3>
                <p className="text-zinc-400 text-sm mb-6">{lib.address}</p>

                <div className="pt-4 border-t border-white/5">
                  {/* Books aren't scoped per-library in the backend yet
                      (getBooksByLibrary exists but there's no per-library
                      route), so this opens the full catalog for now. */}
                  <Link href="/books" className="block">
                    <Button className="w-full bg-white/5 hover:bg-purple-500 text-white border border-white/10 hover:border-purple-500 transition-all rounded-xl h-10 px-5 group/btn">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Catalog
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
