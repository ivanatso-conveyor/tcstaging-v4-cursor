# Trust Center V3 — Cursor handoff

This is the **V3 snapshot** of the Trust Center designer prototype (React + Vite + TypeScript + Tailwind), packaged for continuation in Cursor.

A V2 of this prototype is still active in a separate folder; this V3 copy is for parallel work in Cursor.

## Run it

1. In Terminal, go to the **`trust-center`** folder inside this one:

   ```bash
   cd trust-center
   ```

2. Install dependencies (first time only — not bundled to keep this archive small):

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the URL Vite prints (usually `http://localhost:5175/`) and go to:

   **`/designerstaging`**

## Open in Cursor

1. Open this folder (the one containing `trust-center/` and this file) as your project root.

2. Cursor will auto-load context from:
   - **`AGENTS.md`** — agent briefing (read this first)
   - **`.cursorrules`** — Ivana's communication and styling rules
   - **`HANDOFF-V3.md`** — what V3 added in the latest session

3. Ask the agent to read `HANDOFF-V3.md`, then `MEMORY.md`, then `docs/claude-code-handoff/SESSION-CONTEXT.md`.

## Live preview of this build

V3 was deployed to temp.md and is live at:

**https://calm-marsh-45a5.temp.md** (expires May 11, 2026)

## Build for production yourself

```bash
cd trust-center
npm run build
```

Output goes to `trust-center/dist/`. Serve `dist/index.html` from any static host.

## Parallel V2 prototype

The active V2 prototype (kept running while V3 went to Cursor) lives at:

```
/Users/ivanatso/Desktop/Claude Repo/Trust Center Staging V2 Draft Preview Link Published/
```

V2 and V3 started from the same code. You can keep prototyping in V2 in Claude Code, and run independent experiments in V3 in Cursor.
