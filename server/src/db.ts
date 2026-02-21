export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE'

export interface Question {
  id: string
  type: QuestionType
  label: string
  options: string[]
}

export interface Form {
  id: string
  title: string
  description: string | null
  questions: Question[]
}

export interface Answer {
  questionId: string
  value: string
}

export interface Response {
  id: string
  formId: string
  answers: Answer[]
}

const forms: Form[] = []
const responses: Response[] = []

export const db = {
  forms,
  responses,
}
