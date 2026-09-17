# Phase 5.2 — Toast / Notification System

## Goal

Build a zero-dependency, accessible toast notification system to surface API errors and global success messages, without relying on external libraries.

---

## Architectural Decisions

### Dual-Layer Error Strategy (Industry Standard)

| Layer | Mechanism | Use Cases |
|---|---|---|
| **Form-level** | Local `useState` (`error: string \| null`) | Expected user errors: wrong password, missing field, validation failures |
| **Global Toast** | `ToastContext` + `useToast()` | Background/unexpected failures, network errors, global success messages (e.g., "Profile saved successfully") |

> Hooks retain their local `error` state for inline form feedback. Toasts are **additive** — they handle failures that have no other UI feedback surface.

---

## Architecture

```
App
 └─ ToastProvider          ← context/ToastContext.tsx (outermost)
     └─ AuthProvider
         └─ AppRouter
             ├─ PublicLayout
             └─ AdminLayout
                 (ToastContainer renders once via React Portal into document.body)
```

### Why Portal?

`ReactDOM.createPortal` renders the `<ToastContainer />` directly into `document.body`, completely decoupling it from the layout tree. This means:
- No `z-index` conflicts with modals or sidebars.
- No need to place `<ToastContainer />` in both `PublicLayout` and `AdminLayout`.
- A single instance, mounted once at the `App` root.

---

## Files

| File | Action | Purpose |
|---|---|---|
| `src/context/ToastContext.tsx` | **NEW** | State, `addToast`, `removeToast`, `useToast` hook |
| `src/components/ui/Toast.tsx` | **NEW** | Visual stack renderer via `createPortal` |
| `src/App.tsx` | **MODIFY** | Wrap tree with `ToastProvider` |
| `src/hooks/useProjects.ts` | **MODIFY** | Call `addToast` on API error |
| `src/hooks/useProfile.ts` | **MODIFY** | Call `addToast` on API error |
| `src/hooks/useAuth.ts` | **MODIFY** | Call `addToast` on unexpected auth error |

---

## Toast Shape

```ts
type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;          // crypto.randomUUID()
  message: string;
  variant: ToastVariant;
  duration?: number;   // ms, default 4000
}
```

---

## UI Spec

- **Position:** Fixed, bottom-right (`bottom: 1.5rem`, `right: 1.5rem`).
- **Stacking:** Newest toast at the bottom (appended), max visible stack.
- **Variants:** Colored left border — `error` → red, `success` → green, `info` → blue.
- **Icons:** Uses existing icon components from `src/components/ui/icons/`.
- **Animation:** Slide-in from the right on enter, fade-out on dismiss.
- **Dismiss:** Auto after `duration` ms OR immediately on close `×` button click.
- **Accessibility:** `role="alert"` on each toast item.
