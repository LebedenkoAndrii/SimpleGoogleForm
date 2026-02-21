import { Link } from 'react-router-dom'
import { useFormsQuery, useDeleteFormMutation } from '../api'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function HomePage() {
  const { data, isLoading, isError, error, refetch } = useFormsQuery()
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation()

  if (isLoading) return <LoadingSpinner />
  if (isError) {
    const message = error && 'status' in error ? String((error as { data?: { error?: string } })?.data?.error ?? error) : 'Failed to load forms.'
    return <ErrorMessage message={message} />
  }

  const forms = data?.forms ?? []

  const handleDelete = async (e: React.MouseEvent, formId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Delete this form? This cannot be undone.')) return
    try {
      await deleteForm({ id: formId }).unwrap()
      await refetch()
    } catch {
      // List will refetch on next mount or we could show error
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
        <Link
          to="/forms/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New form
        </Link>
      </div>
      {forms.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          No forms yet. Create one to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {forms.map((form) => (
            <li
              key={form.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div>
                <h2 className="font-medium text-gray-900">{form.title}</h2>
                {form.description && (
                  <p className="mt-1 text-sm text-gray-500">{form.description}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/forms/${form.id}/fill`}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  View
                </Link>
                <Link
                  to={`/forms/${form.id}/edit`}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </Link>
                <Link
                  to={`/forms/${form.id}/responses`}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Responses
                </Link>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, form.id)}
                  disabled={isDeleting}
                  className="rounded border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
