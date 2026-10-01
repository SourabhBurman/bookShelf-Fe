import { gql } from "@apollo/client";

export const GET_SAVED_BOOKS = gql`
  query GetSavedBooks {
    getSavedBooks {
      id
      createdAt
      book {
        id
        name
        author
        genre
        coverImage
        rentPrice
        cost
        quantityAvailable
        totalAvailableCopies
        averageRating
      }
    }
  }
`;
