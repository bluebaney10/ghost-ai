# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature spec 09 (complete)

## Completed

- Boilerplate cleanup: stripped globals.css to Tailwind directive, removed SVGs from public/, replaced page.tsx with minimal "ghost AI" placeholder.
- Feature spec 01 — Design system: shadcn/ui initialized (v4.6.0, Tailwind v4 mode), components Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added to components/ui/, lucide-react installed, lib/utils.ts created with cn() helper. Build passes.
- Feature spec 02 — Editor chrome: EditorNavbar (fixed top, sidebar toggle with PanelLeftOpen/PanelLeftClose, left/center/right sections) and ProjectSidebar (fixed floating, slides from left, Tabs with My Projects/Shared placeholders, New Project button). Dialog pattern ready via spec 01 components. Build passes.
- Feature spec 03 — Auth: ClerkProvider wraps root layout with dark theme from @clerk/ui/themes and CSS variable overrides. proxy.ts updated with createRouteMatcher to protect all routes except /sign-in and /sign-up. app/page.tsx redirects auth users to /editor, unauth to /sign-in. Sign-in and sign-up pages use two-panel layout (left: logo+tagline+features hidden on mobile, right: Clerk form). app/editor/page.tsx minimal shell with EditorNavbar and ProjectSidebar. UserButton added to EditorNavbar right section. Build passes.
- Feature spec 04 — Project dialogs: Editor home screen with heading/description/New Project button. useProjectDialogs hook manages all dialog+form state. CreateProjectDialog (name input + live slug preview), RenameProjectDialog (prefilled, auto-focus, Enter submits), DeleteProjectDialog (destructive confirm). ProjectSidebar updated with mock owned/shared project data, rename/delete actions (owned only, hover-reveal), mobile backdrop scrim. All wired: editor home → Create, sidebar New Project → Create, sidebar rename → Rename, sidebar delete → Delete. Build passes.
- Feature spec 06 — Project APIs: GET /api/projects (list by ownerId, ordered by createdAt desc), POST /api/projects (create, defaults name to "Untitled Project"), PATCH /api/projects/[projectId] (rename, owner-only), DELETE /api/projects/[projectId] (delete, owner-only, 204 no-content). 401 for unauthenticated, 403 for non-owner, 404 if not found. params typed as Promise<{projectId}> per Next.js 16 convention. Build passes.
- Feature spec 05 — Prisma: Project and ProjectCollaborator models in prisma/models/project.prisma (multi-file schema). Indexes on ownerId/createdAt (Project) and projectId/createdAt (ProjectCollaborator). Cascade delete on collaborator relation. Unique constraint on projectId+email. Migration 20260504100328_init applied. Prisma client generated to app/generated/prisma/ (Prisma 7.8.0 prisma-client generator). lib/prisma.ts singleton branches on DATABASE_URL prefix: prisma+postgres:// → Accelerate path, otherwise direct PrismaPg adapter. Build passes.
- Feature spec 07 — Wire editor home: app/editor/page.tsx converted to server component; fetches owned projects (by ownerId) and shared projects (by collaborator email) via Prisma, passes both to EditorHomeClient. hooks/use-project-actions.ts created — manages dialog state + mutations (create/rename/delete), generates slug-suffix room ID preview, calls POST/PATCH/DELETE /api/projects, navigates or refreshes on success. POST /api/projects updated to accept optional custom id (slug-based room ID). components/editor/editor-home-client.tsx extracted as client wrapper. ProjectSidebar updated to accept ownedProjects/sharedProjects props (mock data removed). All three dialogs wired with onConfirm callbacks; create dialog shows Room ID preview; rename Enter key submits correctly. Build passes.
- Feature spec 08 — Workspace shell: app/editor/[roomId]/page.tsx server component with auth redirect and access checks. lib/project-access.ts exports getIdentity() (userId + primary email from Clerk) and getProjectWithAccess() (owner or collaborator check). components/editor/access-denied.tsx centered layout with Lock icon and back link. components/editor/workspace-navbar.tsx shows project name center, Share button and Bot AI toggle right. components/editor/workspace-shell.tsx client wrapper with sidebar + AI panel state; passes activeProjectId to ProjectSidebar for highlight; includes full project mutation dialogs. ProjectSidebar updated with optional activeProjectId prop to highlight current project. Build passes.
- Feature spec 09 — Share dialog: GET/POST/DELETE /api/projects/[projectId]/collaborators routes with Clerk Backend API enrichment (displayName + avatarUrl via clerkClient().users.getUserList). Owners can invite by email (validated, deduped), remove collaborators, copy project link. Collaborators see read-only list. ShareDialog component fetches on open, optimistically updates list after invite/remove. WorkspaceNavbar wired with onShareClick. WorkspaceShell manages isShareOpen state + isOwner prop passed from page. Build passes.

