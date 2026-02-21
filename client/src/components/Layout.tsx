import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <Navigation />
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-4 py-8">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
