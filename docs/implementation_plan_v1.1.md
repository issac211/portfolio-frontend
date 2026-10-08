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
    │   │   ├── AdminSidebar.tsx
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
    │       ├── DashboardPage.tsx
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
    │   ├── profile.ts
    │   └── project.ts
    └── utils/
        └── scroll.ts
```

### Current `PersonalInfoResponse` Type (v1.1)

```typescript
export type StatusIndicator =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | null;

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

> [!IMPORTANT]
> **React Query Integration — SOP Compliance:**
> The current SOP (Section 5) states: _"Native Fetch Only. Do NOT use `axios` or `react-query`."_
> This SOP rule **must be updated** before Phase 2 begins. React Query will be used as a **caching/state layer** on top of the existing `apiClient.ts` fetch calls — it does **not** replace `fetch`. The SOP update should clarify: _"React Query is permitted as a caching layer. All HTTP calls must still go through `services/apiClient.ts`."_

> [!IMPORTANT]
> **React Query Mutations & Cache Invalidation (Strict Requirement):**
> When using React Query, all API write operations (`PUT`, `POST`, `DELETE`) MUST use `useMutation`.
> Upon `onSuccess`, you MUST call `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })` (or `QUERY_KEYS.projects`) to instantly refresh the UI and guarantee client-side cache consistency with the server. Never bypass query invalidation or perform manual out-of-band cache mutations when standard invalidation suffices.

> [!IMPORTANT]
> **Centralized Query Keys (Best Practice):**
> All React Query hooks and mutation callbacks MUST import and use the centralized `QUERY_KEYS` constant from [`constants.ts`](../src/config/constants.ts) (e.g., `QUERY_KEYS.profile`, `QUERY_KEYS.projects`). Hardcoded string literals for query keys are strictly forbidden to eliminate typo drift and disjoint cache states.

> [!IMPORTANT]
> **Controlled Components & Null Coalescing (`ProfileFormPage`):**
> Because the backend migration initializes new nullable columns as `null`, the `ProfileFormPage` state initialization MUST coalesce all `null` values to empty strings (e.g., `hero_title: data.hero_title ?? ""`, `availability_status: data.availability_status ?? ""`, `short_bio: data.short_bio ?? ""`, etc.). Passing `null` to `<input value={...}>` or `<textarea value={...}>` causes React to switch from an uncontrolled to a controlled component, triggering console warnings (`component is changing an uncontrolled input to be controlled`).

> [!IMPORTANT]
> **Type Changes — `ProjectResponse`:**
>
> - `description: string` → **removed**
> - `summary: string` → **added** (replaces `description` on cards and dashboard)
> - `content: string | null` → **added** (rendered on detail page with fallback to `summary`)
>
> All components consuming `ProjectResponse` have been updated: `ProjectCard`, `ProjectDetailPage`, `ProjectFormPage`, `DashboardPage`, `useProjects`, and `projectService`.

> [!IMPORTANT]
> **Type Changes — `PersonalInfoResponse`:**
> Schema synchronized with backend `api-contract.json`:
>
> ```typescript
> hero_title: string | null;
> availability_status: string | null;
> short_bio: string | null; // Tagline for Hero & Footer
> bio: string | null; // Canonical full professional bio
> github_url: string | null;
> linkedin_url: string | null;
> email: string | null;
> status_indicator: StatusIndicator;
> is_active: boolean;
> ```
>
> Components that previously hardcoded these values (`Navbar`, `Footer`, `ProfileHero`) have been refactored to consume them dynamically from the global profile state.

> [!NOTE]
> **Hero Title Two-Tone Gradient Styling (`ProfileHero`):**
> `ProfileHero` splits `hero_title` into a primary dark text block and a vibrant gradient highlight (`bg-gradient-to-r from-blue-600 to-indigo-600`).
>
> - **Smart Auto-Split:** Phrases with 4+ words automatically highlight the final 2 words (e.g. `"Building scalable, modern | web applications"`). Shorter phrases highlight the final word.
> - **Manual Delimiter Support:** Developers can supply an explicit pipe delimiter `|` in `ProfileFormPage` (e.g. `"Cloud-Native Engineer | AI & Systems"`) to manually curate the exact split boundary.

