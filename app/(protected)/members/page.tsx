"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles, OrderStatus } from "@/graphql/generated/graphql";
import { AlertCircle, RotateCcw, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetLibraryOrdersQuery } from "@/graphql/order/hooks";
import { useState } from "react";

type MemberRow = {
  id: string;
  name: string;
  email: string;
  activeRentals: number;
  totalOrders: number;
};

export default function OwnerMembersPage() {
  const { user, isLoading } = useAuth();
  const {
    fetchLibraryOrders,
    libraryOrdersData,
    libraryOrdersLoading,
    libraryOrdersError,
  } = useGetLibraryOrdersQuery();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLibraryOrders();
  }, [fetchLibraryOrders]);

  const members: MemberRow[] = useMemo(() => {
    const byUser = new Map<string, MemberRow>();
    for (const order of libraryOrdersData) {
      const u = order.user;
      if (!u?.id) continue;
      const existing = byUser.get(u.id) || {
        id: u.id,
        name: u.name || "Unnamed Member",
        email: u.email || "No email on file",
        activeRentals: 0,
        totalOrders: 0,
      };
      existing.totalOrders += 1;
      if (order.current_status === OrderStatus.Borrowed) {
        existing.activeRentals += 1;
      }
      byUser.set(u.id, existing);
    }
    return Array.from(byUser.values()).sort(
      (a, b) => b.totalOrders - a.totalOrders,
    );
  }, [libraryOrdersData]);

  const filteredMembers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    );
  }, [members, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (user?.role?.type !== User_Roles.LibraryOwner) {
    return <Forbidden />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Actions */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search members by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
        />
      </div>

      {/* Members Table */}
      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white text-lg font-semibold">
            Members
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {libraryOrdersLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : libraryOrdersError ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">
                Couldn&apos;t load members
              </p>
              <p className="text-zinc-500 text-sm mb-4 break-all">
                {libraryOrdersError.message}
              </p>
              <button
                onClick={() => fetchLibraryOrders()}
                className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-10 text-center text-zinc-400">
              {members.length === 0
                ? "No one has borrowed or purchased from your library yet."
                : "No members match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Member</th>
                    <th className="px-6 py-4 font-medium">Active Rentals</th>
                    <th className="px-6 py-4 font-medium">Total Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMembers.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                            <span className="text-purple-400 font-semibold">
                              {m.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{m.name}</p>
                            <p className="text-zinc-500 text-xs">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {m.activeRentals}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {m.totalOrders}
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
  );
}
