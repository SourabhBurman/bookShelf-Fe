"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { Genre, User_Roles } from "@/graphql/generated/graphql";
import { useGetBooksQuery, useCreateBookMutation } from "@/graphql/book/hooks";
import { GetBooksDocument } from "@/graphql/book/queries.generated";
import { AlertCircle, BookOpen, Plus, RotateCcw, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/Pagination";
import { formatAmount } from "@/lib/utils";

const PAGE_SIZE = 15;

const EMPTY_FORM = {
  name: "",
  author: "",
  genre: Genre.Other,
  description: "",
  cost: "",
  rentPrice: "",
  coverImage: "",
};

export default function AdminCatalogPage() {
  const { user, isLoading } = useAuth();
  const { getBooks, data, loading, error } = useGetBooksQuery();
  const [createBook, { loading: isCreating }] = useCreateBookMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getBooks({ variables: { pagination: { pageNumber: 1, pageSize: 500 } } });
  }, [getBooks]);

  const books = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const all = data?.getBooks ?? [];
    if (!q) return all;
    return all.filter(
      (b) =>
        b?.name?.toLowerCase().includes(q) ||
        b?.author?.toLowerCase().includes(q),
    );
  }, [data, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the search term changes (adjusted during
  // render, per React's guidance, rather than via a setState-in-effect).
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
  if (searchTerm !== prevSearchTerm) {
    setPrevSearchTerm(searchTerm);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBooks = useMemo(
    () => books.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [books, safePage],
  );

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setFormError("Title is required");
      return;
    }
    try {
      setFormError("");
      await createBook({
        variables: {
          input: {
            name: form.name.trim(),
            author: form.author.trim() || undefined,
            genre: form.genre,
            description: form.description.trim() || undefined,
            cost: form.cost ? parseFloat(form.cost) : undefined,
            rentPrice: form.rentPrice ? parseFloat(form.rentPrice) : undefined,
            coverImage: form.coverImage.trim() || undefined,
          },
        },
        refetchQueries: [{ query: GetBooksDocument }],
      });
      setIsAddOpen(false);
      resetForm();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create book");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (user?.role?.type !== User_Roles.Admin) {
    return <Forbidden />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
          />
        </div>

        <Dialog
          open={isAddOpen}
          onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-zinc-950 text-white max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a New Book</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Add a title to the shared platform catalog. Libraries can then
                import it into their own inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Title</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Genre</Label>
                <select
                  value={form.genre}
                  onChange={(e) =>
                    setForm({ ...form, genre: e.target.value as Genre })
                  }
                  className="w-full h-9 rounded-md bg-zinc-900/50 border border-white/10 text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {Object.values(Genre).map((g) => (
                    <option key={g} value={g} className="bg-zinc-900">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Purchase Price (₹)</Label>
                  <Input
                    type="number"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Rent Price (₹/day)</Label>
                  <Input
                    type="number"
                    value={form.rentPrice}
                    onChange={(e) =>
                      setForm({ ...form, rentPrice: e.target.value })
                    }
                    className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Cover Image URL</Label>
                <Input
                  value={form.coverImage}
                  onChange={(e) =>
                    setForm({ ...form, coverImage: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                />
              </div>
              {formError && (
                <p className="text-sm text-rose-400">{formError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="bg-transparent border-white/10 text-white hover:bg-white/5"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-500 hover:bg-purple-600 text-white"
                disabled={isCreating || !form.name.trim()}
                onClick={handleCreate}
              >
                {isCreating ? "Adding..." : "Add Book"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white text-lg font-semibold">
            Platform Catalog
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {books.length} {books.length === 1 ? "title" : "titles"} in the
            shared catalog.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">
                Couldn&apos;t load the catalog
              </p>
              <p className="text-zinc-500 text-sm mb-4 break-all">
                {error.message}
              </p>
              <button
                onClick={() =>
                  getBooks({
                    variables: { pagination: { pageNumber: 1, pageSize: 500 } },
                  })
                }
                className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : books.length === 0 ? (
            <div className="p-10 text-center text-zinc-400">
              {searchTerm ? "No books match your search." : "No books yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Genre</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Rent / Buy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedBooks.map((b) => (
                    <tr
                      key={b?.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-4 w-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{b?.name}</p>
                            <p className="text-zinc-400 text-xs">
                              {b?.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{b?.genre}</td>
                      <td className="px-6 py-4 text-right text-zinc-300">
                        ₹{formatAmount(b?.rentPrice)} / ₹{formatAmount(b?.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
