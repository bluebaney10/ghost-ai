# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature spec 02: Editor chrome — EditorNavbar and ProjectSidebar shell components.

## Completed

- Boilerplate cleanup: stripped globals.css to Tailwind directive, removed SVGs from public/, replaced page.tsx with minimal "ghost AI" placeholder.
- Feature spec 01 — Design system: shadcn/ui initialized (v4.6.0, Tailwind v4 mode), components Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added to components/ui/, lucide-react installed, lib/utils.ts created with cn() helper. Build passes.
- Feature spec 02 — Editor chrome: EditorNavbar (fixed top, sidebar toggle with PanelLeftOpen/PanelLeftClose, left/center/right sections) and ProjectSidebar (fixed floating, slides from left, Tabs with My Projects/Shared placeholders, New Project button). Dialog pattern ready via spec 01 components. Build passes.

## In Progress

- None.

## Next Up

- Feature spec 03 (pending)

## Open Questions

- None currently.

## Architecture Decisions

- Using shadcn/ui on top of Tailwind v4 for the component library. Components live in components/ui/ and are not manually modified after CLI generation.
- `@/*` alias maps to project root (tsconfig paths).
- shadcn v4.6.0 uses `@base-ui/react` instead of `@radix-ui` — confirmed by AGENTS.md warning about breaking changes in this Next.js version.
- CSS variables use oklch color space (shadcn default for Tailwind v4). Dark mode via `.dark` class.
- Editor-specific components live in components/editor/. Reused across all editor screens.
- ProjectSidebar is position:fixed (floats above canvas, does not push content).

## Session Notes

- Next.js 16.2.4, React 19.2.4, Tailwind v4 (CSS-first, no tailwind.config.js).
- No src/ directory — app router lives at app/.
- globals.css has full shadcn CSS variable set + Tailwind v4 @theme inline block. Do not strip these.
- `npm run build` passes cleanly as of feature spec 01 completion.
- Dark mode requires `.dark` class on html element (set in layout.tsx).
