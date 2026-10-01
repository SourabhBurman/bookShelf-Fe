/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetSavedBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSavedBooksQuery = { getSavedBooks: Array<{ __typename: 'SavedBook', id: string | null, createdAt: unknown, book: { __typename: 'Book', id: string | null, name: string | null, author: string | null, genre: string | null, coverImage: string | null, rentPrice: number | null, cost: number | null, quantityAvailable: number | null, totalAvailableCopies: number | null, averageRating: number | null } | null }> };


export const GetSavedBooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSavedBooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSavedBooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"genre"}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"}},{"kind":"Field","name":{"kind":"Name","value":"rentPrice"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailableCopies"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}}]}}]}}]}}]} as unknown as DocumentNode<GetSavedBooksQuery, GetSavedBooksQueryVariables>;