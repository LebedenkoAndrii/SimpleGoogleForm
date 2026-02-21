/**
 * API entry point: base API + generated RTK Query hooks and types.
 * Import hooks and types from here for production use.
 */
export { api, client } from './baseApi'
export {
  useFormsQuery,
  useLazyFormsQuery,
  useFormQuery,
  useLazyFormQuery,
  useResponsesQuery,
  useLazyResponsesQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useSubmitResponseMutation,
} from './generated'
export type {
  Form,
  Question,
  QuestionType,
  Response,
  Answer,
  QuestionInput,
  AnswerInput,
  FormsQuery,
  FormsQueryVariables,
  FormQuery,
  FormQueryVariables,
  ResponsesQuery,
  ResponsesQueryVariables,
  CreateFormMutation,
  CreateFormMutationVariables,
  UpdateFormMutation,
  UpdateFormMutationVariables,
  DeleteFormMutation,
  DeleteFormMutationVariables,
  SubmitResponseMutation,
  SubmitResponseMutationVariables,
} from './generated'
