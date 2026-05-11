# AGENTS.md — Trust Center V3

This file is what AI agents (Cursor, Claude Code, etc.) should read first.

## Who you're talking to

Ivana, product designer at Conveyor. **Not an engineer.** Communicate like you would to a smart Figma-fluent colleague who doesn't write production code:
- Number every step. Keep each step short.
- Before changing code, say what you're about to do and why. After, confirm what changed and what it looks like now.
- Use Figma analogies when they help ("this is like a component variant in Figma").
- **No em dashes.** Use commas, periods, or line breaks.
- If something can be done multiple ways, give your recommendation first, then mention the alternatives briefly.
- When referencing code, name the file and the part of the UI it controls. Example: "In `RightPanel.tsx`, the Publish modal you see when toggling visitor-live..."

Full communication rules: see **`.cursorrules`** at the repo root.

## Project briefing

**Read these in order before doing anything:**

1. `HANDOFF-V3.md` — what's in this version (May 11, 2026), what was built this session, how the state flows
2. `MEMORY.md` — long-term project decisions and tokens
3. `docs/claude-code-handoff/SESSION-CONTEXT.md` — earlier V1/V2 work (still relevant for context on conventions)

## Tech stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4 (tokens live in `trust-center/src/index.css` `@theme` block)
- React Router (designer route: `/designerstaging`)
- State management: single React Context in `trust-center/src/context/DesignerContext.tsx`

## Token-first styling

This is a hard rule. **No raw hex colors, font sizes, or spacings in JSX.**

- Conveyor product UI colors: `primary-*`, `link-*`, `brand-*` tokens (defined in `trust-center/src/index.css`)
- Customer brand colors: `--brand-primary`, `--brand-accent` (only inside the Trust Center preview area, never in Conveyor chrome)
- If no matching token exists, **create one** and tell Ivana you did, with the format:
  > `NEW TOKEN CREATED: --color-link-teal (#0D9488). I added this because no existing token matched. Let me know if you want to rename it or merge it.`

## Run / build

```bash
cd trust-center
npm install   # first time only
npm run dev   # → http://localhost:5173/designerstaging
npm run build # → trust-center/dist/
```

## Files you'll edit most

| File | What it controls |
|------|------------------|
| `trust-center/src/context/DesignerContext.tsx` | All draft/published state, `publishActiveDraft`, `unpublishToDraft`, locale logic |
| `trust-center/src/components/Settings/RightPanel.tsx` | Right column — Draft list, Published overview, all modals (unpublish/republish/changelog/share) |
| `trust-center/src/components/TrustCenter/TrustCenterContent.tsx` | Center preview — sections, empty states, floating preview bars |
| `trust-center/src/components/Settings/DesignerStagingToolbar.tsx` | Top strip — status text + Draft\|Published toggle + autosaved time |
| `trust-center/src/pages/DesignerPage.tsx` | 3-column shell |

## Workflow conventions

- **Type check** after every meaningful edit: `cd trust-center && npx tsc --noEmit`
- **Never** commit, push, or run destructive git commands unless Ivana explicitly asks
- If you spot a separate issue while working on something else, **mention it** but don't auto-fix — Ivana wants to scope changes deliberately
- Test changes in the running dev server when possible (Vite hot-reloads on save)

## Where this version is published

A snapshot of the V3 build is live at **https://calm-marsh-45a5.temp.md**. Update credentials are in the parallel V2 project's `.tempmd` file (this V3 copy intentionally omits them to keep tokens scoped to one project).
