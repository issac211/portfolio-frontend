# Frontend Implementation Plan — v1.1

## Architectural Decisions (v1.1)

| Decision                        | Choice                                                                                                                        | Rationale                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Server state management         | React Query (`@tanstack/react-query`) for Profile & Projects                                                                  | Mandatory across all server state — fetch-once/caching, automatic deduplication, stale-while-revalidate, and unified mutation lifecycle      |
| Query key architecture          | Centralized `QUERY_KEYS` constant in `config/constants.ts`                                                                    | Single Source of Truth for cache keys (`profile`, `projects`, `project(id)`); hierarchical invalidation prevents typo drift                  |
| Mutation & cache invalidation   | `useMutation` with `queryClient.invalidateQueries` on write ops                                                               | All PUT/POST/DELETE and image upload operations trigger automated targeted query invalidation to ensure UI state mirrors the database        |
| Controlled form state safety    | Null-coalescing (`?? ""`) on all nullable fields in form state                                                                | Coalesces database `null` values to empty strings during form initialization, preventing React uncontrolled-to-controlled component warnings |
| Hardcoding elimination strategy | Replace all static strings with data from `GET /api/profile/`                                                                 | Single Source of Truth from the backend; zero hardcoded marketing copy                                                                       |
| Project description split (UI)  | Two separate `<textarea>` inputs in Admin form; `ProjectCard` uses `summary`, `ProjectDetailPage` uses `content`              | Matches the new backend schema; clear separation of concerns                                                                                 |
| Image deletion UX               | Trash icon button with inline confirmation                                                                                    | Lightweight, no modal overhead for a reversible-ish action                                                                                   |
| Profile deletion UX             | Danger-zone button + strict confirmation modal                                                                                | Destructive action requires explicit user intent; mirrors common SaaS patterns                                                               |
| Native Fetch preserved          | Continue using `services/apiClient.ts`                                                                                        | SOP Section 5 mandates native fetch — React Query wraps fetch calls, not replaces `apiClient`                                                |
| Domain vocabulary refactoring   | Rename `tech_stack` → `tags` in all TypeScript interfaces, UI labels, and form fields                                         | Mirrors backend rename; generalizes concept to include status labels ("WIP", "Open Source") and categories beyond technologies               |
| Availability indicator (UI)     | Map `status_indicator` string to Tailwind dot classes in `ProfileHero` (`success` → pulsing green, `error` → solid red, etc.) | Dynamic, backend-driven visual state; avoids boolean flags; uses a semantic string→class lookup instead of conditional chains                |
| API contract-driven development | Validate TS interfaces against `api-contract.json` (OpenAPI) exported by the backend after each schema phase                  | Frontend work begins only after the contract is updated; prevents type drift and integration surprises                                       |
| Client-side SPA navigation      | React Router `<Link>` with conditional smooth scrolling on `/`                                                                | Eliminates full-page browser reloads when navigating across pages or back from detail views, maintaining hot client cache                    |

---

## Current Project State (Baseline v1.1)

