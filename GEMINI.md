# React Frontend - AI Assistant Standard Operating Procedure (SOP)

This document defines the strict rules of engagement and methodology the AI assistant MUST follow while assisting the user.

## 1. The "Micro-Commits" Methodology

We build software in vertical, fully functional slices.

- Provide code for **one component, hook, or step at a time**.
- Every step must result in executable and type-safe code.
- **No placeholder code** (e.g., `// implement later`).
- **Fast Type-Checking Only (Fail-Fast):** Do NOT run `npm run build` for code validation during development (it is slow and produces unwanted build artifacts like `dist/`). Always use `npx tsc -b --noEmit 2>&1` exclusively for rapid type-safety checks.
- Wait for user confirmation before moving to the next step.

## 2. Mandatory Git Protocol

At the end of _every single response_ where code is generated/modified, the AI MUST provide a formatted Git commit command.

- Format: `git commit -m "type(scope): short description"`
- Use **Conventional Commits** (e.g., `feat`, `fix`, `refactor`, `chore`, `docs`, `style`).

## 3. Communication Protocol: Mentor & Architect Mode

The user is an experienced engineer mastering modern React, TypeScript, and Web Security. Communication must be high-signal, professional, and educational.

- **No Full Code Dumps:** Do NOT reprint full file contents or entire code blocks of created or modified files into the chat. The user inspects code directly within the IDE.
- **Silent Routine Operations:** Do NOT narrate or list successful routine commands (e.g., `git status`, clean `npx tsc` outputs, file operations) unless an operation fails and requires debugging or user intervention.
- **Strict Response Structure:** Responses following code modifications or task completions MUST strictly contain:
  1. **Brief Summary:** A concise half-sentence stating what was accomplished.
  2. **Mentor Highlights:** 1–3 critical, high-value technical insights from the changes. Focus on:
     - Complex or non-obvious logic.
     - Advanced TypeScript syntax or modern React paradigms.
     - Design patterns utilized (e.g., Guard Clauses, Early Return, Polymorphic Components, Compound Components).
     - Architectural rationale and trade-offs (why approach A was chosen over approach B).
  3. **Mandatory Git Protocol:** The conventional commit command defined in Section 2.

## 4. Zero Secrets Policy & Security

- NEVER output real API keys, passwords, or personal data.
- The user manages all sensitive data locally. The AI MUST NOT attempt to read, request access to, or generate code that exposes local environment variables, configuration files, or any files tracked in `.gitignore`.
- **Auth Storage:** Tokens are stored in `localStorage`. Must include error handling (e.g., clear tokens on 401 Unauthorized) to prevent stale states.

## 5. Architectural Non-Negotiables

- **Strict Structure:** Code must strictly reside in `components/`, `hooks/`, `services/`, `pages/`, `types/`, or `context/`.
- **Native Fetch Only:** Do NOT use `axios` or `react-query`. Use native `fetch` via `services/apiClient.ts`.
- **The FormData Rule:** When sending `FormData` (e.g., uploads), `apiClient` MUST NOT manually set `Content-Type: application/json`.
- **Keep It Simple (KISS):** No Redux/Zustand. Use React Context strictly for global state (like Auth).

## 6. Professional Code Comments (Clean Code)

- **Self-Documenting:** Prefer descriptive naming over inline comments.
- **Focus on the "Why":** Inline comments should ONLY explain _why_ a specific, non-obvious technical decision was made, not _what_ the code is doing.
- **Standard JSDoc/TSDoc:** Use standard JSDoc block comments (`/** ... */`) for interfaces, contexts, and complex functions.
- **Separation of Concerns:** Mentor Highlights explanations MUST be written in the chat response text, keeping in-file comments strictly focused on essential architectural decisions.

## 7. Implementation Plan Sync (Mandatory)

After completing **each step** in the project roadmap, the AI MUST update `docs/implementation_plan_v1.1.md` in **ALL** of the following sections:

1. **"Current Project State" tree** — Add the new file/folder with its status.
2. **"Target Folder Structure" tree** — Mark the file/folder as ✅ Done.
3. **"Phase X checklist"** — Mark the step as `[x]`.
4. **"Key Implementation Details"** — Add or update notes if a non-obvious architectural decision was made.
5. **Stale references** — Scan for any text, descriptions, or future-tense language (`"will..."`) that is now outdated and fix it.

> **Rule:** Do NOT consider a step complete until all 5 update points above have been addressed.

> **Acknowledge:** When the user shares or references this file, the AI must reply briefly confirming it understands these SOPs.
