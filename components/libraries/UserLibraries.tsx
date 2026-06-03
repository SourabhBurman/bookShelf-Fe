import {
  MapPin,
  Navigation,
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockLibraries = [
  {
    id: "LIB-1",
    name: "Central City Library",
    distance: "0.8 miles",
    address: "100 Main St, Downtown",
    books: "12k+",
    status: "Open until 9 PM",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "LIB-2",
    name: "Northside Community Branch",
    distance: "2.4 miles",
    address: "450 North Ave, Northside",
    books: "4k+",
    status: "Open until 6 PM",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "LIB-3",
    name: "Tech Hub Archives",
    distance: "3.1 miles",
    address: "Innovation Park",
    books: "8k+",
    status: "Closed (Opens 8 AM)",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "LIB-4",
    name: "Westend Books & Coffee",
    distance: "4.5 miles",
    address: "Westend Ave",
    books: "2k+",
    status: "Open 24/7",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
  },
];

const categories = [
  "All",
  "Open Now",
  "Within 2 miles",
  "Highest Rated",
  "Quiet Zones",
  "24/7 Access",
];

export function UserLibraries() {
  return (
    <div className="flex flex-col gap-10">
      {/* Header Map Graphic */}
      <div className="relative h-[300px] sm:h-[400px] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group flex flex-col justify-end p-6 sm:p-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay" />

        <div className="relative z-10 w-full max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Libraries{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Near You
            </span>
          </h2>
          <p className="text-zinc-300 max-w-xl text-lg mb-8">
            Discover millions of books across local branches. Connect with a
            library to start your next adventure.
          </p>

          {/* Search Bar on Map */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group/search">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/search:text-purple-400 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Search libraries by name, address, or zip code..."
                className="pl-12 h-14 bg-zinc-950/80 border-white/20 text-white placeholder:text-zinc-400 rounded-2xl focus-visible:ring-purple-500/50 text-md shadow-xl backdrop-blur-xl"
              />
            </div>
            <Button className="h-14 rounded-2xl bg-white hover:bg-zinc-200 text-black px-8 font-semibold shadow-xl transition-all hover:scale-105">
              <Navigation className="mr-2 h-5 w-5" /> Locate Me
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 bg-zinc-900/50 border-white/10 hover:bg-white/10 text-white rounded-full"
        >
          <Filter className="h-4 w-4" />
        </Button>
        {categories.map((cat, idx) => (
          <Button
            key={idx}
            variant="outline"
            className={`shrink-0 rounded-full border-white/10 transition-colors ${
              idx === 0
                ? "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 hover:text-purple-200"
                : "bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Library Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockLibraries.map((lib) => (
          <div key={lib.id}>
            <Card className="h-full bg-zinc-900/40 border-white/5 backdrop-blur-xl overflow-hidden group hover:border-purple-500/40 transition-colors duration-300 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]">
              <div className="h-48 w-full relative overflow-hidden">
                <img
                  src={lib.image}
                  alt={lib.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-zinc-950/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center border border-white/10 shadow-sm">
                    <MapPin className="mr-1.5 h-3.5 w-3.5 text-purple-400" />
                    {lib.distance}
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="bg-amber-500/10 backdrop-blur-md text-amber-400 text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center border border-amber-500/20 shadow-sm">
                    <Star className="mr-1 h-3.5 w-3.5 fill-amber-400" />
                    {lib.rating}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-4 left-4">
                  <div
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center border backdrop-blur-md ${
                      lib.status.includes("Closed")
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    <Clock className="mr-1.5 h-3 w-3" />
                    {lib.status}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {lib.name}
                </h3>
                <p className="text-zinc-400 text-sm mb-6 flex items-start">
                  {lib.address}
                </p>

                <div className="flex items-end justify-between pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">
                      Collection
                    </span>
                    <span className="text-white font-medium flex items-center gap-1.5 text-lg">
                      <BookOpen className="h-4 w-4 text-purple-400" />
                      {lib.books}
                    </span>
                  </div>
                  <Button className="bg-white/5 hover:bg-purple-500 text-white border border-white/10 hover:border-purple-500 transition-all rounded-xl h-10 px-5 group/btn">
                    Visit Library
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
