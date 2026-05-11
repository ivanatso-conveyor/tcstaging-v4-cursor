# Preview link, draft mode, and change summary brief

This brief is written for Claude Code. Open this repo in Claude Code, then ask:

> Read `docs/claude-code-handoff/PREVIEW-DRAFT-PUBLISHED-BRIEF.md` and implement the three changes in order. Pause after each change so I can review at `/designerstaging`.

The brief is split into three independent changes. Each change lists the file paths, the current code shape, and the recommended edits. None of them require new packages or new state schemas.

---

## Background and goals

Recent meetings flagged three problems with the current draft / published / preview UX:

1. The **preview link** is publicly viewable. The wording around it implies it is private. Customers and internal viewers can open the link if it leaks. The fix is messaging clarity, not access control.
2. The **Create Draft** button is a gate users must click before editing, even though only one draft can ever exist (`MAX_DESIGNER_DRAFTS = 1`). It is dead-weight ceremony.
3. Draft mode does not show **what has changed**. Users edit, then guess at what will publish. The `computeDraftDiff` helper already computes this list but it only feeds the publish modal.

The goals are to clarify wording, remove the unnecessary draft creation step, and surface staged changes in the right panel.

Out of scope for this round (already discussed, deliberately deferred):

- The "Publish N changes" CTA next to the staged-changes summary. Add later.
- A toolbar status pill that summarizes draft / pre-launch / live state. Add later.
- Password-protected preview links. Stretch goal.

---

## Change 1: Rename "preview link" and clarify share copy

The phrase "preview link" appears in copy and dt labels. Replace with **Pre-launch link** when the Trust Center has not yet gone visitor-live, and **Shareable link** in tooltips and modal headers. Add a banner explaining the link is publicly accessible if shared.

### Files to edit

1. `trust-center/src/components/Settings/RightPanel.tsx`
2. `trust-center/src/components/TrustCenter/ShareLinkBanner.tsx` (new file)

### Current state

Two key places use the wording today:

**File:** `trust-center/src/components/Settings/RightPanel.tsx` line 198
```tsx
<p className="text-xs leading-relaxed text-primary-700">
  View currently active Trust Centers. Toggle the trust center on/off to move from Live link back to a preview link.
</p>
```

**File:** `trust-center/src/components/Settings/RightPanel.tsx` line 502 (inside `PublishedSnapshot`)
```tsx
<dt className="shrink-0 text-primary-600">
  {isVisitorLive ? 'Share Link' : 'Preview link'}
</dt>
<dd className="min-w-0 text-right">
  <a
    href={isVisitorLive ? 'https://trust.mediacore.com' : 'https://pr-3348.preview.chq'}
    ...
  >
    {isVisitorLive ? 'trust.mediacore.com' : 'pr-3348.preview.chq'}
  </a>
</dd>
```

The "Share link" menu item lives at line 705 inside the row "..." menu.

### Recommended edits

**a. Reword the active-trust-centers explainer (line ~198).**

Replace with:

```tsx
<p className="text-xs leading-relaxed text-primary-700">
  View currently active Trust Centers. Toggle a Trust Center off to revert from the live URL back to a pre-launch link.
  Pre-launch links are publicly viewable if shared.
</p>
```

**b. Rename the dt label and add a subtle public-access hint (lines ~500 to 514).**

Replace with:

```tsx
<div className="flex items-start justify-between gap-3">
  <dt className="shrink-0 text-primary-600">
    {isVisitorLive ? 'Live URL' : 'Pre-launch link'}
  </dt>
  <dd className="min-w-0 text-right">
    <a
      href={isVisitorLive ? 'https://trust.mediacore.com' : 'https://pr-3348.preview.chq'}
      target="_blank"
      rel="noreferrer"
      className="text-link-400 hover:underline break-all"
    >
      {isVisitorLive ? 'trust.mediacore.com' : 'pr-3348.preview.chq'}
    </a>
    {!isVisitorLive ? (
      <p className="mt-1 text-[11px] leading-snug text-primary-600">
        Anyone with this link can view the Trust Center.
      </p>
    ) : null}
  </dd>
</div>
```

