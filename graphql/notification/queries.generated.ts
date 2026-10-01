/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from '../generated/graphql';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationsQuery = { getNotifications: Array<{ __typename: 'Notification', id: string | null, type: Types.NotificationType | null, message: string | null, isRead: boolean | null, createdAt: unknown }> };

export type GetUnreadNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnreadNotificationCountQuery = { getUnreadNotificationCount: number };


export const GetNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetUnreadNotificationCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUnreadNotificationCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUnreadNotificationCount"}}]}}]} as unknown as DocumentNode<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>;