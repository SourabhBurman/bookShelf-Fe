import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      id
      book {
        name
        cost
        coverImage
        author
      }
      library {
        id
        name
        address
      }
      expectedReturnDate
      current_status
      transactions {
        transactionType
        transactionDate
        paymentStatus
        amount
      }
    }
  }
`;