```
frontend/
├── .env
├── .env.example
├── api-contract.json
├── eslint.config.js
├── GEMINI.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── docs/
│   ├── implementation_plan.md            # v1.0 archive — do not modify
│   └── phase_5_2_toast_system.md
├── public/
│   ├── favicon.svg
│   └── og-image.jpg
└── src/
    ├── App.tsx                     # Root — QueryClientProvider + AuthProvider + AppRouter (Phase 1)
    ├── index.css
    ├── main.tsx
    ├── components/
    │   ├── admin/
    │   │   ├── AdminLayout.tsx
    │   │   ├── AdminSidebar.tsx        # Persistent & drawer navigation with collapsible, scrollable project edit list
    │   │   └── ConfirmDeleteModal.tsx  # Accessible danger-zone confirmation modal with typed keyword check (Phase 5)
    │   ├── layout/
    │   │   ├── Footer.tsx              # Public footer with mailto safety & SPA smooth-scroll links (Phase 2, Phase 6)
    │   │   ├── Navbar.tsx              # Public navbar with profile branding & SPA smooth-scroll links (Phase 2, Phase 6)
    │   │   └── PublicLayout.tsx
    │   ├── shared/
    │   │   ├── ProfileHero.tsx         # Hero presentation with age calculation, narrative paragraphs & timeline markers
    │   │   └── ProjectCard.tsx         # Showcase card with conditional compact media, elevated typography & primary tag badges
    │   └── ui/
    │       ├── Badge.tsx
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── EmptyState.tsx
    │       ├── Input.tsx
    │       ├── Loader.tsx
│       ├── MarkdownContent.tsx     # Secure, styled Markdown renderer (react-markdown + remark-gfm)
    │       ├── SectionTitle.tsx
    │       ├── Skeleton.tsx            # Shimmer loading placeholders matching 2-column project cards & detail layouts
    │       ├── StatusBadge.tsx         # Unified availability status badge & dot (pill & inline variants)
    │       ├── Toast.tsx
    │       └── icons/
    │           ├── index.ts
    │           ├── ArrowDownIcon.tsx
    │           ├── ArrowLeftIcon.tsx
    │           ├── ArrowRightIcon.tsx
    │           ├── CheckCircleIcon.tsx
    │           ├── CodeIcon.tsx
    │           ├── DashboardIcon.tsx
    │           ├── ExclamationCircleIcon.tsx
    │           ├── ExternalLinkIcon.tsx
    │           ├── GithubIcon.tsx
    │           ├── ImageIcon.tsx
    │           ├── InboxIcon.tsx
    │           ├── InfoCircleIcon.tsx
    │           ├── LinkedInIcon.tsx
    │           ├── LogoutIcon.tsx
    │           ├── MailIcon.tsx
    │           ├── MenuIcon.tsx
    │           ├── PencilIcon.tsx
    │           ├── PlusIcon.tsx
    │           ├── TrashIcon.tsx
    │           ├── UserIcon.tsx
    │           └── XIcon.tsx
    ├── config/
    │   └── constants.ts            # API/IMAGE URLs, TOKEN_KEY + QUERY_KEYS with project(id) factory (Phase 1, Phase 6)
    ├── context/
    │   ├── AuthContext.tsx
    │   └── ToastContext.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useProfile.ts           # React Query useQuery + upsert, upload & delete image/profile mutations (Phase 5, Phase 6)
    │   ├── useProjects.ts          # React Query useQuery, useProject(id) + project CRUD, upload & delete mutations (Phase 5, Phase 6)
    │   ├── useScrollToHash.ts
    │   └── useSEO.ts
    ├── pages/
    │   ├── HomePage.tsx            # Public landing with Hero, 2-column project showcase & hash navigation
    │   ├── LoginPage.tsx
    │   ├── ProjectDetailPage.tsx   # Deep-dive with header-first layout, conditional compact media & React Query cache
    │   └── admin/
    │       ├── DashboardPage.tsx       # Metrics hub with dynamic status indicator, profile summary & project admin table
    │       ├── ProfileFormPage.tsx     # Full profile CRUD, upload/delete image & danger zone soft delete (Phase 5, Phase 6)
    │       └── ProjectFormPage.tsx     # Full project CRUD, upload/delete image & rich Markdown editor (MDEditor)
    ├── router/
    │   ├── AppRouter.tsx
    │   └── ProtectedRoute.tsx
    ├── services/
    │   ├── apiClient.ts
    │   ├── authService.ts
    │   ├── profileService.ts       # getProfile, upsertProfile, uploadProfileImage, deleteProfileImage, deleteProfile (Phase 5)
    │   └── projectService.ts       # project CRUD + uploadProjectImage + deleteProjectImage (Phase 5)
    ├── types/
    │   ├── api.ts
    │   ├── auth.ts
    │   ├── profile.ts              # PersonalInfo schemas & ActiveStatusIndicator helper
    │   └── project.ts
    └── utils/
        ├── scroll.ts
        └── status.ts               # Single Source of Truth STATUS_CONFIG, helpers & STATUS_OPTIONS
```

### Current `PersonalInfoResponse` Type (v1.1)

```typescript
export type StatusIndicator =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | null;

export type ActiveStatusIndicator = Exclude<StatusIndicator, null>;

interface PersonalInfoResponse {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  bio: string | null;
  hero_title: string | null;
  availability_status: string | null;
  short_bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  status_indicator: StatusIndicator;
  image_url: string | null;
  is_active: boolean;
}
```

### Current `ProjectResponse` Type (v1.1)

```typescript
interface ProjectResponse {
  id: number;
  title: string;
  summary: string;
  content: string | null;
  github_url: string | null;
  live_url: string | null;
  tags: string[] | null;
  display_order: number | null;
  image_url: string | null;
}
```

---

## Key Implementation Details

