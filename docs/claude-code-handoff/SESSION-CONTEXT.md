# Session context (Trust Center designer prototype)

This is a **working summary** of what this collaboration focused on. It is not a verbatim chat log. For raw Cursor transcripts, see `CURSOR-TRANSCRIPTS.md`.

## Product

Conveyor **Trust Center** designer: three-column shell (left nav, center preview, right settings). Customer brand colors apply only inside the preview, not the Conveyor chrome.

## Stack

- React 19, TypeScript, Vite, Tailwind CSS v4 (`@theme` in `trust-center/src/index.css`)
- React Router: main designer route **`/designerstaging`**

## Major implementation threads (recent)

### Static hosting and hero banner

- Default banner image: **`trust-center/public/assets/tc-banner.png`**
- URL built in `trust-center/src/constants/uiAssets.ts` with `` `${import.meta.env.BASE_URL}assets/tc-banner.png` `` so static hosts do not break on hashed filenames or spaces.

### Staging and publish UX

- Publish modal copy references the published view name (semibold).
- Draft vs published diff: `trust-center/src/utils/draftDiff.ts`
- Single published Trust Center card / visitor toggle: `RightPanel.tsx` (`PublishedOverviewSection`), `DesignerContext.tsx` (`setPublishedTrustCenterVisitorLive`).

### Certifications

- Editable from **Published** tab and “Edit Live Content,” not from draft hover text. Uses `TrustCenterEditableRegion` (`draftLockedHint`, `publishedOverlay`), `CertificationsSection.tsx`, and `PUBLISHED_LIVE_EDIT_SECTION_IDS` in `TrustCenterContent.tsx`.

### ConveyorAI / Ask AI configuration

- Section: `trust-center/src/components/Settings/TrustCenterAgentConfigurationSection.tsx` (title **ConveyorAI Configuration**).
- State on stageable snapshot: `savedAiAgentConfig` in `types/aiAgentConfig.ts`, `utils/stagingPresentation.ts`, `context/DesignerContext.tsx`.
- Nav and search respect `askAiEnabled` and optional `buttonLabel`: `StickyNav.tsx`, `SearchBar.tsx`.
- UI refinements: compact toggle matching `RightPanel` switches, `text-xs` copy, two checkboxes (`surfaceDocuments`, `allowQuestionnaire`), no “New Feature” badge in current code.

### Right panel lists

- **Edit Live Content** (`LIVE_CONTENT_ITEMS`): includes Subprocessors, Trusted By, What we Offer, Video Resources (placeholder modals unless a dedicated modal exists).
- **Draftable Content** accordion: **hidden** behind `SHOW_DRAFTABLE_CONTENT_ACCORDION` in `RightPanel.tsx` (set `true` to restore). List when visible: Imagery, Branding only.
- **Localization** column header next to checkboxes: label **ENABLE** (word `Enable` with CSS `uppercase`).

### Other

- `MAX_DESIGNER_DRAFTS = 1` and UI copy in draft staging (see `MEMORY.md`).
- Trust Center Imagery accordion default expanded (see `MEMORY.md`).

## Files to read first in Claude Code

1. `MEMORY.md` (project decisions and preferences)
2. `trust-center/src/context/DesignerContext.tsx`
3. `trust-center/src/components/Settings/RightPanel.tsx`
4. `trust-center/src/components/TrustCenter/TrustCenterContent.tsx`
5. `trust-center/src/App.tsx`

## Conventions (short)

- Token-first styling (`primary-*`, `brand-*`, `link-*`, etc.). Avoid raw hex in components.
- `.cursorrules` at repo root has full designer-oriented rules (Figma refs, no em dashes, MEMORY updates).

---

*Last updated: 2026-04-16*
