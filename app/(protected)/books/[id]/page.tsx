"use client";

import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Library,
  MapPin,
  Share2,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Home,
  Clock,
  History,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// Placeholder data since we don't have DB context here
const MOCK_BOOK = {
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
};

const MOCK_LIBRARIES = [
  { name: "Downtown Public Library", distance: "0.8 miles", available: true },
  { name: "Tech District Hub", distance: "2.1 miles", available: false },
  { name: "Westside Community Books", distance: "3.5 miles", available: true },
];

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

const navItems: NavItem[] = [
  { title: "Home", href: "/dashboard/user", icon: <Home /> },
  { title: "My Rentals", href: "/orders", icon: <Clock /> },
  { title: "Order History", href: "/orders", icon: <History /> },
];

export default function BookDetailPage() {
  const [isWishlisted, setIsWishlisted] = useState(false);

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
          {MOCK_BOOK.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white font-medium truncate max-w-[200px]">
          {MOCK_BOOK.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12">
        {/* LEFT COLUMN: Cover Image & At a Glance */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Main Book Cover with Glassmorphic reflection effect */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <Image
              src={MOCK_BOOK.coverImage}
              alt={MOCK_BOOK.title}
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
              <span className="text-white font-medium mt-1">
                {MOCK_BOOK.pages}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Rating
              </span>
              <span className="text-white font-medium mt-1 flex items-center justify-center gap-1">
                {MOCK_BOOK.rating}{" "}
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
        <div className="lg:col-span-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* TEXT CONTENT */}
          <div className="xl:col-span-7 flex flex-col pt-2">
            <div className="mb-4">
              <span className="inline-flex text-xs font-semibold tracking-widest uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full mb-3">
                {MOCK_BOOK.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-2">
                {MOCK_BOOK.title}
              </h1>
              <p className="text-xl text-zinc-400 font-medium">
                by{" "}
                <span className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors underline underline-offset-4 decoration-purple-500/30">
                  {MOCK_BOOK.author}
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
                <span className="text-white font-medium">
                  {MOCK_BOOK.rating}
                </span>{" "}
                ({MOCK_BOOK.reviewsCount.toLocaleString()} reviews)
              </div>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
              <h3 className="text-xl font-semibold text-white mb-3">
                About this book
              </h3>
              <p className="text-zinc-300 leading-relaxed text-[15px]">
                {MOCK_BOOK.description}
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

            {/* Library Availability Section */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" /> Available Nearby
              </h3>
              <ul className="space-y-3">
                {MOCK_LIBRARIES.map((lib, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{lib.name}</span>
                      <span className="text-sm text-zinc-400">
                        {lib.distance}
                      </span>
                    </div>
                    <div>
                      {lib.available ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="h-4 w-4" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex text-sm font-medium text-zinc-500 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
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
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                      <ShieldCheck className="h-3.5 w-3.5" /> Fast Delivery
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* RENT OPTION */}
                    <label className="relative flex cursor-pointer rounded-xl border border-purple-500 bg-purple-500/10 p-4 shadow-sm hover:border-purple-400">
                      <input
                        type="radio"
                        name="purchaseType"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="absolute top-4 right-4 h-5 w-5 rounded-full border-4 border-purple-500 bg-zinc-950 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-300 text-sm font-medium uppercase tracking-wider mb-1">
                          Rent Monthly
                        </span>
                        <span className="text-3xl font-bold text-white">
                          ${MOCK_BOOK.rentPrice}
                          <span className="text-sm font-medium text-zinc-500">
                            /mo
                          </span>
                        </span>
                      </div>
                    </label>

                    {/* BUY OPTION */}
                    <label className="relative flex cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm hover:border-white/20 transition-colors">
                      <input
                        type="radio"
                        name="purchaseType"
                        className="sr-only"
                      />
                      <div className="absolute top-4 right-4 h-5 w-5 rounded-full border-2 border-zinc-600 bg-zinc-900" />
                      <div className="flex flex-col">
                        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">
                          Buy Permanent
                        </span>
                        <span className="text-3xl font-bold text-white">
                          ${MOCK_BOOK.purchasePrice}
                        </span>
                      </div>
                    </label>
                  </div>

                  <Button className="w-full h-14 mt-8 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] transition-all">
                    Proceed to Checkout
                  </Button>

                  <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-2">
                    <Library className="h-4 w-4" /> Pick up available at 2 near
                    libraries.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
