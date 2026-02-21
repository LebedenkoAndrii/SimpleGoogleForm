import { Outlet, Link } from 'react-router-dom'

interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-blue-600 hover:text-blue-700">
            Google Forms Lite
          </Link>
          <Link
            to="/forms"
            className="ml-6 text-gray-600 hover:text-gray-900"
          >
            Forms
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-4 py-8">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}
