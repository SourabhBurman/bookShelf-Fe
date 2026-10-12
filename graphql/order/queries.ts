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
        id
        transactionType
        transactionDate
        paymentStatus
        amount
      }
    }
  }
`;

export const GET_LIBRARY_ORDERS = gql`
  query GetLibraryOrders {
    getLibraryOrders {
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
      user {
        id
        name
        email
      }
      expectedReturnDate
      current_status
      transactions {
        id
        transactionType
        transactionDate
        paymentStatus
        amount
      }
    }
  }
`;

export const GET_PAYMENT_STATUS = gql`
  query GetPaymentStatus($paymentIntentId: String!) {
    getPaymentStatus(paymentIntentId: $paymentIntentId) {
      paymentIntentId
      paymentStatus
      orderId
      orderStatus
      bookName
    }
  }
`;
