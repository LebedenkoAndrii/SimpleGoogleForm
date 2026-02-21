import type { QuestionType } from "../types/index.ts";

export interface QuestionInput {
  id?: string | null;
  type: QuestionType;
  label: string;
  options?: string[] | null;
}

export interface AnswerInput {
  questionId: string;
  value: string;
}