**c. Rename the "..." menu item (line ~705).**

Change the label from `Share link` to `Copy shareable link`. While you are there, add a `title` attribute or subtitle hover that says "Anyone with this link can view." A future iteration can wire it up to `navigator.clipboard.writeText(...)`.

**d. Optional global wording sweep.**

Run a project-wide search for the strings `Preview link`, `preview link`, `Share Link`, and `Share link`. Update any user-facing copy to match: **Pre-launch link** for unpublished trust centers, **Shareable link** for the action, **Live URL** for the published production URL. Do not touch:

- Imports, type names, or variable names.
- Comments inside `RightPanel.tsx`'s top JSDoc spec block (lines 1 to 39); those are design-system notes, not user-facing copy.

### Acceptance check

Open `/designerstaging`. On the Published tab, confirm:

- The strip below the tabs reads "...revert from the live URL back to a pre-launch link. Pre-launch links are publicly viewable if shared."
- The status row reads "Pre-launch link" when the visitor toggle is off and "Live URL" when it is on.
- The "..." menu reads "Copy shareable link."

---

## Change 2: Always-on draft mode (remove the explicit Create Draft step)

The `DraftStagingSection` component renders different UI for `state.drafts.length === 0` (a "Create Draft" card with a single plus button) and for `state.drafts.length > 0` (the same card plus the drafts list). Because `MAX_DESIGNER_DRAFTS = 1`, the user always either has zero drafts or exactly one. The plus button is friction.

We will replace the no-draft state with a simple empty state that says **No staged changes yet. Edit anything in the preview to start a draft.** The first stageable edit creates the draft implicitly.

### Files to edit

1. `trust-center/src/components/Settings/RightPanel.tsx`
2. `trust-center/src/context/DesignerContext.tsx`

### Current state

**File:** `trust-center/src/components/Settings/RightPanel.tsx` line 264 onward.

`DraftStagingSection` renders `<button onClick={() => createDraft()}>` in two places (lines ~280 and ~316). The drafts list renders only when `state.drafts.length > 0`.

The right-panel content below the staging card is dimmed when there is no draft (lines ~157 to 164):

```tsx
<div
  className={
    state.drafts.length === 0
      ? 'pointer-events-none select-none opacity-40'
      : undefined
  }
  aria-disabled={state.drafts.length === 0 ? true : undefined}
>
  <CustomizeLayoutSection ... />
  ...
</div>
```

`createDraft` is exposed by `DesignerContext` (`trust-center/src/context/DesignerContext.tsx`). It currently no-ops when at the cap (per `MEMORY.md`).

### Recommended edits

**a. Replace the no-draft branch in `DraftStagingSection`.**

Find lines 270 to 303 (the `if (state.drafts.length === 0) return (...)` branch). Replace the entire return with:

```tsx
return (
  <div className="space-y-2 border-b border-primary-400 bg-primary-100 px-5 py-4">
    <p className="text-sm font-medium text-primary-800">Staged changes</p>
    <p className="text-xs leading-relaxed text-primary-700">
      No staged changes yet. Edit anything in the preview to start a draft.
    </p>
    {state.previewLocale !== 'en' ? (
      <p className="text-[11px] leading-snug text-primary-600">
        You are previewing copy in{' '}
        <span className="font-medium text-primary-800">{previewLocaleLabel(state.previewLocale)}</span>.
      </p>
    ) : null}
  </div>
);
```

**b. Rename the heading on the existing-draft branch.**

In the second return (lines 305 onward) change:

```tsx
<p className="text-sm font-medium text-primary-800">Create Draft</p>
```

to:

```tsx
<p className="text-sm font-medium text-primary-800">Staged changes</p>
```

