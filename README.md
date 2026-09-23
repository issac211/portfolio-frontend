# Itzik's Developer Portfolio — Frontend

The client-side web application and Content Management System (CMS) for my personal software engineering portfolio. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite 8**, consuming a custom **FastAPI** REST backend.

---

## Project Motivation (Why a Full-Stack Portfolio?)

Typically, a personal developer portfolio is built as a static website using plain HTML or static site generators with hardcoded JSON files. However, this project was deliberately designed as a **Full-Stack Application with a dynamic client-side CMS** to serve as a practical engineering playground for implementing enterprise-grade frontend architecture.

The goal was not just to display projects, but to demonstrate hands-on mastery in:

- **Full-Stack Integration:** Consuming custom REST APIs, managing stateless JWT authentication lifecycles, and handling binary/multipart media streams.
- **Enterprise Frontend Architecture:** Strict separation of concerns across service layers, domain hooks, global contexts, and atomic design primitives.
- **Production-Grade UX & Resilience:** Fail-fast startup configuration, contextual skeleton loaders, zero Cumulative Layout Shift (CLS), and dynamic SEO metadata.
- **Web Security:** Defensive token handling, automatic 401 unauthorized cleanup, and boundary-safe multipart form handling.

---

## Architecture & Engineering Highlights

This frontend is designed with a strong focus on clean architecture, performance, security, and developer ergonomics:

- **Layered Architecture & Separation of Concerns:** Strict isolation between API Clients (`services/`), Business Logic (`hooks/`), Global State (`context/`), Route Guards (`router/`), and Atomic UI Primitives (`components/ui/`).
- **Contract-Driven API Integration:** Complete end-to-end type safety synchronized with [`api-contract.json`](./api-contract.json), guaranteeing TypeScript interfaces directly match the backend's Pydantic schemas.
- **Native, Zero-Dependency HTTP Pipeline:** Custom `fetch` wrapper (`apiClient.ts`) avoiding heavyweight dependencies (no Axios, no React Query). Features automatic Bearer token injection, automated 401 token eviction, and intelligent `FormData` boundary preservation.
- **Zero-CLS Mobile UX & Anchor Navigation:** Floating overlay mobile navigation eliminating layout shifts, combined with cross-browser `scroll-margin` offsets that overcome mobile WebKit/Safari `scrollIntoView` bugs.
- **Contextual Skeletons & Micro-Interactions:** Custom shimmering skeletons tailored to each layout replacing generic spinners, paired with GPU-accelerated cubic-bezier transitions and strict `prefers-reduced-motion` accessibility guards.
- **Dynamic SEO & Social Graph Previews:** `useSEO` custom hook managing per-route `document.title`, `<meta name="description">`, Open Graph, and Twitter Card tags with absolute URL construction for rich crawler previews (WhatsApp, LinkedIn, X).

---

## Key Features

### Public Showcase

- **Smooth Anchor Gliding:** Single-page seamless navigation (`#home`, `#projects`, `#contact`) with zero Cumulative Layout Shift (CLS) and cross-browser scroll offsets.
- **Hero Presentation:** Profile presentation featuring headline, bio, live status indicator, and dynamic avatar resolution.
- **Featured Projects Grid:** Interactive project cards with 16:9 media previews, categorized tech-stack badges, external demo/repository links, and empty states.
- **Dedicated Project Detail Pages:** Deep-dive view (`/project/:id`) highlighting architecture, technical stack, full description, and high-resolution screenshots.
- **Contextual Skeleton Loading:** Shimmer placeholders (`animate-pulse`) across all data-fetching views for a premium perceived performance.
- **Dynamic SEO & Social Cards:** Custom `useSEO` hook managing per-route metadata with absolute image URLs for rich link previews.

### Admin CMS & Management

- **Role-Secured Dashboard:** Protected routes (`/admin`) guarded by JWT authentication stored in `localStorage` with automated 401 unauthorized cleanup.
- **Project CRUD:** Create, edit, and delete projects with confirmation dialogs and optimistic toast feedback.
- **Multipart Media Uploads:** Direct image file uploads via native `FormData` without breaking `multipart/form-data` boundary headers.
- **Profile Customizer:** Manage personal bio, title, social links, and profile photos.
- **Global Toast System:** Context-driven notification queue (`ToastContext`) rendered via React Portals with automatic timer dismissal.

---

## Tech Stack & Architecture

| Layer                   | Technology                   | Details                                                          |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------- |
| **Runtime & Framework** | React 19                     | Latest React paradigms with strict type-safety                   |
| **Language**            | TypeScript (Strict)          | Exhaustive typing synchronized with `api-contract.json`          |
| **Styling**             | Tailwind CSS v4              | Native `@tailwindcss/vite` integration, CSS variables            |
| **Routing**             | React Router v7              | Nested layouts, outer `ProtectedRoute` auth gating               |
| **Build & Tooling**     | Vite 8                       | Instant Hot Module Replacement (HMR) and optimized rollup bundle |
| **HTTP Client**         | Native `fetch`               | Lightweight wrapper (`apiClient.ts`) for JSON & multipart data   |
| **State Management**    | React Context                | KISS/YAGNI — AuthContext & ToastContext only (no Redux/Zustand)  |
| **Code Quality**        | ESLint 9 + TypeScript-ESLint | Zero-tolerance lint policy with custom architecture rules        |

---

## Project Structure

```
src/
├── assets/          # Static media and icons
├── components/      # Modular UI components
│   ├── admin/       # Admin-specific navigation and layouts
│   ├── layout/      # Public shells (Navbar, Footer, PublicLayout)
│   ├── shared/      # Domain components (ProfileHero, ProjectCard)
│   └── ui/          # Atomic primitives (Button, Input, Card, Badge, Skeleton, Icons)
├── config/          # Startup-validated environment constants
├── context/         # React Contexts (AuthContext, ToastContext)
├── hooks/           # Custom React hooks (useAuth, useProfile, useProjects, useSEO, useScrollToHash)
├── pages/           # Routed page views (public & protected admin views)
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

This repository follows a strict pairing standard defined in [`GEMINI.md`](./GEMINI.md). Development follows a **Micro-Commits** methodology, rigorous type validation, zero-secrets security, and continuous implementation plan tracking documented in [`docs/implementation_plan.md`](./docs/implementation_plan.md).
