"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { PieChart, BookOpen, Users, IndianRupee, Settings, Download, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ownerNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: <PieChart /> },
  { title: "Inventory", href: "/dashboard/inventory", icon: <BookOpen /> },
  { title: "Members", href: "/dashboard/members", icon: <Users /> },
  { title: "Financials", href: "/dashboard/financials", icon: <IndianRupee /> },
  { title: "Settings", href: "/dashboard/settings", icon: <Settings /> },
];

const revenueData = [
  { name: "Week 1", rentals: 400, fines: 240, purchases: 600 },
  { name: "Week 2", rentals: 300, fines: 139, purchases: 450 },
  { name: "Week 3", rentals: 550, fines: 400, purchases: 800 },
  { name: "Week 4", rentals: 780, fines: 190, purchases: 950 },
];

const transactions = [
  { id: "TX-9901", type: "Platform Payout", amount: "+$1,250.00", status: "Completed", date: "Today" },
  { id: "TX-9902", type: "Member Rental (Dune)", amount: "+$4.00", status: "Completed", date: "Yesterday" },
  { id: "TX-9903", type: "Late Fine (A. Walker)", amount: "+$1.50", status: "Pending", date: "2 days ago" },
  { id: "TX-9904", type: "Platform Fee", amount: "-$45.00", status: "Completed", date: "1 week ago" },
];

export default function OwnerFinancialsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  let role = "user";
  if (user?.role) {
    role = typeof user.role === "string" ? user.role : String(user.role.type || user.role).toLowerCase();
  }

  if (role !== "owner") {
    return (
      <DashboardShell navItems={[]} userTitle="Unauthorized">
        <Forbidden />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={ownerNavItems} userTitle="Financial Analytics">
      <div className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
            <CreditCard className="mr-2 h-4 w-4" />
            Request Payout
          </Button>
        </div>

        {/* Charts & Balances */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-lg font-semibold">Revenue Breakdown</CardTitle>
              <CardDescription className="text-zinc-400">Monthly breakdown of your earnings sources.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRentals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#52525b" tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="rentals" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRentals)" />
                    <Area type="monotone" dataKey="purchases" stroke="#10b981" fillOpacity={1} fill="url(#colorPurchases)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-emerald-400 font-medium">Available Balance</CardDescription>
                <CardTitle className="text-4xl text-white font-bold">$3,240.50</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-emerald-400 text-sm mt-2">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+12.5% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-zinc-400 font-medium">Pending Fines</CardDescription>
                <CardTitle className="text-2xl text-white font-bold">$142.00</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-rose-400 text-sm mt-2">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>Uncollected overdue fees</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white text-lg font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-zinc-300 font-medium">{tx.id}</td>
                      <td className="px-6 py-4 text-white">{tx.type}</td>
                      <td className={`px-6 py-4 font-medium ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{tx.date}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {tx.status}
                        </span>
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
