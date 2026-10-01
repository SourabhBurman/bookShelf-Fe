"use client";

import { useEffect, useMemo } from "react";
import { BookCard, Book } from "@/components/ui/BookCard";
import { StatCard } from "@/components/ui/StatCard";
import { AlertCircle, Clock, IndianRupee, Package, Search, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useGetOrdersQuery } from "@/graphql/order/hooks";
import { useGetBooksQuery } from "@/graphql/book/hooks";
import { OrderStatus } from "@/graphql/generated/graphql";

export function UserDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchOrders, ordersData, ordersLoading, ordersError } =
    useGetOrdersQuery();
  const { getBooks, data: booksData, loading: booksLoading, error: booksError } =
    useGetBooksQuery();

  useEffect(() => {
    fetchOrders();
    getBooks();
  }, [fetchOrders, getBooks]);

  const activeRentalsCount = useMemo(
    () => ordersData.filter((o) => o.current_status === OrderStatus.Borrowed).length,
    [ordersData],
  );

  const trendingBooks: Book[] = useMemo(() => {
    return (booksData?.getBooks ?? []).slice(0, 4).map((b) => ({
      id: b?.id || "",
      title: b?.name || "Unknown Title",
      author: b?.author || "Unknown Author",
      category: b?.genre || "Uncategorized",
      coverImage:
        b?.coverImage ||
        `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop&random=${b?.id}`,
      rentPrice: b?.rentPrice || 2.99,
      purchasePrice: b?.cost || 14.99,
      rating: b?.averageRating ?? null,
      available: (b?.totalAvailableCopies || 0) > 0,
    }));
  }, [booksData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/books");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-zinc-400 animate-pulse text-sm">
            Authorizing member session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero & Search */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-white/10 p-5 sm:p-6 mb-8 shadow-xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row-reverse md:items-center justify-between gap-2 sm:gap-6">
          <div className="flex-1 text-left md:text-right">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1.5">
              What will you read{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                next?
              </span>
            </h2>
            <p className="text-zinc-300 text-sm max-w-lg md:ml-auto">
              Explore books from local libraries. Rent or purchase your next
              favorite story instantly.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="relative flex items-center w-full md:w-80 lg:w-96 shrink-0 group"
          >
            <div className="absolute left-3 text-zinc-400 group-focus-within:text-purple-400 transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author..."
              className="pl-9 h-10 bg-zinc-950/60 border-white/20 text-white placeholder:text-zinc-500 rounded-full focus-visible:ring-purple-500/50 text-sm shadow-inner backdrop-blur-md"
            />
            <Button
              type="submit"
              className="absolute right-1 h-8 rounded-full bg-purple-500 hover:bg-purple-600 text-white px-4 text-xs font-semibold"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Active Rentals"
          value={ordersLoading || ordersError ? "—" : activeRentalsCount.toString()}
          icon={<Clock className="h-6 w-6" />}
          variant="purple"
        />
        <StatCard
          title="Account Balance"
          value={`$${(user.balance ?? 0).toFixed(2)}`}
          icon={<IndianRupee className="h-6 w-6" />}
          variant="emerald"
        />
        <StatCard
          title="Orders Placed"
          value={ordersLoading ? "—" : ordersData.length.toString()}
          icon={<Package className="h-6 w-6" />}
          variant="blue"
        />
      </div>

      {/* Trending Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
            <h3 className="text-2xl font-bold text-white tracking-tight">
              From the Catalog
            </h3>
          </div>
          <Button
            variant="link"
            asChild
            className="text-purple-400 hover:text-purple-300"
          >
            <Link href="/books">View all</Link>
          </Button>
        </div>

        {booksLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : booksError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
            Couldn&apos;t load the catalog right now.
          </div>
        ) : trendingBooks.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No books are available yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingBooks.map((book) => (
              <div key={book.id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
