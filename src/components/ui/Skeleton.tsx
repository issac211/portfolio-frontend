// ─── Skeleton Primitive ───────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

/**
 * Single shimmer block. Compose multiple instances to build
 * page-specific skeleton layouts.
 */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  );
}

// ─── Composed Skeleton Layouts ────────────────────────────────────

/**
 * 2-column project card grid skeleton.
 * Mirrors the `ProjectCard` grid in `HomePage`.
 */
export function ProjectsGridSkeleton() {
  return (
    <div
      aria-label="Loading projects…"
      role="status"
      className="grid grid-cols-1 gap-8 md:grid-cols-2"
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs"
        >
          {/* Image placeholder */}
          <Skeleton className="h-44 sm:h-48 w-full rounded-none" />
          <div className="space-y-3.5 p-6 sm:p-7">
            {/* Title */}
            <Skeleton className="h-6 w-3/4" />
            {/* Summary lines */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            {/* Tags row */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>
          </div>
          {/* Footer action slot */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:px-7">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Project detail page skeleton.
 * Mirrors the article layout in `ProjectDetailPage`.
 */
export function ProjectDetailSkeleton() {
  return (
    <div
      aria-label="Loading project…"
      role="status"
      className="py-12 sm:py-16"
    >
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Skeleton className="h-4 w-28" />

        {/* Header: Title, Actions & Tags */}
        <div className="border-b border-gray-200 pb-8 space-y-5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <Skeleton className="h-10 w-2/3 sm:w-1/2" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          {/* Summary */}
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Media Banner placeholder */}
        <Skeleton className="h-48 sm:h-60 md:h-72 w-full rounded-xl" />

        {/* Body text lines */}
        <div className="space-y-3 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard profile card skeleton.
 * Mirrors the avatar + name/bio layout in `DashboardPage`.
 */
export function ProfileCardSkeleton() {
  return (
    <div
      aria-label="Loading profile…"
      role="status"
      className="flex items-center gap-4 py-2"
    >
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-56" />
      </div>
    </div>
  );
}

/**
 * Dashboard projects table skeleton.
 * Renders 4 placeholder rows matching the table column structure.
 */
export function ProjectsTableSkeleton() {
  return (
    <div
      aria-label="Loading projects…"
      role="status"
      className="divide-y divide-gray-200"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          {/* Thumbnail */}
          <Skeleton className="h-10 w-14 shrink-0 rounded-md" />
          {/* Title + description */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          {/* Tech badges */}
          <div className="hidden gap-1.5 sm:flex">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          {/* Order badge */}
          <Skeleton className="h-5 w-8 rounded-full" />
          {/* Action icons */}
          <div className="flex gap-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Profile form page skeleton.
 * Mirrors the avatar column + personal details form layout.
 */
export function ProfileFormSkeleton() {
  return (
    <div
      aria-label="Loading profile settings…"
      role="status"
      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
    >
      {/* Left: avatar card */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-gray-200 p-6">
          <Skeleton className="mb-4 h-5 w-28" />
          <Skeleton className="mx-auto mb-5 h-36 w-36 rounded-full" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
      {/* Right: form card */}
      <div className="lg:col-span-8">
        <div className="rounded-2xl border border-gray-200 p-6 space-y-6">
          <Skeleton className="h-5 w-36" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Project form page skeleton.
 * Mirrors the media preview column + project details form layout.
 */
export function ProjectFormSkeleton() {
  return (
    <div
      aria-label="Loading project…"
      role="status"
      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
    >
      {/* Left: media card */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-gray-200 p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
      {/* Right: details card */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-2xl border border-gray-200 p-6 space-y-5">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Public hero section skeleton.
 * Mirrors the grid, status badge, typography hierarchy, and portrait avatar in `ProfileHero`.
 */
export function ProfileHeroSkeleton() {
  return (
    <section
      id="home"
      aria-label="Loading profile…"
      role="status"
      className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text & CTAs */}
          <div className="flex flex-col items-center text-center lg:col-span-8 lg:items-start lg:text-left">
            {/* Status Pill Skeleton */}
            <Skeleton className="h-6 w-36 rounded-full sm:w-44" />

            {/* Primary Heading (H1 lines) Skeleton */}
            <div className="mt-5 flex w-full flex-col items-center space-y-3 lg:items-start">
              <Skeleton className="h-9 w-11/12 sm:h-11 sm:w-4/5 lg:h-12" />
              <Skeleton className="h-9 w-3/4 sm:h-11 sm:w-3/5 lg:h-12" />
            </div>

            {/* Name & Age Skeleton */}
            <Skeleton className="mt-4 h-6 w-52 sm:w-64" />

            {/* Bio Paragraph Lines Skeleton */}
            <div className="mt-3 flex w-full max-w-3xl flex-col items-center space-y-2 lg:items-start">
              <Skeleton className="h-4.5 w-full" />
              <Skeleton className="h-4.5 w-11/12" />
              <Skeleton className="h-4.5 w-4/5" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-32 rounded-lg" />
            </div>
          </div>

          {/* Right Column: Avatar Portrait Skeleton */}
          <div className="relative lg:col-span-4">
            <div className="flex justify-center lg:sticky lg:top-24 lg:justify-end">
              <div className="relative">
                <div
                  className="absolute -inset-2 rounded-full bg-gray-200/50 blur-xl"
                  aria-hidden="true"
                />
                <Skeleton className="relative h-60 w-60 rounded-full border-4 border-white shadow-xl sm:h-72 sm:w-72 lg:h-80 lg:w-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
