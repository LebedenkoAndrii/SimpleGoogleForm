export const typeDefs = `#graphql
  type Form {
    id: ID!
    title: String!
    description: String
    createdAt: String!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
  }

  input CreateFormInput {
    title: String!
    description: String
  }

  type Mutation {
    createForm(input: CreateFormInput!): Form!
    deleteForm(id: ID!): Boolean!
  }
`
