import { useCallback, useState } from 'react';
import { useCreateFormMutation, useUpdateFormMutation } from '../api';
import type {
  UseFormEditorOptions,
  FormEditorState,
  DraftQuestion,
} from '../types/form';
import { isOptionsType, createDraftQuestion } from '../utils/formHelpers';

export function useFormEditor({
  formId,
  initialState,
}: UseFormEditorOptions = {}) {
  const [state, setState] = useState<FormEditorState>(
    initialState ?? { title: '', description: '', questions: [] },
  );

  const [createForm, createResult] = useCreateFormMutation();
  const [updateForm, updateResult] = useUpdateFormMutation();

  const isEditMode = Boolean(formId);
  const mutationResult = isEditMode ? updateResult : createResult;

  const setTitle = useCallback(
    (title: string) => setState((prev) => ({ ...prev, title })),
    [],
  );

  const setDescription = useCallback(
    (description: string) => setState((prev) => ({ ...prev, description })),
    [],
  );

  const addQuestion = useCallback((afterIndex?: number) => {
    const newQuestion = createDraftQuestion();
    setState((prev) => {
      const insertAt =
        afterIndex !== undefined ? afterIndex + 1 : prev.questions.length;
      const newQuestions = [...prev.questions];
      newQuestions.splice(insertAt, 0, newQuestion);
      return { ...prev, questions: newQuestions };
    });
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  }, []);

  const updateQuestion = useCallback(
    (id: string, updates: Partial<DraftQuestion>) => {
      setState((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== id) return q;
          const next = { ...q, ...updates };
          if (updates.type) {
            next.options = isOptionsType(updates.type)
              ? next.options.length
                ? next.options
                : ['']
              : [];
          }
          return next;
        }),
      }));
    },
    [],
  );

  const updateOption = useCallback(
    (qId: string, index: number, value: string) => {
      setState((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== qId) return q;
          const newOptions = [...q.options];
          newOptions[index] = value;
          return { ...q, options: newOptions };
        }),
      }));
    },
    [],
  );

  const addOption = useCallback((qId: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ''] } : q,
      ),
    }));
  }, []);

  const removeOption = useCallback((qId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q,
      ),
    }));
  }, []);

  const submit = useCallback(async () => {
    const payload = {
      title: state.title.trim(),
      description: state.description.trim() || undefined,
      questions: state.questions.map(({ id, ...q }) => ({
        ...(isEditMode ? { id } : {}),
        type: q.type,
        label: q.label.trim(),
        options: isOptionsType(q.type)
          ? q.options.filter((opt) => opt.trim() !== '')
          : [],
      })),
    };

    if (isEditMode && formId) {
      const response = await updateForm({ id: formId, ...payload }).unwrap();
      return response.updateForm;
    }

    const response = await createForm(payload).unwrap();
    return response.createForm;
  }, [state, formId, isEditMode, createForm, updateForm]);

  const reset = useCallback(() => {
    setState({ title: '', description: '', questions: [] });
  }, []);

  return {
    state,
    setTitle,
    setDescription,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    updateOption,
    removeOption,
    submit,
    reset,
    isEditMode,
    isOptionsType,
    mutationResult,
  };
}
