import { useQuery, useMutation } from "@apollo/client/react";
import { GetRolesDocument, GetPermissionsDocument } from "./queries.generated";
import {
  CreateRoleDocument,
  UpdateRoleDocument,
  DeleteRoleDocument,
} from "./mutations.generated";

export const useGetRolesQuery = () => {
  const { data, loading, error, refetch } = useQuery(GetRolesDocument);
  return {
    roles: data?.getRoles ?? [],
    rolesLoading: loading,
    rolesError: error,
    refetchRoles: refetch,
  };
};

export const useGetPermissionsQuery = () => {
  const { data, loading, error } = useQuery(GetPermissionsDocument);
  return {
    permissions: data?.getPermissions ?? [],
    permissionsLoading: loading,
    permissionsError: error,
  };
};

export const useCreateRoleMutation = () => useMutation(CreateRoleDocument);
export const useUpdateRoleMutation = () => useMutation(UpdateRoleDocument);
export const useDeleteRoleMutation = () => useMutation(DeleteRoleDocument);
