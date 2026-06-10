"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Library,
  Share2,
  Heart,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetLibrariesQuery } from "@/graphql/library/hooks";
import { useMutation, useQuery } from "@apollo/client/react";
import { PLACE_ORDER } from "@/graphql/order/mutations";
import MyLoading from "@/components/myLoading";
import { GetBookByIdDocument } from "@/graphql/book/queries.generated";

// Placeholder data since we don't have DB context here
const DEFAULT_BOOK_VALUES = {
  id: "1",
  title: "The Midnight Library",
  author: "Matt Haig",
  description:
    "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
  coverImage:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
  category: "Fiction",
  rating: 4.8,
  reviewsCount: 12450,
  pages: 304,
  publisher: "Viking",
  publishedDate: "2020-08-13",
  rentPrice: 2.99,
  purchasePrice: 14.99,
  quantityAvailable: 0,
};

const MOCK_REVIEWS = [
  {
    user: "Sarah Jenkins",
    avatar: "SJ",
    Initials: true,
    rating: 5,
    date: "Oct 12, 2023",
    text: "Absolutely loved this! The concept was mind-blowing and the execution was perfect.",
  },
  {
    user: "David Miller",
    avatar: "DM",
    Initials: true,
    rating: 4,
    date: "Oct 05, 2023",
    text: "Great read. Pacing was a bit slow in the middle, but the ending tied everything beautifully.",
  },
];

