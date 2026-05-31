import { Home, Library, Heart, History, Clock, MapPin, Navigation, BookOpen } from "lucide-react";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const userNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: <Home /> },
  { title: "My Rentals", href: "/orders", icon: <Clock /> },
  { title: "Saved Books", href: "/dashboard/saved", icon: <Heart /> },
  { title: "Nearby Libraries", href: "/dashboard/libraries", icon: <Library /> },
  { title: "Order History", href: "/orders", icon: <History /> },
];

const mockLibraries = [
  { id: "LIB-1", name: "Central City Library", distance: "0.8 miles", address: "100 Main St, Downtown", books: "12k+", image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop" },
  { id: "LIB-2", name: "Northside Community Branch", distance: "2.4 miles", address: "450 North Ave, Northside", books: "4k+", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop" },
  { id: "LIB-3", name: "Tech Hub Archives", distance: "3.1 miles", address: "Innovation Park", books: "8k+", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" }
];

export function UserLibraries() {
  return (
    <DashboardShell navItems={userNavItems} userTitle="Nearby Libraries">
      <div className="flex flex-col gap-8">
        
        {/* Header Map Graphic (Simulated) */}
        <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-2xl font-bold text-white mb-2">Explore Your Area</h2>
            <p className="text-zinc-300 max-w-lg">Discover millions of books across local branches. Connect with a library to start renting.</p>
          </div>
          <div className="absolute top-6 right-6">
            <Button className="bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/10 rounded-full h-12 px-6">
              <Navigation className="mr-2 h-4 w-4" /> Use My Location
            </Button>
          </div>
        </div>

        {/* Library Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLibraries.map((lib) => (
            <Card key={lib.id} className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden group hover:border-purple-500/30 transition-colors">
              <div className="h-40 w-full relative overflow-hidden">
                <img src={lib.image} alt={lib.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center border border-white/10">
                  <MapPin className="mr-1 h-3 w-3 text-purple-400" /> {lib.distance}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{lib.name}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-1">{lib.address}</p>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-xs">Collection</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-purple-400" /> {lib.books} Books
                    </span>
                  </div>
                  <Button className="bg-white/10 hover:bg-purple-500 text-white transition-colors">
                    Browse Catalog
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
