import { useLazyQuery } from "@apollo/client/react";
import { GetUserDocument, GetUsersDocument } from "./queries.generated";

export const useGetUserLazyQuery = () => {
  const [getUser, { loading, error }] = useLazyQuery(GetUserDocument);
  return { getUser, loading, error };
};

export const useGetUsersQuery = () => {
  const [fetchUsers, { data, loading, error }] =
    useLazyQuery(GetUsersDocument);
  return {
    fetchUsers,
    usersData: data?.getUsers ?? [],
    usersLoading: loading,
    usersError: error,
  };
};
