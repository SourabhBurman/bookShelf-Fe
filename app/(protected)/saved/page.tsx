"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Heart, Bookmark } from "lucide-react";
import { BookCard, Book } from "@/components/ui/BookCard";

const MOCK_SAVED_BOOKS: Book[] = [
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
];

export default function UserSavedPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  let role = "user";
  if (user?.role) {
    role =
      typeof user.role === "string"
        ? user.role
        : String(user.role.type || user.role).toLowerCase();
  }

  if (role !== "user") {
    return (
      <DashboardShell userTitle="Unauthorized">
        <Forbidden />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell userTitle="Saved Books">
      <div className="flex flex-col gap-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-purple-400" /> My Reading List
          </h2>
          <p className="text-zinc-400 mt-2">
            Books you&apos;ve bookmarked to rent or buy later.
          </p>
        </div>

        {MOCK_SAVED_BOOKS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_SAVED_BOOKS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-2xl bg-zinc-900/30">
            <Heart className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium text-zinc-300">
              No saved books yet
            </h3>
            <p className="text-zinc-500 mt-2 max-w-sm">
              When you find a book you like, tap the heart icon to save it here
              for later.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
