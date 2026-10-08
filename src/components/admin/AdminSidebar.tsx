import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import {
  ArrowDownIcon,
  DashboardIcon,
  ExternalLinkIcon,
  LogoutIcon,
  PencilIcon,
  PlusIcon,
  UserIcon,
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
  const { projects, isLoading } = useProjects();
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

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

            {/* ── Collapsible Editable Projects List ── */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsProjectsExpanded((prev) => !prev)}
                aria-expanded={isProjectsExpanded}
                aria-controls="sidebar-projects-list"
                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:bg-gray-800/60 hover:text-gray-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Edit Projects</span>
                  {!isLoading && (
                    <span className="rounded-full bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-300">
                      {projects.length}
                    </span>
                  )}
                </span>
                <ArrowDownIcon
                  className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 group-hover:text-gray-200 ${
                    isProjectsExpanded ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              <div
                id="sidebar-projects-list"
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
                  isProjectsExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Editable projects list"
                    className="mt-1 max-h-52 overflow-y-auto pl-2 pr-1 space-y-1 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.25)_transparent] focus:outline-none focus:ring-1 focus:ring-blue-500/40 rounded-md"
                  >
                    {isLoading && (
                      <div className="space-y-1.5 px-3 py-2">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-800" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-800" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-800" />
                      </div>
                    )}

                    {!isLoading && projects.length === 0 && (
                      <p className="px-3 py-2 text-xs text-gray-500 italic">
                        No projects created yet.
                      </p>
                    )}

                    {!isLoading &&
                      projects.map((project) => (
                        <NavLink
                          key={project.id}
                          to={`/admin/projects/${project.id}/edit`}
                          onClick={onClose}
                          title={`Edit ${project.title}`}
                          className={({ isActive }) =>
                            [
                              "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                              isActive
                                ? "bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-500 pl-2"
                                : "text-gray-400 hover:bg-gray-800/80 hover:text-gray-200",
                            ].join(" ")
                          }
                        >
                          <PencilIcon className="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-400 transition-all" />
                          <span className="truncate">{project.title}</span>
                        </NavLink>
                      ))}
                  </div>
                </div>
              </div>
            </div>
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
