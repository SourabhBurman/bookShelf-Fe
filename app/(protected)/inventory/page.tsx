"use client";

import { BookImportFlow } from "@/components/library/BookImportFlow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Forbidden } from "@/components/ui/Forbidden";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { User_Roles } from "@/graphql/generated/graphql";
import { useGetBooksByLibraryQuery } from "@/graphql/book/hooks";
import { UpdateBookDocument } from "@/graphql/book/mutations.generated";
import { UpdateLibraryBookDocument } from "@/graphql/library/mutations.generated";
import { useMutation } from "@apollo/client/react";
import {
  AlertCircle,
  BookOpen,
  Filter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// A row in this library's own shelf, as distinct from the shared catalog:
// `libraryBookId` + `quantityAvailable` are this library's own copy count
// (LibraryBook), while `bookId` + `rentPrice` point at the shared catalog
// entry (Book), whose price applies platform-wide.
type LibraryBookRow = {
  libraryBookId: string;
  bookId: string;
  name: string;
  author: string;
  quantityAvailable: number;
  rentPrice: number;
};

export default function OwnerInventoryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBookRow | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [editRentPrice, setEditRentPrice] = useState(0);
  const [actionError, setActionError] = useState("");

  const libraryId = user?.library_owned?.id;
  const {
    getBooksByLibrary,
    libraryBooksData,
    libraryBooksLoading,
    libraryBooksError,
  } = useGetBooksByLibraryQuery();
  const [updateBook, { loading: isSavingPrice }] = useMutation(
    UpdateBookDocument,
  );
  const [updateLibraryBook, { loading: isSavingStock }] = useMutation(
    UpdateLibraryBookDocument,
  );
  const isSaving = isSavingPrice || isSavingStock;

  const refetchLibraryBooks = () => {
    if (libraryId) getBooksByLibrary({ variables: { id: libraryId } });
  };

  useEffect(() => {
    if (!isAuthLoading && user && !user.library_owned && user.role?.type === User_Roles.LibraryOwner) {
      router.push("/inventory/setup");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    refetchLibraryBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryId]);

  const books: LibraryBookRow[] = useMemo(
    () =>
      libraryBooksData
        .filter(
          (lb): lb is NonNullable<typeof lb> => !!lb?.id && !!lb.book?.id,
        )
        .map((lb) => ({
          libraryBookId: lb.id as string,
          bookId: lb.book!.id as string,
          name: lb.book?.name || "Untitled",
          author: lb.book?.author || "Unknown Author",
          quantityAvailable: lb.quantityAvailable ?? 0,
          rentPrice: lb.book?.rentPrice ?? 0,
        })),
    [libraryBooksData],
  );

  const filteredBooks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return books.filter((b) => {
      if (lowStockOnly && b.quantityAvailable > 2) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    });
  }, [books, searchTerm, lowStockOnly]);

  const openEdit = (book: LibraryBookRow) => {
    setActionError("");
    setEditingBook(book);
    setEditQuantity(book.quantityAvailable);
    setEditRentPrice(book.rentPrice);
  };

  const handleSaveEdit = async () => {
    if (!editingBook) return;
    try {
      setActionError("");
      await Promise.all([
        updateLibraryBook({
          variables: {
            id: editingBook.libraryBookId,
            input: { quantityAvailable: editQuantity },
          },
        }),
        updateBook({
          variables: {
            id: editingBook.bookId,
            input: { rentPrice: editRentPrice },
          },
        }),
      ]);
      setEditingBook(null);
      refetchLibraryBooks();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update book");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  // Redirect to setup if no library is owned
  if (!user?.library_owned) {
    return null;
  }

  if (user?.role?.type !== User_Roles.LibraryOwner) {
    return <Forbidden />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setLowStockOnly((v) => !v)}
            className={`flex-1 sm:flex-none border-white/10 ${
              lowStockOnly
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30"
                : "bg-transparent text-white hover:bg-white/5"
            }`}
          >
            <Filter className="mr-2 h-4 w-4" />
            {lowStockOnly ? "Low Stock Only" : "Filter"}
          </Button>
          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                Import Books
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl border-white/10 bg-zinc-950 p-6 sm:p-8">
              <DialogTitle className="sr-only">Import Books</DialogTitle>
              {user?.library_owned?.id && (
                <BookImportFlow
                  libraryId={user.library_owned.id}
                  onComplete={() => {
                    setIsImportModalOpen(false);
                    refetchLibraryBooks();
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white text-lg font-semibold">
            Current Catalog
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {libraryBooksLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : libraryBooksError ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">
                Couldn&apos;t load your inventory
              </p>
              <p className="text-zinc-500 text-sm mb-4 break-all">
                {libraryBooksError.message}
              </p>
              <button
                onClick={refetchLibraryBooks}
                className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="p-10 text-center text-zinc-400">
              {books.length === 0
                ? "No books in your inventory yet. Import some from the catalog to get started."
                : "No books match your current search/filter."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Book Details</th>
                    <th className="px-6 py-4 font-medium">Rental Price</th>
                    <th className="px-6 py-4 font-medium">Stock Level</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBooks.map((b) => {
                    const status =
                      b.quantityAvailable === 0
                        ? "Out of Stock"
                        : b.quantityAvailable <= 2
                          ? "Low Stock"
                          : "Available";
                    return (
                      <tr
                        key={b.libraryBookId}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-10 bg-zinc-800 rounded flex items-center justify-center shrink-0 border border-white/10">
                              <BookOpen className="h-4 w-4 text-zinc-500" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {b.name}
                              </p>
                              <p className="text-zinc-400 text-xs">
                                {b.author}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          ${b.rentPrice.toFixed(2)}
                          <span className="text-zinc-500 text-xs">/day</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">
                            {b.quantityAvailable}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              status === "Out of Stock"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : status === "Low Stock"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                            onClick={() => openEdit(b)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Book Dialog */}
      <Dialog
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Edit {editingBook?.name}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Stock is specific to your library. Rental price is shared
              across the whole catalog, since it lives on the book itself.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">
                Your Library&apos;s Stock
              </Label>
              <Input
                type="number"
                min="0"
                value={editQuantity}
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">
                Rental Price (per day, catalog-wide)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={editRentPrice}
                onChange={(e) =>
                  setEditRentPrice(parseFloat(e.target.value) || 0)
                }
                className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            {actionError && (
              <p className="text-sm text-rose-400">{actionError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
              onClick={() => setEditingBook(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isSaving}
              onClick={handleSaveEdit}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
