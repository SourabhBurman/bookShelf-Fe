import { gql } from "@apollo/client";

export const GET_MY_WAITLIST = gql`
  query GetMyWaitlist {
    getMyWaitlist {
      id
      book {
        id
      }
    }
  }
`;