### 1. Hierarchical Query Invalidation & Single-Project Cache
- Single project queries use the key factory `QUERY_KEYS.project(id)` (`["projects", id]`).
- Because React Query invalidates hierarchically by prefix matching, calling `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects })` on collection writes automatically invalidates both the project list and all cached single-project views without manual ID tracking.

### 2. Controlled Form State Safety (Null Coalescing)
- Backend nullable columns initialize as `null`. Form states in `ProfileFormPage` and `ProjectFormPage` coalesce with `?? ""` (e.g. `hero_title: data.hero_title ?? ""`).
- Passing `null` to `<input value={...}>` causes React to switch from an uncontrolled to a controlled component, triggering console warnings.

### 3. SPA Navigation with Preserved Smooth Scroll
- `Navbar`, `Footer`, and `ProjectDetailPage` use React Router `<Link>` with a custom click handler (`handleNavClick`):
  - On root (`/`): preserves in-page smooth scrolling (`handleSmoothScroll`).
  - On sub-routes (`/projects/:id`, `/admin`): executes client-side transition without full-page reloads, preserving hot React Query cache; `useScrollToHash` handles target positioning post-navigation.

### 4. Centralized Status Architecture (`status.ts` & `StatusBadge.tsx`)
- Status indicators are centralized in `src/utils/status.ts` with `STATUS_CONFIG` typed strictly as `Record<ActiveStatusIndicator, StatusConfig>` (guaranteeing compile-time exhaustiveness across backend enum values).
- Reusable `<StatusBadge />` supports both `pill` (Hero) and `inline` (Footer) variants. Standalone `<StatusDot />` encapsulates the ping pulse animation for Admin Dashboard metric cards.
- Admin forms consume `STATUS_OPTIONS` dynamically to populate `<select>` options without duplicate markup.

### 5. Markdown Architecture & Heading Hierarchy
- **Public (`ProjectDetailPage`):** Rendered via `<MarkdownContent />` (`react-markdown` + `remark-gfm`). Headings map `#` to `<h3>` (`h3`–`h6`) to preserve page `<h1>` (Project Title) and `<h2>` (About) semantic hierarchy and satisfy single-H1 accessibility rules. External links automatically enforce `target="_blank" rel="noopener noreferrer"`.
- **Admin (`ProjectFormPage`):** Authoring via `@uiw/react-md-editor` with live dual-pane preview (`data-color-mode="light"`).

### 6. Hero Narrative Formatting & Split Title
- `ProfileHero` auto-splits `hero_title` (phrases with 4+ words highlight the final 2 in gradient) while supporting explicit `|` delimiter overrides from the admin form.
- Extended bio splits raw newline text (`split(/\n+/)`) into narrative timeline nodes with CSS `grid-template-rows` smooth auto-height toggle (`grid-rows-[0fr] ↔ [1fr]`).

### 7. Native Mailto Safety & Clipboard Fallback
- `Footer` conditionally omits `target="_blank"` on `mailto:` links to prevent browsers from opening unwanted blank tabs.
- If no desktop mail client is registered, clicking the email button copies the address to clipboard via `navigator.clipboard.writeText` and displays a toast notification.

### 8. Danger-Zone Modal Mount Lifecycle
- `ConfirmDeleteModal` uses a mount-based lifecycle with typed keyword verification (`confirmKeyword="DELETE"`). State resets upon mount rather than synchronously inside a `useEffect` to prevent React 19 cascading render warnings.

### 9. Admin Sidebar Fast Project Navigation
- `AdminSidebar` consumes `useProjects()` to render a collapsible sub-navigation list directly under "New Project", allowing instant one-click editing without returning to the dashboard table.
- Employs an internal scroll container (`max-h-52 overflow-y-auto` with slim scrollbar) so sidebars remain compact and footer session actions (Back to Site / Logout) stay anchored and reachable even with dozens of projects.

---

## Target Folder Structure (v1.1)

