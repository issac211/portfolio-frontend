import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useProjects } from "../hooks/useProjects";
import { ProfileHero } from "../components/shared/ProfileHero";
import { ProjectCard } from "../components/shared/ProjectCard";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";

/**
 * Public portfolio landing page.
 *
 * Integrates the ProfileHero section (`#home`) and Projects showcase grid (`#projects`),
 * coordinating parallel client-side data fetching, graceful loading/error/empty states,
 * and automatic smooth-scrolling to URL hash anchors.
 */
export function HomePage() {
  const location = useLocation();
  const { profile } = useProfile();
  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  // Smooth-scroll to hash anchor after data/DOM stabilizes (e.g. navigation from sub-routes)
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash, isProjectsLoading]);

  return (
    <div className="flex flex-col">
      {/* ── Hero Section (#home) ── */}
      <ProfileHero profile={profile} />

      {/* ── Featured Projects Section (#projects) ── */}
      <section
        id="projects"
        aria-label="Featured Projects"
        className="border-t border-gray-100 bg-gray-50/50 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Featured Projects"
            subtitle="A showcase of recent web applications, systems, and open-source contributions."
            badge="Portfolio"
            align="left"
          />

          {/* Loading State */}
          {isProjectsLoading && (
            <div className="flex min-h-[280px] items-center justify-center">
              <Loader size="lg" />
            </div>
          )}

          {/* Error State with Retry */}
          {!isProjectsLoading && projectsError && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 p-8 text-center sm:p-12">
              <svg
                className="mx-auto h-10 w-10 text-red-500"
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
              <h3 className="mt-4 text-base font-semibold text-red-900">
                Failed to load projects
              </h3>
              <p className="mt-1 text-sm text-red-700">{projectsError}</p>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => refetchProjects()}
                >
                  Try again
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isProjectsLoading && !projectsError && projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                No projects published yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back soon or explore the GitHub repository.
              </p>
            </div>
          )}

          {/* Projects Grid */}
          {!isProjectsLoading && !projectsError && projects.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
