# Itzik's Developer Portfolio — Frontend (v1.3)

The client-side web application and Content Management System (CMS) for my personal software engineering portfolio. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Vite 8**, and **TanStack React Query v5**, consuming a custom **FastAPI** REST backend.

---

## Project Motivation (Why a Full-Stack Portfolio?)

Typically, a personal developer portfolio is built as a static website using plain HTML or static site generators with hardcoded JSON files. However, this project was deliberately designed as a **Full-Stack Application with a dynamic client-side CMS** to serve as a practical engineering playground for implementing enterprise-grade frontend architecture.

The goal was not just to display projects, but to demonstrate hands-on mastery in:

- **Full-Stack Integration:** Consuming custom REST APIs, managing stateless JWT authentication lifecycles, and handling binary/multipart media streams.
- **Enterprise Frontend Architecture:** Strict separation of concerns across service layers, domain hooks, global contexts, and atomic design primitives.
- **Modern Server-State Caching:** Unified React Query caching layer over native fetch, eliminating redundant network calls, providing stale-while-revalidate UX, and coordinating automated cache invalidations.
- **Production-Grade UX & Resilience:** Fail-fast startup configuration, contextual skeleton loaders, zero Cumulative Layout Shift (CLS), and dynamic SEO metadata.
- **Web Security:** Defensive token handling, automatic 401 unauthorized cleanup, and boundary-safe multipart form handling.

---

## Architecture & Engineering Highlights

This frontend is designed with a strong focus on clean architecture, performance, security, and developer ergonomics:

- **Layered Architecture & Separation of Concerns:** Strict isolation between API Clients (`services/`), Domain Hooks (`hooks/`), Global Contexts (`context/`), Route Guards (`router/`), and Atomic UI Primitives (`components/ui/`).
- **Contract-Driven API Integration:** Complete end-to-end type safety synchronized with [`api-contract.json`](./api-contract.json), guaranteeing TypeScript interfaces directly match the backend's OpenAPI schemas.
- **Server-State Management (TanStack React Query v5):** All API read queries and write mutations are orchestrated by React Query wrapping native `fetch` (`apiClient.ts`). Centralized query key architecture (`QUERY_KEYS.profile`, `QUERY_KEYS.projects`, `QUERY_KEYS.project(id)`) ensures hierarchical cache invalidation on mutations (create, update, image upload, delete).
- **Native Fetch Pipeline with Boundary Preservation:** HTTP calls strictly flow through `services/apiClient.ts`. Automatic Bearer token injection, automatic 401 token eviction, and intelligent `FormData` boundary preservation (never overriding browser-generated boundary headers during file uploads).
- **Client-Side SPA Navigation & Smooth Anchor Scrolling:** React Router `<Link>` integration with conditional smooth-scroll checks (`/#projects`, `/#contact`) that prevent disruptive full-page document reloads when navigating from sub-routes, maintaining in-memory React Query cache and preserving fast navigation.
- **Zero-CLS Mobile UX & Anchor Navigation:** Floating overlay mobile navigation eliminating layout shifts, combined with cross-browser `scroll-margin` offsets that overcome mobile WebKit/Safari `scrollIntoView` bugs.
- **Contextual Skeletons & Micro-Interactions:** Custom shimmering skeletons tailored to each layout replacing generic spinners, paired with GPU-accelerated cubic-bezier transitions and strict `prefers-reduced-motion` accessibility guards.
- **Dynamic SEO & Social Graph Previews:** `useSEO` custom hook managing per-route `document.title`, `<meta name="description">`, Open Graph, and Twitter Card tags with absolute URL construction for rich crawler previews (WhatsApp, LinkedIn, X).
- **Resilient Email Contact UX:** Smart contact link in `Footer` that initiates `mailto:` protocols while simultaneously copying the address to clipboard via `navigator.clipboard.writeText` with an instant toast notification, ensuring seamless interaction even when the OS lacks a configured desktop email client.

---

## Key Features

### Public Showcase

- **Dynamic Hero Presentation:** Profile presentation driven by API metadata with a two-tone gradient headline (smart auto-split with manual pipe `|` delimiter support), live availability badge (`status_indicator` mapped to semantic Tailwind dot styles: `success`, `warning`, `error`, `neutral`), short bio tagline, and dynamic portrait with multi-tier initials fallback.
- **Featured Projects Grid:** Interactive project cards with 16:9 media previews, concise project `summary`, categorized `tags` badges (technologies, categories, status tags), external demo/repository links, and empty states.
- **Dedicated Project Detail Pages:** Deep-dive view (`/projects/:id`) with React Query caching (`useProject`), rendering architecture write-ups (`content` with fallback to `summary`), tags list, responsive media, and client-side back navigation.
- **Smooth Anchor Gliding:** Single-page seamless navigation (`#home`, `#projects`, `#contact`) with zero Cumulative Layout Shift (CLS) and cross-browser scroll offsets.
- **Contextual Skeleton Loading:** Shimmer placeholders (`animate-pulse`) across all data-fetching views for a premium perceived performance.
- **Dynamic SEO & Social Cards:** Custom `useSEO` hook managing per-route metadata with absolute image URLs for rich link previews.

### Admin CMS & Management

