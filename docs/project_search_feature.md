# Feature — Free-Text Project Search

## Goal

Provide instant, intuitive, and accessible free-text search across published projects on the public home page (`HomePage.tsx`). The feature enables visitors to quickly discover projects by typing arbitrary search terms (names, technologies, or keywords) with zero network latency, while gracefully falling back to the complete project showcase when the query is empty.

---

## Architectural Decisions

### 1. Client-Side In-Memory Cache Filtering (`useMemo`)

| Strategy | Mechanism | Trade-Off & Decision |
|---|---|---|
| **Server-Side API Filtering** | Backend endpoint with query parameters (e.g., `GET /projects?q=...`) | Introduces network roundtrips, debouncing complexity, and redundant database queries for small/medium collections. |
| **Client-Side Cache Filtering** | Pure `useMemo` filter over the cached React Query `projects` collection | **Chosen.** All projects are already pre-fetched and cached via `useProjects()`. Client filtering delivers instant (0ms) keystroke feedback, preserves smooth animations, and works offline/stale. |

### 2. Multi-Term Keyword Matching Predicate

Instead of an exact substring match on the entire query string (which fails when words appear in different orders or across different fields), the search algorithm splits queries into distinct whitespace-delimited words:

```ts
const queryWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

return projects.filter((project) => {
  const searchableText = `${project.title} ${project.summary} ${(project.tags || []).join(" ")} ${project.content || ""}`.toLowerCase();
  return queryWords.every((word) => searchableText.includes(word));
});
```

- **All Words Must Match (`every`):** Typing `"react postgresql"` returns projects containing both terms, even if `"react"` is in the title and `"postgresql"` is in the tags.
- **Case-Insensitive & Whitespace-Tolerant:** Leading/trailing/multiple spaces are collapsed, and all text comparisons are converted to lowercase.
- **Graceful Fallback:** If `searchQuery` is empty or whitespace-only, the filter returns the full `projects` array without computation.

### 3. Dual Empty-State Handling

| State | Condition | Presentation |
|---|---|---|
| **Empty Portfolio** | `projects.length === 0` | Standard `EmptyState` ("No projects published yet") with mailbox icon. The search bar is hidden. |
| **No Search Matches** | `projects.length > 0 && filteredProjects.length === 0` | Contextual `EmptyState` ("No matching projects found") with `SearchIcon`, displaying the exact query and a prominent `"Clear search"` button that resets `searchQuery` to `""`. |

---

## Component Architecture

```
HomePage (#projects)
 ├─ SectionTitle
 ├─ ProjectSearch (rendered when projects.length > 0)
 │   ├─ SearchIcon (leading visual indicator)
 │   ├─ <input type="search" /> (accessible form control)
 │   ├─ Clear Button (XIcon, rendered when query is non-empty)
 │   └─ Live Result Counter (aria-live="polite", "Found X of Y projects")
 ├─ ProjectsGridSkeleton (during initial load)
 ├─ EmptyState (search zero-results with reset action)
 └─ ProjectCard Grid (renders filteredProjects)
```

### Accessibility (a11y) & Usability Details

- **Semantic Role:** The search wrapper defines `role="search"` and `aria-label="Search projects"`.
- **Screen Reader Labels:** Form control uses an accessible `<label htmlFor="project-search-input" className="sr-only">`.
- **Clear Action:** Clear button specifies `aria-label="Clear search filter"` and resets the input in a single click.
- **Live Announcer:** Result counter uses `aria-live="polite"` so screen reader users are notified when the match count updates without disrupting page flow.

---

## Files

| File | Action | Purpose |
|---|---|---|
| `src/components/ui/icons/SearchIcon.tsx` | **NEW** | Accessible 24×24 magnifying glass SVG icon |
| `src/components/ui/icons/index.ts` | **MODIFY** | Re-export `SearchIcon` alongside existing icon primitives |
| `src/components/shared/ProjectSearch.tsx` | **NEW** | Modular, presentational search bar with clear button and live counter |
| `src/pages/HomePage.tsx` | **MODIFY** | Connect `searchQuery` state, multi-term `useMemo` filter, search bar slot, and empty search state |
| `docs/project_search_feature.md` | **NEW** | This architecture and implementation reference document |

---

## Verification & Type Safety

- **Type-Check:** `npx tsc -b --noEmit` exits with code 0 (100% strict type-safe).
- **Linter:** `npm run lint` exits with code 0 (0 warnings, 0 errors).
