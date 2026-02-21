export const typeDefs = `#graphql
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Question {
    id: ID!
    type: QuestionType!
    label: String!
    options: [String!]!
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Answer {
    questionId: ID!
    value: String!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  input QuestionInput {
    id: ID
    type: QuestionType!
    label: String!
    options: [String!]
  }

  input AnswerInput {
    questionId: ID!
    value: String!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(title: String!, description: String, questions: [QuestionInput!]): Form!
    updateForm(id: ID!, title: String, description: String, questions: [QuestionInput!]): Form
    deleteForm(id: ID!): Boolean!
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
  }
`
