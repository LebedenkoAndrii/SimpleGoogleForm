import { db } from './db.js'
import type { AnswerInput, QuestionInput } from './schema.types.js'

export const resolvers = {
  Query: {
    forms: () => db.forms,
    form: (_: unknown, { id }: { id: string }) =>
      db.forms.find((f) => f.id === id) ?? null,
    responses: (_: unknown, { formId }: { formId: string }) =>
      db.responses.filter((r) => r.formId === formId),
  },
  Mutation: {
    createForm: (
      _: unknown,
      {
        title,
        description,
        questions = [],
      }: { title: string; description?: string | null; questions?: QuestionInput[] | null }
    ) => {
      const formId = crypto.randomUUID()
      const formQuestions = (questions ?? []).map((q) => ({
        id: crypto.randomUUID(),
        type: q.type,
        label: q.label,
        options: q.options ?? [],
      }))
      const form = {
        id: formId,
        title,
        description: description ?? null,
        questions: formQuestions,
      }
      db.forms.push(form)
      return form
    },
    updateForm: (
      _: unknown,
      {
        id,
        title,
        description,
        questions,
      }: {
        id: string
        title?: string | null
        description?: string | null
        questions?: QuestionInput[] | null
      }
    ) => {
      const form = db.forms.find((f) => f.id === id)
      if (!form) return null
      if (title !== undefined && title !== null) form.title = title
      if (description !== undefined) form.description = description ?? null
      if (questions !== undefined && questions !== null) {
        form.questions = questions.map((q) => ({
          id: q.id ?? crypto.randomUUID(),
          type: q.type,
          label: q.label,
          options: q.options ?? [],
        }))
      }
      return form
    },
    deleteForm: (_: unknown, { id }: { id: string }) => {
      const index = db.forms.findIndex((f) => f.id === id)
      if (index === -1) return false
      db.forms.splice(index, 1)
      db.responses.splice(0, db.responses.length, ...db.responses.filter((r) => r.formId !== id))
      return true
    },
    submitResponse: (
      _: unknown,
      { formId, answers }: { formId: string; answers: AnswerInput[] }
    ) => {
      const form = db.forms.find((f) => f.id === formId)
      if (!form) {
        throw new Error(`Form not found: ${formId}`)
      }
      const response = {
        id: crypto.randomUUID(),
        formId,
        answers: answers.map((a) => ({ questionId: a.questionId, value: a.value })),
      }
      db.responses.push(response)
      return response
    },
  },
}
