/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type GetLibrariesQueryVariables = Exact<{ [key: string]: never }>;

export type GetLibrariesQuery = {
  getLibraries: Array<{
    __typename: "Library";
    id: string | null;
    name: string | null;
    address: string | null;
    balance: number | null;
  }> | null;
};

export type GetLibraryByIdQueryVariables = Exact<{
  id: string | number;
}>;

export type GetLibraryByIdQuery = {
  getLibraryById: {
    __typename: "Library";
    id: string | null;
    name: string | null;
    address: string | null;
    balance: number | null;
  } | null;
};

export const GetLibrariesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetLibraries" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "getLibraries" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "balance" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLibrariesQuery, GetLibrariesQueryVariables>;
export const GetLibraryByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetLibraryById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "getLibraryById" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "balance" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLibraryByIdQuery, GetLibraryByIdQueryVariables>;
