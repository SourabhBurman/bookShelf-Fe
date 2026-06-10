import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  documents: "graphql/**/!(*.generated).ts",
  generates: {
    "graphql/generated/graphql.ts": {
      plugins: ["typescript"],
      config: {
        generateOperationTypes: false,
      },
    },
    "graphql/": {
      preset: "near-operation-file",
      plugins: ["typescript-operations", "typed-document-node"],
      config: {
        withHooks: true,
        withLazyQueryHook: true,
        withMutationFn: true,
        withHOC: false,
        withComponent: false,
        withSuspense: false,
        importSchemaTypesFrom: "graphql/generated/graphql.ts",
        apolloReactHooksImportFrom: "@apollo/client/react",
        apolloReactCommonImportFrom: "@apollo/client/react",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
    },
  },
};

export default config;
