# Claude Code handoff (Trust Center prototype)

Use this folder when you continue this work in **Claude Code** (Anthropic’s terminal agent) instead of Cursor.

## Quick start

1. Open a terminal and go to the **repository root** (the folder that contains `trust-center/` and `MEMORY.md`).

   ```bash
   cd "/Users/ivanatso/Desktop/Cursor Repo/staging-prototype-v1"
   ```

2. Install dependencies once (if needed):

   ```bash
   cd trust-center && npm install && cd ..
   ```

3. Start the app (Vite prints the real URL and port):

   ```bash
   cd trust-center && npm run dev
   ```

4. In the browser, open **`/designerstaging`** on the host and port Vite shows (this repo defaults to `http://localhost:5175/designerstaging` in `vite.config.ts`).

5. In Claude Code, open the **same repo root** as the project folder, then ask Claude to read:

   - This file: `docs/claude-code-handoff/README.md`
   - `docs/claude-code-handoff/SESSION-CONTEXT.md` (what we changed, file map)
   - `MEMORY.md` (decisions, tokens, Figma notes)

## Optional: help Claude Code auto-load context

Copy the bundled agent instructions into the repo root (Claude Code often reads `CLAUDE.md` at the project root):

```bash
cp "docs/claude-code-handoff/CLAUDE.md" "./CLAUDE.md"
```

Commit `CLAUDE.md` only if you want it in git for the whole team.

## Files in this folder

| File | Purpose |
|------|---------|
| `README.md` | This overview |
| `SESSION-CONTEXT.md` | Summary of features and files touched in recent work |
| `OPEN-IN-CLAUDE-CODE.md` | Step-by-step to launch Claude Code against this repo |
| `CLAUDE.md` | Short agent briefing (copy to repo root if desired) |
| `CURSOR-TRANSCRIPTS.md` | Where Cursor stores raw JSONL transcripts on your machine |

## Repo layout reminder

- **App:** `trust-center/` (Vite + React + TypeScript + Tailwind v4)
- **Routes:** see `trust-center/src/App.tsx` (designer default: `/designerstaging`)
- **Design tokens:** `trust-center/src/index.css` (`@theme` block)
- **Designer state:** `trust-center/src/context/DesignerContext.tsx`

---

*Packaged: 2026-04-16*
