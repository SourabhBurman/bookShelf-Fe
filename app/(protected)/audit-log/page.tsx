"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles } from "@/graphql/generated/graphql";
import { useGetAuditLogsQuery } from "@/graphql/auditLog/hooks";
import { AlertCircle, ScrollText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default function AdminAuditLogPage() {
  const { user, isLoading } = useAuth();
  const { auditLogs, auditLogsLoading, auditLogsError } =
    useGetAuditLogsQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(auditLogs.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLogs = useMemo(
    () => auditLogs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [auditLogs, safePage],
  );

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
    <div className="flex flex-col gap-8">
      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-purple-400" /> Audit Log
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {auditLogs.length} recent admin{" "}
            {auditLogs.length === 1 ? "action" : "actions"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {auditLogsLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : auditLogsError ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">
                Couldn&apos;t load the audit log
              </p>
              <p className="text-zinc-500 text-sm break-all">
                {auditLogsError.message}
              </p>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-10 text-center text-zinc-400">
              No admin actions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Time</th>
                    <th className="px-6 py-4 font-medium">Actor</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                    <th className="px-6 py-4 font-medium">Target</th>
                    <th className="px-6 py-4 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedLogs.map((log) => (
                    <tr
                      key={log?.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-zinc-400 whitespace-nowrap text-xs">
                        {log?.createdAt
                          ? new Date(log.createdAt as Date).toLocaleString()
                          : ""}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {log?.actorEmail}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-purple-500/10 text-purple-300 border-purple-500/20">
                          {log?.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {log?.targetType}
                        {log?.targetId ? ` #${log.targetId}` : ""}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs max-w-xs truncate font-mono">
                        {log?.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
