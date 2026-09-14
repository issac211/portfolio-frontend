import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useProfile } from "../../hooks/useProfile";
import { deleteProject } from "../../services/projectService";
import { IMAGE_BASE_URL } from "../../config/constants";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import type { ApiError } from "../../types/api";

/**
 * Admin dashboard overview page.
 *
 * Serves as the central management hub, displaying aggregate portfolio metrics,
 * personal profile overview, and a comprehensive project administration table
 * with direct create, edit, view, and deletion workflows.
 */
export function DashboardPage() {
  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  const {
    profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfile();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Compute total unique technologies utilized across all projects
  const uniqueTechCount = useMemo(() => {
    const techSet = new Set<string>();
    for (const p of projects) {
      if (p.tech_stack) {
        for (const tech of p.tech_stack) {
          techSet.add(tech);
        }
      }
    }
    return techSet.size;
  }, [projects]);

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "";

  async function handleDelete(id: number, title: string) {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    setActionError(null);

    try {
      await deleteProject(id);
      await refetchProjects();
    } catch (err) {
      const apiErr = err as ApiError;
      setActionError(apiErr.message || "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal profile, showcase projects, and portfolio
            content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>New Project</span>
          </Link>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            <span>Live Site</span>
          </Link>
        </div>
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Error performing action</p>
          <p className="mt-0.5 text-red-700">{actionError}</p>
        </div>
      )}

      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Metric 1: Total Projects */}
        <Card>
          <CardBody className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg
                className="h-6 w-6"
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
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Total Projects
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                {isProjectsLoading ? "—" : projects.length}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Metric 2: Technologies */}
        <Card>
          <CardBody className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Technologies
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                {isProjectsLoading ? "—" : uniqueTechCount}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Metric 3: Profile Status */}
        <Card>
          <CardBody className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                className="h-6 w-6"
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
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Profile Status
              </p>
              <p className="mt-1 text-base font-bold text-gray-900">
                {isProfileLoading
                  ? "Loading…"
                  : profile
                    ? "Active & Published"
                    : "Not Configured"}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Profile Summary Card ── */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Personal Profile Information
          </h2>
          <Link
            to="/admin/profile"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Edit Profile →
          </Link>
        </CardHeader>
        <CardBody>
          {isProfileLoading ? (
            <div className="py-4">
              <Loader size="sm" />
            </div>
          ) : profileError ? (
            <p className="text-sm text-red-600">{profileError}</p>
          ) : profile ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {profile.image_url ? (
                  <img
                    src={`${IMAGE_BASE_URL}${profile.image_url}`}
                    alt={fullName || "Admin avatar"}
                    className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {fullName || "Anonymous Developer"}
                  </h3>
                  {profile.bio && (
                    <p className="mt-0.5 line-clamp-1 max-w-xl text-sm text-gray-500">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              <Link
                to="/admin/profile"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
              >
                Update Profile & Photo
              </Link>
            </div>
          ) : (
            <div className="py-2 text-sm text-gray-500">
              No personal profile information found.{" "}
              <Link
                to="/admin/profile"
                className="font-medium text-blue-600 underline hover:text-blue-700"
              >
                Create your profile now
              </Link>
              .
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Project Administration Table ── */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Projects Management
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Review, edit, reorder, or delete projects displayed on your portfolio.
            </p>
          </div>

          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Add Project</span>
          </Link>
        </CardHeader>

        {isProjectsLoading ? (
          <div className="py-12">
            <Loader size="md" />
          </div>
        ) : projectsError ? (
          <CardBody className="py-8 text-center">
            <p className="text-sm text-red-600">{projectsError}</p>
            <div className="mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => refetchProjects()}
              >
                Retry
              </Button>
            </div>
          </CardBody>
        ) : projects.length === 0 ? (
          <CardBody className="py-12 text-center">
            <svg
              className="mx-auto h-10 w-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              No projects created yet
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Get started by creating your first showcase project.
            </p>
            <div className="mt-4">
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                Create First Project
              </Link>
            </div>
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3">
                    Project
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Tech Stack
                  </th>
                  <th scope="col" className="px-5 py-3 text-center">
                    Order
                  </th>
                  <th scope="col" className="px-5 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => {
                  const imageUrl = project.image_url
                    ? `${IMAGE_BASE_URL}${project.image_url}`
                    : null;
                  const isDeleting = deletingId === project.id;

                  return (
                    <tr
                      key={project.id}
                      className="transition-colors hover:bg-gray-50/75"
                    >
                      {/* Title & Preview Thumbnail */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <svg
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">
                              {project.title}
                            </p>
                            <p className="line-clamp-1 text-xs text-gray-500">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tech Stack Badges */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.tech_stack && project.tech_stack.length > 0 ? (
                            project.tech_stack.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                              >
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                          {project.tech_stack &&
                            project.tech_stack.length > 3 && (
                              <span className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-xs text-gray-500">
                                +{project.tech_stack.length - 3}
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Display Order */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {project.display_order ?? "—"}
                        </span>
                      </td>

                      {/* Actions: View, Edit, Delete */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/projects/${project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            title="View public project page"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                            <span className="sr-only">View</span>
                          </Link>

                          <Link
                            to={`/admin/projects/${project.id}/edit`}
                            className="rounded-md p-1.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                            title="Edit project"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Link>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() =>
                              handleDelete(project.id, project.title)
                            }
                            className="rounded-md p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                            title="Delete project"
                          >
                            {isDeleting ? (
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            )}
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
