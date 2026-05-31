import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
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
    <Card className={cn("group bg-zinc-900/40 border-white/5 backdrop-blur-md overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 relative", className)}>
      
      {/* Availability Badge */}
      <div className="absolute top-3 left-3 z-10">
        {book.available ? (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 backdrop-blur-md shadow-lg">
             Available
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20 backdrop-blur-md shadow-lg">
             Rented Out
          </span>
        )}
      </div>

      {/* Floating Rating */}
      <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-zinc-900/60 px-2 py-1 text-xs font-semibold text-zinc-200 border border-white/10 backdrop-blur-md shadow-lg">
         <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
         {book.rating.toFixed(1)}
      </div>

      <div className="relative aspect-[3/4] w-full bg-zinc-800/50 overflow-hidden rounded-t-xl group-hover:opacity-90 transition-opacity">
         {/* Fallback pattern gradient if real image fails/empty, or just placeholder style */}
         <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-zinc-700" />
         </div>
          <Image 
             src={book.coverImage} 
             alt={book.title} 
             fill
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
             className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-overlay"
          />
         
         <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
      </div>

      <CardContent className="flex flex-col flex-1 p-5 relative z-10 -mt-10">
        <div className="mb-1">
          <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {book.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white leading-tight mt-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
           <Users className="h-3.5 w-3.5 opacity-70" />
           {book.author}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
             <span className="text-xs text-zinc-500 font-medium tracking-wide">RENT / MO</span>
             <span className="text-lg font-bold text-white">${book.rentPrice.toFixed(2)}</span>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex flex-col text-right">
             <span className="text-xs text-zinc-500 font-medium tracking-wide">BUY</span>
             <span className="text-lg font-bold text-zinc-300">${book.purchasePrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto border-t border-white/5 bg-zinc-950/50">
        <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200 transition-colors font-semibold group/btn mt-4">
          View Details
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
