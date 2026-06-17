"use client";

import { HttpLink, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

function makeClient() {
  const httpLink = new HttpLink({
    // Use an absolute URL for SSR
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    fetchOptions: {
      credentials: "include",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorLink = onError(({ graphQLErrors }: any) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === "UNAUTHENTICATED") {
          // Token expired or invalid, log them out and redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }
    }
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
