import { useQuery } from "@apollo/client/react";
import { GetAuditLogsDocument } from "./queries.generated";

export const useGetAuditLogsQuery = () => {
  const { data, loading, error, refetch } = useQuery(GetAuditLogsDocument);
  return {
    auditLogs: data?.getAuditLogs ?? [],
    auditLogsLoading: loading,
    auditLogsError: error,
    refetchAuditLogs: refetch,
  };
};
