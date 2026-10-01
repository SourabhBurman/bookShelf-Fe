"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles } from "@/graphql/generated/graphql";
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/graphql/role/hooks";
import { GetRolesDocument } from "@/graphql/role/queries.generated";
import { AlertCircle, Pencil, ShieldCheck, Trash2 } from "lucide-react";
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

type RoleRow = { id: string; type: string; displayName: string };

export default function AdminRolesPage() {
  const { user, isLoading } = useAuth();
  const { roles, rolesLoading, rolesError } = useGetRolesQuery();
  const { permissions } = useGetPermissionsQuery();
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [deletingRole, setDeletingRole] = useState<RoleRow | null>(null);
  const [actionError, setActionError] = useState("");

  const [updateRole, { loading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { loading: isDeleting }] = useDeleteRoleMutation();

  const openEdit = (r: RoleRow) => {
    setActionError("");
    setEditingRole(r);
    setEditDisplayName(r.displayName);
    setSelectedPermissionIds([]);
  };

  const togglePermission = (id: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleUpdate = async () => {
    if (!editingRole) return;
    try {
      setActionError("");
      await updateRole({
        variables: {
          id: editingRole.id,
          input: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: editingRole.type as any,
            displayName: editDisplayName.trim(),
            permissions: selectedPermissionIds.map((id) => ({ id })),
          },
        },
        refetchQueries: [{ query: GetRolesDocument }],
      });
      setEditingRole(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update role");
    }
  };

  const handleDelete = async () => {
    if (!deletingRole) return;
    try {
      setActionError("");
      await deleteRole({
        variables: { id: deletingRole.id },
        refetchQueries: [{ query: GetRolesDocument }],
      });
      setDeletingRole(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to delete role");
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
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Roles &amp; Permissions
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {roles.length} {roles.length === 1 ? "role" : "roles"} defined
              on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {rolesLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              </div>
            ) : rolesError ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
                <p className="text-zinc-300 font-medium mb-1">
                  Couldn&apos;t load roles
                </p>
                <p className="text-zinc-500 text-sm break-all">
                  {rolesError.message}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                    <tr>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {roles.map((r) => (
                      <tr
                        key={r?.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                              <ShieldCheck className="h-4 w-4 text-purple-400" />
                            </div>
                            <p className="text-white font-medium">
                              {r?.displayName}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300">{r?.type}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                              onClick={() =>
                                r?.id &&
                                openEdit({
                                  id: r.id,
                                  type: r.type ?? "",
                                  displayName: r.displayName ?? "",
                                })
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                              onClick={() =>
                                r?.id &&
                                (setActionError(""),
                                setDeletingRole({
                                  id: r.id,
                                  type: r.type ?? "",
                                  displayName: r.displayName ?? "",
                                }))
                              }
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

      {/* Edit Role Dialog */}
      <Dialog
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update this role&apos;s display name and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">Display Name</Label>
              <Input
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Permissions</Label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 border border-white/10 rounded-lg p-3 bg-zinc-900/50">
                {permissions.length === 0 ? (
                  <p className="text-xs text-zinc-500">
                    No permissions defined yet.
                  </p>
                ) : (
                  permissions.map((p) => (
                    <label
                      key={p?.id}
                      className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={!!p?.id && selectedPermissionIds.includes(p.id)}
                        onChange={() => p?.id && togglePermission(p.id)}
                        className="rounded border-white/20"
                      />
                      {p?.name}
                    </label>
                  ))
                )}
              </div>
            </div>
            {actionError && (
              <p className="text-sm text-rose-400">{actionError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
              onClick={() => setEditingRole(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isUpdating || !editDisplayName.trim()}
              onClick={handleUpdate}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <Dialog
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will permanently delete &quot;{deletingRole?.displayName}
              &quot;. Roles still assigned to a user can&apos;t be deleted.
            </DialogDescription>
          </DialogHeader>
          {actionError && <p className="text-sm text-rose-400">{actionError}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
              onClick={() => setDeletingRole(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