Also remove the plus button block (the `<span className="group/create-draft relative shrink-0">...</span>` block, lines ~309 to 326) and the explainer paragraph at lines ~328 to 331 (`"Change content like layout, ... Maximum 1 draft."`). These are no longer needed because the draft is created implicitly. Leave the drafts list (`<ul role="list">`) intact, including row rename and delete.

**c. Make the right panel content always interactive.**

Currently the bottom of the right panel is dimmed when `state.drafts.length === 0`. Now that draft mode is always on, remove the dim wrapper. In `RightPanel.tsx` lines ~157 to 164, replace:

```tsx
<div
  className={
    state.drafts.length === 0
      ? 'pointer-events-none select-none opacity-40'
      : undefined
  }
  aria-disabled={state.drafts.length === 0 ? true : undefined}
>
```

with:

```tsx
<div>
```

(and remove the corresponding closing `</div>` indentation if you prefer; the JSX nesting can stay the same).

**d. Auto-create the draft on the first stageable edit.**

This is the key behavioral change. Inside `DesignerContext.tsx`, find every state setter that mutates a stageable field on the active presentation (the ones that already write to `drafts`). For each one, if `state.drafts.length === 0`, call the same logic as `createDraft()` first, then apply the edit to the new draft.

The cleanest way:

1. Locate `createDraft` in `DesignerContext.tsx`. Note its return value or capture the new draft id by extracting the body into a helper that returns the id, e.g. `ensureActiveDraft(): string`.
2. Inside every stageable setter (for example `setPublicView`, `setAccentColor`, `setPrimaryColor`, `setFontFamily`, `toggleSection`, `reorderSections`, `setSavedTrustCenterImagery`, `setSavedAiAgentConfig`, `toggleLocaleLive`), at the top of the function, run:

   ```ts
   if (state.drafts.length === 0) {
     ensureActiveDraft();
   }
   ```

3. Be careful with the helpers that already check `previewMode === 'draft'`. The new behavior is: any stageable mutation, regardless of preview mode, should create the draft if none exists. If the active preview was Published, switch it to Draft after creating, since the user just started editing.

If the setter list is long, an alternative is to add a thin middleware layer:

```ts
function withDraftAutoCreate<T extends (...args: any[]) => void>(fn: T): T {
  return ((...args: Parameters<T>) => {
    setState((s) => {
      if (s.drafts.length === 0) return applyCreateDraft(s);
      return s;
    });
    fn(...args);
  }) as T;
}
```

Pick whichever pattern fits the existing context shape best.

**e. Keep the right-panel "registerOpenDraftWorkspaceHandler" effect working.**

In `RightPanel.tsx` lines 108 to 118, the existing `useEffect` already calls `createDraft()` when entering the Draft tab with no drafts. Leave that intact for now. It is harmless after change (d) because `createDraft` is idempotent at the cap.

### Acceptance check

Open `/designerstaging`. Confirm:

- The Draft tab no longer shows a plus button or "Create Draft" heading. Instead it shows "Staged changes" with the empty-state copy.
- The right-panel sections (Customize Layout, Public View, Brand Settings, etc.) are fully interactive immediately, not dimmed.
- Toggling a section visibility, changing a brand color, or any other stageable edit creates a draft automatically. The draft row appears in the staging card.
- The drafts list, rename, and delete still work.

### Manual smoke checks

- Edit something. Click delete on the draft row and confirm. Confirm you go back to the empty state.
- Click the Published tab, edit a "live content" item from a published-area pencil. Confirm that does not create a draft (those edits write to `publishedSnapshot`, not the draft).

---

## Change 3: Surface staged changes in the right panel

`computeDraftDiff(draft, published)` lives in `trust-center/src/utils/draftDiff.ts` and returns a `string[]` of human-readable changes. Render it in the staging card.

### Files to edit

1. `trust-center/src/components/Settings/RightPanel.tsx`

### Current state

