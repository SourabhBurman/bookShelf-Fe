import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8000/graphql",
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
