import { useLazyQuery, useMutation } from "@apollo/client/react";
import { GetBooksDocument, GetBooksByLibraryDocument } from "./queries.generated";
import { CreateBookDocument, DeleteBookDocument } from "./mutations.generated";

export const useGetBooksQuery = () => {
  const [getBooks, options] = useLazyQuery(GetBooksDocument);
  return { getBooks, ...options };
};

export const useCreateBookMutation = () => useMutation(CreateBookDocument);
export const useDeleteBookMutation = () => useMutation(DeleteBookDocument);

export const useGetBooksByLibraryQuery = () => {
  const [getBooksByLibrary, { data, loading, error }] = useLazyQuery(
    GetBooksByLibraryDocument,
  );
  return {
    getBooksByLibrary,
    libraryBooksData: data?.getBooksByLibrary ?? [],
    libraryBooksLoading: loading,
    libraryBooksError: error,
  };
};
