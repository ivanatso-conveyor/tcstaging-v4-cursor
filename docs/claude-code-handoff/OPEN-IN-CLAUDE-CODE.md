# Open this prototype in Claude Code

Claude Code is Anthropic’s **terminal-based** coding agent. It works on a **local folder** (this git repo). These steps assume you already installed the Claude Code CLI from Anthropic’s documentation.

## 1. Know your folder path

Repository root (example on your Mac):

```text
/Users/ivanatso/Desktop/Cursor Repo/staging-prototype-v1
```

If the folder moved, use the path where `trust-center/package.json` and `MEMORY.md` both exist.

## 2. Open Claude Code in that folder

In Terminal:

```bash
cd "/Users/ivanatso/Desktop/Cursor Repo/staging-prototype-v1"
claude
```

If your CLI uses a different command (for example a pinned binary), use that instead of `claude`.

## 3. Prime the session (first message suggestion)

Paste something like:

```text
Read docs/claude-code-handoff/README.md, then docs/claude-code-handoff/SESSION-CONTEXT.md, then MEMORY.md. The Vite app lives in trust-center/. Default route for the designer is /designerstaging. Do not install new npm packages without asking.
```

## 4. Run the dev server (separate terminal)

```bash
cd "/Users/ivanatso/Desktop/Cursor Repo/staging-prototype-v1/trust-center"
npm install
npm run dev
```

Use the URL Vite prints (port may not be 5173).

## 5. Optional: project-level `CLAUDE.md`

From repo root:

```bash
cp docs/claude-code-handoff/CLAUDE.md ./CLAUDE.md
```

Then Claude Code will pick up the briefing automatically for this repo.

---

If Claude Code is not installed yet, get the current install steps from Anthropic’s Claude Code documentation, then return to step 2.
