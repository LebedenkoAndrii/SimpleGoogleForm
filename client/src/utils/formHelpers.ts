import { QuestionType } from '../api';
import type { DraftQuestion, FormEditorState } from '../types/form';

export const OPTION_TYPES: QuestionType[] = ['MULTIPLE_CHOICE', 'CHECKBOX'];
const BAD_OPTION_VALUE = '%future added value';

export const isOptionsType = (type: QuestionType): boolean =>
  OPTION_TYPES.includes(type);

export const sanitizeOptions = (options: string[]): string[] =>
  options.filter((o) => o !== BAD_OPTION_VALUE);

export const createDraftQuestion = (
  overrides: Partial<DraftQuestion> = {},
): DraftQuestion => ({
  id: crypto.randomUUID(),
  type: 'TEXT',
  label: '',
  options: [],
  ...overrides,
});

export function formToEditorState(form: any): FormEditorState {
  return {
    title: form.title,
    description: form.description ?? '',
    questions: form.questions.map((q: any) => ({
      ...q,
      options: sanitizeOptions(q.options ?? []),
    })),
  };
}
