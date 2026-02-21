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
