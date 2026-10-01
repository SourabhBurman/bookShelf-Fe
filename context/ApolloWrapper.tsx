"use client";

import { HttpLink, ApolloLink } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Observable } from "rxjs";
import { refresh as refreshSession } from "@/services/authServices";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

// Tracks an in-flight refresh so concurrent 401s from several queries only
// trigger one /refresh call, and every one of them retries once that
// resolves.
let refreshInFlight: Promise<unknown> | null = null;

function makeClient() {
  const httpLink = new HttpLink({
    // Use an absolute URL for SSR
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    fetchOptions: {
      credentials: "include",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorLink = new ErrorLink(({ error, operation, forward }: any) => {
    const isUnauthenticated =
      CombinedGraphQLErrors.is(error) &&
      error.errors.some(
        (e: { extensions?: { code?: string } }) =>
          e.extensions?.code === "UNAUTHENTICATED",
      );

    if (!isUnauthenticated) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Observable((observer: any) => {
      if (!refreshInFlight) {
        refreshInFlight = refreshSession().finally(() => {
          refreshInFlight = null;
        });
      }

      refreshInFlight
        .then(() => {
          forward(operation).subscribe(observer);
        })
        .catch(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          observer.error(error);
        });
    });
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([httpLink])
        : ApolloLink.from([errorLink, httpLink]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
