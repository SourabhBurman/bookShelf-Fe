"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Building,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
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
} from "@/components/ui/dialog";
import { useGetLibrariesQuery } from "@/graphql/library/hooks";
import {
  UpdateLibraryDocument,
  DeleteLibraryDocument,
} from "@/graphql/library/mutations.generated";
import { GetLibrariesDocument } from "@/graphql/library/queries.generated";

type LibraryRow = {
  id: string;
  name: string;
  address: string;
  balance: number | null;
};

export function AdminLibraries() {
  const { data, loading, error, refetch } = useGetLibrariesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLibrary, setEditingLibrary] = useState<LibraryRow | null>(
    null,
  );
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [deletingLibrary, setDeletingLibrary] = useState<LibraryRow | null>(
    null,
  );
  const [actionError, setActionError] = useState("");

  const [updateLibrary, { loading: isUpdating }] = useMutation(
    UpdateLibraryDocument,
    { refetchQueries: [{ query: GetLibrariesDocument }] },
  );
  const [deleteLibrary, { loading: isDeleting }] = useMutation(
    DeleteLibraryDocument,
    { refetchQueries: [{ query: GetLibrariesDocument }] },
  );

  const libraries: LibraryRow[] = useMemo(() => {
    return (data?.getLibraries ?? [])
      .filter((lib): lib is NonNullable<typeof lib> => !!lib?.id)
      .map((lib) => ({
        id: lib.id as string,
        name: lib.name || "Untitled Library",
        address: lib.address || "No address on file",
        balance: lib.balance ?? null,
      }));
  }, [data]);

  const filteredLibraries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return libraries;
    return libraries.filter(
      (lib) =>
        lib.name.toLowerCase().includes(q) ||
        lib.address.toLowerCase().includes(q),
    );
  }, [libraries, searchTerm]);

  const openEdit = (lib: LibraryRow) => {
    setActionError("");
    setEditingLibrary(lib);
    setEditName(lib.name);
    setEditAddress(lib.address);
  };

  const handleUpdate = async () => {
    if (!editingLibrary) return;
    try {
      setActionError("");
      await updateLibrary({
        variables: {
          id: editingLibrary.id,
          input: { name: editName.trim(), address: editAddress.trim() },
        },
      });
      setEditingLibrary(null);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Failed to update library",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingLibrary) return;
    try {
      setActionError("");
      await deleteLibrary({ variables: { id: deletingLibrary.id } });
      setDeletingLibrary(null);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Failed to remove library",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-rose-500/20">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Couldn&apos;t load libraries
        </h2>
        <p className="text-zinc-400 max-w-md mb-8">
          We had trouble fetching libraries from our servers. Please try
          again or check back later.
          <br />
          <span className="text-rose-400/80 text-sm mt-2 block break-all">
            Error: {error.message}
          </span>
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search libraries by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Libraries Table */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Registered Branches
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {libraries.length}{" "}
              {libraries.length === 1 ? "library" : "libraries"} connected to
              the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredLibraries.length === 0 ? (
              <div className="p-10 text-center text-zinc-400">
                {searchTerm
                  ? "No libraries match your search."
                  : "No libraries have been onboarded yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                    <tr>
                      <th className="px-6 py-4 font-medium">Library</th>
                      <th className="px-6 py-4 font-medium">Address</th>
                      <th className="px-6 py-4 font-medium">Balance</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLibraries.map((lib) => (
                      <tr
                        key={lib.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                              <Building className="h-5 w-5 text-purple-400" />
                            </div>
                            <p className="text-white font-medium">
                              {lib.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {lib.address}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {lib.balance !== null
                            ? `$${lib.balance.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                              onClick={() => openEdit(lib)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                              onClick={() => {
                                setActionError("");
                                setDeletingLibrary(lib);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Library Dialog */}
      <Dialog
        open={!!editingLibrary}
        onOpenChange={(open) => !open && setEditingLibrary(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Edit Library</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update this library&apos;s public details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Address</Label>
              <Input
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
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
              onClick={() => setEditingLibrary(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isUpdating || !editName.trim() || !editAddress.trim()}
              onClick={handleUpdate}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Library Confirmation */}
      <Dialog
        open={!!deletingLibrary}
        onOpenChange={(open) => !open && setDeletingLibrary(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Remove Library</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will permanently remove &quot;{deletingLibrary?.name}&quot;
              from the platform. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {actionError && (
            <p className="text-sm text-rose-400">{actionError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
              onClick={() => setDeletingLibrary(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
