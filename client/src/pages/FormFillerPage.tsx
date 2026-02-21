import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormQuery, useSubmitResponseMutation } from '../api';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { QuestionType } from '../api';

type AnswerState = Record<string, string | string[]>;

function QuestionRenderer({
  questionId,
  type,
  options,
  value,
  onChange,
}: {
  questionId: string;
  type: QuestionType;
  label: string;
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
}) {
  if (type === 'TEXT') {
    return (
      <input
        type="text"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    );
  }
  if (type === 'DATE') {
    return (
      <input
        type="date"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    );
  }
  if (type === 'MULTIPLE_CHOICE') {
    const selected = (value as string) ?? '';
    return (
      <div className="space-y-2">
        {options
          .filter((o) => o && o !== '%future added value')
          .map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={questionId}
                value={opt}
                checked={selected === opt}
                onChange={() => onChange(opt)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{opt}</span>
            </label>
          ))}
      </div>
    );
  }
  if (type === 'CHECKBOX') {
    const selected = (Array.isArray(value) ? value : []) as string[];
    return (
      <div className="space-y-2">
        {options
          .filter((o) => o && o !== '%future added value')
          .map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value={opt}
                checked={selected.includes(opt)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...selected, opt]
                    : selected.filter((x) => x !== opt);
                  onChange(next);
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{opt}</span>
            </label>
          ))}
      </div>
    );
  }
  return (
    <input
      type="text"
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  );
}

export function FormFillerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useFormQuery(
    { id: id! },
    { skip: !id },
  );
  const [
    submitResponse,
    { isLoading: isSubmitting, isError: isSubmitError, error: submitError },
  ] = useSubmitResponseMutation();
  const [answers, setAnswers] = useState<AnswerState>({});

  const form = data?.form;
  const questions = form?.questions ?? [];

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form) return;
    const answerList = questions.map((q) => {
      const v = answers[q.id];
      const value = Array.isArray(v) ? v.join(', ') : (v ?? '');
      return { questionId: q.id, value };
    });
    try {
      await submitResponse({ formId: id, answers: answerList }).unwrap();
      navigate(`/forms/${id}/responses`, { replace: true });
    } catch {
      // Error shown below
    }
  };

  if (!id) {
    return <ErrorMessage message="Missing form ID." />;
  }
  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    const message =
      error && 'status' in error
        ? String((error as { data?: { error?: string } })?.data?.error ?? error)
        : 'Failed to load form.';
    return <ErrorMessage message={message} />;
  }
  if (!form) {
    return <ErrorMessage message="Form not found." />;
  }

  return (
    <div>
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
        {form.description && (
          <p className="mt-2 text-gray-600">{form.description}</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <label className="block text-sm font-medium text-gray-700">
              {q.label}
            </label>
            <div className="mt-2">
              <QuestionRenderer
                questionId={q.id}
                type={q.type}
                label={q.label}
                options={q.options}
                value={answers[q.id] ?? (q.type === 'CHECKBOX' ? [] : '')}
                onChange={(value) => setAnswer(q.id, value)}
              />
            </div>
          </div>
        ))}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || questions.length === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
        {isSubmitError && (
          <ErrorMessage
            message={
              submitError && 'status' in submitError
                ? String(
                    (submitError as { data?: { error?: string } })?.data
                      ?.error ?? submitError,
                  )
                : 'Failed to submit response.'
            }
          />
        )}
      </form>
    </div>
  );
}