The diff is currently called only inside the publish modal in `DesignerStagingToolbar.tsx`. The right panel does not import it.

`DesignerContext` exposes `getPublishedPresentation` (already imported in `RightPanel.tsx` line 44) which returns the published `StageablePresentation`. The active draft's stageable shape lives on the `.payload` property. See `trust-center/src/types/staging.ts`:

```ts
export type TrustCenterDraft = {
  id: string;
  editedBy: string;
  name: string;
  updatedAt: number;
  payload: StageablePresentation;
};
```

### Recommended edits

**a. Compute the diff inside `DraftStagingSection`.**

At the top of the component (after the existing `useDesigner` destructure):

```ts
import { computeDraftDiff } from '../../utils/draftDiff';
// ...
const activeDraft = state.drafts.find((d) => d.id === state.activeDraftId);
const publishedPresentation = getPublishedPresentation(state);
const diff = activeDraft
  ? computeDraftDiff(activeDraft.payload, publishedPresentation)
  : [];
```

(If `getPublishedPresentation` is not already imported in this exact form, add it to the imports from `../../context/DesignerContext`.)

**b. Render the diff list under the drafts list.**

Inside the `state.drafts.length > 0` branch of `DraftStagingSection`, after the existing `<div><p>Drafts</p><ul>...</ul></div>` block, add:

```tsx
<div className="border-t border-primary-300 pt-3">
  <p className="mb-1.5 text-xs font-medium text-primary-800">
    Staged changes ({diff.length})
  </p>
  {diff.length === 0 ? (
    <p className="text-[11px] leading-snug text-primary-600">
      Draft matches published. Edit something to stage a change.
    </p>
  ) : (
    <ul className="space-y-1 text-[11px] leading-snug text-primary-700" role="list">
      {diff.map((change, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary-500" />
          <span>{change}</span>
        </li>
      ))}
    </ul>
  )}
</div>
```

**c. Reuse the same logic on the no-draft empty state.**

When `state.drafts.length === 0`, the empty state already says "No staged changes yet." That is consistent with `diff.length === 0`, so no extra render needed there.

### Acceptance check

Open `/designerstaging` on the Draft tab.

- With no edits, the staging card reads "Staged changes (0) — Draft matches published. Edit something to stage a change." (or whatever exact phrasing you went with).
- Change the accent color from the default. The card now reads "Staged changes (1)" with a single bullet "Accent color changed to #...".
- Toggle a section's visibility. The count goes to 2 and a second bullet appears.
- Click delete on the draft (or revert via `discardActiveDraft` if you wired that). Count returns to 0.

### Notes for Claude Code

- Do not duplicate the diff computation. Pass it down from `RightPanel` if needed, or call `computeDraftDiff` once per render inside `DraftStagingSection`. The computation is cheap.
- Do not introduce a new color token. Reuse `primary-300` for the divider, `primary-500` for the bullet dot, `primary-700` for the change text, `primary-800` for the heading.
- The bullets should not use a Tailwind list-disc style; the explicit dot span gives consistent spacing.

---

## Verification pass before handing back to me

After all three changes, run:

1. `npm run dev` from `trust-center/`. Open `http://localhost:5173/designerstaging`.
2. Walk through every Acceptance check listed above.
3. Run `npm run build` to confirm there are no TypeScript errors introduced by the renames or by the diff wiring.

If anything regresses outside the three listed areas (for example the publish modal stops showing diffs, or the drafts list disappears), revert that change and ask.

---

## Project conventions reminder

Pulled from `MEMORY.md`:

- Token-first styling. Avoid raw hex.
- No em dashes anywhere in user-facing copy. Use commas, periods, or line breaks.
- One component per file, organized by feature area.
- Material Symbols Rounded for icons (already loaded). Font Awesome only for legacy right-panel layout controls.

When done, append a short note under `## Decisions` in `MEMORY.md` describing what shipped and the date.
