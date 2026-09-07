import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";

// ─── Temporary Page Stubs ────────────────────────────────────────
// Replaced with real components as each Phase is completed.

function HomePage() {
  return <h1>Home</h1>;
}

function ProjectDetailPage() {
  return <h1>Project Detail</h1>;
}


function DashboardPage() {
  return <h1>Admin Dashboard</h1>;
}

function ProfileFormPage() {
  return <h1>Edit Profile</h1>;
}

function ProjectFormPage() {
  return <h1>Project Form</h1>;
}

// ─── Temporary Layout Stubs ──────────────────────────────────────

function PublicLayout() {
  return (
    <>
      <nav>Public Navbar</nav>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside>Admin Sidebar</aside>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

// ─── Router ──────────────────────────────────────────────────────

/**
 * Defines the full route tree for the application.
 *
 * Public routes are wrapped in `PublicLayout` (Navbar + Footer).
 * Admin routes are wrapped in `ProtectedRoute` → `AdminLayout` (Sidebar).
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Routes ── */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* ── Protected Admin Routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<DashboardPage />} />
            <Route path="admin/profile" element={<ProfileFormPage />} />
            <Route path="admin/projects/new" element={<ProjectFormPage />} />
            <Route
              path="admin/projects/:id/edit"
              element={<ProjectFormPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