## In Progress

- None.

## Next Up

- Feature spec 10 (pending)

## Open Questions

- None currently.

## Architecture Decisions

- Using shadcn/ui on top of Tailwind v4 for the component library. Components live in components/ui/ and are not manually modified after CLI generation.
- `@/*` alias maps to project root (tsconfig paths).
- shadcn v4.6.0 uses `@base-ui/react` instead of `@radix-ui` — confirmed by AGENTS.md warning about breaking changes in this Next.js version.
- CSS variables use oklch color space (shadcn default for Tailwind v4). Dark mode via `.dark` class.
- Editor-specific components live in components/editor/. Reused across all editor screens.
- ProjectSidebar is position:fixed (floats above canvas, does not push content).
- proxy.ts at project root is the Clerk middleware (Next.js 16.2.4 supports this naming — shown as "Proxy (Middleware)" in build output).
- @clerk/ui/themes exports `dark` theme used as ClerkProvider `theme` prop (Clerk v7 renamed `baseTheme` → `theme`).
- Clerk appearance variables accept CSS var() strings — used to wire app CSS tokens without hardcoding colors.
- Dialog state lives in hooks/use-project-dialogs.ts (useProjectDialogs). All three dialogs share one open/close/target state machine. Dialog components in components/editor/project-dialogs.tsx are controlled (open prop + onOpenChange).
- Project type is exported from hooks/use-project-actions.ts and imported by the sidebar and editor-home-client.
- Button (`@base-ui/react`) does not support `asChild`. Use `buttonVariants()` from `@/components/ui/button` to style a Next.js `<Link>` directly instead.
- lib/project-access.ts is the single place for Clerk identity resolution and project access checks — always use getIdentity() + getProjectWithAccess() in server components instead of inlining auth logic.
- Clerk Backend API: `clerkClient` from `@clerk/nextjs/server` is async — use `await clerkClient()` to get the client, then `client.users.getUserList({ emailAddress: [...] })` returns `{ data: User[] }`.
- CollaboratorDto type is exported from the collaborators route file and imported by the share dialog to keep the type in one place.
- Prisma 7.8.0 uses the new `prisma-client` generator (not `prisma-client-js`). Generated client output is app/generated/prisma/; import from `@/app/generated/prisma/client` (no index.ts — use client.ts directly).
- Prisma 7 requires a driver adapter in PrismaClient constructor — `new PrismaClient({ adapter })`. No-arg constructor is not valid.
- Schema config is split: prisma/schema.prisma has generator/datasource blocks; models live in prisma/models/*.prisma (multi-file schema, all files in prisma/ are merged).
- DATABASE_URL is loaded via dotenv in prisma.config.ts. Not loaded automatically by Next.js from .env for Prisma CLI commands.
- PrismaPg (adapter-pg 7.8.0) constructor accepts pg.Pool | pg.PoolConfig | string — can pass connection string directly.

## Session Notes

- Next.js 16.2.4, React 19.2.4, Tailwind v4 (CSS-first, no tailwind.config.js).
- No src/ directory — app router lives at app/.
- globals.css has full shadcn CSS variable set + Tailwind v4 @theme inline block. Do not strip these.
- `npm run build` passes cleanly as of feature spec 01 completion.
- Dark mode requires `.dark` class on html element (set in layout.tsx).
