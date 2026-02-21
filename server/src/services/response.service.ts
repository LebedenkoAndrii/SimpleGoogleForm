import { db } from "../db.js";
import { AnswerInput } from "../schema/schema.types.js";

export const responseService = {
  submitResponse: (
    _: unknown,
    { formId, answers }: { formId: string; answers: AnswerInput[] },
  ) => {
    const form = db.forms.find((f) => f.id === formId);
    if (!form) {
      throw new Error(`Form not found: ${formId}`);
    }
    const response = {
      id: crypto.randomUUID(),
      formId,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        value: a.value,
      })),
    };
    db.responses.push(response);
    return response;
  },
};
