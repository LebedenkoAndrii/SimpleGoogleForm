import { db } from "./db.js";
import type { AnswerInput, QuestionInput } from "./schema/schema.types.js";
import { formService } from "./services/form.service.js";
import { responseService } from "./services/response.service.js";

export const resolvers = {
  Query: {
    forms: () => db.forms,
    form: (_: unknown, { id }: { id: string }) =>
      db.forms.find((f) => f.id === id) ?? null,
    responses: (_: unknown, { formId }: { formId: string }) =>
      db.responses.filter((r) => r.formId === formId),
  },
  Mutation: {
    createForm: formService.create,
    updateForm: formService.update,
    deleteForm: formService.delete,
    submitResponse: responseService.submitResponse,
  },
};