- **Role-Secured Dashboard:** Protected routes (`/admin`) guarded by JWT authentication stored in `localStorage` with automated 401 unauthorized cleanup.
- **Project CRUD & Description Split:** Create, edit, and delete projects. Distinct inputs for concise `summary` (rendered on cards/dashboard) and detailed `content` (rendered on detail pages), plus comma-separated `tags` with live chip previews.
- **React Query Mutation Lifecycle:** Project and profile create, update, image upload, and deletion operations run through dedicated `useMutation` hooks with automated cache invalidation (`QUERY_KEYS`).
- **Multipart Media Uploads & Removal:** Direct image uploads using `useUploadProjectImageMutation` and `useUploadProfileImageMutation`, alongside dedicated "Remove Image" actions with inline confirmations and instant cache updates.
- **Profile Customizer & Danger Zone:** Comprehensive profile editor (hero title, short bio, full bio, availability status, status indicator dropdown, social links) with a reusable, accessible `ConfirmDeleteModal` requiring typed confirmation keyword (`DELETE`) for soft deletion.
- **Global Toast System:** Context-driven notification queue (`ToastContext`) rendered via React Portals with automatic timer dismissal.

---

## Tech Stack & Architecture

| Layer                   | Technology                   | Details                                                                                  |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| **Runtime & Framework** | React 19                     | Latest React paradigms with strict type-safety                                           |
| **Language**            | TypeScript (Strict)          | Exhaustive typing synchronized with `api-contract.json`                                  |
| **Server State / Cache**| TanStack React Query v5      | Centralized `QUERY_KEYS`, background revalidation, optimistic invalidation               |
| **Styling**             | Tailwind CSS v4              | Native `@tailwindcss/vite` integration, CSS variables                                    |
| **Routing**             | React Router v7              | Nested layouts, SPA anchor navigation, outer `ProtectedRoute` auth gating                |
| **Build & Tooling**     | Vite 8                       | Instant Hot Module Replacement (HMR) and optimized rollup bundle                         |
| **HTTP Client**         | Native `fetch`               | Lightweight wrapper (`apiClient.ts`) for JSON & multipart data                           |
| **Client Global State** | React Context                | KISS/YAGNI — AuthContext & ToastContext only (no Redux/Zustand)                          |
| **Code Quality**        | ESLint 9 + TypeScript-ESLint | Zero-tolerance lint policy with custom architecture rules                                |

---

## Project Structure

```
src/
├── assets/          # Static media and icons
├── components/      # Modular UI components
│   ├── admin/       # Admin navigation, layout & ConfirmDeleteModal (Phase 5)
│   ├── layout/      # Public shells (Navbar, Footer, PublicLayout) with SPA navigation
│   ├── shared/      # Domain components (ProfileHero, ProjectCard)
│   └── ui/          # Atomic primitives (Button, Input, Card, Badge, Skeleton, Toast, Icons)
├── config/          # Startup-validated environment constants & QUERY_KEYS
├── context/         # React Contexts (AuthContext, ToastContext)
├── hooks/           # Custom React hooks (useAuth, useProfile, useProjects, useSEO, useScrollToHash)
├── pages/           # Routed page views (HomePage, ProjectDetailPage, admin views)
├── router/          # AppRouter and ProtectedRoute auth gate
├── services/        # Backend API service layers (auth, profile, projects)
├── types/           # Strongly-typed TypeScript interfaces (Auth, Profile, Project, API)
└── utils/           # Helper utilities (smooth scroll, date formatting)
```

---

## Getting Started

### Prerequisites

- **Node.js:** v20.0.0 or higher
- **npm:** v10.0.0 or higher
- Running instance of the portfolio backend API

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/my-portfolio.git
cd my-portfolio/frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root of the `frontend` folder based on `.env.example`:

```bash
cp .env.example .env
```

Define the required environment variables:

```ini
# Base URL for REST API endpoints (without trailing slash)
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Base URL for serving uploaded images and media assets
VITE_IMAGE_BASE_URL=http://localhost:8000

# Canonical public web app URL (without trailing slash) for Open Graph & social previews (WhatsApp, LinkedIn, X)
VITE_APP_URL=https://your-portfolio-domain.com
```

> **Note:** The application uses fail-fast validation at startup. If any required environment variable is missing, an explicit error is thrown immediately.

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Available Scripts

| Command               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `npm run dev`         | Starts Vite local development server with HMR              |
| `npx tsc -b --noEmit` | Fast TypeScript type-checking without emitting build files |
| `npm run lint`        | Runs ESLint across all `.ts` and `.tsx` source files       |
| `npm run build`       | Validates types and compiles production bundle to `dist/`  |
| `npm run preview`     | Locally serves the compiled production build for testing   |

---

## Contributing Guidelines

We welcome contributions! To maintain code excellence and consistency, please follow these guidelines:

1. **Fork & Branch:** Create a feature branch with a descriptive name:

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Code Standards:**
   - Write clean, self-documenting code with TypeScript strict mode enabled.
   - Use atomic, reusable components in `src/components/ui/`.
   - Ensure all changes pass type-checks (`npx tsc -b --noEmit`) and linting (`npm run lint`) with 0 errors and warnings.

3. **Conventional Commits:**
   All commits must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

   ```bash
   git commit -m "feat(scope): concise description of feature"
   git commit -m "fix(scope): concise description of bug fix"
   ```

4. **Pull Requests:**
   - Provide a clear PR description detailing what was changed and why.
   - Verify that your branch builds cleanly using `npm run build`.

---

## AI-Assisted Architecture

This repository follows a strict pairing standard defined in [`GEMINI.md`](./GEMINI.md). Development follows a **Micro-Commits** methodology, rigorous type validation, zero-secrets security, and continuous implementation plan tracking documented in [`docs/implementation_plan_v1.1.md`](./docs/implementation_plan_v1.1.md).
