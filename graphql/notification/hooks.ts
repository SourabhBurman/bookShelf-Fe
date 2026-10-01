import { useQuery, useMutation } from "@apollo/client/react";
import {
  GetNotificationsDocument,
  GetUnreadNotificationCountDocument,
} from "./queries.generated";
import {
  MarkNotificationReadDocument,
  MarkAllNotificationsReadDocument,
} from "./mutations.generated";

export const useGetNotificationsQuery = (
  pollInterval?: number,
  skip?: boolean,
) => {
  const { data, loading, error, refetch } = useQuery(GetNotificationsDocument, {
    pollInterval,
    skip,
  });
  return {
    notifications: data?.getNotifications ?? [],
    notificationsLoading: loading,
    notificationsError: error,
    refetchNotifications: refetch,
  };
};

export const useGetUnreadNotificationCountQuery = (
  pollInterval?: number,
  skip?: boolean,
) => {
  const { data, loading, refetch } = useQuery(GetUnreadNotificationCountDocument, {
    pollInterval,
    skip,
  });
  return {
    unreadCount: data?.getUnreadNotificationCount ?? 0,
    unreadCountLoading: loading,
    refetchUnreadCount: refetch,
  };
};

export const useMarkNotificationReadMutation = () =>
  useMutation(MarkNotificationReadDocument);

export const useMarkAllNotificationsReadMutation = () =>
  useMutation(MarkAllNotificationsReadDocument);
