import { gql } from "@apollo/client";

export const CREATE_ROLE = gql`
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      id
      type
      displayName
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $input: RoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      type
      displayName
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      success
      message
    }
  }
`;
