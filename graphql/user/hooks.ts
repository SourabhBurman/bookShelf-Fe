import { useLazyQuery } from "@apollo/client/react";
import { GetUserDocument } from "./queries.generated";

export const useGetUserLazyQuery = () => {
  const [getUser, { loading, error }] = useLazyQuery(GetUserDocument);
  return { getUser, loading, error };
};
