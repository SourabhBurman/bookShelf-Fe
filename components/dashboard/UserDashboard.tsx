"use client";

import { BookCard, Book } from "@/components/ui/BookCard";
import { StatCard } from "@/components/ui/StatCard";
import {
  Search,
  Home,
  Library,
  Heart,
  Bookmark,
  History,
  LayoutGrid,
  Clock,
  IndianRupee,
  Gem,
  Flame,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const MOCK_TRENDING_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    rentPrice: 2.99,
    purchasePrice: 14.99,
    rating: 4.8,
    available: true,
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    coverImage:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    rentPrice: 3.5,
    purchasePrice: 20.0,
    rating: 4.9,
    available: false,
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    category: "Sci-Fi",
    coverImage:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop",
    rentPrice: 4.0,
    purchasePrice: 25.0,
    rating: 4.7,
    available: true,
  },
  {
    id: "4",
    title: "Sapiens: A Brief History",
    author: "Yuval Noah Harari",
    category: "History",
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    rentPrice: 3.99,
    purchasePrice: 22.5,
    rating: 4.6,
    available: true,
  },
];

export function UserDashboard() {
  const { user, isLoading } = useAuth();

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-white/10 p-8 sm:p-12 mb-10 shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            What will you read{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              next?
            </span>
          </h2>
          <p className="text-zinc-300 text-lg mb-8 max-w-xl">
            Explore thousands of books from local libraries. Rent or purchase
            your next favorite story instantly.
          </p>

          <div className="relative flex items-center w-full max-w-lg group">
            <div className="absolute left-4 text-zinc-400 group-focus-within:text-purple-400 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search by title, author, or genre..."
              className="pl-12 h-14 bg-zinc-950/60 border-white/20 text-white placeholder:text-zinc-500 rounded-full focus-visible:ring-purple-500/50 text-md shadow-xl backdrop-blur-md"
            />
            <Button className="absolute right-1.5 h-11 rounded-full bg-purple-500 hover:bg-purple-600 text-white px-6">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Active Rentals"
          value="3"
          icon={<Clock className="h-6 w-6" />}
          variant="purple"
          trendLabel="2 due this week"
        />
        <StatCard
          title="Money Saved"
          value="$142.50"
          icon={<IndianRupee className="h-6 w-6" />}
          variant="emerald"
          trend={12}
        />
        <StatCard
          title="Books Read"
          value="24"
          icon={<Bookmark className="h-6 w-6" />}
          variant="blue"
          trend={8}
        />
        <StatCard
          title="Membership"
          value="Pro"
          icon={<Gem className="h-6 w-6" />}
          variant="amber"
        />
      </div>

      {/* Trending Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Trending Now
            </h3>
          </div>
          <Button
            variant="link"
            className="text-purple-400 hover:text-purple-300"
          >
            View all
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_TRENDING_BOOKS.map((book) => (
            <div key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>

      {/* Categories / Quick Links */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight mb-6">
          Browse Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            "Fantasy",
            "Sci-Fi",
            "Mystery",
            "Romance",
            "Non-Fiction",
            "Biography",
          ].map((cat) => (
            <div
              key={cat}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-800/80 p-4 transition-colors cursor-pointer hover:border-purple-500/30"
            >
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                  <LayoutGrid className="h-5 w-5 text-zinc-400 group-hover:text-purple-400" />
                </div>
                <span className="text-sm font-semibold text-zinc-300 group-hover:text-white">
                  {cat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
