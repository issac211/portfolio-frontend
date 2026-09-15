import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { MenuIcon } from "../ui/icons";

/**
 * Shell layout for protected administrative routes.
 *
 * Implements an adaptive responsive architecture:
 * - Desktop (`md:`): independent two-pane layout with persistent sidebar
 *   and independently scrollable content viewport (`overflow-y-auto`).
 * - Mobile (`< md:`): sticky app bar with brand badge and drawer trigger,
 *   coordinating an off-canvas slide-out navigation panel with backdrop overlay.
 */
export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gray-50 text-gray-900 md:flex-row">
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden">
        {/* Mobile Navigation Header */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-gray-900"
          >
            <span>Portfolio</span>
            <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-xs font-semibold text-blue-600">
              Admin
            </span>
          </Link>
        </header>

        {/* Scrollable Main Content Viewport */}
        <main
          id="admin-main-content"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-10"
        >
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

