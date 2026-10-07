import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ExternalLinkIcon,
  GithubIcon,
  ImageIcon,
} from "../components/ui/icons";
import { ProjectDetailSkeleton } from "../components/ui/Skeleton";
import { IMAGE_BASE_URL } from "../config/constants";
import { useProject } from "../hooks/useProjects";
import { useSEO } from "../hooks/useSEO";

/**
 * Deep-dive detail page for an individual project.
 *
 * Fetches and caches project metadata by ID via React Query, renders an accessible
 * back-navigation breadcrumb using client-side routing, displays high-resolution media,
 * lists project tags, and provides secure external links.
 */
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? Number(id) : null;
  const isInvalidId = !id || Number.isNaN(projectId);

  const {
    data: project,
    isLoading,
    error: queryError,
  } = useProject(isInvalidId ? null : projectId);

  const errorMessage = isInvalidId
    ? "Invalid project identifier."
    : queryError
      ? queryError.message || "Failed to load project details."
      : null;

  useSEO({
    title: project
      ? project.title
      : isLoading
        ? "Loading Project..."
        : "Project Details",
    description:
      project?.summary ||
      "Detailed project deep-dive showcasing tags, media preview, and architecture.",
    image: project?.image_url
      ? `${IMAGE_BASE_URL}${project.image_url}`
      : undefined,
  });

  // Ensure scroll is reset to top on navigating to a project detail view
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  // Loading State
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  // Error State / Not Found
  if (errorMessage || !project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center sm:p-12">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-red-900">
            Project Not Found
          </h2>
          <p className="mt-2 text-sm text-red-700">
            {errorMessage || "The requested project could not be found."}
          </p>
          <div className="mt-6">
            <Link
              to="/#projects"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-xs ring-1 ring-gray-300 ring-inset transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = project.image_url
    ? `${IMAGE_BASE_URL}${project.image_url}`
    : null;

  return (
    <article className="py-12 sm:py-16 animate-fade-in-up">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
        </nav>

        {/* Media Preview Slot */}
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-100 shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
              <ImageIcon className="h-16 w-16 text-gray-300" />
            </div>
          )}
        </div>

        {/* Header: Title & Action Links */}
        <header className="border-b border-gray-200 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Sole H1 for this page view */}
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>

            {/* External Links: Live Demo & GitHub */}
            <div className="flex flex-wrap items-center gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>Live Demo</span>
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>Repository</span>
                </a>
              )}
            </div>
          </div>

          {/* Tag Badges */}
          {project.tags && project.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Project Content / Full Write-up */}
        <div className="py-8">
          <h2 className="text-lg font-bold text-gray-900">About the Project</h2>
          <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700 sm:text-lg">
            {project.content || project.summary}
          </div>
        </div>
      </div>
    </article>
  );
}
