import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "../services/projectService";
import { IMAGE_BASE_URL } from "../config/constants";
import { Loader } from "../components/ui/Loader";
import type { ProjectResponse } from "../types/project";
import type { ApiError } from "../types/api";

/**
 * Deep-dive detail page for an individual project.
 *
 * Fetches project metadata by ID from the URL parameters, renders an accessible
 * back-navigation breadcrumb, displays high-resolution media with responsive aspect ratios,
 * lists technology stack tags, and provides secure external links to live deployments
 * and source code repositories.
 */
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard clause: validate parameter presence and integer format
    const projectId = Number(id);
    if (!id || Number.isNaN(projectId)) {
      setError("Invalid project identifier.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getProject(projectId)
      .then((data) => {
        if (isMounted) {
          setProject(data);
        }
      })
      .catch((err: ApiError | Error) => {
        if (isMounted) {
          setError(err.message || "Failed to load project details.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Error State / Not Found
  if (error || !project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center sm:p-12">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-red-900">
            Project Not Found
          </h2>
          <p className="mt-2 text-sm text-red-700">
            {error || "The requested project could not be found."}
          </p>
          <div className="mt-6">
            <Link
              to="/#projects"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-xs ring-1 ring-gray-300 ring-inset transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
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
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
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
              <svg
                className="h-16 w-16 text-gray-300"
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
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>Repository</span>
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Badges */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Project Description Content */}
        <div className="py-8">
          <h2 className="text-lg font-bold text-gray-900">
            About the Project
          </h2>
          <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700 sm:text-lg">
            {project.description}
          </div>
        </div>
      </div>
    </article>
  );
}
