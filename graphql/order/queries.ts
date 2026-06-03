import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      id
      user {
        name
        email
      }
      book {
        name
        cost
      }
      transactionType
      transactionDate
      expectedReturnDate
    }
  }
`;
