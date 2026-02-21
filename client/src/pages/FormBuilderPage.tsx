import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormQuery } from '../api';
import { useFormEditor } from '../hooks/useFormEditor';
import { formToEditorState } from '../utils/formHelpers';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { QuestionType } from '../api';

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  TEXT: 'Short text',
  MULTIPLE_CHOICE: 'Multiple choice',
  CHECKBOX: 'Checkboxes',
  DATE: 'Date',
  '%future added value': 'Other',
};

interface FormBuilderFormProps {
  formId?: string;
  initialState?: ReturnType<typeof formToEditorState>;
}

function FormBuilderForm({ formId, initialState }: FormBuilderFormProps) {
  const navigate = useNavigate();
  const editor = useFormEditor(
    formId && initialState ? { formId, initialState } : undefined,
  );

  // Використовуємо mutationResult, як ми домовилися в рефакторингу хука
  const { state, mutationResult, isEditMode, isOptionsType } = editor;

  // Локальний стан для помилок валідації
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Функція валідації перед відправкою
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!state.title.trim()) {
      errors.title = 'Title is required';
    }

    state.questions.forEach((q) => {
      if (!q.label.trim()) {
        errors[`q_${q.id}`] = 'Question label is required';
      }

      if (isOptionsType(q.type)) {
        if (q.options.length < 1) {
          errors[`opts_${q.id}`] = 'Add at least one option';
        } else if (q.options.some((opt) => !opt.trim())) {
          errors[`opts_${q.id}`] = 'All options must be filled';
        }
      }
    });

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const saved = await editor.submit();
      if (!isEditMode) editor.reset();
      const targetId = saved?.id ?? formId;
      if (targetId) navigate(`/forms/${targetId}/responses`, { replace: true });
    } catch (err) {
      // Помилка сервера обробляється через mutationResult
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {isEditMode ? 'Edit form' : 'Create form'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Блок заголовка */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={state.title}
            onChange={(e) => {
              editor.setTitle(e.target.value);
              if (localErrors.title)
                setLocalErrors((prev) => ({ ...prev, title: '' }));
            }}
            className={`mt-1 block w-full rounded border ${
              localErrors.title ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
            placeholder="Form title"
          />
          {localErrors.title && (
            <p className="mt-1 text-xs text-red-500">{localErrors.title}</p>
          )}

          <label className="mt-4 block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <input
            type="text"
            value={state.description}
            onChange={(e) => editor.setDescription(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Form description"
          />
        </div>

        {/* Список питань */}
        {state.questions.map((q, index) => (
          <div
            key={q.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Question {index + 1}
              </span>
              <button
                type="button"
                onClick={() => editor.removeQuestion(q.id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={q.type}
                onChange={(e) =>
                  editor.updateQuestion(q.id, {
                    type: e.target.value as QuestionType,
                  })
                }
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {(['TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX', 'DATE'] as const).map(
                  (t) => (
                    <option key={t} value={t}>
                      {QUESTION_TYPE_LABELS[t]}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Question label
              </label>
              <input
                type="text"
                value={q.label}
                onChange={(e) => {
                  editor.updateQuestion(q.id, { label: e.target.value });
                  if (localErrors[`q_${q.id}`])
                    setLocalErrors((prev) => ({ ...prev, [`q_${q.id}`]: '' }));
                }}
                className={`mt-1 block w-full rounded border ${
                  localErrors[`q_${q.id}`]
                    ? 'border-red-500'
                    : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                placeholder="Question text"
              />
              {localErrors[`q_${q.id}`] && (
                <p className="mt-1 text-xs text-red-500">
                  {localErrors[`q_${q.id}`]}
                </p>
              )}
            </div>

            {/* Опції для Multiple Choice / Checkbox */}
            {isOptionsType(q.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <ul className="mt-2 space-y-2">
                  {q.options.map((opt, i) => (
                    <li key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          editor.updateOption(q.id, i, e.target.value)
                        }
                        className="block flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder={`Option ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => editor.removeOption(q.id, i)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                {localErrors[`opts_${q.id}`] && (
                  <p className="mt-2 text-xs text-red-500">
                    {localErrors[`opts_${q.id}`]}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => editor.addOption(q.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add option
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Кнопки дій */}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => editor.addQuestion()}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Add question
          </button>
          <button
            type="submit"
            disabled={mutationResult.isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutationResult.isLoading
              ? 'Saving…'
              : isEditMode
                ? 'Update form'
                : 'Save form'}
          </button>
        </div>

        {/* Помилка від сервера */}
        {mutationResult.isError && (
          <ErrorMessage
            message={
              'data' in mutationResult.error
                ? (mutationResult.error.data as any)?.message || 'Server error'
                : 'Failed to save form.'
            }
          />
        )}
      </form>
    </div>
  );
}

export function FormBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useFormQuery({ id: id! }, { skip: !id });
  const form = data?.form;

  if (id && isLoading) return <LoadingSpinner />;
  if (id && isError) return <ErrorMessage message="Failed to load form." />;
  if (id && !form) return <ErrorMessage message="Form not found." />;

  return (
    <FormBuilderForm
      key={form?.id ?? 'new'}
      formId={form?.id}
      initialState={form ? formToEditorState(form) : undefined}
    />
  );
}
