"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Forbidden } from "@/components/ui/Forbidden";
import { useAuth } from "@/context/AuthContext";
import { Activity, Cpu, Database, Network, Server } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

export default function AdminHealthPage() {
  const { user, isLoading } = useAuth();

  // Simulated real-time data
  const [cpuData, setCpuData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: Math.floor(Math.random() * 40) + 20,
    })),
  );
  const [memData, setMemData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: Math.floor(Math.random() * 20) + 60,
    })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: Math.floor(Math.random() * 40) + 20,
        },
      ]);
      setMemData((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: Math.floor(Math.random() * 20) + 60,
        },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return null;

  let role = "user";
  if (user?.role) {
    role =
      typeof user.role === "string"
        ? user.role
        : String(user.role.type || user.role).toLowerCase();
  }

  if (role !== "admin") {
    return (
      <DashboardShell userTitle="Unauthorized">
        <Forbidden />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell userTitle="System Health">
      <div className="flex flex-col gap-6">
        {/* Status Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Server className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">API Server</p>
              <p className="text-zinc-400 text-sm">
                Operational (99.9% uptime)
              </p>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Database className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">Database</p>
              <p className="text-zinc-400 text-sm">
                Replicating (12ms latency)
              </p>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Network className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">CDN Node</p>
              <p className="text-zinc-400 text-sm">Routing optimized</p>
            </div>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <p className="text-rose-400 font-semibold">Worker Node 3</p>
              <p className="text-zinc-400 text-sm">High Load (92% CPU)</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mt-4">
          <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">CPU Utilization</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cpuData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <YAxis
                      domain={[0, 100]}
                      stroke="#52525b"
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#3f3f46",
                      }}
                      itemStyle={{ color: "#d8b4fe" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCpu)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Memory Usage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memData}>
                    <YAxis
                      domain={[0, 100]}
                      stroke="#52525b"
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#3f3f46",
                      }}
                      itemStyle={{ color: "#93c5fd" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
