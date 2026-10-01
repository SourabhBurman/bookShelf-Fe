"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles } from "@/graphql/generated/graphql";
import { useGetUsersQuery } from "@/graphql/user/hooks";
import { GetUsersDocument } from "@/graphql/user/queries.generated";
import {
  UpdateUserDocument,
  DeleteUserDocument,
} from "@/graphql/user/mutations.generated";
import { AlertCircle, Pencil, RotateCcw, Search, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";

type UserRow = { id: string; name: string; email: string; role: string };

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const { fetchUsers, usersData, usersLoading, usersError } =
    useGetUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null);
  const [actionError, setActionError] = useState("");

  const [updateUser, { loading: isUpdating }] = useMutation(
    UpdateUserDocument,
    { refetchQueries: [{ query: GetUsersDocument }] },
  );
  const [deleteUser, { loading: isDeleting }] = useMutation(
    DeleteUserDocument,
    { refetchQueries: [{ query: GetUsersDocument }] },
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const users: UserRow[] = useMemo(
    () =>
      usersData
        .filter((u): u is NonNullable<typeof u> => !!u?.id)
        .map((u) => ({
          id: u.id as string,
          name: u.name || "Unnamed User",
          email: u.email || "No email on file",
          role: u.role?.displayName || "Reader",
        })),
    [usersData],
  );

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, searchTerm]);

  const openEdit = (u: UserRow) => {
    setActionError("");
    setEditingUser(u);
    setEditName(u.name);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      setActionError("");
      await updateUser({
        variables: { id: editingUser.id, input: { name: editName.trim() } },
      });
      setEditingUser(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      setActionError("");
      await deleteUser({ variables: { id: deletingUser.id } });
      setDeletingUser(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to remove user");
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
    <>
      <div className="flex flex-col gap-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Platform Users
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {users.length} {users.length === 1 ? "user" : "users"}{" "}
              registered on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              </div>
            ) : usersError ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
                <p className="text-zinc-300 font-medium mb-1">
                  Couldn&apos;t load users
                </p>
                <p className="text-zinc-500 text-sm mb-4 break-all">
                  {usersError.message}
                </p>
                <button
                  onClick={() => fetchUsers()}
                  className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-zinc-400">
                {searchTerm
                  ? "No users match your search."
                  : "No users registered yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                    <tr>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                              <span className="text-purple-400 font-semibold text-xs">
                                {u.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {u.name}
                              </p>
                              <p className="text-zinc-400 text-xs">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                              onClick={() => openEdit(u)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                              onClick={() => {
                                setActionError("");
                                setDeletingUser(u);
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

      {/* Edit User Dialog */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update this user&apos;s display name.
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
            {actionError && (
              <p className="text-sm text-rose-400">{actionError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isUpdating || !editName.trim()}
              onClick={handleUpdate}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <Dialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will permanently remove &quot;{deletingUser?.name}&quot;
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
              onClick={() => setDeletingUser(null)}
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
