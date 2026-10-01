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

export const UPDATE_LIBRARY = gql`
  mutation UpdateLibrary($id: ID!, $input: LibraryInput!) {
    updateLibrary(id: $id, input: $input) {
      id
      name
      address
      balance
    }
  }
`;

export const DELETE_LIBRARY = gql`
  mutation DeleteLibrary($id: ID!) {
    deleteLibrary(id: $id) {
      id
    }
  }
`;

export const UPDATE_LIBRARY_BOOK = gql`
  mutation UpdateLibraryBook($id: ID!, $input: UpdateLibraryBookInput!) {
    updateLibraryBook(id: $id, input: $input) {
      id
      totalQuantities
      quantityAvailable
    }
  }
`;
