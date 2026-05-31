"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Globe, Building, Users, ShieldAlert, Activity, Search, AlertTriangle, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
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

const mockReports = [
  { id: "RPT-001", type: "Fraud", description: "Suspicious bulk rental activity", status: "open", severity: "high", date: "2 hours ago" },
  { id: "RPT-002", type: "Dispute", description: "User disputes overdue fines", status: "investigating", severity: "medium", date: "5 hours ago" },
  { id: "RPT-003", type: "System", description: "Payment gateway timeout spikes", status: "resolved", severity: "high", date: "1 day ago" },
  { id: "RPT-004", type: "Content", description: "Inappropriate library description", status: "open", severity: "low", date: "2 days ago" },
];

export default function AdminReportsPage() {
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
    <DashboardShell navItems={adminNavItems} userTitle="System Reports & Alerts">
      <div className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search reports by ID or keyword..."
              className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              Filter Status
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
              <FileText className="mr-2 h-4 w-4" />
              Generate Audit
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <div className="grid gap-4">
          {mockReports.map((report) => (
            <Card key={report.id} className="bg-zinc-900/50 border-white/5 backdrop-blur-xl hover:bg-zinc-800/50 transition-colors cursor-pointer group">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    report.severity === 'high' ? 'bg-rose-500/10 text-rose-400' :
                    report.severity === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {report.severity === 'high' ? <AlertTriangle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{report.id}</span>
                      <span className="text-zinc-500 text-sm">•</span>
                      <span className="text-zinc-400 text-sm">{report.type}</span>
                    </div>
                    <p className="text-zinc-300 text-sm">{report.description}</p>
                    <p className="text-zinc-500 text-xs mt-2">{report.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 justify-between sm:justify-end">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    report.status === 'open' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    report.status === 'investigating' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {report.status === 'resolved' && <CheckCircle2 className="mr-1.5 h-3 w-3" />}
                    {report.status.toUpperCase()}
                  </span>
                  <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
