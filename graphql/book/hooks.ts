import { useLazyQuery } from "@apollo/client/react";
import { GetBooksDocument } from "./queries.generated";

export const useGetBooksQuery = () => {
  const [getBooks, options] = useLazyQuery(GetBooksDocument);
  return { getBooks, ...options };
};
