import { SearchIcon, XIcon } from "../ui/icons";

interface ProjectSearchProps {
  /** Current search input string. */
  value: string;
  /** Callback fired on input change. */
  onChange: (value: string) => void;
  /** Total count of projects before filtering. */
  totalCount: number;
  /** Count of projects matching the current filter. */
  filteredCount: number;
}

/**
 * Free-text search bar for filtering featured projects.
 *
 * Provides an accessible search input with leading icon, instant clear button,
 * and live result count indicator.
 */
export function ProjectSearch({
  value,
  onChange,
  totalCount,
  filteredCount,
}: ProjectSearchProps) {
  const isFiltering = value.trim().length > 0;

  return (
    <div
      role="search"
      aria-label="Search projects"
      className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Search Input Container */}
      <div className="relative w-full max-w-md">
        <label htmlFor="project-search-input" className="sr-only">
          Search projects by name, technology, or keywords
        </label>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
          <SearchIcon className="h-4 w-4" />
        </div>
        <input
          id="project-search-input"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, technology, or keywords..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-9 pl-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-xs transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search filter"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Result Count Indicator */}
      {isFiltering && (
        <p
          aria-live="polite"
          className="text-xs font-medium text-gray-500 animate-fade-in"
        >
          Found <span className="font-semibold text-gray-900">{filteredCount}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalCount}</span> projects
        </p>
      )}
    </div>
  );
}
