# Claude Code project briefing: Trust Center prototype

You are working in a **monorepo-style** project: the runnable app is entirely under **`trust-center/`**.

## First actions on a new session

1. Read **`MEMORY.md`** at the repo root (decisions, tokens, Figma refs, user preferences).
2. Read **`docs/claude-code-handoff/SESSION-CONTEXT.md`** for a concise map of recent UX and engineering work.
3. App entry and routes: **`trust-center/src/App.tsx`**. Designer shell: **`/designerstaging`**.

## Commands

```bash
cd trust-center && npm install   # once
cd trust-center && npm run dev   # dev server
cd trust-center && npm run build # typecheck + production build
```

## Architecture notes

- **Designer state:** `trust-center/src/context/DesignerContext.tsx` (drafts, published snapshot, preview mode, stageable presentation).
- **Staging model:** `trust-center/src/types/staging.ts`, `trust-center/src/utils/stagingPresentation.ts`, `trust-center/src/utils/draftDiff.ts`.
- **Right sidebar:** `trust-center/src/components/Settings/RightPanel.tsx` (feature flag `SHOW_DRAFTABLE_CONTENT_ACCORDION` for Draftable Content block).
- **Tokens:** `trust-center/src/index.css` (`@theme`). Do not hardcode hex in JSX; use existing Tailwind token classes.
- **Two color systems:** Conveyor shell = fixed product palette. Customer brand = preview only (`--brand-primary`, `--brand-accent`). Do not mix.

## User preferences (from project rules)

- Explain for a product designer when appropriate. Step-by-step numbered lists for changes.
- Do not use em dashes in user-facing copy or comments you add.
- Ask before adding new npm packages.
- Update **`MEMORY.md`** when you make a significant decision, add tokens, or fix an important bug.

## Icons

Material Symbols **Outlined** or **Rounded** per existing files and `MEMORY.md`. Use the shared icon patterns already in the codebase.

---

*Source copy lives in `docs/claude-code-handoff/CLAUDE.md`. You may duplicate this file to the repo root as `./CLAUDE.md` for Claude Code auto-discovery.*
