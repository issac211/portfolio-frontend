import { Link } from "react-router-dom";
import { Card, CardBody, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { GithubIcon, ExternalLinkIcon, ArrowRightIcon } from "../ui/icons";
import { IMAGE_BASE_URL } from "../../config/constants";
import type { ProjectResponse } from "../../types/project";

interface ProjectCardProps {
  project: ProjectResponse;
}

/**
 * Individual project showcase card.
 *
 * Employs semantic `<article>` container via polymorphic `Card`.
 * Conditionally renders a compact media banner only when an image is present
 * (allowing text-only projects to start immediately from the title),
 * elevates title and summary typography, highlights tags with primary badges,
 * and exposes deep-dive navigation alongside external repository links.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.image_url
    ? `${IMAGE_BASE_URL}${project.image_url}`
    : null;

  return (
    <Card
      as="article"
      hoverable
      className="group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg"
    >
      {/* Compact Media Preview Slot — clickable image banner navigating to project */}
      {imageUrl && (
        <Link
          to={`/projects/${project.id}`}
          aria-label={`View details for ${project.title}`}
          className="relative block h-44 sm:h-48 w-full overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        >
          <img
            src={imageUrl}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-gray-950/20 via-transparent to-transparent opacity-60"
            aria-hidden="true"
          />
        </Link>
      )}

      {/* Content Slot: Title, Summary, Tags */}
      <CardBody className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Semantic h3 preserves document heading hierarchy under section h2 */}
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
          <Link
            to={`/projects/${project.id}`}
            className="focus:outline-none focus:underline"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm sm:text-base font-normal leading-relaxed text-gray-600">
          {project.summary}
        </p>

        {/* Tag Badges — primary styling for high-contrast tag discovery */}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-auto pt-5 flex flex-wrap gap-1.5 sm:gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardBody>

      {/* Action Slot: Internal Detail Link & External Actions */}
      <CardFooter className="sm:px-7 flex items-center justify-between gap-4">
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-700/10 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:ring-blue-600 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>View project</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.title}`}
              className="p-1.5 text-gray-400 transition-all duration-200 hover:scale-110 active:scale-95 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          )}

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demonstration for ${project.title}`}
              className="p-1.5 text-gray-400 transition-all duration-200 hover:scale-110 active:scale-95 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <ExternalLinkIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
