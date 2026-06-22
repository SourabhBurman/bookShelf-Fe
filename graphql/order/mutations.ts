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
