import { useLazyQuery } from "@apollo/client/react";
import { GetOrdersDocument } from "./queries.generated";

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
