import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  rentPrice: number;
  purchasePrice: number;
  rating: number;
  available: boolean;
}

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <Card
      className={cn(
        "group bg-zinc-950/80 border border-white/5 backdrop-blur-2xl overflow-hidden hover:border-zinc-500/50 transition-all duration-500 flex flex-col h-full hover:shadow-2xl hover:-translate-y-1.5 relative ring-1 ring-white/5 p-0 gap-0",
        className,
      )}
    >
      {/* Availability Badge */}
      <div className="absolute top-3 left-3 z-10">
        {book.available ? (
          <span className="inline-flex items-center rounded-full bg-emerald-950/90 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-lg">
            Available
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-rose-950/90 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/30 backdrop-blur-md shadow-lg">
            Rented Out
          </span>
        )}
      </div>

      {/* Floating Rating */}
      <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-zinc-900/60 px-2 py-1 text-xs font-semibold text-zinc-200 border border-white/10 backdrop-blur-md shadow-lg">
        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        {book.rating.toFixed(1)}
      </div>

      <div className="relative h-40 w-full bg-zinc-900 overflow-hidden rounded-t-xl">
        {/* Fallback pattern gradient if real image fails/empty, or just placeholder style */}
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-zinc-700" />
        </div>
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-90"
        />

        {/* Elegant vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <CardContent className="flex flex-col flex-1 p-4 relative z-10 -mt-10">
        <div className="mb-2">
          <span className="inline-flex text-[11px] font-bold tracking-widest uppercase text-zinc-300 bg-zinc-800/90 px-3 py-1 rounded-full border border-zinc-600/30 backdrop-blur-xl">
            {book.category}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-white leading-tight mt-1.5 line-clamp-1 transition-colors duration-300 group-hover:text-zinc-300">
          {book.title}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 font-medium">
          <Users className="h-3 w-3 text-zinc-500" />
          {book.author}
        </p>

        <div className="mt-4 flex items-end justify-between bg-zinc-900/50 rounded-lg p-2.5 border border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">
              RENT / MO
            </span>
            <span className="text-lg font-black text-white tracking-tight">
              ${book.rentPrice.toFixed(2)}
            </span>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">
              BUY
            </span>
            <span className="text-lg font-bold text-zinc-400 tracking-tight">
              ${book.purchasePrice.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto border-t border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="w-full bg-white text-zinc-950 hover:bg-zinc-200 transition-colors font-semibold group/btn mt-3"
        >
          <Link href={`/books/${book.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