> [!IMPORTANT]
> **`status_indicator` → Tailwind Dot & Default Text Mapping (`ProfileHero` & `Footer`):**
> The backend provides `status_indicator: "success" | "warning" | "error" | "neutral" | null`. Both `ProfileHero` and `Footer` map this value to visual styling and dynamic fallback copy via lookup objects (`STATUS_STYLES` / `STATUS_DOT_COLORS`):
>
> - `success`: pulsing green dot + fallback `"Available for new opportunities"`
> - `warning`: pulsing amber dot + fallback `"Limited availability"`
> - `error`: solid red dot + fallback `"Currently unavailable"`
> - `neutral`: solid gray dot + fallback `"Open to inquiries"`
>
> If the developer sets a custom `availability_status`, that string takes precedence; otherwise, the indicator's `defaultText` renders automatically.

> [!NOTE]
> **ProfileHero Typography, Age Calculation, Narrative Paragraphs & Sticky Avatar (✅ Done):**
>
> - **Scaled Headline:** The H1 hero heading was scaled from `text-4xl...6xl` to `text-3xl sm:text-4xl lg:text-5xl` for a more balanced visual hierarchy.
> - **Dynamic Age Calculation:** `calculateAge(birth_date)` calculates age dynamically from ISO date strings with leap-year-safe calendar difference, rendering inline only when `birth_date` is configured.
> - **Narrative Paragraphs & Timeline Nodes:** Extended bio parses raw newline text into distinct paragraphs (`split(/\n+/)`), styled with vertical rhythm (`space-y-3.5 sm:space-y-4`) and precision timeline dot markers (`ring-[3px] ring-white bg-blue-500`) along a continuous accent border, rendering long prose with editorial clarity.
> - **Smooth Collapsible Bio:** The extended bio features an accessible toggle (`isBioExpanded`, defaulting to `true` / expanded), animating smoothly via CSS `grid-template-rows` (`grid-rows-[1fr]` to `grid-rows-[0fr]`) and opacity transitions for pure auto-height interpolation.
> - **Sticky Avatar Tracking:** The portrait column uses a stretch-height grid parent (`lg:items-stretch`) with an inner sticky container (`lg:sticky lg:top-24`), tracking smoothly through Hero scrolling and anchoring cleanly at the section boundary.

> [!NOTE]
> **Detailed Content Markdown Support (✅ Done):**
> - **Public Rendering (`ProjectDetailPage`):** `MarkdownContent.tsx` securely renders the project `content` write-up via `react-markdown` and `remark-gfm` (GFM tables, task lists, code blocks, autolinks, blockquotes). Semantic tags are customized with accessible Tailwind styles, sanitized against XSS, and external links automatically apply `target="_blank"` and `rel="noopener noreferrer"`.
> - **Admin Authoring (`ProjectFormPage`):** Integrated `@uiw/react-md-editor` with live dual-pane preview (`preview="live"`, height 350px, `data-color-mode="light"`), providing engineers with full WYSIWYG toolbars and markdown shortcuts for case-study write-ups.

> [!NOTE]
> **API Contract-Driven Development (Frontend Side):**
> Each frontend phase that depends on backend schema changes (Phases 2, 3, 4) must **not begin** until the backend has exported an updated `api-contract.json` to the `frontend/` root. Before updating TS interfaces, cross-reference the OpenAPI spec to verify field names, types, and nullability. This prevents type drift and catches mismatches early.

> [!NOTE]
> **Hardcoded Data Audit:** Before implementation, audit every component in `components/layout/` and `components/shared/` for hardcoded strings (hero titles, social URLs, availability badges, bios). Document each occurrence so nothing is missed during the refactor.

> [!NOTE]
> **Image Deletion & Profile Danger-Zone Deletion (✅ Done):**
>
> - **Service Calls:** `deleteProfileImage()`, `deleteProfile()`, and `deleteProjectImage(id)` implemented in `profileService.ts` and `projectService.ts` calling `DELETE` endpoints and returning `void` (204 No Content).
> - **React Query Mutations:** Dedicated mutation hooks (`useDeleteProfileImageMutation`, `useDeleteProfileMutation`, `useDeleteProjectImageMutation`) trigger automatic cache invalidation (`QUERY_KEYS.profile`, `QUERY_KEYS.projects`).
> - **Lightweight Image Removal UX:** "Remove Photo" / "Remove Image" buttons with `TrashIcon` provide inline browser confirmation and optimistic preview state clearing upon success.
> - **Accessible Danger-Zone Modal:** `ConfirmDeleteModal.tsx` implements strict safety with typed keyword confirmation (`confirmKeyword="DELETE"`). To prevent React 19 cascading render warnings, the modal dialog uses a mount-based component lifecycle rather than resetting state synchronously inside a `useEffect`.

