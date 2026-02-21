import { useParams } from 'react-router-dom'
import { useFormQuery, useResponsesQuery } from '../api'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function FormResponsesPage() {
  const { id } = useParams<{ id: string }>()
  const { data: formData, isLoading: formLoading, isError: formError, error: formErr } = useFormQuery({ id: id! }, { skip: !id })
  const { data: responsesData, isLoading: responsesLoading, isError: responsesError, error: responsesErr } = useResponsesQuery({ formId: id! }, { skip: !id })

  const form = formData?.form
  const responses = responsesData?.responses ?? []
  const questions = form?.questions ?? []
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q]))

  const isLoading = formLoading || responsesLoading
  const isError = formError || responsesError
  const error = formErr ?? responsesErr

  if (!id) {
    return <ErrorMessage message="Missing form ID." />
  }
  if (isLoading) return <LoadingSpinner />
  if (isError) {
    const message = error && 'status' in error ? String((error as { data?: { error?: string } })?.data?.error ?? error) : 'Failed to load data.'
    return <ErrorMessage message={message} />
  }
  if (!form) {
    return <ErrorMessage message="Form not found." />
  }

  return (
    <div>
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
        {form.description && (
          <p className="mt-2 text-gray-600">{form.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          {responses.length} response{responses.length !== 1 ? 's' : ''}
        </p>
      </div>
      {responses.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          No responses yet.
        </p>
      ) : (
        <div className="space-y-6">
          {responses.map((response) => (
            <div
              key={response.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-sm font-medium text-gray-500">Response</h2>
              <dl className="space-y-3">
                {response.answers.map((a) => {
                  const q = questionMap[a.questionId]
                  const label = q?.label ?? a.questionId
                  return (
                    <div key={`${response.id}-${a.questionId}`}>
                      <dt className="text-sm font-medium text-gray-700">{label}</dt>
                      <dd className="mt-1 text-gray-900">{a.value || '—'}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
