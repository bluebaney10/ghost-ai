# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature spec 02 (pending)

## Completed

- Boilerplate cleanup: stripped globals.css to Tailwind directive, removed SVGs from public/, replaced page.tsx with minimal "ghost AI" placeholder.
- Feature spec 01 — Design system: shadcn/ui initialized (v4.6.0, Tailwind v4 mode), components Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added to components/ui/, lucide-react installed, lib/utils.ts created with cn() helper. Build passes.

## In Progress

- None.

## Next Up

- Feature spec 02 (pending)

## Open Questions

- None currently.

## Architecture Decisions

- Using shadcn/ui on top of Tailwind v4 for the component library. Components live in components/ui/ and are not manually modified after CLI generation.
- `@/*` alias maps to project root (tsconfig paths).
- shadcn v4.6.0 uses `@base-ui/react` instead of `@radix-ui` — confirmed by AGENTS.md warning about breaking changes in this Next.js version.
- CSS variables use oklch color space (shadcn default for Tailwind v4). Dark mode via `.dark` class.

## Session Notes

- Next.js 16.2.4, React 19.2.4, Tailwind v4 (CSS-first, no tailwind.config.js).
- No src/ directory — app router lives at app/.
- globals.css has full shadcn CSS variable set + Tailwind v4 @theme inline block. Do not strip these.
- `npm run build` passes cleanly as of feature spec 01 completion.
