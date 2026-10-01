"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useApolloClient } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import {
  GetNotificationsDocument,
  GetUnreadNotificationCountDocument,
} from "@/graphql/notification/queries.generated";

/**
 * Opens a live connection to the backend while the user's logged in, and
 * refetches the notification queries the instant a new one is pushed
 * (see server/src/util/notify.ts) — instead of only finding out on the
 * next 30s poll (DashboardShell.tsx's useGetUnreadNotificationCountQuery).
 *
 * `withCredentials: true` is what makes the browser attach the
 * `accessToken` httpOnly cookie to the socket's initial handshake
 * request — the same cookie every GraphQL request already relies on —
 * so the server can identify *which* user this connection belongs to
 * (see server/src/config/socket.ts's auth middleware).
 */
export const useNotificationSocket = () => {
  const { user } = useAuth();
  const client = useApolloClient();

  useEffect(() => {
    if (!user) return;

    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });

    socket.on("notification", () => {
      // Refetch rather than trying to hand-splice the pushed payload into
      // Apollo's cache — simpler, and guarantees the list/count are
      // exactly what a fresh page load would show, not a hand-maintained
      // approximation of it.
      client.refetchQueries({
        include: [GetNotificationsDocument, GetUnreadNotificationCountDocument],
      });
    });

    socket.on("connect_error", (err) => {
      // Non-fatal — the 30s poll is still running as a fallback, so a
      // failed/rejected socket just means slightly slower notifications,
      // not a broken app.
      console.warn("Notification socket connection failed:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, client]);
};
