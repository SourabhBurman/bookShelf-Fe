"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Globe, Building, Users, ShieldAlert, Activity, Search, MoreHorizontal, UserX, UserCheck, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { title: "Platform Overview", href: "/dashboard", icon: <Globe /> },
  { title: "Libraries", href: "/dashboard/libraries", icon: <Building /> },
  { title: "Users", href: "/dashboard/users", icon: <Users /> },
  { title: "Reports", href: "/dashboard/reports", icon: <ShieldAlert /> },
  { title: "System Health", href: "/dashboard/health", icon: <Activity /> },
];

const mockUsers = [
  { id: "101", name: "Alice Walker", email: "alice@example.com", role: "user", status: "active", joined: "2024-01-15" },
  { id: "102", name: "Central Library", email: "contact@central.lib", role: "owner", status: "active", joined: "2023-11-20" },
  { id: "103", name: "John Smith", email: "john.s@example.com", role: "user", status: "suspended", joined: "2024-03-05" },
  { id: "104", name: "Super Admin", email: "admin@bookshelf.com", role: "admin", status: "active", joined: "2023-01-01" },
  { id: "105", name: "Emma Davis", email: "emma.d@example.com", role: "user", status: "active", joined: "2024-04-12" },
];

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  let role = "user";
  if (user?.role) {
    role = typeof user.role === "string" ? user.role : String(user.role.type || user.role).toLowerCase();
  }

  if (role !== "admin") {
    return (
      <DashboardShell navItems={[]} userTitle="Unauthorized">
        <Forbidden />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={adminNavItems} userTitle="User Management">
      <div className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by name, email, or ID..."
              className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
            />
          </div>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 whitespace-nowrap">
            <Shield className="mr-2 h-4 w-4" />
            Invite Admin
          </Button>
        </div>

        {/* Users Table */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white text-lg font-semibold">Platform Users</CardTitle>
            <CardDescription className="text-zinc-400">
              Manage all registered users, library owners, and administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Joined</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                            <span className="text-purple-400 font-semibold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.name}</p>
                            <p className="text-zinc-400 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          u.role === 'owner' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                          <span className={u.status === 'active' ? 'text-zinc-300' : 'text-rose-400'}>
                            {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 hidden md:table-cell">
                        {u.joined}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                          {u.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
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
    </DashboardShell>
  );
}
