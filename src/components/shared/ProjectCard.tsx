import { Link } from "react-router-dom";
import { Card, CardBody, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { GithubIcon, ExternalLinkIcon, ArrowRightIcon, ImageIcon } from "../ui/icons";
import { IMAGE_BASE_URL } from "../../config/constants";
import type { ProjectResponse } from "../../types/project";

interface ProjectCardProps {
  project: ProjectResponse;
}

/**
 * Individual project showcase card.
 *
 * Employs semantic `<article>` container via polymorphic `Card`, enforces
 * uniform 16:9 media aspect ratios with lazy loading, handles relative
 * image paths, and exposes navigation to the deep-dive detail route alongside
 * secure external repository and deployment links.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.image_url
    ? `${IMAGE_BASE_URL}${project.image_url}`
    : null;

  return (
    <Card as="article" hoverable className="group flex h-full flex-col">
      {/* 16:9 Media Preview Slot */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
            <ImageIcon className="h-10 w-10 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content Slot: Title, Description, Tech Stack */}
      <CardBody className="flex flex-1 flex-col">
        {/* Semantic h3 preserves document heading hierarchy under section h2 */}
        <h3 className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
          <Link to={`/projects/${project.id}`} className="focus:outline-none">
            {project.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {project.summary}
        </p>

        {/* Tech Stack Badges */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        )}
      </CardBody>

      {/* Action Slot: Internal Detail Link & External Actions */}
      <CardFooter>
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          <span>Learn more</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
        </Link>

        <div className="flex items-center gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.title}`}
              className="text-gray-400 transition-all duration-200 hover:scale-110 active:scale-95 hover:text-gray-900"
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
              className="text-gray-400 transition-all duration-200 hover:scale-110 active:scale-95 hover:text-blue-600"
            >
              <ExternalLinkIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
