import { store } from './store.js'

export const resolvers = {
  Query: {
    forms: () => store.forms,
    form: (_: unknown, { id }: { id: string }) =>
      store.forms.find((f) => f.id === id) ?? null,
  },
  Mutation: {
    createForm: (_: unknown, { input }: { input: { title: string; description?: string } }) => {
      const form = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description ?? null,
        createdAt: new Date().toISOString(),
      }
      store.forms.push(form)
      return form
    },
    deleteForm: (_: unknown, { id }: { id: string }) => {
      const index = store.forms.findIndex((f) => f.id === id)
      if (index === -1) return false
      store.forms.splice(index, 1)
      return true
    },
  },
}
