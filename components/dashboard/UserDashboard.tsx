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
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Trending Now
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_TRENDING_BOOKS.map((book) => (
            <div key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