export default function BookDetailPage() {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [transactionType, setTransactionType] = useState<"BORROW" | "PURCHASE">(
    "BORROW",
  );
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id as string;

  const { data: bookData, loading: bookLoading } = useQuery(
    GetBookByIdDocument,
    {
      variables: { id: bookId },
      skip: !bookId,
    },
  );

  const fetchedBook = bookData?.getBook;

  const book = {
    id: fetchedBook?.id || DEFAULT_BOOK_VALUES.id,
    title: fetchedBook?.name || DEFAULT_BOOK_VALUES.title,
    // The backend might not have author in getBook by ID, but we fall back
    author: fetchedBook?.author || DEFAULT_BOOK_VALUES.author,
    description: fetchedBook?.description || DEFAULT_BOOK_VALUES.description,
    coverImage: fetchedBook?.coverImage || DEFAULT_BOOK_VALUES.coverImage,
    category: fetchedBook?.genre || DEFAULT_BOOK_VALUES.category,
    rating: DEFAULT_BOOK_VALUES.rating,
    reviewsCount: DEFAULT_BOOK_VALUES.reviewsCount,
    pages: DEFAULT_BOOK_VALUES.pages,
    publisher: DEFAULT_BOOK_VALUES.publisher,
    publishedDate:
      fetchedBook?.publishedDate || DEFAULT_BOOK_VALUES.publishedDate,
    rentPrice: fetchedBook?.rentPrice || DEFAULT_BOOK_VALUES.rentPrice,
    purchasePrice: fetchedBook?.cost || DEFAULT_BOOK_VALUES.purchasePrice,
    quantityAvailable:
      fetchedBook?.quantityAvailable ?? DEFAULT_BOOK_VALUES.quantityAvailable,
  };

  const isOutOfStock = book.quantityAvailable < 1;

  const { data: librariesData, loading: libsLoading } = useGetLibrariesQuery();
  const libraries = librariesData?.getLibraries || [];

  const [placeOrder, { loading: isPlacingOrder }] = useMutation(PLACE_ORDER, {
    onCompleted: () => {
      alert("Order placed successfully!");
      router.push("/orders");
    },
    onError: (err) => {
      alert(`Error placing order: ${err.message}`);
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedLibraryId) return;
    placeOrder({
      variables: {
        input: [
          {
            book: book.id, // Replace with actual book ID if fetched dynamically
            library: selectedLibraryId,
            transactionType: transactionType,
          },
        ],
      },
    });
  };

  if (bookLoading) return <MyLoading />;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-2">
        <Link
          href="/dashboard/user"
          className="hover:text-white transition-colors"
        >
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/dashboard/user?category=Fiction"
          className="hover:text-white transition-colors"
        >
          {book.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white font-medium truncate max-w-[200px]">
          {book.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 items-start">
        {/* LEFT COLUMN: Cover Image & At a Glance */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {/* Main Book Cover with Glassmorphic reflection effect */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Floating Actions on Cover */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
              <Button
                size="icon"
                variant="default"
                className={`rounded-full shadow-lg ${isWishlisted ? "bg-rose-500 hover:bg-rose-600" : "bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20"}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-white" : "text-white"}`}
                />
              </Button>
              <Button
                size="icon"
                variant="default"
                className="rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 shadow-lg text-white"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-xl p-4 divide-x divide-white/5 text-center">
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Pages
              </span>
              <span className="text-white font-medium mt-1">{book.pages}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Rating
              </span>
              <span className="text-white font-medium mt-1 flex items-center justify-center gap-1">
                {book.rating}{" "}
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Format
              </span>
              <span className="text-white font-medium mt-1">E-Book</span>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Details & Description (Spans more) */}
        <div className="lg:col-span-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* TEXT CONTENT */}
          <div className="xl:col-span-7 flex flex-col pt-2">
            <div className="mb-4">
              <span className="inline-flex text-xs font-semibold tracking-widest uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full mb-3">
                {book.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-zinc-400 font-medium">
                by{" "}
                <span className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors underline underline-offset-4 decoration-purple-500/30">
                  {book.author}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-5 w-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <div className="text-sm text-zinc-400">
                <span className="text-white font-medium">{book.rating}</span> (
                {book.reviewsCount.toLocaleString()} reviews)
              </div>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
              <h3 className="text-xl font-semibold text-white mb-3">
                About this book
              </h3>
              <p className="text-zinc-300 leading-relaxed text-[15px]">
                {book.description}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 border-t border-white/5 pt-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Customer Reviews
              </h3>
              <div className="space-y-6">
                {MOCK_REVIEWS.map((review, idx) => (
                  <div
                    key={idx}
                    className="border-b border-white/5 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xs font-semibold text-purple-300">
                          {review.avatar}
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm">
                            {review.user}
                          </h4>
                          <span className="text-xs text-zinc-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-300 text-sm pl-11 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Action Sticky Card */}
          <div className="xl:col-span-5">
            <div className="sticky top-24">
              <Card className="bg-zinc-900/80 border-white/10 backdrop-blur-xl shadow-2xl p-2 rounded-2xl overflow-hidden ring-1 ring-white/5">
                {/* Decorative border top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-zinc-400 font-medium">
                      Format: Printed Book
                    </span>
                    {isOutOfStock ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <ShieldCheck className="h-3.5 w-3.5" /> Fast Delivery
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 mb-6">
                    {/* RENT OPTION */}
                    <label
                      onClick={() => setTransactionType("BORROW")}
                      className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-colors ${transactionType === "BORROW" ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                    >
                      <input
                        type="radio"
                        name="purchaseType"
                        className="sr-only"
                        checked={transactionType === "BORROW"}
                        readOnly
                      />
                      <div
                        className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center ${transactionType === "BORROW" ? "border-purple-500 border-4 bg-zinc-950" : "border-zinc-600 bg-zinc-900"}`}
                      >
                        {transactionType === "BORROW" && (
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-medium uppercase tracking-wider mb-1 ${transactionType === "BORROW" ? "text-zinc-300" : "text-zinc-400"}`}
                        >
                          Rent Monthly
                        </span>
                        <span className="text-3xl font-bold text-white">
                          ₹{book.rentPrice}
                          <span className="text-sm font-medium text-zinc-500">
                            /mo
                          </span>
                        </span>
                      </div>
                    </label>

                    {/* BUY OPTION */}
                    <label
                      onClick={() => setTransactionType("PURCHASE")}
                      className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-colors ${transactionType === "PURCHASE" ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                    >
                      <input
                        type="radio"
                        name="purchaseType"
                        className="sr-only"
                        checked={transactionType === "PURCHASE"}
                        readOnly
                      />
                      <div
                        className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center ${transactionType === "PURCHASE" ? "border-purple-500 border-4 bg-zinc-950" : "border-zinc-600 bg-zinc-900"}`}
                      >
                        {transactionType === "PURCHASE" && (
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-medium uppercase tracking-wider mb-1 ${transactionType === "PURCHASE" ? "text-zinc-300" : "text-zinc-400"}`}
                        >
                          Buy Permanent
                        </span>
                        <span className="text-3xl font-bold text-white">
                          ₹{book.purchasePrice}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* LIBRARY SELECTION */}
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Library className="h-4 w-4 text-purple-400" /> Select a
                      Library:
                    </h4>
                    {libsLoading ? (
                      <div className="text-sm text-zinc-400 animate-pulse py-4 text-center border border-white/5 rounded-lg bg-zinc-900/50">
                        Searching nearby libraries...
                      </div>
                    ) : libraries.length === 0 ? (
                      <div className="text-sm text-rose-400 py-4 text-center border border-rose-500/10 rounded-lg bg-rose-500/5">
                        No libraries found in your area.
                      </div>
                    ) : (
                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {libraries.map((lib) => (
                          <label
                            key={lib?.id}
                            className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-colors ${selectedLibraryId === lib?.id ? "border-purple-500 bg-purple-500/10" : "border-white/5 bg-zinc-900/50 hover:bg-zinc-800"}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="library"
                                  className="hidden"
                                  checked={selectedLibraryId === lib?.id}
                                  onChange={() =>
                                    setSelectedLibraryId(lib?.id || "")
                                  }
                                />
                                <div
                                  className={`mt-0.5 shrink-0 h-4 w-4 rounded-full border flex items-center justify-center ${selectedLibraryId === lib?.id ? "border-purple-500" : "border-zinc-500"}`}
                                >
                                  {selectedLibraryId === lib?.id && (
                                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-white leading-none mb-1">
                                    {lib?.name}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    {lib?.address}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-400 shrink-0">
                                {transactionType === "BORROW"
                                  ? `₹${book.rentPrice}/mo`
                                  : `₹${book.purchasePrice}`}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    disabled={
                      !selectedLibraryId || isPlacingOrder || isOutOfStock
                    }
                    onClick={handlePlaceOrder}
                    className="w-full h-14 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>{" "}
                        Processing...
                      </span>
                    ) : isOutOfStock ? (
                      "Currently Unavailable"
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
