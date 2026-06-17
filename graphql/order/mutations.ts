import { gql } from "@apollo/client";

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: [PlaceOrderInput]!) {
    placeOrder(input: $input) {
      id
      transactions {
        transactionType
        transactionDate
      }
    }
  }
`;

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($input: PlaceOrderInput!) {
    createPaymentIntent(input: $input) {
      razorpayOrderId
      amount
      currency
    }
  }
`;
