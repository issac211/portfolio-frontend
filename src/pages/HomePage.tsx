import { useMemo, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useProjects } from "../hooks/useProjects";
import { useScrollToHash } from "../hooks/useScrollToHash";
import { useSEO } from "../hooks/useSEO";
import { ProfileHero } from "../components/shared/ProfileHero";
import { ProjectCard } from "../components/shared/ProjectCard";
import { ProjectSearch } from "../components/shared/ProjectSearch";
import { SectionTitle } from "../components/ui/SectionTitle";
import { EmptyState } from "../components/ui/EmptyState";
import { ProjectsGridSkeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import {
  ExclamationCircleIcon,
  InboxIcon,
  SearchIcon,
} from "../components/ui/icons";

/**
 * Public portfolio landing page.
 *
 * Integrates the ProfileHero section (`#home`) and Projects showcase grid (`#projects`),
 * coordinating parallel client-side data fetching, graceful loading/error/empty states,
 * free-text project filtering, and automatic smooth-scrolling to URL hash anchors.
 */
export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { profile, isLoading: isProfileLoading } = useProfile();
  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  useSEO({
    title: "Home",
    description:
      "Explore modern web applications, scalable system architectures, and open-source contributions by Itzik.",
  });

  // Scroll to hash anchor once data resolves so the target section exists in the DOM
  useScrollToHash(isProjectsLoading || isProfileLoading);

  // Filter projects by free-text keywords across title, summary, tags, and content
  const filteredProjects = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return projects;

    const queryWords = trimmed.split(/\s+/).filter(Boolean);

    return projects.filter((project) => {
      const title = project.title.toLowerCase();
      const summary = project.summary.toLowerCase();
      const tags = (project.tags || []).map((t) => t.toLowerCase()).join(" ");
      const content = (project.content || "").toLowerCase();
      const searchableText = `${title} ${summary} ${tags} ${content}`;

      return queryWords.every((word) => searchableText.includes(word));
    });
  }, [projects, searchQuery]);

  return (
    <div className="flex flex-col">
      {/* ── Hero Section (#home) ── */}
      <ProfileHero profile={profile} isLoading={isProfileLoading} />

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

          {/* Search Bar — rendered when projects are available */}
          {!isProjectsLoading && !projectsError && projects.length > 0 && (
            <ProjectSearch
              value={searchQuery}
              onChange={setSearchQuery}
              totalCount={projects.length}
              filteredCount={filteredProjects.length}
            />
          )}

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

          {/* Empty State (no projects added to portfolio yet) */}
          {!isProjectsLoading && !projectsError && projects.length === 0 && (
            <EmptyState
              icon={<InboxIcon className="h-8 w-8" />}
              title="No projects published yet"
              description="Projects will appear here once they are added to the portfolio. Check back soon!"
            />
          )}

          {/* Empty Search State (search yielded zero matching projects) */}
          {!isProjectsLoading &&
            !projectsError &&
            projects.length > 0 &&
            filteredProjects.length === 0 && (
              <EmptyState
                icon={<SearchIcon className="h-8 w-8" />}
                title="No matching projects found"
                description={`No projects match your search for "${searchQuery}". Try different keywords, technologies, or clear the search filter.`}
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                }
              />
            )}

          {/* Projects Grid — 1 or 2 columns for optimal content balance */}
          {!isProjectsLoading &&
            !projectsError &&
            filteredProjects.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-fade-in-up">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

