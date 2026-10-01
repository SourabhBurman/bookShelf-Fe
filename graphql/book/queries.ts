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
      coverImage
      author
      totalAvailableCopies
      averageRating
    }
  }
`;

export const GET_BOOKS_BY_LIBRARY = gql`
  query GetBooksByLibrary($id: ID!) {
    getBooksByLibrary(id: $id) {
      id
      totalQuantities
      quantityAvailable
      book {
        id
        name
        author
        genre
        cost
        rentPrice
        coverImage
      }
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
      coverImage
      author
      averageRating
      totalAvailableCopies
    }
  }
`;
