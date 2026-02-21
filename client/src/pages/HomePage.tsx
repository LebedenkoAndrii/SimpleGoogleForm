import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Google Forms Lite</h1>
      <p className="mt-2 text-gray-600">Create and manage simple forms.</p>
      <Link
        to="/forms"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        View Forms
      </Link>
    </div>
  )
}
