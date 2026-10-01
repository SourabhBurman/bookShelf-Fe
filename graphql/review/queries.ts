import { gql } from "@apollo/client";

export const GET_REVIEWS_FOR_BOOK = gql`
  query GetReviewsForBook($bookId: ID!) {
    getReviewsForBook(bookId: $bookId) {
      id
      rating
      comment
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      id
      rating
      comment
      createdAt
      user {
        id
        name
        email
      }
      book {
        id
        name
      }
    }
  }
`;
