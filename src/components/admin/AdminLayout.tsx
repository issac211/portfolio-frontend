import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

/**
 * Shell layout for protected administrative routes.
 *
 * Implements an independent two-pane application layout (`h-screen overflow-hidden`),
 * locking `AdminSidebar` to the left while providing an independently scrollable
 * content viewport (`overflow-y-auto`) that renders nested admin routes via `<Outlet />`.
 */
export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <AdminSidebar />
      <main
        id="admin-main-content"
        className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10"
      >
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
