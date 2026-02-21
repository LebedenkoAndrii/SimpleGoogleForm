import type { QuestionType } from './db.js'

export interface QuestionInput {
  type: QuestionType
  label: string
  options?: string[] | null
}

export interface AnswerInput {
  questionId: string
  value: string
}
