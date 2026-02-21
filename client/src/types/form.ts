import { QuestionType } from '../api';

export interface DraftQuestion {
  id: string;
  type: QuestionType;
  label: string;
  options: string[];
}

export interface FormEditorState {
  title: string;
  description: string;
  questions: DraftQuestion[];
}

export interface UseFormEditorOptions {
  formId?: string;
  initialState?: FormEditorState;
}
