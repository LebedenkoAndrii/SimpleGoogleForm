export function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12" aria-busy="true">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  )
}
