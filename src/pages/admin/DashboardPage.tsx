import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useProfile } from "../../hooks/useProfile";
import { useToast } from "../../context/ToastContext";
import { deleteProject } from "../../services/projectService";
import { IMAGE_BASE_URL } from "../../config/constants";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProfileCardSkeleton, ProjectsTableSkeleton } from "../../components/ui/Skeleton";
import {
  DashboardIcon,
  CodeIcon,
  UserIcon,
  PlusIcon,
  ExternalLinkIcon,
  PencilIcon,
  TrashIcon,
  ImageIcon,
  InboxIcon,
} from "../../components/ui/icons";
import type { ApiError } from "../../types/api";

/**
 * Admin dashboard overview page.
 *
 * Serves as the central management hub, displaying aggregate portfolio metrics,
 * personal profile overview, and a comprehensive project administration table
 * with direct create, edit, view, and deletion workflows.
 */
export function DashboardPage() {
  const { addToast } = useToast();
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

    try {
      await deleteProject(id);
      await refetchProjects();
      addToast({ message: `"${title}" deleted successfully.`, variant: "success" });
    } catch (err) {
      const apiErr = err as ApiError;
      addToast({ message: apiErr.message || "Failed to delete project.", variant: "error" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8 pb-4 sm:pb-6">
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
            <PlusIcon className="h-4 w-4" />
            <span>New Project</span>
          </Link>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            <span>Live Site</span>
          </Link>
        </div>
      </div>


      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1: Total Projects */}
        <Card>
          <CardBody className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <DashboardIcon className="h-6 w-6" />
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
              <CodeIcon className="h-6 w-6" />
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
              <UserIcon className="h-6 w-6" />
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
            <div className="py-2">
              <ProfileCardSkeleton />
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
                    <UserIcon className="h-7 w-7" />
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
            <PlusIcon className="h-3.5 w-3.5" />
            <span>Add Project</span>
          </Link>
        </CardHeader>

        {isProjectsLoading ? (
          <ProjectsTableSkeleton />
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
          <CardBody className="py-10">
            <EmptyState
              variant="solid"
              icon={<InboxIcon className="h-8 w-8" />}
              title="No projects created yet"
              description="Get started by creating your first showcase project."
              action={
                <Link
                  to="/admin/projects/new"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  Create First Project
                </Link>
              }
            />
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm text-gray-600">
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
                                <ImageIcon className="h-5 w-5" />
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
                              <Badge key={tech}>{tech}</Badge>
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
                            <ExternalLinkIcon className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>

                          <Link
                            to={`/admin/projects/${project.id}/edit`}
                            className="rounded-md p-1.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                            title="Edit project"
                          >
                            <PencilIcon className="h-4 w-4" />
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
                              <TrashIcon className="h-4 w-4" />
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
