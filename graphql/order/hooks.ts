import { useLazyQuery } from "@apollo/client/react";
import { GetOrdersDocument, GetLibraryOrdersDocument } from "./queries.generated";

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
