import { useQuery, useMutation } from "@apollo/client/react";
import { GetSavedBooksDocument } from "./queries.generated";
import { SaveBookDocument, UnsaveBookDocument } from "./mutations.generated";

export const useGetSavedBooksQuery = (skip?: boolean) => {
  const { data, loading, error, refetch } = useQuery(GetSavedBooksDocument, {
    skip,
  });
  return {
    savedBooks: data?.getSavedBooks ?? [],
    savedBooksLoading: loading,
    savedBooksError: error,
    refetchSavedBooks: refetch,
  };
};

export const useSaveBookMutation = () => useMutation(SaveBookDocument);
export const useUnsaveBookMutation = () => useMutation(UnsaveBookDocument);
