"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import {
  PieChart,
  BookOpen,
  Users,
  IndianRupee,
  Settings,
  Search,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ownerNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: <PieChart /> },
  { title: "Inventory", href: "/dashboard/inventory", icon: <BookOpen /> },
  { title: "Members", href: "/dashboard/members", icon: <Users /> },
  { title: "Financials", href: "/dashboard/financials", icon: <IndianRupee /> },
  { title: "Settings", href: "/dashboard/settings", icon: <Settings /> },
];

const mockMembers = [
  {
    id: "M-101",
    name: "Alice Walker",
    activeRentals: 2,
    totalRentals: 15,
    fines: "$0.00",
    status: "Active",
  },
  {
    id: "M-102",
    name: "John Smith",
    activeRentals: 0,
    totalRentals: 3,
    fines: "$5.50",
    status: "Overdue",
  },
  {
    id: "M-103",
    name: "Emma Davis",
    activeRentals: 1,
    totalRentals: 8,
    fines: "$0.00",
    status: "Active",
  },
  {
    id: "M-104",
    name: "Michael Chen",
    activeRentals: 0,
    totalRentals: 42,
    fines: "$0.00",
    status: "VIP",
  },
];

export default function OwnerMembersPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search members by name or ID..."
            className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
          />
        </div>
        <Button className="bg-white/10 hover:bg-white/20 text-white shadow-lg border border-white/10">
          <Mail className="mr-2 h-4 w-4" />
          Message All
        </Button>
      </div>

      {/* Members Table */}
      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white text-lg font-semibold">
            Registered Members
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                <tr>
                  <th className="px-6 py-4 font-medium">Member</th>
                  <th className="px-6 py-4 font-medium">Active Rentals</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">
                    Total History
                  </th>
                  <th className="px-6 py-4 font-medium">Outstanding Fines</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                          <span className="text-purple-400 font-semibold">
                            {m.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{m.name}</p>
                          <p className="text-zinc-500 text-xs">{m.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {m.activeRentals}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 hidden sm:table-cell">
                      {m.totalRentals} books
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          m.fines !== "$0.00"
                            ? "text-rose-400 font-medium"
                            : "text-zinc-500"
                        }
                      >
                        {m.fines}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          m.status === "Overdue"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : m.status === "VIP"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
