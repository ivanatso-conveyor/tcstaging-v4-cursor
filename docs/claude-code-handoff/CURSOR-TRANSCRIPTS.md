# Cursor conversation transcripts (raw JSONL)

Cursor stores **parent** agent transcripts on your machine as JSONL (one JSON object per line). They are **not** inside this git repo by default.

## Folder on this Mac

```text
/Users/ivanatso/.cursor/projects/Users-ivanatso-Desktop-Cursor-Repo-staging-prototype-v1/agent-transcripts/
```

Each subfolder is named with a UUID. The main transcript file is usually:

```text
<uuid>/<uuid>.jsonl
```

## Recently modified transcripts (as of packaging)

Check modification time when you want the longest session:

```bash
ls -lt "/Users/ivanatso/.cursor/projects/Users-ivanatso-Desktop-Cursor-Repo-staging-prototype-v1/agent-transcripts"/*/*.jsonl
```

Example parent id from an earlier long Trust Center session: `47e10d7f-6edd-4fb2-9a96-5283094f483c` (file may be large, several MB).

## Copy a transcript into this repo (optional)

If you want a snapshot inside git (can be large):

```bash
mkdir -p "docs/claude-code-handoff/cursor-exports"
cp "/Users/ivanatso/.cursor/projects/Users-ivanatso-Desktop-Cursor-Repo-staging-prototype-v1/agent-transcripts/<UUID>/<UUID>.jsonl" \
  "docs/claude-code-handoff/cursor-exports/<UUID>.jsonl"
```

Then add `docs/claude-code-handoff/cursor-exports/` to `.gitignore` if you do not want transcripts committed.

## Export from Cursor UI

You can also use Cursor’s chat UI to **copy or export** the visible conversation and save it as `.md` or `.txt` under `docs/claude-code-handoff/` yourself.
