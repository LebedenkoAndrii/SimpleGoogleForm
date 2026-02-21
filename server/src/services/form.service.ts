import { db } from "../db.js";
import type { AnswerInput, QuestionInput } from "../schema/schema.types.js";
import { generateId } from "../utils/generateId.js";

export const formService = {
  create: (
    _: unknown,
    {
      title,
      description,
      questions = [],
    }: {
      title: string;
      description?: string | null;
      questions?: QuestionInput[] | null;
    },
  ) => {
    const formId = generateId();
    const formQuestions = (questions ?? []).map((q) => ({
      id: generateId(),
      type: q.type,
      label: q.label,
      options: q.options ?? [],
    }));
    const form = {
      id: formId,
      title,
      description: description ?? null,
      questions: formQuestions,
    };
    db.forms.push(form);
    return form;
  },

  update: (
    _: unknown,
    {
      id,
      title,
      description,
      questions,
    }: {
      id: string;
      title?: string | null;
      description?: string | null;
      questions?: QuestionInput[] | null;
    },
  ) => {
    const form = db.forms.find((f) => f.id === id);
    if (!form) return null;
    if (title !== undefined && title !== null) form.title = title;
    if (description !== undefined) form.description = description ?? null;
    if (questions !== undefined && questions !== null) {
      form.questions = questions.map((q) => ({
        id: q.id ?? generateId(),
        type: q.type,
        label: q.label,
        options: q.options ?? [],
      }));
    }
    return form;
  },

  delete: (_: unknown, { id }: { id: string }) => {
    const index = db.forms.findIndex((f) => f.id === id);
    if (index === -1) return false;
    db.forms.splice(index, 1);
    db.responses.splice(
      0,
      db.responses.length,
      ...db.responses.filter((r) => r.formId !== id),
    );
    return true;
  },
};
