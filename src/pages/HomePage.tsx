import { useProfile } from "../hooks/useProfile";
import { useProjects } from "../hooks/useProjects";
import { useScrollToHash } from "../hooks/useScrollToHash";
import { ProfileHero } from "../components/shared/ProfileHero";
import { ProjectCard } from "../components/shared/ProjectCard";
import { SectionTitle } from "../components/ui/SectionTitle";
import { EmptyState } from "../components/ui/EmptyState";
import { ProjectsGridSkeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { ExclamationCircleIcon, InboxIcon } from "../components/ui/icons";

/**
 * Public portfolio landing page.
 *
 * Integrates the ProfileHero section (`#home`) and Projects showcase grid (`#projects`),
 * coordinating parallel client-side data fetching, graceful loading/error/empty states,
 * and automatic smooth-scrolling to URL hash anchors.
 */
export function HomePage() {
  const { profile } = useProfile();
  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  // Scroll to hash anchor once data resolves so the target section exists in the DOM
  useScrollToHash(isProjectsLoading);

  return (
    <div className="flex flex-col">
      {/* ── Hero Section (#home) ── */}
      <ProfileHero profile={profile} />

      {/* ── Featured Projects Section (#projects) ── */}
      <section
        id="projects"
        aria-label="Featured Projects"
        className="border-t border-gray-100 bg-gray-50/50 pt-10 pb-16 sm:pt-12 sm:pb-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Featured Projects"
            subtitle="A showcase of recent web applications, systems, and open-source contributions."
            badge="Portfolio"
            align="left"
          />

          {/* Loading State */}
          {isProjectsLoading && <ProjectsGridSkeleton />}

          {/* Error State with Retry */}
          {!isProjectsLoading && projectsError && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 p-8 text-center sm:p-12">
              <ExclamationCircleIcon className="mx-auto h-10 w-10 text-red-500" />
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
            <EmptyState
              icon={<InboxIcon className="h-8 w-8" />}
              title="No projects published yet"
              description="Projects will appear here once they are added to the portfolio. Check back soon!"
            />
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