```
frontend/
├── .env
├── .env.example
├── api-contract.json                     [UPDATE] — refreshed by backend after each schema phase (source of truth for TS interfaces)
├── eslint.config.js
├── GEMINI.md                             ✅ Done — SOP Section 5 React Query & Section 7 reference
├── index.html
├── package.json                          ✅ Done — added @tanstack/react-query
├── package-lock.json                     ✅ Done — lockfile refreshed
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── docs/
│   ├── implementation_plan.md            # v1.0 archive — untouched
│   ├── implementation_plan_v1.1.md       [NEW] — this file
│   └── phase_5_2_toast_system.md
├── public/
│   ├── favicon.svg
│   └── og-image.jpg
└── src/
    ├── App.tsx                           ✅ Done — wrapped with QueryClientProvider
    ├── index.css
    ├── main.tsx
    ├── components/
    │   ├── admin/
    │   │   ├── AdminLayout.tsx
    │   │   ├── AdminSidebar.tsx         ✅ Done — collapsible, scrollable project edit list with mobile drawer support
    │   │   └── ConfirmDeleteModal.tsx    ✅ Done — reusable accessible confirmation modal with typed keyword verification
    │   ├── layout/
    │   │   ├── Footer.tsx               ✅ Done — consumed profile data, mailto safety & SPA navigation
    │   │   ├── Navbar.tsx               ✅ Done — consumed profile data & SPA navigation
    │   │   └── PublicLayout.tsx
    │   ├── shared/
    │   │   ├── ProfileHero.tsx          ✅ Done — age calculation, formatted collapsible bio, scaled heading & status indicator
    │   │   └── ProjectCard.tsx          ✅ Done — uses `summary` instead of `description`; renders `tags`
    │   └── ui/
    │       ├── Badge.tsx                ✅ Done — audited, JSDoc generalized for tags
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── EmptyState.tsx
    │       ├── Input.tsx
    │       ├── Loader.tsx
    │       ├── MarkdownContent.tsx      ✅ Done — secure Markdown viewer (react-markdown + remark-gfm)
    │       ├── SectionTitle.tsx
    │       ├── Skeleton.tsx             ✅ Done — updated skeletons for 2-col showcase & detail page
    │       ├── StatusBadge.tsx          ✅ Done — centralized status badge & dot (pill & inline variants)
    │       ├── Toast.tsx
    │       └── icons/
    │           └── ... (no changes)
    ├── config/
    │   └── constants.ts                 ✅ Done — defined centralized QUERY_KEYS object with project(id) factory
    ├── context/
    │   ├── AuthContext.tsx
    │   └── ToastContext.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useProfile.ts               ✅ Done — refactored to React Query (useQuery + upsert, upload & delete mutations)
    │   ├── useProjects.ts              ✅ Done — refactored to React Query (useQuery, useProject(id) + project CRUD, upload & delete mutations)
    │   ├── useScrollToHash.ts
    │   └── useSEO.ts
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── LoginPage.tsx
    │   ├── ProjectDetailPage.tsx        ✅ Done — cached via useProject(id), client-side navigation breadcrumbs, full write-up & tags
    │   └── admin/
    │       ├── DashboardPage.tsx         ✅ Done — delete mutation + `tags` column/metric
    │       ├── ProfileFormPage.tsx       ✅ Done — profile inputs, upsert & upload mutations, image remove button & soft-delete danger zone
    │       └── ProjectFormPage.tsx       ✅ Done — summary + content + tags inputs, CRUD & upload mutations & project image remove button
    ├── router/
    │   ├── AppRouter.tsx
    │   └── ProtectedRoute.tsx
    ├── services/
    │   ├── apiClient.ts
    │   ├── authService.ts
    │   ├── profileService.ts            ✅ Done — getProfile, upsertProfile, uploadProfileImage, deleteProfileImage, deleteProfile
    │   └── projectService.ts            ✅ Done — project CRUD, uploadProjectImage, deleteProjectImage
    ├── types/
    │   ├── api.ts
    │   ├── auth.ts
    │   ├── profile.ts                   ✅ Done — new fields in all interfaces + status_indicator type
    │   └── project.ts                   ✅ Done — summary + content added, description removed, tech_stack → tags
    └── utils/
        ├── scroll.ts
        └── status.ts                    ✅ Done — centralized STATUS_CONFIG, helpers & STATUS_OPTIONS
```

---

## Step-by-Step Roadmap

### Phase 1: React Query Setup & Global State Foundation

