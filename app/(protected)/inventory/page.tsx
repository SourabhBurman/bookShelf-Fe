"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { NavItem } from "@/components/layout/DashboardShell";
import {
  PieChart,
  BookOpen,
  Users,
  IndianRupee,
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockInventory = [
  {
    id: "BK-100",
    title: "The Midnight Library",
    author: "Matt Haig",
    stock: 5,
    total: 5,
    status: "Available",
    price: "$2.99",
  },
  {
    id: "BK-101",
    title: "Atomic Habits",
    author: "James Clear",
    stock: 0,
    total: 3,
    status: "Out of Stock",
    price: "$3.50",
  },
  {
    id: "BK-102",
    title: "Dune",
    author: "Frank Herbert",
    stock: 1,
    total: 4,
    status: "Low Stock",
    price: "$4.00",
  },
  {
    id: "BK-103",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    stock: 6,
    total: 6,
    status: "Available",
    price: "$3.99",
  },
];

export default function OwnerInventoryPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  let role = "user";
  if (user?.role) {
    role =
      typeof user.role === "string"
        ? user.role
        : String(user.role.type || user.role).toLowerCase();
  }

  if (role !== "owner") {
    return <Forbidden />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search books by title, author, or ISBN..."
            className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="bg-transparent border-white/10 text-white hover:bg-white/5 flex-1 sm:flex-none"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                <tr>
                  <th className="px-6 py-4 font-medium">Book Details</th>
                  <th className="px-6 py-4 font-medium">Rental Price</th>
                  <th className="px-6 py-4 font-medium">Stock Level</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockInventory.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 bg-zinc-800 rounded flex items-center justify-center shrink-0 border border-white/10">
                          <BookOpen className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{b.title}</p>
                          <p className="text-zinc-400 text-xs">{b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{b.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {b.stock}
                        </span>
                        <span className="text-zinc-500">/ {b.total}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          b.status === "Out of Stock"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : b.status === "Low Stock"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
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
