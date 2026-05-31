import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart, ArrowRight, LibraryBig } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Navbar Minimal */}
      <header className="z-40 w-full backdrop-blur-md bg-zinc-950/50 border-b border-white/5 sticky top-0">
        <div className="mx-auto flex h-16 items-center justify-between p-8">
          <div className="flex items-center gap-2">
            <LibraryBig className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold tracking-tight text-white">BookShelf</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-black hover:bg-zinc-200 transition-colors">
                Start for Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto relative isolate">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] mix-blend-screen pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 sm:pt-32 lg:pt-40 lg:pb-40 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center items-center text-center">
          
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
          </div>
          
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out block">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              The Librarian&apos;s Life,
              <br className="max-md:hidden" />
              <span className="text-purple-400"> simplified and automated.</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl leading-8 text-zinc-400 max-w-2xl mx-auto">
              BookShelf gives you the ultimate workspace to track books, manage borrowers, and easily enforce penalties. Spend less time managing records and more time curating your collection.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-base bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/25">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-white/10 bg-zinc-950/50 backdrop-blur-3xl relative">
          <div className="py-24 sm:py-32 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to run your library</h2>
              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Powerful tools designed specifically to make a librarian&apos;s daily workflows faster and easier.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-7xl px-0 sm:mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-zinc-900/50 border-white/10 hover:border-purple-500/50 transition-colors backdrop-blur-xl group">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Automated Book Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-zinc-400 text-base">
                      No more missing titles. Easily track which books are available, who is currently renting them, and when they are due back.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-white/10 hover:border-purple-500/50 transition-colors backdrop-blur-xl group">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-pink-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Easy Borrower Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-zinc-400 text-base">
                      Organize your borrowers efficiently. View their history, active rentals, and contact information all in one unified dashboard.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-white/10 hover:border-purple-500/50 transition-colors backdrop-blur-xl group">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BarChart className="h-6 w-6 text-yellow-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Smart Penalty System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-zinc-400 text-base">
                      Dynamically calculate late fines. The system handles all the math and automatically deducts the necessary balances on return.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
