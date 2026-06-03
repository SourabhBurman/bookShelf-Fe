import { useQuery, useLazyQuery } from "@apollo/client/react";
import { GetLibrariesDocument, GetLibraryByIdDocument } from "./queries.generated";

export const useGetLibrariesQuery = () => {
  const query = useQuery(GetLibrariesDocument);
  return query;
};

export const useGetLibraryByIdQuery = (id: string) => {
  const query = useQuery(GetLibraryByIdDocument, { variables: { id } });
  return query;
};
