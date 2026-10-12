"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";
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
import { CreatePaymentIntentDocument } from "@/graphql/order/mutations.generated";
import MyLoading from "@/components/myLoading";
import { GetBookByIdDocument } from "@/graphql/book/queries.generated";
import { TransactionType } from "@/graphql/generated/graphql";
import { toast } from "sonner";
import { StripePaymentModal } from "@/components/StripePaymentModal";
import { useAuth } from "@/context/AuthContext";
import {
  useGetReviewsForBookQuery,
  useCreateReviewMutation,
} from "@/graphql/review/hooks";
import {
  useGetSavedBooksQuery,
  useSaveBookMutation,
  useUnsaveBookMutation,
} from "@/graphql/savedBook/hooks";
import {
  useGetMyWaitlistQuery,
  useJoinWaitlistMutation,
  useLeaveWaitlistMutation,
} from "@/graphql/waitlist/hooks";
import { GetSavedBooksDocument } from "@/graphql/savedBook/queries.generated";
import { GetMyWaitlistDocument } from "@/graphql/waitlist/queries.generated";

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
  pages: 304,
  publisher: "Viking",
  publishedDate: "2020-08-13",
  rentPrice: 2.99,
  purchasePrice: 14.99,
  quantityAvailable: 0,
};

export default function BookDetailPage() {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.Borrow,
  );
  const [borrowDays, setBorrowDays] = useState(1);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(
    null,
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);

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
    averageRating: fetchedBook?.averageRating ?? null,
    pages: DEFAULT_BOOK_VALUES.pages,
    publisher: DEFAULT_BOOK_VALUES.publisher,
    publishedDate:
      fetchedBook?.publishedDate || DEFAULT_BOOK_VALUES.publishedDate,
    rentPrice: fetchedBook?.rentPrice || DEFAULT_BOOK_VALUES.rentPrice,
    purchasePrice: fetchedBook?.cost || DEFAULT_BOOK_VALUES.purchasePrice,
    // Real, currently-borrowable stock (sum across every library that
    // stocks it) — not the shared catalog pool, which doesn't reflect what
    // a user can actually borrow/buy right now.
    totalAvailableCopies:
      fetchedBook?.totalAvailableCopies ?? DEFAULT_BOOK_VALUES.quantityAvailable,
  };

  const isOutOfStock = book.totalAvailableCopies < 1;

  const { user } = useAuth();
  const { data: librariesData, loading: libsLoading } = useGetLibrariesQuery();
  const libraries = librariesData?.getLibraries || [];

  const { savedBooks, refetchSavedBooks } = useGetSavedBooksQuery(!user);
  const isSaved = savedBooks.some((s) => s?.book?.id === book.id);
  const [saveBook, { loading: isSaving }] = useSaveBookMutation();
  const [unsaveBook, { loading: isUnsaving }] = useUnsaveBookMutation();

  const handleToggleSaved = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      if (isSaved) {
        await unsaveBook({
          variables: { bookId: book.id },
          refetchQueries: [{ query: GetSavedBooksDocument }],
        });
      } else {
        await saveBook({
          variables: { bookId: book.id },
          refetchQueries: [{ query: GetSavedBooksDocument }],
        });
      }
      refetchSavedBooks();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const { waitlist, refetchWaitlist } = useGetMyWaitlistQuery(!user);
  const isOnWaitlist = waitlist.some((w) => w?.book?.id === book.id);
  const [joinWaitlist, { loading: isJoiningWaitlist }] =
    useJoinWaitlistMutation();
  const [leaveWaitlist, { loading: isLeavingWaitlist }] =
    useLeaveWaitlistMutation();

  const handleToggleWaitlist = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      if (isOnWaitlist) {
        await leaveWaitlist({
          variables: { bookId: book.id },
          refetchQueries: [{ query: GetMyWaitlistDocument }],
        });
        toast.success("Removed from waitlist");
      } else {
        await joinWaitlist({
          variables: { bookId: book.id },
          refetchQueries: [{ query: GetMyWaitlistDocument }],
        });
        toast.success("You'll be notified when this book is back in stock");
      }
      refetchWaitlist();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const { reviews, refetchReviews } = useGetReviewsForBookQuery(bookId);
  const [createReview, { loading: isSubmittingReview }] =
    useCreateReviewMutation();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const handleSubmitReview = async () => {
    try {
      await createReview({
        variables: {
          input: { bookId: book.id, rating: reviewRating, comment: reviewComment },
        },
      });
      setReviewComment("");
      toast.success("Thanks for your review!");
      refetchReviews();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to submit review",
      );
    }
  };

  const [createPaymentIntent, { loading: isPlacingOrder }] = useMutation(
    CreatePaymentIntentDocument,
    {
      onCompleted: async (data) => {
        const intent = data.createPaymentIntent;
        if (intent.clientSecret) {
          setClientSecret(intent.clientSecret);
        } else {
          toast.error("Failed to generate payment intent.");
        }
      },
      onError: (err) => {
        toast.error(`Payment failed: ${err.message || "Something went wrong"}`);
      },
    },
  );

  const handlePlaceOrder = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedLibraryId) return;

    let expectedReturnDate = undefined;
    if (transactionType === TransactionType.Borrow) {
      const date = new Date();
      date.setDate(date.getDate() + borrowDays);
      expectedReturnDate = date.toISOString();
    }

    createPaymentIntent({
      variables: {
        input: {
          bookId: book.id,
          libraryId: selectedLibraryId,
          transactionType,
          ...(expectedReturnDate ? { expectedReturnDate } : {}),
        },
      },
    });
  };

  if (bookLoading) return <MyLoading />;

  return (
    <>
      {clientSecret && (
        <StripePaymentModal
          clientSecret={clientSecret}
          onSuccess={(paymentIntentId) =>
            // Same query param Stripe itself appends when a payment method
            // redirects to return_url, so the success page reads one shape.
            router.push(
              `/orders/success?payment_intent=${encodeURIComponent(paymentIntentId)}`,
            )
          }
          onCancel={() => setClientSecret(null)}
        />
      )}
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-2">
        <Link
          href="/books"
          className="hover:text-white transition-colors"
        >
          Browse Books
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/books?category=${encodeURIComponent(book.category)}`}
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
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
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
                disabled={isSaving || isUnsaving}
                title={isSaved ? "Remove from saved books" : "Save for later"}
                className={`rounded-full shadow-lg ${isSaved ? "bg-rose-500 hover:bg-rose-600" : "bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20"}`}
                onClick={handleToggleSaved}
              >
                <Heart
                  className={`h-5 w-5 ${isSaved ? "fill-white" : "text-white"}`}
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
                {book.averageRating ?? "—"}{" "}
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
                    className={`h-5 w-5 ${
                      book.averageRating && s <= Math.round(book.averageRating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-zinc-400">
                <span className="text-white font-medium">
                  {book.averageRating ?? "No ratings yet"}
                </span>{" "}
                {reviews.length > 0 &&
                  `(${reviews.length} ${reviews.length === 1 ? "review" : "reviews"})`}
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

              {user && (
                <div className="mb-8 p-4 rounded-xl border border-white/10 bg-zinc-900/50">
                  <h4 className="text-sm font-medium text-white mb-3">
                    Write a review
                  </h4>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-0.5"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            s <= reviewRating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-zinc-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about this book (only borrowers/purchasers can review)…"
                    rows={3}
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                  <Button
                    size="sm"
                    disabled={isSubmittingReview}
                    onClick={handleSubmitReview}
                    className="mt-3 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-zinc-500 text-sm">
                  No reviews yet — be the first to share your thoughts.
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review?.id}
                      className="border-b border-white/5 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xs font-semibold text-purple-300">
                            {(review?.user?.name ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-sm">
                              {review?.user?.name ?? "Anonymous"}
                            </h4>
                            <span className="text-xs text-zinc-500">
                              {review?.createdAt
                                ? new Date(review.createdAt as Date).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < (review?.rating ?? 0) ? "text-yellow-500 fill-yellow-500" : "text-zinc-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review?.comment && (
                        <p className="text-zinc-300 text-sm pl-11 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Action Sticky Card */}
          <div className="xl:col-span-5">
            <div className="xl:sticky xl:top-24">
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
                      onClick={() => setTransactionType(TransactionType.Borrow)}
                      className={`relative flex flex-col cursor-pointer rounded-xl border p-4 shadow-sm transition-colors ${transactionType === TransactionType.Borrow ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                    >
                      <input
                        type="radio"
                        name="purchaseType"
                        className="sr-only"
                        checked={transactionType === TransactionType.Borrow}
                        readOnly
                      />
                      <div
                        className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center ${transactionType === TransactionType.Borrow ? "border-purple-500 border-4 bg-zinc-950" : "border-zinc-600 bg-zinc-900"}`}
                      >
                        {transactionType === TransactionType.Borrow && (
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-medium uppercase tracking-wider mb-1 ${transactionType === TransactionType.Borrow ? "text-zinc-300" : "text-zinc-400"}`}
                        >
                          Borrow Book
                        </span>
                        <span className="text-3xl font-bold text-white">
                          ₹{formatAmount(book.rentPrice)}
                          <span className="text-sm font-medium text-zinc-500">
                            /day
                          </span>
                        </span>
                      </div>

                      {transactionType === TransactionType.Borrow && (
                        <div
                          className="mt-4 pt-4 border-t border-white/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="text-sm text-zinc-400 mb-2 block font-medium">
                            Number of Days to Borrow:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={borrowDays}
                            onChange={(e) =>
                              setBorrowDays(parseInt(e.target.value) || 1)
                            }
                            className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                      )}
                    </label>

                    {/* BUY OPTION */}
                    <label
                      onClick={() =>
                        setTransactionType(TransactionType.Purchase)
                      }
                      className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-colors ${transactionType === TransactionType.Purchase ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                    >
                      <input
                        type="radio"
                        name="purchaseType"
                        className="sr-only"
                        checked={transactionType === TransactionType.Purchase}
                        readOnly
                      />
                      <div
                        className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center ${transactionType === TransactionType.Purchase ? "border-purple-500 border-4 bg-zinc-950" : "border-zinc-600 bg-zinc-900"}`}
                      >
                        {transactionType === TransactionType.Purchase && (
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-medium uppercase tracking-wider mb-1 ${transactionType === TransactionType.Purchase ? "text-zinc-300" : "text-zinc-400"}`}
                        >
                          Buy Permanent
                        </span>
                        <span className="text-3xl font-bold text-white">
                          ₹{formatAmount(book.purchasePrice)}
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
                              <span className="text-xs font-bold text-emerald-400 shrink-0 flex flex-col items-end">
                                {transactionType === TransactionType.Borrow ? (
                                  <>
                                    <span>
                                      ₹
                                      {formatAmount(
                                        book.rentPrice * borrowDays +
                                          0.5 * book.purchasePrice,
                                      )}{" "}
                                      total
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-normal mt-0.5">
                                      incl. ₹{formatAmount(0.5 * book.purchasePrice)}{" "}
                                      security
                                    </span>
                                  </>
                                ) : (
                                  `₹${book.purchasePrice}`
                                )}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    disabled={
                      !!user &&
                      (!selectedLibraryId || isPlacingOrder || isOutOfStock)
                    }
                    onClick={handlePlaceOrder}
                    className="w-full h-14 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {!user ? (
                      "Log In to Continue"
                    ) : isPlacingOrder ? (
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

                  {isOutOfStock && (
                    <Button
                      variant="outline"
                      disabled={isJoiningWaitlist || isLeavingWaitlist}
                      onClick={handleToggleWaitlist}
                      className={`w-full h-11 mt-3 rounded-xl font-semibold transition-all ${
                        isOnWaitlist
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                          : "bg-transparent border-white/10 text-white hover:bg-white/5"
                      }`}
                    >
                      {isOnWaitlist
                        ? "You're on the waitlist ✕"
                        : "Notify Me When Available"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
