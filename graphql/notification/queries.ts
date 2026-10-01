import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      id
      type
      message
      isRead
      createdAt
    }
  }
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount {
    getUnreadNotificationCount
  }
`;
