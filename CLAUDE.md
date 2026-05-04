# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Before Implementing Anything

Read these context files in order before making any architectural decision or implementing a feature:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture.md` — system structure, boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, and component conventions
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Feature specs live in `context/feature-specs/` and are numbered (01, 02, …). Each spec defines the next unit of work.

Update `context/progress-tracker.md` after every meaningful implementation change. If a change affects architecture, scope, or standards, update the relevant context file before continuing.

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build (must pass before closing a feature unit)
npm run lint     # ESLint via next lint
npm run start    # run production build
```

There is no test runner configured yet.

## Stack

- **Next.js 16.2.4** with React 19 — App Router, no `src/` directory, routes live at `app/`
- **TypeScript 5** — strict mode enabled
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.js`; all theme tokens are defined in `app/globals.css` using the `@theme inline` block
- **shadcn/ui v4.6.0** — uses `@base-ui/react` as the primitive layer (not `@radix-ui` — these are breaking-change incompatible)
- **lucide-react** — stroke icons, `h-4 w-4` inline / `h-5 w-5` buttons

## Import Alias

`@/*` maps to the project root (not `src/`). Example: `import { cn } from "@/lib/utils"`.

## Key Architectural Rules

- **Dark mode** is applied via the `.dark` class on the `<html>` element, set in `app/layout.tsx`. Never use `prefers-color-scheme` media queries.
- **Color tokens** use the `oklch()` color space (shadcn + Tailwind v4 default). All components must use CSS custom property tokens — no hardcoded hex or oklch literals in component files.
- **`components/ui/`** — shadcn/ui generated primitives. Do not edit these manually; use the shadcn CLI to add or update.
- **`components/editor/`** — custom editor chrome (navbar, sidebar). Editor-specific components belong here and are reused across all editor screens.
- **`lib/utils.ts`** — exports the `cn()` helper (clsx + tailwind-merge). Use it for all conditional class composition.
- **`ProjectSidebar`** is `position: fixed` — it floats above the canvas and does not push content.

## Adding shadcn Components

```bash
npx shadcn@latest add <component>
```

Do not write UI primitives from scratch if a shadcn component exists.
