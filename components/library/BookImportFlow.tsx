"use client";

import { useEffect, useState } from "react";
import { AddBookToLibraryDocument } from "@/graphql/library/mutations.generated";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, ArrowRight, Loader2, Package } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { useGetBooksQuery } from "@/graphql/book/hooks";

interface BookImportFlowProps {
  libraryId: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function BookImportFlow({
  libraryId,
  onComplete,
  onSkip,
}: BookImportFlowProps) {
  const { getBooks, data, loading, error } = useGetBooksQuery();
  const [addBookToLibrary, { loading: importing }] = useMutation(
    AddBookToLibraryDocument,
    {
      onCompleted: () => onComplete(),
    },
  );

  const [isAll, setIsAll] = useState(false);
  const [quantityForIsAll, setQuantityForIsAll] = useState(5);

  // State for specific book selection: { bookId: string, quantity: number }
  const [selectedBooks, setSelectedBooks] = useState<Record<string, number>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");

  const books = data?.getBooks || [];
  const filteredBooks = books.filter(
    (b) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleBook = (bookId: string, checked: boolean) => {
    setSelectedBooks((prev) => {
      const next = { ...prev };
      if (checked) {
        next[bookId] = 1; // Default quantity 1
      } else {
        delete next[bookId];
      }
      return next;
    });
  };

  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    setSelectedBooks((prev) => ({
      ...prev,
      [bookId]: quantity,
    }));
  };

  const handleImport = () => {
    if (isAll) {
      addBookToLibrary({
        variables: {
          input: {
            library: libraryId,
            isAll: true,
            quantityForIsAll,
          },
        },
      });
    } else {
      const booksToImport = Object.entries(selectedBooks).map(
        ([bookId, quantity]) => ({
          bookId,
          quantity,
        }),
      );

      if (booksToImport.length === 0) return;

      addBookToLibrary({
        variables: {
          input: {
            library: libraryId,
            isAll: false,
            books: booksToImport,
          },
        },
      });
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-rose-500 bg-rose-500/10 rounded-lg">
        Failed to load catalog: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 mb-6 border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
          <Package className="h-8 w-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Populate Your Library
        </h2>
        <p className="text-zinc-400">
          Import books from the global catalog into your inventory
        </p>
      </div>

      <Card className="bg-zinc-900/50 border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-4">
            <Checkbox
              id="import-all"
              checked={isAll}
              onCheckedChange={(c) => {
                setIsAll(c as boolean);
                if (c) setSelectedBooks({});
              }}
              className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <div className="flex-1">
              <label
                htmlFor="import-all"
                className="text-base font-medium text-white cursor-pointer"
              >
                Import All Available Books
              </label>
              <p className="text-sm text-zinc-400">
                Add every book from the global catalog to your library.
              </p>
            </div>
            {isAll && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Qty per book:</span>
                <Input
                  type="number"
                  min="1"
                  value={quantityForIsAll}
                  onChange={(e) =>
                    setQuantityForIsAll(parseInt(e.target.value) || 1)
                  }
                  className="w-20 bg-black/50 border-white/10 text-white"
                />
              </div>
            )}
          </div>
        </CardHeader>

        {!isAll && (
          <CardContent className="p-0">
            <div className="p-4 border-b border-white/5 bg-zinc-950/50">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {filteredBooks.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">
                  No books found matching your search.
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {filteredBooks.map((book) => (
                    <li
                      key={book.id!}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                    >
                      <Checkbox
                        id={`book-${book.id}`}
                        checked={!!selectedBooks[book.id!]}
                        onCheckedChange={(c) =>
                          handleToggleBook(book.id!, c as boolean)
                        }
                        className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <div className="h-12 w-10 bg-zinc-800 rounded flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.name || "Cover"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-4 w-4 text-zinc-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`book-${book.id}`}
                          className="text-white font-medium truncate cursor-pointer block"
                        >
                          {book.name}
                        </label>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-zinc-400 text-xs truncate">
                            {book.author}
                          </p>
                          {book.genre && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-zinc-300">
                              {book.genre}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            ₹{book.cost || 0}
                          </p>
                          <p className="text-zinc-500 text-xs">cost</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-400">
                            ₹{book.rentPrice || 0}
                          </p>
                          <p className="text-zinc-500 text-xs">rent</p>
                        </div>
                        <div className="text-right border-l border-white/10 pl-6">
                          <p className="text-sm font-medium text-emerald-400">
                            {book.quantityAvailable}{" "}
                            <span className="text-zinc-500 font-normal">
                              avail
                            </span>
                          </p>
                        </div>
                      </div>
                      {selectedBooks[book.id!] && (
                        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                          <span className="text-sm text-zinc-400">Qty:</span>
                          <Input
                            type="number"
                            min="1"
                            max={book.quantityAvailable || 1}
                            value={selectedBooks[book.id!]}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                book.id!,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-20 bg-black/50 border-white/10 h-8 text-white"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-between items-center gap-4">
        {onSkip ? (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-zinc-400 hover:text-white hover:bg-white/5"
          >
            Skip for now
          </Button>
        ) : (
          <div />
        )}
        <Button
          onClick={handleImport}
          disabled={
            importing || (!isAll && Object.keys(selectedBooks).length === 0)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]"
        >
          {importing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Import Selected Books
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
