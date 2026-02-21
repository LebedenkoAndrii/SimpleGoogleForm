import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient('/graphql')

/**
 * Base RTK Query API for GraphQL.
 * Endpoints and hooks are injected by GraphQL Codegen from generated.ts.
 */
export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({ client }),
  endpoints: () => ({}),
})

export { client }
