import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Schema from server; set CODEGEN_SCHEMA_PATH=src/graphql/schema.graphql for offline/build
  schema: process.env.CODEGEN_SCHEMA_PATH ?? 'http://localhost:4000/graphql',
  documents: ['src/graphql/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'src/api/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        {
          'typescript-rtk-query': {
            importBaseApiFrom: './baseApi',
            exportHooks: true,
          },
        },
      ],
      config: {
        strictScalars: true,
        skipTypename: false,
        enumsAsTypes: true,
        dedupeFragments: true,
        preResolveTypes: true,
        avoidOptionals: false,
        futureProofEnums: true,
      },
    },
  },
};

export default config;