- [x] Install `@tanstack/react-query`: `npm install @tanstack/react-query`
- [x] Update SOP in `GEMINI.md` Section 5 — clarify that React Query is permitted as a caching/mutation layer over `apiClient.ts`
- [x] Define centralized `QUERY_KEYS` constant in `src/config/constants.ts` (`profile: ["profile"]`, `projects: ["projects"]` as `const`) — all hooks and mutations MUST consume this object instead of hardcoded strings
- [x] Create `QueryClient` instance and wrap `<App />` with `<QueryClientProvider>` in `App.tsx` (or `main.tsx`)
- [x] Refactor `hooks/useProfile.ts` to use `useQuery` with `QUERY_KEYS.profile` — fetch profile data once at the app root level
- [x] Refactor `hooks/useProjects.ts` to use React Query (mandatory) — replace manual `useEffect` fetch/loading/error state with `useQuery` (`QUERY_KEYS.projects`) and `useMutation` for project CRUD, invalidating `QUERY_KEYS.projects` on success
- [x] Verify existing profile- and project-dependent components still render correctly with cached state
- [x] Type-check: `npx tsc -b --noEmit`

### Phase 2: PersonalInfo Type Expansion & Hardcoding Elimination

- [x] **Pre-check:** Verify `api-contract.json` has been updated by the backend (Phase 2 contract sync) before proceeding
- [x] Update `types/profile.ts` — add new fields to `PersonalInfoResponse`: `hero_title`, `availability_status`, `short_bio`, `github_url`, `linkedin_url`, `email`, `status_indicator`, `is_active` (Note: canonical full bio remains `bio`)
- [x] Update `types/profile.ts` — add `status_indicator` type as `"success" | "warning" | "error" | "neutral" | null` (match backend `Literal` values)
- [x] Update `types/profile.ts` — add new fields to `PersonalInfoCreate` and `PersonalInfoUpdate`
- [x] Audit `components/layout/Navbar.tsx` for hardcoded data → refactor to consume global profile state
- [x] Audit `components/layout/Footer.tsx` for hardcoded data → refactor to consume global profile state (social links, email, short_bio)
- [x] Audit `components/shared/ProfileHero.tsx` for hardcoded data → refactor to consume `hero_title`, `availability_status`, `short_bio`
- [x] Centralize `status_indicator` architecture in `src/utils/status.ts` (`Record<ActiveStatusIndicator, StatusConfig>`) & `src/components/ui/StatusBadge.tsx` (`<StatusBadge />`, `<StatusDot />`) consumed by `ProfileHero`, `Footer`, `DashboardPage`, and `ProfileFormPage`
- [x] Update `pages/admin/ProfileFormPage.tsx` — add form inputs for all new fields
- [x] In `ProfileFormPage.tsx`, ensure state initialization coalesces all nullable fields from `null` to empty strings (e.g., `hero_title: data.hero_title ?? ""`, `availability_status: data.availability_status ?? ""`, etc.) to prevent React "uncontrolled to controlled" component warnings
- [x] Add a `<select>` dropdown for `status_indicator` in `ProfileFormPage.tsx` — options: `success`, `warning`, `error`, `neutral` (do NOT use a free-text input)
- [x] In `ProfileFormPage.tsx` / `hooks/useProfile.ts`, wrap profile update in `useMutation`: on `onSuccess`, call `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })` and display a success toast
- [x] Update `services/profileService.ts` — ensure create/update payloads include new fields (verified typed interfaces)
- [x] Type-check: `npx tsc -b --noEmit`

### Phase 3: Project Description Split (Summary vs. Content)

- [x] **Pre-check:** Verify `api-contract.json` has been updated by the backend (Phase 3 contract sync) — confirm `summary` + `content` fields are present
- [x] Update `types/project.ts` — replace `description` with `summary` + `content` in `ProjectResponse`, `ProjectCreate`, `ProjectUpdate`
- [x] Update `components/shared/ProjectCard.tsx` — render `summary` instead of `description`
- [x] Update `pages/ProjectDetailPage.tsx` — render `content` (full write-up) instead of `description` (with fallback to `summary`)
- [x] Update `pages/admin/ProjectFormPage.tsx` — replace single description textarea with two inputs: "Summary" and "Content"
- [x] Update `services/projectService.ts` — ensure create/update payloads use `summary` + `content`
- [x] Update `hooks/useProjects.ts` if it references `description` anywhere
- [x] Type-check: `npx tsc -b --noEmit`

### Phase 4: Domain Vocabulary Refactoring (Tech Stack → Tags)

