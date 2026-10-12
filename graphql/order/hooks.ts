import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  GetOrdersDocument,
  GetLibraryOrdersDocument,
  GetPaymentStatusDocument,
} from "./queries.generated";

export const useGetOrdersQuery = () => {
  const [fetchOrders, { data, loading, error }] =
    useLazyQuery(GetOrdersDocument);
  return {
    fetchOrders,
    ordersData: data?.getOrders ?? [],
    ordersLoading: loading,
    ordersError: error,
  };
};

// Orders placed against the library owned by the current user — distinct
// from useGetOrdersQuery, which only returns the current user's own orders
// as a borrower/purchaser.
export const useGetLibraryOrdersQuery = () => {
  const [fetchLibraryOrders, { data, loading, error }] = useLazyQuery(
    GetLibraryOrdersDocument,
  );
  return {
    fetchLibraryOrders,
    libraryOrdersData: data?.getLibraryOrders ?? [],
    libraryOrdersLoading: loading,
    libraryOrdersError: error,
  };
};

// Server-side status of one Stripe payment, as settled by the backend's
// webhook. Polled by the checkout success page as a fallback for the live
// `payment_status` socket push (see hooks/useNotificationSocket.ts), which
// refetches this query the moment the webhook lands.
export const useGetPaymentStatusQuery = (
  paymentIntentId: string | null,
  pollInterval: number,
) => {
  const { data, error } = useQuery(GetPaymentStatusDocument, {
    variables: { paymentIntentId: paymentIntentId ?? "" },
    skip: !paymentIntentId,
    pollInterval,
    fetchPolicy: "network-only",
  });
  return {
    paymentStatus: data?.getPaymentStatus ?? null,
    paymentStatusError: error,
  };
};
