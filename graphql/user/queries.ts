import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      name
      email
      role {
        id
        displayName
        type
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      gender
      role {
        displayName
      }
    }
  }
`;
