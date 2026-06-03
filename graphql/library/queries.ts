import { gql } from "@apollo/client";

export const GET_LIBRARIES = gql`
  query GetLibraries {
    getLibraries {
      id
      name
      address
      balance
    }
  }
`;

export const GET_LIBRARY_BY_ID = gql`
  query GetLibraryById($id: ID!) {
    getLibraryById(id: $id) {
      id
      name
      address
      balance
    }
  }
`;
