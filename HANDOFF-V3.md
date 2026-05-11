# Trust Center V3 — Cursor Handoff

This document captures the state of the Trust Center designer prototype as of the V3 handoff (May 11, 2026). It is the **continuation point** for picking up work in Cursor.

> **Designer note:** Ivana is a product designer at Conveyor, not an engineer. Explain everything step by step, in plain language, with Figma analogies where helpful. No em dashes. See `.cursorrules` for the full communication guide.

---

## Quick start

```bash
cd trust-center
npm install
npm run dev
```

Open `http://localhost:5175/designerstaging`.

**Build for production:**
```bash
cd trust-center
npm run build
# output in trust-center/dist/
```

---

## Where this version is published

A snapshot of the V3 build is live at:

**https://calm-marsh-45a5.temp.md** ("Trust Center V3 Staging Draft Preview")

- Hosted on [temp.md](https://temp.md/), no account
- Expires May 11, 2026 unless claimed
- Update token + claim link are in the V2 project's `.tempmd` file

---

## What V3 added (this session's work)

Each item lists the user-facing behavior, the files touched, and the key code paths.

### 1. Empty states for Draft and Published preview

**Draft empty state** — shown in the center column when the user is on the Draft tab and there are zero drafts.

- Component: `DraftEmptySkeleton` in `trust-center/src/components/TrustCenter/TrustCenterContent.tsx`
- Trigger: `showDraftEmptyState = !standalone && workspaceTab === 'draft' && state.drafts.length === 0`
- Copy: "There is no Trust Center Draft." / "Start a draft now, and share with a draft preview link."
- CTA: green "Create Draft" button calls `createDraft()` from `DesignerContext`

**Published empty state** — shown when the Published tab is active but no locale is visitor-live.

- Component: `PublishedEmptySkeleton` in the same file
- Trigger: `showPublishedSkeleton = !standalone && state.previewMode === 'published' && !isVisitorLive && !showDraftEmptyState`
- Has **two copy variants** based on `hasEverPublished`:
  - **Never published before**: "Your active trust center will appear here after your draft is published. Reach out to Conveyor Support to claim your branded url."
  - **Previously published (unpublished now)**: "Your Trust Center has been unpublished. Visit the Draft tab to make changes and republish."
- Both variants show two buttons: secondary **"Contact Support"** + primary **"View Draft"** (the View Draft button is wired to `onViewDraft` which sets both `previewMode` and `workspaceTab` to `'draft'`)

Both skeletons render a faded structural placeholder (nav bar, banner, identity, certifications, etc.) so the page never looks blank — the visual emphasizes "this is where your Trust Center will appear."

The `EmptyStateIllustration` SVG (a small grid of squares + key) is shared between both empty states.

### 2. Unpublish flow

When a user toggles a published Trust Center **off**, V3 saves its current state to a draft and shows the published empty state.

**Trigger:** The visitor-live toggle in the Published right panel intercepts the "off" action and opens a confirmation modal:
- File: `trust-center/src/components/Settings/RightPanel.tsx` → `PublishedOverviewSection`
- State: `unpublishConfirmOpen`
- Modal copy: "Are you sure you want to unpublish your Trust Center?" + (if a draft exists) an amber warning: "Unpublishing will overwrite current draft, {draftName}."

**On confirm:** Calls `unpublishToDraft()` from `DesignerContext`.

**`unpublishToDraft()` implementation** (`DesignerContext.tsx`):
1. Clones the published snapshot as a new draft payload
2. Sets `localeEverPublished.en = true` on the draft (so publishing it later activates locales)
3. Names the draft using the published TC's name (from `publishedTrustCenterNames[PRIMARY_TRUST_CENTER_LOCALE]`)
4. Sets `localeLive` on the published snapshot to all `false`
5. **Overwrites** any existing draft (replaces `drafts` array entirely)
6. Keeps `previewMode: 'published'` so the user immediately sees the empty state

### 3. Republish flow (V3: publishes the draft + clears it)

When a user toggles the Trust Center **back on** from the Published tab, V3 now treats this as a full "publish the active draft."

**Trigger:** Same toggle as above, but on the "on" branch:
- State: `republishConfirmOpen`
- Modal copy: "Publish Trust Center?" / "Are you sure you want to publish current draft, **{draftName}** to active URL?"
- Footer: secondary "Cancel" + primary green "Publish Trust Center"

**On confirm** (`RightPanel.tsx`):
```ts
if (state.drafts.length > 0) {
  publishActiveDraft(undefined, { goLive: true });
} else {
  setPublishedTrustCenterVisitorLive(true);
}
```

The `publishActiveDraft(undefined, { goLive: true })` path:
- Clones the active draft as the new published snapshot
- Flips `localeLive` to true for every ever-published locale
- Updates the published TC name to the draft's name
- **Removes the draft from `state.drafts`** (line 465 in `DesignerContext.tsx`: `remaining = drafts.filter(...)`)
- Sets `activeDraftId` to empty string

After republishing, switching to the Draft tab shows the **"There is no Trust Center Draft"** empty state.

The `else` branch handles an edge case: if the user deleted the draft before republishing, we fall back to just toggling the existing published snapshot live.

### 4. PublishedViewBar (floating green toolbar on Published view)

Mirrors the blue `PreviewAsBar` from Draft mode, but for the live published view.

- Component: `PublishedViewBar` in `TrustCenterContent.tsx`
- Trigger: `!standalone && workspaceTab === 'published' && isVisitorLive`
- Renders via `createPortal` to `document.body`, positioned at the visible bottom of the preview container (clamped to viewport)
- Background colors: `#0B815A` bar, `#07694A` segment pill (vs the blue `#0569CB` / `#0052B1` of `PreviewAsBar`)
- Label: **"Viewing active Trust Center as:"** (vs "Previewing as:")
- Right-side actions: **"Share Live URL"** (Share2 icon) + **"Open in new tab"** (ExternalLink icon)
- Uses the same segment selector popover pattern as `PreviewAsBar` (`PublishedSegmentSelectorPopover`), wired to the same `SEGMENT_OPTIONS` constant

### 5. Toolbar header (`DesignerStagingToolbar.tsx`)

The top strip above the center column had visibility bugs that V3 fixed.

**Problem:** When the user clicked the Published tab, the toolbar's left side (status text) and right side (Autosaved time) both went blank, making the toolbar look empty/broken.

**Fix:**
- Left side now shows **"● Published view"** (green dot + brand-600 text) when `!isDraftSideActive` **AND** the TC is visitor-live (`isVisitorLive` is true). When the TC is unpublished, the label is hidden (per V3 design — see V3 ticket "Published view label").
- Right side (Autosaved time) only shows on the draft side: `{autosavedTime && isDraftSideActive ? ... : null}`
- `workspaceTab` and `state.previewMode` are now kept in sync — the "View Draft" button in the published empty state calls both `setPreviewMode('draft')` and `onWorkspaceTabChange?.('draft')`. This required threading `onWorkspaceTabChange` through `TrustCenterContent` as a prop.

### 6. "Edit Active Content" disabled when no published TC

The "Edit Active Content" section in the Published right panel now visually disables itself when the TC is unpublished (because there's nothing to edit live).

- File: `RightPanel.tsx` → `PublishedContentSection`
- Computes `isVisitorLive` from `getPublishedPresentation(state)` + `LANGUAGE_MENU`
- When not live, the body wrapper gets `opacity-50 pointer-events-none`
- Description text swaps to: **"Publish your Trust Center to edit active content."**
- Accordion header (chevron expand/collapse) is still clickable so users can still hide the section

### 7. Other smaller V3 changes (carried in from earlier in the session)

- **Draft row UI:** Autosaved time moved under the draft name; revert icon (`Undo2`) is icon-only and only appears on hover; "Share Draft Preview" rename; draft name is clickable inline (preserves rename in draft mode)
- **Unpublish modal:** Shortened to one-line copy with an amber TriangleAlert callout
- **Unpublish button styling:** Solid red (`bg-red-500 text-white`), no outline
- **Published tab empty state copy:** "No active Trust Center." / "Visit the Draft tab to view or publish your Trust Center." (no "Go to Draft" button — the View Draft button moved to the center empty state instead)
- **`createDraft()` fix:** New drafts created from the right panel now set `base.localeEverPublished.en = true` so they can be published live (was a bug where new drafts couldn't activate any locale)

---

## Architecture refresher

```
trust-center/src/
  context/
    DesignerContext.tsx        # Single source of truth: drafts, published snapshot, previewMode
  components/
    Settings/
      DesignerStagingToolbar.tsx  # Top strip: status + Draft|Published toggle + autosaved
      RightPanel.tsx              # Right column — Draft tab + Published tab + all modals
    TrustCenter/
      TrustCenterContent.tsx      # Center preview — sections, empty states, floating bars
      [section components...]
  pages/
    DesignerPage.tsx           # 3-column shell: LeftNav + center + RightPanel
  constants/
    previewLocale.ts           # LANGUAGE_MENU, PREVIEW_LOCALES, PRIMARY_TRUST_CENTER_LOCALE
```

**Key concept — `workspaceTab` vs `previewMode`:**
- `workspaceTab` is **local state** in `DesignerPage`, controls which right-panel tab is open
- `state.previewMode` is **context state** in `DesignerContext`, controls what the center column renders
- These are kept in sync by passing `onWorkspaceTabChange` down to anything that switches the center preview, so toggles always update both

**Key concept — `localeLive` vs `localeEverPublished`:**
- `localeLive`: currently visitor-live (the green dot on the TC card)
- `localeEverPublished`: has been live at least once — used to determine "first time publish" vs "republish" empty state copy

```ts
const isVisitorLive = LANGUAGE_MENU.some((item) => pub.localeLive[item.locale]);
const hasEverPublished = LANGUAGE_MENU.some((item) => pub.localeEverPublished[item.locale]);
```

---

## State diagram (Draft + Published flows)

```
[Draft exists, TC live]
  └─ toggle off → unpublish modal → unpublishToDraft()
      └─ saves published as draft, clears localeLive
         → [No draft (overwritten), TC unpublished, sees PublishedEmptySkeleton with View Draft]

[Draft exists, TC unpublished]
  └─ toggle on → republish modal → publishActiveDraft({ goLive: true })
      └─ pushes draft to published, removes draft
         → [No draft, TC live, sees PublishedViewBar]
         → switching to Draft tab shows DraftEmptySkeleton with Create Draft

[No draft, TC live]
  └─ Draft tab → DraftEmptySkeleton.Create Draft → createDraft()
      └─ clones published snapshot as new draft
         → [Draft exists, TC live]

[No draft, TC unpublished]  (rare edge state — only if user deletes draft after unpublishing)
  └─ toggle on republish → fallback: setPublishedTrustCenterVisitorLive(true)
      └─ uses last-known published snapshot (still in state.publishedSnapshot)
```

---

## Open / future ideas (not done, just notes)

- The "Contact Support" button in `PublishedEmptySkeleton` is currently a no-op placeholder — wire it up when there's a real support flow
- The "Share Live URL" button on `PublishedViewBar` is also a placeholder — needs share modal or copy-link behavior
- `MAX_DESIGNER_DRAFTS` is currently 1 — V3 has not removed this cap, so the user can only have one draft at a time
- The republish flow currently always sets `previewMode: 'published'`; consider whether to bounce to Draft tab to highlight the new empty state

---

## How to continue this in Cursor

1. **Open the project root** (this folder) in Cursor
2. **Read these files in order:**
   - `HANDOFF-V3.md` (this file)
   - `MEMORY.md` (longer history of decisions)
   - `.cursorrules` (Ivana's communication preferences + token rules)
   - `docs/claude-code-handoff/SESSION-CONTEXT.md` (earlier V1/V2 work)
3. **Then dive into the codebase**, starting with:
   - `trust-center/src/context/DesignerContext.tsx`
   - `trust-center/src/components/Settings/RightPanel.tsx`
   - `trust-center/src/components/TrustCenter/TrustCenterContent.tsx`
4. `npm install` in `trust-center/` (the V3 copy doesn't include `node_modules`)
5. `npm run dev` and navigate to `/designerstaging`

The parallel V2 prototype (still active) lives at:
`/Users/ivanatso/Desktop/Claude Repo/Trust Center Staging V2 Draft Preview Link Published/`
