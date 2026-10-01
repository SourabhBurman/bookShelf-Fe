import { gql } from "@apollo/client";

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs {
    getAuditLogs {
      id
      actorEmail
      action
      targetType
      targetId
      details
      createdAt
    }
  }
`;
