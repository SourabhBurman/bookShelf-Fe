import { gql } from "@apollo/client";

export const CREATE_LIBRARY = gql`
  mutation CreateLibrary($input: LibraryInput!) {
    createLibrary(input: $input) {
      id
      name
      address
    }
  }
`;

export const ADD_BOOK_TO_LIBRARY = gql`
  mutation AddBookToLibrary($input: LibraryBookInput!) {
    addBookToLibrary(input: $input) {
      success
      message
    }
  }
`;