> [!NOTE]
> **Domain Vocabulary Refactoring — `tech_stack` → `tags` (✅ Done):**
>
> - **Types:** `tech_stack` was removed outright (not kept as a deprecated alias) and replaced by `tags: string[] | null` in `ProjectResponse`, `ProjectCreate`, and `ProjectUpdate`, mirroring `api-contract.json`. A hard rename lets the compiler surface every stale consumer instead of silently falling back to `undefined`.
> - **UI Labels:** All user-facing "Tech Stack" / "Technology Stack" / "Technologies" strings are now "Tags" (admin form field, dashboard table column and metric card). Internal identifiers were renamed too (`tagsInput`, `tagChips`, `uniqueTagCount`).
> - **Badge Mapping:** `Badge` contained no tech-specific logic — only its JSDoc wording was generalized.
> - **Admin Form:** The tags input remains a comma-separated text field with live chip preview; helper text now explains tags may represent technologies, categories, or status labels (e.g. "WIP", "Open Source").
> - `projectService.ts` and `useProjects.ts` required no changes: they are typed against `ProjectCreate`/`ProjectUpdate`, so the rename propagates through the interfaces.

> [!IMPORTANT]
> **Single-Project Caching & Hierarchical Invalidation (`QUERY_KEYS.project(id)` — ✅ Done):**
>
> - Single project fetching in `ProjectDetailPage` and `ProjectFormPage` is encapsulated in `useProject(id)`.
> - The query key factory `QUERY_KEYS.project(id)` evaluates to `["projects", id] as const`.
> - Because React Query invalidates queries by prefix matching, mutating the collection via `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects })` automatically invalidates the project list query as well as all individual cached project queries (`["projects", 1]`, etc.), keeping cache state synchronized without manual ID tracking.

> [!IMPORTANT]
> **Client-Side SPA Anchor Routing vs. Full Page Refresh (✅ Done):**
>
> - Standard `<a href="/#section">` links without SPA routing trigger full browser document reloads when activated from sub-routes (such as `/projects/:id` or `/admin`), discarding in-memory React Query cache and re-fetching assets.
> - `Navbar.tsx`, `Footer.tsx`, and `ProjectDetailPage.tsx` now employ React Router `<Link to={href}>` with `handleNavClick`:
>   - On the root page (`/`), smooth in-page scrolling (`handleSmoothScroll`) is preserved.
>   - On sub-routes, React Router executes a client-side route transition without reloading the document, after which `useScrollToHash` scrolls directly to the targeted section.

> [!NOTE]
> **Image Upload Mutations & Form State Simplification (✅ Done):**
>
> - Profile and project image uploads are migrated to `useUploadProfileImageMutation` and `useUploadProjectImageMutation`.
> - Successful uploads trigger automated cache invalidation (`QUERY_KEYS.profile`, `QUERY_KEYS.projects`), eliminating manual `refetch()` invocations and local `isUploadingImage` state flags from `ProfileFormPage` and `ProjectFormPage`.

> [!NOTE]
> **Native Mailto Protocol & Clipboard Fallback UX (✅ Done):**
>
> - External social links utilize `target="_blank" rel="noopener noreferrer"` to protect against reverse tabnabbing.
> - For `mailto:` URIs, browsers open an unwanted `about:blank` tab if `target="_blank"` is present; `Footer.tsx` conditionally omits `target` and `rel` attributes whenever `href.startsWith("mailto:")`.
> - On client machines lacking a registered desktop email client (or when the browser swallows `mailto:` due to unconfigured protocol handlers), clicking the email link automatically copies the address (`contactEmail`) to the clipboard via `navigator.clipboard.writeText` and renders an instant toast notification (`useToast`), providing a seamless fallback.

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
    │   │   ├── AdminSidebar.tsx
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
    │       ├── SectionTitle.tsx
    │       ├── Skeleton.tsx
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
        └── scroll.ts
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
- [x] Implement `status_indicator` → Tailwind dot mapping in `ProfileHero.tsx` — use a `Record<string, string>` lookup object (e.g., `success` → `"bg-green-500 animate-pulse"`, `error` → `"bg-red-500"`); fallback to `neutral` for `null`/unknown
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
