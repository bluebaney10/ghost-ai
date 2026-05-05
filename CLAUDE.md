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

> Note: Several context files (`architecture.md`, `code-standards.md`, `ui-context.md`, `project-overview.md`) are still template placeholders. The authoritative architectural record is `context/progress-tracker.md` — read the **Architecture Decisions** section there first.

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
- **Clerk v7** — authentication and user management
- **Prisma 7.8.0** + PostgreSQL — database ORM
- **lucide-react** — stroke icons, `h-4 w-4` inline / `h-5 w-5` buttons

## Import Alias

`@/*` maps to the project root (not `src/`). Example: `import { cn } from "@/lib/utils"`.

## Key Architectural Rules

- **Dark mode** is applied via the `.dark` class on the `<html>` element, set in `app/layout.tsx`. Never use `prefers-color-scheme` media queries.
- **Color tokens** use the `oklch()` color space (shadcn + Tailwind v4 default). All components must use CSS custom property tokens — no hardcoded hex or oklch literals in component files.
- **`components/ui/`** — shadcn/ui generated primitives. Do not edit these manually; use the shadcn CLI to add or update.
- **`components/editor/`** — custom editor chrome (navbar, sidebar, workspace shell). Editor-specific components belong here and are reused across all editor screens.
- **`lib/utils.ts`** — exports the `cn()` helper (clsx + tailwind-merge). Use it for all conditional class composition.
- **`ProjectSidebar`** is `position: fixed` — it floats above the canvas and does not push content.
- **Project `id` is the room ID** — created as a URL-safe slug + random 5-char suffix (e.g. `my-project-a3f8k`). Do not treat it as an opaque cuid.

## Auth Patterns

- **Middleware** lives at `proxy.ts` (project root), not `middleware.ts`. Next.js 16.2.4 supports this naming — it shows as "Proxy (Middleware)" in build output.
- **In API routes**: use `auth()` from `@clerk/nextjs/server` when you only need `userId`.
- **In server components and access-checked routes**: use `getIdentity()` + `getProjectWithAccess()` from `lib/project-access.ts` — never inline auth logic.
- **`clerkClient` is async**: `const client = await clerkClient()` then `client.users.getUserList(...)` returns `{ data: User[] }`.
- Clerk appearance variables accept `var(--token)` strings — CSS tokens are wired in `app/layout.tsx`.

## Prisma

- **Generator**: `prisma-client` (Prisma 7, not legacy `prisma-client-js`). Output: `app/generated/prisma/`.
- **Import**: `import { PrismaClient } from '@/app/generated/prisma/client'` — no barrel `index.ts`, use `client.ts` directly.
- **Driver adapter required**: `new PrismaClient({ adapter })` — no-arg constructor is invalid in Prisma 7.
- **Multi-file schema**: generator + datasource blocks live in `prisma/schema.prisma`; models live in `prisma/models/*.prisma`. All files in `prisma/` are merged by the CLI.
- **Singleton**: `lib/prisma.ts` exports the `prisma` singleton — always import from there, never construct a new client inline.
- **CLI env**: `DATABASE_URL` is loaded via `prisma.config.ts` (dotenv). It is not auto-loaded from `.env` for Prisma CLI commands.

## Next.js 16 Conventions

- **Route params are a Promise**: always `await params` — type as `Promise<{ paramName: string }>`.
- Default to server components; add `"use client"` only when browser interactivity requires it.

## UI Gotchas

- **`Button` does not support `asChild`** (`@base-ui/react` limitation). To style a Next.js `<Link>` as a button, use `buttonVariants()` from `@/components/ui/button` applied directly to the `<Link>`.

## Client-Side State

- `hooks/use-project-actions.ts` — manages all project mutation state (create/rename/delete dialogs + API calls + navigation). Import `Project` type from here.
- `CollaboratorDto` type is exported from `app/api/projects/[projectId]/collaborators/route.ts` — import from there to keep the type co-located with the route.

## Adding shadcn Components

```bash
npx shadcn@latest add <component>
```

Do not write UI primitives from scratch if a shadcn component exists.
