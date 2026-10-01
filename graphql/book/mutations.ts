import { gql } from "@apollo/client";

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: updateBookInput!) {
    updateBook(id: $id, input: $input) {
      id
      name
      quantityAvailable
      rentPrice
      cost
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      id
      name
      author
      genre
      description
      cost
      rentPrice
      quantityAvailable
      coverImage
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      success
      message
    }
  }
`;
