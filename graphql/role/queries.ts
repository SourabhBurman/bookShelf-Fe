import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query GetRoles {
    getRoles {
      id
      type
      displayName
    }
  }
`;

export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    getRole(id: $id) {
      id
      role
      displayName
      permissions {
        id
        name
        description
      }
    }
  }
`;

export const GET_PERMISSIONS = gql`
  query GetPermissions {
    getPermissions {
      id
      name
      description
    }
  }
`;
