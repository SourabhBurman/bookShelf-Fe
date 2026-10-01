/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type JoinWaitlistMutationVariables = Exact<{
  bookId: string | number;
}>;


export type JoinWaitlistMutation = { joinWaitlist: { __typename: 'Waitlist', id: string | null, book: { __typename: 'Book', id: string | null } | null } };

export type LeaveWaitlistMutationVariables = Exact<{
  bookId: string | number;
}>;


export type LeaveWaitlistMutation = { leaveWaitlist: { __typename: 'Response', success: boolean | null, message: string | null } | null };


export const JoinWaitlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinWaitlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinWaitlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<JoinWaitlistMutation, JoinWaitlistMutationVariables>;
export const LeaveWaitlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveWaitlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveWaitlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LeaveWaitlistMutation, LeaveWaitlistMutationVariables>;