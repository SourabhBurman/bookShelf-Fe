import { gql } from "@apollo/client";

export const SAVE_BOOK = gql`
  mutation SaveBook($bookId: ID!) {
    saveBook(bookId: $bookId) {
      id
      book {
        id
      }
    }
  }
`;

export const UNSAVE_BOOK = gql`
  mutation UnsaveBook($bookId: ID!) {
    unsaveBook(bookId: $bookId) {
      success
      message
    }
  }
`;
