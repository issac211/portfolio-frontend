import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/** Navigation item definition for the admin sidebar. */
interface AdminNavItem {
  label: string;
  to: string;
  end?: boolean;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Dashboard",
    to: "/admin",
    end: true,
    icon: ({ className }) => (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.75"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    label: "Edit Profile",
    to: "/admin/profile",
    icon: ({ className }) => (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.75"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
  {
    label: "New Project",
    to: "/admin/projects/new",
    icon: ({ className }) => (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.75"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  },
];

/**
 * Sidebar navigation panel for authenticated admin operations.
 *
 * Utilizes `NavLink` with functional `className` to indicate active route states,
 * enforces strict prefix matching using `end` for index routes, and provides
 * navigation back to the public portfolio along with direct session termination.
 */
export function AdminSidebar() {
  const { handleLogout } = useAuth();

  return (
    <aside
      aria-label="Admin Navigation"
      className="flex h-screen w-64 flex-col justify-between border-r border-gray-800 bg-gray-900 p-4 text-gray-300"
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-colors hover:text-blue-400"
          >
            <span>Portfolio</span>
            <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-xs font-semibold text-blue-400">
              Admin
            </span>
          </Link>
        </div>

        {/* Primary Admin Navigation */}
        <nav className="space-y-1.5" aria-label="Admin Sections">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-100",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & Session Actions */}
      <div className="space-y-2 border-t border-gray-800 pt-4">
        {/* Public Site Navigation */}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100"
        >
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.75"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          <span>Back to Site</span>
        </Link>

        {/* Logout Trigger */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
        >
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.75"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
