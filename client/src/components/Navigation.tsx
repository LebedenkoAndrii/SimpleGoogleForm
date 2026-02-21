import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div>
      <Link
        to="/"
        className="text-lg font-semibold text-blue-600 hover:text-blue-700"
      >
        Google Forms Lite
      </Link>
      <Link to="/" className="ml-6 text-gray-600 hover:text-gray-900">
        Forms
      </Link>
      <Link to="/forms/new" className="ml-6 text-gray-600 hover:text-gray-900">
        New form
      </Link>
    </div>
  );
}
