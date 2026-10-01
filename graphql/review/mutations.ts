import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
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

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      success
      message
    }
  }
`;
