import { gql } from "@apollo/client";

export const JOIN_WAITLIST = gql`
  mutation JoinWaitlist($bookId: ID!) {
    joinWaitlist(bookId: $bookId) {
      id
      book {
        id
      }
    }
  }
`;

export const LEAVE_WAITLIST = gql`
  mutation LeaveWaitlist($bookId: ID!) {
    leaveWaitlist(bookId: $bookId) {
      success
      message
    }
  }
`;
