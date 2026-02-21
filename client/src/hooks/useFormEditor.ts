import { useCallback, useState } from 'react'
import { useCreateFormMutation } from '../api'
import type { QuestionType } from '../api'

const QUESTION_TYPES_WITH_OPTIONS: QuestionType[] = ['MULTIPLE_CHOICE', 'CHECKBOX']

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

export function useFormEditor() {
  const [state, setState] = useState<FormEditorState>({
    title: '',
    description: '',
    questions: [],
  })
  const [createForm, createResult] = useCreateFormMutation()

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
        type: q.type,
        label: q.label.trim(),
        options: isOptionsType(q.type) ? q.options.filter(Boolean) : undefined,
      })),
    }
    const result = await createForm(payload).unwrap()
    return result
  }, [state.title, state.description, state.questions, createForm])

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
    createResult: {
      isSuccess: createResult.isSuccess,
      isError: createResult.isError,
      isLoading: createResult.isLoading,
      error: createResult.error,
      data: createResult.data,
    },
    isOptionsType,
  }
}
