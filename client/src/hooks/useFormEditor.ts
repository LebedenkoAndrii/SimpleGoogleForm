import { useCallback, useState } from 'react'
import { useCreateFormMutation, useUpdateFormMutation } from '../api'
import type { QuestionType } from '../api'

export interface UseFormEditorOptions {
  formId?: string
  initialState?: FormEditorState
}

const QUESTION_TYPES_WITH_OPTIONS: QuestionType[] = ['MULTIPLE_CHOICE', 'CHECKBOX']

/** Codegen adds this to the enum; it must never appear as an answer option. */
const BAD_OPTION_VALUE = '%future added value'

function sanitizeOptions(options: string[]): string[] {
  return options.filter((o) => o !== BAD_OPTION_VALUE)
}

export interface DraftQuestion {
  id: string
  type: QuestionType
  label: string
  options: string[]
}

export interface FormEditorState {
  title: string
  description: string
  questions: DraftQuestion[]
}

const createDraftQuestion = (overrides: Partial<DraftQuestion> = {}): DraftQuestion => ({
  id: crypto.randomUUID(),
  type: 'TEXT',
  label: '',
  options: [],
  ...overrides,
})

function isOptionsType(type: QuestionType): boolean {
  return QUESTION_TYPES_WITH_OPTIONS.includes(type)
}

/** Convert API Form to editor state (e.g. for edit mode). */
export function formToEditorState(form: { title: string; description?: string | null; questions: Array<{ id: string; type: QuestionType; label: string; options: string[] }> }): FormEditorState {
  return {
    title: form.title,
    description: form.description ?? '',
    questions: form.questions.map((q) => ({
      id: q.id,
      type: q.type as QuestionType,
      label: q.label,
      options: sanitizeOptions(q.options ?? []),
    })),
  }
}

export function useFormEditor(options: UseFormEditorOptions = {}) {
  const { formId, initialState } = options
  const [state, setState] = useState<FormEditorState>(
    initialState ?? { title: '', description: '', questions: [] }
  )
  const [createForm, createResult] = useCreateFormMutation()
  const [updateForm, updateResult] = useUpdateFormMutation()
  const isEditMode = Boolean(formId)
  const mutationResult = isEditMode ? updateResult : createResult

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({ ...prev, title }))
  }, [])

  const setDescription = useCallback((description: string) => {
    setState((prev) => ({ ...prev, description }))
  }, [])

  const addQuestion = useCallback((afterIndex?: number) => {
    const newQuestion = createDraftQuestion()
    setState((prev) => {
      const questions = [...prev.questions]
      const insertAt = afterIndex !== undefined ? afterIndex + 1 : questions.length
      questions.splice(insertAt, 0, newQuestion)
      return { ...prev, questions }
    })
    return newQuestion.id
  }, [])

  const removeQuestion = useCallback((questionId: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }, [])

  const updateQuestion = useCallback(
    (questionId: string, updates: Partial<Pick<DraftQuestion, 'type' | 'label' | 'options'>>) => {
      setState((prev) => {
        const questions = prev.questions.map((q) => {
          if (q.id !== questionId) return q
          const next = { ...q, ...updates }
          if (updates.type !== undefined && !isOptionsType(updates.type)) {
            next.options = []
          }
          if (updates.type !== undefined && isOptionsType(updates.type) && next.options.length === 0) {
            next.options = ['']
          }
          return next
        })
        return { ...prev, questions }
      })
    },
    []
  )

  const addOption = useCallback((questionId: string, value: string = '') => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, value] } : q
      ),
    }))
  }, [])

  const updateOption = useCallback((questionId: string, index: number, value: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q
        const options = [...q.options]
        if (index >= 0 && index < options.length) options[index] = value
        return { ...q, options }
      }),
    }))
  }, [])

  const removeOption = useCallback((questionId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q
        const options = q.options.filter((_, i) => i !== index)
        return { ...q, options }
      }),
    }))
  }, [])

  const submit = useCallback(async () => {
    const payload = {
      title: state.title.trim(),
      description: state.description.trim() || undefined,
      questions: state.questions.map((q) => ({
        ...(formId ? { id: q.id } : {}),
        type: q.type,
        label: q.label.trim(),
        options: isOptionsType(q.type) ? sanitizeOptions(q.options).filter(Boolean) : undefined,
      })),
    }
    if (formId) {
      const result = await updateForm({ id: formId, ...payload }).unwrap()
      return result.updateForm
    }
    const result = await createForm(payload).unwrap()
    return result.createForm
  }, [formId, state.title, state.description, state.questions, createForm, updateForm])

  const reset = useCallback(() => {
    setState({ title: '', description: '', questions: [] })
  }, [])

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
    createResult: mutationResult,
    isEditMode,
    isOptionsType,
  }
}
