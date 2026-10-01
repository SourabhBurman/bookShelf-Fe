"use client";

import { BookCard, Book } from "@/components/ui/BookCard";
import { Heart } from "lucide-react";
import { useGetSavedBooksQuery } from "@/graphql/savedBook/hooks";

export default function SavedBooksPage() {
  const { savedBooks, savedBooksLoading } = useGetSavedBooksQuery();

  if (savedBooksLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const books: Book[] = savedBooks
    .filter((s): s is NonNullable<typeof s> => !!s?.book)
    .map((s) => ({
      id: s.book!.id || "",
      title: s.book!.name || "Unknown Title",
      author: s.book!.author || "Unknown Author",
      category: s.book!.genre || "Uncategorized",
      coverImage:
        s.book!.coverImage ||
        `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop&random=${s.book!.id}`,
      rentPrice: s.book!.rentPrice || 2.99,
      purchasePrice: s.book!.cost || 14.99,
      rating: s.book!.averageRating ?? null,
      available: (s.book!.totalAvailableCopies || 0) > 0,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Heart className="h-8 w-8 text-purple-400" />
          Saved Books
        </h1>
        <p className="text-zinc-400 mt-1">
          {books.length} {books.length === 1 ? "book" : "books"}{" "}
          you&apos;ve saved for later.
        </p>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
          <Heart className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">
            No saved books yet
          </h3>
          <p className="text-zinc-500 max-w-sm">
            Tap the heart icon on any book to save it here for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <div key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
