import { Globe, Building, Users, ShieldAlert, Activity, Search, Plus, MoreHorizontal, ShieldCheck, XCircle } from "lucide-react";
import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const adminNavItems: NavItem[] = [
  { title: "Platform Overview", href: "/dashboard", icon: <Globe /> },
  { title: "Libraries", href: "/dashboard/libraries", icon: <Building /> },
  { title: "Users", href: "/dashboard/users", icon: <Users /> },
  { title: "Reports", href: "/dashboard/reports", icon: <ShieldAlert /> },
  { title: "System Health", href: "/dashboard/health", icon: <Activity /> },
];

const mockLibraries = [
  { id: "LIB-001", name: "Central City Library", owner: "contact@central.lib", location: "Downtown", books: 12450, status: "Active" },
  { id: "LIB-002", name: "Northside Community Branch", owner: "northside@example.com", location: "North District", books: 4320, status: "Active" },
  { id: "LIB-003", name: "Tech Hub Archives", owner: "admin@techhub.edu", location: "University District", books: 8900, status: "Under Review" },
  { id: "LIB-004", name: "Westend Books", owner: "westend@books.com", location: "Westside", books: 1200, status: "Suspended" },
];

export function AdminLibraries() {
  return (
    <DashboardShell navItems={adminNavItems} userTitle="Library Network">
      <div className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search libraries by name or location..."
              className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
            />
          </div>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Onboard Library
          </Button>
        </div>

        {/* Libraries Table */}
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white text-lg font-semibold">Registered Branches</CardTitle>
            <CardDescription className="text-zinc-400">Manage all libraries connected to the platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Library Name & Owner</th>
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium">Total Inventory</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockLibraries.map((lib) => (
                    <tr key={lib.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                            <Building className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{lib.name}</p>
                            <p className="text-zinc-500 text-xs">{lib.owner}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {lib.location}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{lib.books.toLocaleString()}</span>
                        <span className="text-zinc-500 ml-1">books</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          lib.status === 'Suspended' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          lib.status === 'Under Review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {lib.status === 'Active' && <ShieldCheck className="mr-1 h-3 w-3" />}
                          {lib.status === 'Suspended' && <XCircle className="mr-1 h-3 w-3" />}
                          {lib.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
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
