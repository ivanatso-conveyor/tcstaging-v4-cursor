# Exporting a Cursor chat for your team

Cursor does **not** support uploading or importing a file to recreate a chat on someone else’s account. A shared **Markdown** (or plain text) export is for **reading**, **searching**, or **pasting excerpts** into a new chat.

## Generate `docs/cursor-chat-export.md`

From the repo root:

```bash
python3 scripts/export_cursor_transcript.py
```

Optional: point at a specific transcript and output path:

```bash
python3 scripts/export_cursor_transcript.py \
  ~/.cursor/projects/<your-project-folder>/agent-transcripts/<id>/<id>.jsonl \
  docs/cursor-chat-export.md
```

The script picks the newest matching project folder under `~/.cursor/projects/` for this repository name when you omit the first argument.

## Give it to a teammate

- Commit or send **`docs/cursor-chat-export.md`** (or zip the repo).
- They can open it in Cursor, VS Code, or any Markdown viewer.
- For a new agent session, they often paste the **last user message** plus a short summary, or `@`-attach the file if the editor supports file context.

## Privacy

Transcripts can include prompts, code, and paths. Review before sharing outside a trusted team.
