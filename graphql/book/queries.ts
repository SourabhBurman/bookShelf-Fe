import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query GetBooks($pagination: BookPaginationInput, $filter: BookFilterInput) {
    getBooks(pagination: $pagination, filter: $filter) {
      id
      name
      description
      genre
      quantityAvailable
      cost
      rentPrice
      publishedDate
    }
  }
`;

export const GET_BOOK_BY_ID = gql`
  query GetBookById($id: ID!) {
    getBook(id: $id) {
      id
      name
      description
      genre
      quantityAvailable
      cost
      rentPrice
      publishedDate
    }
  }
`;