- [x] **Pre-check:** Verify `api-contract.json` has been updated by the backend (Phase 4 contract sync) — confirm `tags` field replaces `tech_stack`
- [x] Update `types/project.ts` — rename `tech_stack: string[] | null` → `tags: string[] | null` in `ProjectResponse`, `ProjectCreate`, `ProjectUpdate`
- [x] Update `components/shared/ProjectCard.tsx` — rename `tech_stack` references to `tags`; update any UI labels from "Tech Stack" to "Tags"
- [x] Update `pages/ProjectDetailPage.tsx` — rename any `tech_stack` references to `tags`; update section headers/labels
- [x] Update `pages/admin/ProjectFormPage.tsx` — rename form field label from "Tech Stack" to "Tags"; update field name bindings
- [x] Update `pages/admin/DashboardPage.tsx` — rename `tech_stack` references, table column header, and "Technologies" metric card to "Tags"
- [x] Update `services/projectService.ts` — ensure create/update payloads use `tags` instead of `tech_stack` (verified: typed via `ProjectCreate`/`ProjectUpdate`, no code change needed)
- [x] Update `hooks/useProjects.ts` — rename any `tech_stack` references to `tags` (verified: no references)
- [x] Audit `components/ui/Badge.tsx` — verify no tech-stack-specific logic; ensure it works generically for tags
- [x] Type-check: `npx tsc -b --noEmit`

### Phase 5: Image Deletion & Profile Deletion UI

- [x] **Profile Image Deletion:**
  - [x] Add `deleteProfileImage()` to `services/profileService.ts` — calls `DELETE /api/profile/image`
  - [x] In `pages/admin/ProfileFormPage.tsx`, implement image deletion via `useMutation`: on `onSuccess`, call `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })`, clear preview, and display a success toast
  - [x] Add "Remove Image" button (trash icon) to `pages/admin/ProfileFormPage.tsx`
- [x] **Project Image Deletion:**
  - [x] Add `deleteProjectImage(id: number)` to `services/projectService.ts` — calls `DELETE /api/projects/{id}/image`
  - [x] In `pages/admin/ProjectFormPage.tsx`, implement project image deletion via `useMutation`: on `onSuccess`, call `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects })`, clear preview, and display a success toast
  - [x] Add "Remove Image" button (trash icon) to `pages/admin/ProjectFormPage.tsx`
- [x] **Profile Soft Delete:**
  - [x] Add `deleteProfile()` to `services/profileService.ts` — calls `DELETE /api/profile/`
  - [x] Create `components/admin/ConfirmDeleteModal.tsx` — reusable danger-zone confirmation modal
  - [x] Add danger-zone section to `pages/admin/ProfileFormPage.tsx` with delete button that triggers the confirmation modal
  - [x] Implement profile deletion via `useMutation`: on `onSuccess`, call `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })`, redirect to dashboard, and display a success toast
- [x] Type-check: `npx tsc -b --noEmit`

### Phase 6: Final Verification & Network/Navigation Hardening

- [x] **Single-Project React Query Caching:** Wrap single-project fetch in `useProject(id)` hook with `QUERY_KEYS.project(id)` in `ProjectDetailPage` and `ProjectFormPage`, eliminating redundant requests and establishing fast client caching.
- [x] **SPA Navigation Integrity:** Convert anchor navigation in `Navbar.tsx`, `Footer.tsx`, and `ProjectDetailPage.tsx` to React Router `<Link>` with conditional in-page smooth scrolling on `/`, preventing hard browser reloads and memory cache flushing when navigating from sub-routes.
- [x] **Image Upload Mutations:** Wrap `uploadProfileImage` and `uploadProjectImage` in `useUploadProfileImageMutation` and `useUploadProjectImageMutation` with automated invalidation of `QUERY_KEYS.profile` and `QUERY_KEYS.projects`.
- [x] **Mailto Protocol Fix & Clipboard Fallback:** Omit `target="_blank"` on `mailto:` links in `Footer.tsx` and copy email to clipboard with instant toast notification on click.
- [x] Full type-check pass: `npx tsc -b --noEmit` (0 errors)
- [x] Static analysis & linting pass: `npm run lint` (0 errors, 0 warnings)
- [x] Codebase audit: zero residual `tech_stack` or `.description` references; all queries/mutations wired through centralized `QUERY_KEYS`
- [x] Verify React Query caching: profile and projects fetched once and cached, invalidations trigger seamlessly upon mutations
- [x] Manual smoke test: all public pages render profile data from API (no hardcoded strings)
- [x] Manual smoke test: admin forms handle all new fields correctly
- [x] Manual smoke test: image upload, deletion, and profile soft-delete flows work end-to-end
- [x] Manual smoke test: tags render correctly on ProjectCard and ProjectDetailPage (no residual "Tech Stack" labels)
