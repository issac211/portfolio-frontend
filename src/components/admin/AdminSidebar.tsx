import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  DashboardIcon,
  UserIcon,
  PlusIcon,
  ExternalLinkIcon,
  LogoutIcon,
  XIcon,
} from "../ui/icons";

/** Navigation item definition for the admin sidebar. */
interface AdminNavItem {
  label: string;
  to: string;
  end?: boolean;
  icon: (props: { className?: string }) => React.JSX.Element;
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Dashboard",
    to: "/admin",
    end: true,
    icon: DashboardIcon,
  },
  {
    label: "Edit Profile",
    to: "/admin/profile",
    icon: UserIcon,
  },
  {
    label: "New Project",
    to: "/admin/projects/new",
    icon: PlusIcon,
  },
];

/**
 * Sidebar navigation panel for authenticated admin operations.
 *
 * Supports dual display modes:
 * - Desktop: fixed persistent sidebar (`md:static md:translate-x-0`).
 * - Mobile: off-canvas drawer controlled via `isOpen`/`onClose` with backdrop overlay.
 */
export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const { handleLogout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-950/60 backdrop-blur-xs animate-fade-in md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Admin Navigation"
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col justify-between border-r border-gray-800 bg-gray-900 p-4 text-gray-300 transition-transform duration-300 ease-in-out md:static md:h-full md:w-64 md:shrink-0 md:translate-x-0 md:z-auto overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="space-y-6">
          {/* Brand Header & Mobile Close Action */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <Link
              to="/admin"
              onClick={onClose}
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-colors hover:text-blue-400"
            >
              <span>Portfolio</span>
              <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-xs font-semibold text-blue-400">
                Admin
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden cursor-pointer"
              aria-label="Close admin menu"
            >
              <XIcon className="h-5 w-5" />
            </button>
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
                  onClick={onClose}
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
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100"
          >
            <ExternalLinkIcon className="h-5 w-5 shrink-0" />
            <span>Back to Site</span>
          </Link>

          {/* Logout Trigger */}
          <button
            type="button"
            onClick={() => {
              onClose?.();
              handleLogout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          >
            <LogoutIcon className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
