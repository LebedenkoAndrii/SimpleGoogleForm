import { api } from './baseApi';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Answer = {
  __typename?: 'Answer';
  questionId: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type AnswerInput = {
  questionId: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type Form = {
  __typename?: 'Form';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  questions: Array<Question>;
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createForm: Form;
  submitResponse: Response;
};


export type MutationCreateFormArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<QuestionInput>>;
  title: Scalars['String']['input'];
};


export type MutationSubmitResponseArgs = {
  answers: Array<AnswerInput>;
  formId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  form?: Maybe<Form>;
  forms: Array<Form>;
  responses: Array<Response>;
};


export type QueryFormArgs = {
  id: Scalars['ID']['input'];
};


export type QueryResponsesArgs = {
  formId: Scalars['ID']['input'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  options: Array<Scalars['String']['output']>;
  type: QuestionType;
};

export type QuestionInput = {
  label: Scalars['String']['input'];
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  type: QuestionType;
};

export type QuestionType =
  | 'CHECKBOX'
  | 'DATE'
  | 'MULTIPLE_CHOICE'
  | 'TEXT'
  | '%future added value';

export type Response = {
  __typename?: 'Response';
  answers: Array<Answer>;
  formId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
};

export type FormsQueryVariables = Exact<{ [key: string]: never; }>;


export type FormsQuery = { __typename?: 'Query', forms: Array<{ __typename?: 'Form', id: string, title: string, description?: string | null, questions: Array<{ __typename?: 'Question', id: string, type: QuestionType, label: string, options: Array<string> }> }> };

export type FormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FormQuery = { __typename?: 'Query', form?: { __typename?: 'Form', id: string, title: string, description?: string | null, questions: Array<{ __typename?: 'Question', id: string, type: QuestionType, label: string, options: Array<string> }> } | null };

export type ResponsesQueryVariables = Exact<{
  formId: Scalars['ID']['input'];
}>;


export type ResponsesQuery = { __typename?: 'Query', responses: Array<{ __typename?: 'Response', id: string, formId: string, answers: Array<{ __typename?: 'Answer', questionId: string, value: string }> }> };

export type CreateFormMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<QuestionInput> | QuestionInput>;
}>;


export type CreateFormMutation = { __typename?: 'Mutation', createForm: { __typename?: 'Form', id: string, title: string, description?: string | null, questions: Array<{ __typename?: 'Question', id: string, type: QuestionType, label: string, options: Array<string> }> } };

export type SubmitResponseMutationVariables = Exact<{
  formId: Scalars['ID']['input'];
  answers: Array<AnswerInput> | AnswerInput;
}>;


export type SubmitResponseMutation = { __typename?: 'Mutation', submitResponse: { __typename?: 'Response', id: string, formId: string, answers: Array<{ __typename?: 'Answer', questionId: string, value: string }> } };


export const FormsDocument = `
    query Forms {
  forms {
    id
    title
    description
    questions {
      id
      type
      label
      options
    }
  }
}
    `;
export const FormDocument = `
    query Form($id: ID!) {
  form(id: $id) {
    id
    title
    description
    questions {
      id
      type
      label
      options
    }
  }
}
    `;
export const ResponsesDocument = `
    query Responses($formId: ID!) {
  responses(formId: $formId) {
    id
    formId
    answers {
      questionId
      value
    }
  }
}
    `;
export const CreateFormDocument = `
    mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput!]) {
  createForm(title: $title, description: $description, questions: $questions) {
    id
    title
    description
    questions {
      id
      type
      label
      options
    }
  }
}
    `;
export const SubmitResponseDocument = `
    mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]!) {
  submitResponse(formId: $formId, answers: $answers) {
    id
    formId
    answers {
      questionId
      value
    }
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: module.hot?.status() === "apply",
  endpoints: (build) => ({
    Forms: build.query<FormsQuery, FormsQueryVariables | void>({
      query: (variables) => ({ document: FormsDocument, variables })
    }),
    Form: build.query<FormQuery, FormQueryVariables>({
      query: (variables) => ({ document: FormDocument, variables })
    }),
    Responses: build.query<ResponsesQuery, ResponsesQueryVariables>({
      query: (variables) => ({ document: ResponsesDocument, variables })
    }),
    CreateForm: build.mutation<CreateFormMutation, CreateFormMutationVariables>({
      query: (variables) => ({ document: CreateFormDocument, variables })
    }),
    SubmitResponse: build.mutation<SubmitResponseMutation, SubmitResponseMutationVariables>({
      query: (variables) => ({ document: SubmitResponseDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useFormsQuery, useLazyFormsQuery, useFormQuery, useLazyFormQuery, useResponsesQuery, useLazyResponsesQuery, useCreateFormMutation, useSubmitResponseMutation } = injectedRtkApi;

