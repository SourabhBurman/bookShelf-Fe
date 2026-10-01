import { gql } from "@apollo/client";

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($input: PlaceOrderInput!) {
    createPaymentIntent(input: $input) {
      clientSecret
      amount
      currency
    }
  }
`;

export const RETURN_ORDER = gql`
  mutation ReturnOrder($input: [UpdateOrderInput]!) {
    returnOrder(input: $input) {
      id
      current_status
    }
  }
`;
