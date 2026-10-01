"use client";

import { BookCard, Book } from "@/components/ui/BookCard";
import { BookOpen, Search, AlertCircle, RotateCcw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetBooksQuery } from "@/graphql/book/hooks";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

function BooksExploreContent() {
  const { getBooks, data, loading, error } = useGetBooksQuery();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Search/category filtering happens client-side across the whole
    // catalog (see `books` below), so fetch it all in one page rather than
    // the backend's default of 10 — the UI paginates the filtered result.
    getBooks({ variables: { pagination: { pageNumber: 1, pageSize: 500 } } });
  }, [getBooks]);

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const categoryQuery = searchParams.get("category")?.toLowerCase() || "";

  // Local input state so typing feels instant; the URL (and therefore the
  // actual filtering below) only updates after a short debounce.
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) {
        params.set("q", searchInput);
      } else {
        params.delete("q");
      }
      router.replace(`/books?${params.toString()}`);
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Map GraphQL data to BookCard props and apply client-side filtering
  const books: Book[] = useMemo(() => {
    if (!data?.getBooks) return [];

    let mappedBooks = data.getBooks.map((b) => ({
      id: b?.id || "",
      title: b?.name || "Unknown Title",
      author: b?.author || "Unknown Author",
      category: b?.genre || "Uncategorized",
      coverImage:
        b?.coverImage ||
        `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop&random=${b?.id}`, // Mock unique cover
      rentPrice: b?.rentPrice || 2.99,
      purchasePrice: b?.cost || 14.99,
      rating: b?.averageRating ?? null,
      // Real, currently-borrowable stock across libraries — not the shared
      // catalog pool, which doesn't reflect what's actually available.
      available: (b?.totalAvailableCopies || 0) > 0,
    }));

    if (searchQuery) {
      mappedBooks = mappedBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery) ||
          b.author.toLowerCase().includes(searchQuery) ||
          b.category.toLowerCase().includes(searchQuery),
      );
    }

    if (categoryQuery && categoryQuery !== "all books") {
      mappedBooks = mappedBooks.filter(
        (b) => b.category.toLowerCase() === categoryQuery,
      );
    }

    return mappedBooks;
  }, [data, searchQuery, categoryQuery]);

  const [currentPage, setCurrentPage] = useState(1);

  // Jump back to page 1 whenever the active filters change, so a narrower
  // search doesn't leave the user stranded on a now out-of-range page.
  // (Adjusted during render rather than in an effect, per React's guidance
  // on deriving state from a prop/dependency change.)
  const filterKey = `${searchQuery}|${categoryQuery}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBooks = useMemo(
    () => books.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [books, safePage],
  );

  // Categories are derived from whatever genres actually exist in the
  // catalog — always in sync with real data instead of a hand-typed list
  // that can drift from the backend's genre values.
  const categories = useMemo(() => {
    const distinct = new Set<string>();
    (data?.getBooks ?? []).forEach((b) => {
      if (b?.genre) distinct.add(b.genre);
    });
    return ["All Books", ...Array.from(distinct).sort()];
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
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
          Oops! Something went wrong
        </h2>
        <p className="text-zinc-400 max-w-md mb-8">
          We had trouble fetching the catalog from our servers. Please try again
          or check back later.
          <br />
          <span className="text-rose-400/80 text-sm mt-2 block break-all">
            Error: {error.message}
          </span>
        </p>
        <button
          onClick={() =>
            getBooks({
              variables: { pagination: { pageNumber: 1, pageSize: 500 } },
            })
          }
          className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Sticky Header Section */}
      <div className="sticky top-16 z-30 bg-zinc-950/90 backdrop-blur-xl pb-6 pt-10 -mt-10 -mx-4 px-4 sm:-mx-8 sm:px-8 border-b border-white/5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              Explore Books
            </h1>
            <p className="text-zinc-400 mt-1">
              {books.length} {books.length === 1 ? "book" : "books"} found
              {searchQuery && ` for "${searchQuery}"`}
              {categoryQuery && ` in ${categoryQuery}`}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Filter current view..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 bg-zinc-900/50 border-white/10 text-white rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive =
              (cat === "All Books" && !categoryQuery) ||
              cat.toLowerCase() === categoryQuery;

            return (
              <button
                key={cat}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (cat === "All Books") {
                    params.delete("category");
                  } else {
                    params.set("category", cat.toLowerCase());
                  }
                  router.push(`/books?${params.toString()}`);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                    : "bg-zinc-900/50 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
          <BookOpen className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No books found</h3>
          <p className="text-zinc-500 max-w-sm">
            We couldn&apos;t find any books matching your current filters. Try
            adjusting your search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedBooks.map((book) => (
              <div key={book.id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="pt-4"
          />
        </>
      )}
    </div>
  );
}

export default function BooksExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      }
    >
      <BooksExploreContent />
    </Suspense>
  );
}
