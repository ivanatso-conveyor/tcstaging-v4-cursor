# Project Memory

## Decisions

- [2026-04-20] **Featured Documents modal (`FeaturedDocumentsSettingsModal.tsx`):** Title "Featured Documents." Subheader `h3` "Featured Documents" above paragraphs (matches Badges modal "Featured Badges" pattern). Two intro paragraphs ("Let your customers know..." and "Add your public docs by updating their access settings..."). Multi-select product dropdown (`ProductLineDropdown` inline, uses `ListChecks` icon + chevron) between paragraphs and list: "All Products" row acts as select-all toggle, divider, then individual products from `productFilters` (excluding sentinels "All Products" and "+ 12 More"). Trigger label shows "All Products" when all selected, product name when 1 selected, "N products" when multiple. Single reorderable list (grip handle, badge thumbnail or PDF pill, name, lock icon when `doc.locked`, X remove). Shell matches `BadgesSettingsModal` (`max-w-xl`, h-14 header `primary-100`, scroll body, h-[72px] footer `primary-200`). Published-only edit: `FeaturedDocumentsSection.tsx` wraps only `h2 + ProductFilterChips + doc grid` in `TrustCenterEditableRegion`, leaving **"View all documents" OUTSIDE** the hover region (per design requirement). `'featured-documents'` added to `EditableTrustSectionId` (plus ARIA_LABELS/TITLES entries) and to `PUBLISHED_LIVE_EDIT_SECTION_IDS`. Wired at both entry points: `TrustCenterContent.tsx` (preview pencil) and `RightPanel.tsx` `PublishedContentSection` (Edit Live Content list). Rows are local modal state; Save does not yet persist.
- [2026-04-20] **Quick Summary modal (`QuickSummarySettingsModal.tsx`):** Title "Update Summary." Subtitle "Toggle on all that apply for your company to populate your summary." 14 rows: each has enable toggle + link button + label. Two new indicators added vs. current Trust Center preview list: **Has a privacy policy**, **Has an AI policy**. "Submit a suggestion" callout (link) at body bottom. Shell matches `BadgesSettingsModal` (h-14 header `primary-100`, scroll body, h-[72px] footer `primary-200`, Cancel + Save); width `max-w-[520px]` (narrower than badges). Rows use local state only, not yet persisted to `DesignerContext`. Wired at both entry points: `TrustCenterContent.tsx` (preview pencil) and `RightPanel.tsx` `PublishedContentSection` (Edit Live Content list).
- [2026-04-20] **Quick Summary edit mode:** Edited from **Published** tab and "Edit Live Content," not from draft hover (matches Certifications precedent). In `QuickSummarySection.tsx`, `TrustCenterEditableRegion` uses `editableInDraft={false}`, `draftLockedHint="Switch to publish to edit."`, and `publishedOverlay="pencil-only"`. `'quick-summary'` added to `PUBLISHED_LIVE_EDIT_SECTION_IDS` in `TrustCenterContent.tsx` so clicking the published pencil keeps you in Published mode.
- [2026-04-16] **Claude Code handoff folder:** Packaged under `docs/claude-code-handoff/` (`README.md`, `SESSION-CONTEXT.md`, `OPEN-IN-CLAUDE-CODE.md`, `CURSOR-TRANSCRIPTS.md`, `CLAUDE.md`). Repo root `CLAUDE.md` points there so Claude Code can discover context quickly.
- [2026-04-16] **Trust Center Imagery accordion default:** `ImagerySection` in `RightPanel.tsx` initializes expanded (`useState(true)`) so it matches other draft-editor accordions (Brand Settings, Localization, layout). Button includes `aria-expanded`.
- [2026-04-16] **Single draft limit (prototype):** `MAX_DESIGNER_DRAFTS = 1` in `trust-center/src/constants/designerDraftAuthor.ts`. `createDraft` in `DesignerContext` no-ops at the cap. `DraftStagingSection` in `RightPanel.tsx` shows "Maximum 1 draft." and disables the square plus when a draft exists.
- [2026-04-15] **Draftable Content accordion:** Hidden in the draft right panel. Toggle `SHOW_DRAFTABLE_CONTENT_ACCORDION` in `trust-center/src/components/Settings/RightPanel.tsx` (near imports) to show it again. Component `DraftableContentSection` and `DRAFTABLE_CONTENT_ITEMS` remain in that file.
- [2026-04-15] **Default Trust Center hero banner:** Served from `trust-center/public/assets/tc-banner.png`. `uiAssets.tcBanner` is the string `` `${import.meta.env.BASE_URL}assets/tc-banner.png` `` (stable path, no Rollup hash, no spaces in the filename). Vite copies the file to `dist/assets/tc-banner.png`.
- [2026-04-14] **GitHub Pages:** Vite `base` comes from `VITE_BASE_PATH` (see `trust-center/vite.config.ts`). CI sets it to `/${{ github.event.repository.name }}/` in `.github/workflows/deploy-github-pages.yml` (runs on `main` and `master`). `BrowserRouter` uses `basename` derived from `import.meta.env.BASE_URL`. Raw `<a href>` links to the public Trust Center preview use `` `${import.meta.env.BASE_URL}trust-center` `` so they work under a subpath. **`index.html`** uses Vite’s `%BASE_URL%favicon.svg` so the favicon resolves on a subpath. **`postbuild`** runs `scripts/copy-spa-fallback.mjs` to copy `dist/index.html` → `dist/404.html` (required for deep links and refresh on Pages). **`public/.nojekyll`** disables Jekyll so files like `_` paths are not stripped. Local shortcut: `npm run build:gh-pages` (defaults path to `/staging-prototype-v1/`; change the script if the GitHub repo name differs).
- [2026-04-14] **Staging UX (designer):** Draft tab hides Public View, Brand Settings, Customized Fonts, Localization, and Trust Center features until `drafts.length > 0`. Draft labels use `formatDraftLabel` in `constants/designerDraftAuthor.ts` ("Draft MM/DD/YY at h:mm AM/PM"). Toolbar: white background, wide Draft/Published toggle showing active draft name (centered), no language copy pill; clicking Published only changes center `previewMode`, not the right panel tab. Status shows unpublished vs clean draft plus autosave time. Right panel: merged tabs into grey "Create Draft" block; icon-only create with dark tooltip (Arrow DS style); draft rows with inline rename, open preview (new-tab icon + tooltip), delete; `DraftableContentSection` and `PublishedContentSection` for content edit entry points; published area is one **Live Trust Centers** list (live + inactive), smaller toggles on the left, row click to expand (no chevron), `shadow-md` on row hover, merged sticky header (tabs white, header grey). **Publish:** removes published draft from list, optional changelog in modal (`draftDiff` bullets), `publishedChangelogNote` + per-locale `publishedTrustCenterNames` (only newly-live locales take the draft name). **Edit changelog** from row "..." menu. **NDA** row in snapshot: label + "Manage NDAs" link only (no "Yes"). Tooltips use token `primary-900` background (same as Arrow DS black spec).
- [2026-04-09] Tech stack: React + Tailwind CSS + TypeScript
- [2026-04-09] Icons: Google Material Symbols **Rounded** via CDN (FILL 0 or 1 per icon, wght 400, GRAD 0, opsz 20). Font Awesome is allowed only for small right-panel layout row controls. No other icon libraries without asking first.
- [2026-04-09] Font stack: `Neue Montreal` first, then `Inter` and system UI (`--font-family-sans` in `trust-center/src/index.css`). Load actual font files the same way the app already does, do not add new font packages without asking.
- [2026-04-09] Two color systems: Conveyor Product UI colors (fixed) and Customer Brand colors (configurable, preview area only)
- [2026-04-09] Default icon color for Conveyor shell icons: `--color-icon-default` / `#09334E` (`text-icon-default`, `var(--color-icon-default)` in `index.css` @theme).
- [2026-04-09] Component architecture: one component per file, organized by feature area (layout, trust-center, settings, shared)
- [2026-04-09] Token-first approach: product palette and typography tokens live in the Tailwind `@theme` block in `trust-center/src/index.css` (exposed as CSS variables and Tailwind utilities such as `text-primary-800`). Runtime customer brand for the Trust Center preview uses `--brand-primary`, `--brand-accent`, and `trust-center/src/constants/brandDefaults.ts` defaults. Avoid duplicating the same hex in a second TS constants file unless it is truly runtime config.

## Design Tokens Added

### Colors: Conveyor Product UI
- `--color-nav-bg`: #1E1B4B (top navigation bar, dark indigo)
- `--color-nav-text`: #FFFFFF (top nav text and icons)
- `--color-sidebar-bg`: #FFFFFF (left sidebar background)
- `--color-sidebar-text`: #374151 (nav item text, gray-700)
- `--color-sidebar-muted`: #6B7280 (section headers like "KNOWLEDGE", gray-500)
- `--color-sidebar-selected-bg`: #E6FFFA (teal highlight on selected nav item)
- `--color-sidebar-selected-text`: #0D9488 (teal text on selected item)
- `--color-icon-default`: #09334E (default icon color throughout)
- `--color-link`: #0D9488 (all teal links, interactive elements, teal-600)
- `--color-toggle-active`: #0D9488 (toggle switch ON state)
- `--color-toggle-track`: #CCFBF1 (toggle track when ON, teal-100)
- `--color-pill-selected-bg`: #1E1B4B (selected filter pill, same as nav)
- `--color-pill-selected-text`: #FFFFFF
- `--color-pill-default-bg`: #FFFFFF
- `--color-pill-default-border`: #D1D5DB (gray-300)
- `--color-pill-default-text`: #374151 (gray-700)
- `--color-banner-bg`: #ECFDF5 (live banner background, emerald-50)
- `--color-banner-text`: #065F46 (live banner text, emerald-800)
- `--color-share-btn`: #0D9488 (share button, teal-600)
- `--color-card-bg`: #FFFFFF
- `--color-card-border`: #E5E7EB (gray-200)
- `--color-body-bg`: #F3F4F6 (main content area background, gray-100)
- `--color-heading`: #111827 (section titles, gray-900)
- `--color-body-text`: #374151 (paragraph text, gray-700)
- `--color-text-muted`: #6B7280 (secondary text, gray-500)
- `--color-divider`: #E5E7EB (horizontal dividers, gray-200)
- `--color-checkmark`: #10B981 (green checkmark badge, emerald-500)
- `--color-callout-bg`: #FFFBEB (yellow callout box, amber-50)
- `--color-callout-border`: #F59E0B (yellow callout left border, amber-500)
- `--color-notification-badge`: #EF4444 (red badge, red-500)
- `--color-space-dot`: #6366F1 (purple dot, indigo-500)

### Colors: Customer Brand (Mediacore defaults)
- `--brand-accent`: #292951 (deep purple, Accent Color picker default, matches `TRUST_CENTER_DEFAULT_ACCENT` in `brandDefaults.ts`)
- `--brand-primary`: #333366 (navy header, Primary Color picker default, matches `TRUST_CENTER_DEFAULT_PRIMARY`)

### Font Sizes
- `--font-size-xs`: 11px (sidebar section headers)
- `--font-size-sm`: 12px (QUICK LINKS header, answer counts, promo banner)
- `--font-size-caption`: 13px (pill text, descriptions, color hex values, All Products pill, Share button)
- `--font-size-body`: 14px (nav items, body text, links, input text, layout items)
- `--font-size-card-title`: 15px (card titles like "Documents 9")
- `--font-size-section-header`: 16px (Designer Settings, right sidebar headings, MediaCore nav text)
- `--font-size-page-title`: 20px (section titles like "Certifications")
- `--font-size-company-name`: 28px (company name and tagline)

### Font Weights
- `--font-weight-thin`: 200 (divider "|" between name and tagline)
- `--font-weight-light`: 300 (tagline "Digital media experts")
- `--font-weight-regular`: 400 (body text, descriptions)
- `--font-weight-medium`: 500 (nav items, links, pill text)
- `--font-weight-semibold`: 600 (section headers, labels, selected nav, buttons)
- `--font-weight-bold`: 700 (company name, sidebar headings, section titles)

### Icon Sizes
- `--icon-size-sm`: 14px (stat pill icons)
- `--icon-size-md`: 16px (sidebar nav, layout items, quick links, most icons)
- `--icon-size-lg`: 20px (top nav bar icons)

### Spacing (add as discovered)

### Border Radius (add as discovered)

## Figma References

- **Figma File:** Trust Center Vision HQ
- **File Key:** U3ZtAQwW5Wz7xQ9RFJejJc
- **Outlined Icons frame:** node 471:1869 (contains all 33 Material Symbol icons used in the project)
- **Designer Page (main view):** node 471-1869 area (confirm exact node)

### Icon Node IDs
- schedule: 471:1863
- shield: 471:1862
- chat_bubble: 471:1864
- docs (description): 471:1866
- language (globe): 471:1860
- notifications (bell): 471:1857
- settings: 471:1867
- logout: 471:1854
- search: 475:2109
- person: 515:8136
- close: 515:9334
- menu (hamburger): 515:8559
- keyboard_arrow_right: 551:8551
- thumb_up: 471:1853
- file_save: 569:8056
- sim_card_download: 569:8057
- download: 569:8060
- swap_vert: 617:12066
- arrow_back: 630:10877
- keyboard_arrow_left: 630:11286
- arrow_back_ios_new: 630:11316
- arrow_forward_ios: 630:11315
- info: 630:11628
- ConveyorAI (custom): 515:8130
- login: 812:23168
- data_alert: 935:33997
- preview: 1130:28148
- cake: 471:1861
- pest_control: 471:1858
- link_2: 471:1856
- link: 471:1855
- dropdown_up: 471:1868
- dropdown_down: 471:1859

## Bugs Found and Fixed

- [2026-04-14] **Design token audit (quick):** Replaced hardcoded hex in `RightPanel.tsx` tooltips and controls with `primary-900`, `primary-400`, `text-link-400`. Aligned `BadgesSettingsModal.tsx` to `primary-*`, `brand-*`, `text-link-400`, `text-xl` for the modal title (matches ~20px page title scale).

## My Preferences

- Do not use em dashes anywhere. Use commas, periods, or line breaks instead.
- Explain everything step by step for a product designer, not a developer.
- Use Figma terminology when it helps (frames, components, auto-layout, variants).
- When a new token is created, announce it clearly so I can approve or rename it.
- Ask before installing new packages or libraries.
- Always reference the Figma frame in component comment headers.
- Show side-by-side comparisons when possible (Figma vs. prototype).

## Trust Center designer prototype (implementation notes)

- **Hover edit regions** on the preview open modals: combined **Trust Center Page Imagery** (banner + nav brand), **Quick Links**, **Company Profile**, **Badges**. Entry for imagery is only from the preview hover targets, not from Brand Settings in `RightPanel.tsx` (imagery block was removed there on purpose).
- **Modal backdrop:** full-viewport scrim `rgba(0, 27, 40, 0.25)` with `backdrop-filter: blur(4px)` (see `TrustCenterModalBackdrop.tsx`).
- **Designer persisted state** (`DesignerContext`): `savedQuickLinks`, `savedCompanyProfile`, `savedTrustCenterImagery` (square logo, header banner, thumbnail as data URLs). Changing **preview locale** clears quick links and company profile overrides, not imagery.
- **Merged copy helpers:** `quickLinksMerge.ts`, `companyProfileMerge.ts`, `trustCenterImageryMerge.ts` plus `trustCenterCopy.ts` (`trustCenterDisplayName`, URLs, identity strings).
- **Bundled imagery defaults:** `constants/uiAssets.ts` (Mediacore logo and default TC banner from `trust-center/src/assets/ui/`, including `tc-banner.png` copied from the design asset so Vite emits `/assets/...` URLs in dev and production, not `/@fs/` paths).
- **Icon API:** `MaterialIcon` takes a **`symbol`** prop (Material ligature name). `LogoDevMark` takes **`brandName`** for alt and fallback initial (not generic `name`).
- **Living style guide:** in-app reference at route **`/design-system`** (`pages/DesignSystemPage.tsx`). The designer top bar links to it as **Design system**.
- **Audit doc:** `docs/design-system-audit.md` lists canonical token names, duplicate hex aliases, and exclusions. `@theme` also defines `hero-bg`, `avatar-bg`, `ai-text`, `purple-300`, `purple-500` for hero strip, avatar, and Search Ask AI UI.
- **Staging (draft vs published):** See `docs/project-kickoff.md`. `DesignerContext` holds `publishedSnapshot`, `drafts`, `activeDraftId`, `previewMode`, `publishedTrustCenterNames`, `publishedChangelogNote`, `localeEverPublished` on `StageablePresentation` (`types/staging.ts`). `publishActiveDraft` removes the published draft, applies changelog text, updates names only for locales that were not live before. **`/trust-center`** reads **`publishedSnapshot`** only. Quick links and company profile stay immediate (not in the snapshot). UI: `DesignerStagingToolbar` (`DesignerPage.tsx`), draft/published chrome in `RightPanel.tsx`, diff helper `utils/draftDiff.ts`. **Hover edit:** `TrustCenterEditableRegion` supports `editableInDraft` for banner, badges, quick summary in draft mode; published tab uses **Edit Live Content** modals.

## ConveyorAI Configuration Section
- [2026-04-15] Redesigned `TrustCenterAgentConfigurationSection.tsx` to match Figma screenshot.
- Section title: "ConveyorAI Configuration" (was "Trust Center agent configuration").
- Toggle: "Enable Trust Center Agent" with a "New Feature" pill badge (green/teal outlined, uses `brand-400` + `auto_awesome` Material Symbol).
- Description: "Configure AI Agent chat to guide visitors and allow for faster self-service."
- Two checkboxes replace the old button-label input and instructions textarea:
  - `surfaceDocuments` (checked by default): "Surface and bundle relevant documents and Provide accurate answers with citations"
  - `allowQuestionnaire` (unchecked by default): "Allow questionnaire and bulk question support"
- `SavedAiAgentConfig` type updated: added `surfaceDocuments` and `allowQuestionnaire` booleans; `buttonLabel` and `agentInstructions` kept as optional deprecated fields for backward compat.
- `draftDiff.ts` updated to detect changes in the new checkbox fields.

## Conversation Notes

- [2026-04-14] User asked to persist staging and deployment decisions in this file, run a quick token audit on new UI, and deploy to GitHub Pages. Figma links used earlier: Arrow DS tooltip (node 14087-6567), Trust Center Staging (8-859), Badge settings (1110-43022).
- [2026-04-09] Project is a Conveyor Trust Center prototype for the customer "Mediacore" (digital media experts).
- [2026-04-09] Three-panel layout: left nav sidebar, center Trust Center preview, right settings panel.
- [2026-04-09] Certifications/badges section can show different badges depending on configuration. Two known sets: (1) SOC 2 Type II, ISO 27001, GDPR, SOC 3, CCPA, CSA and (2) CMMC, EcoVadis, HDS, ISAE 3402 Type I, ISAE 3402 Type II, ISMAP, ITAR, NIST.
- [2026-04-09] The "Customize Layout" items in the right sidebar are drag-and-drop reorderable (note the drag handles).
- [2026-04-09] "Modern Landing" and "Simple form" are two layout options for the public Trust Center view.
- [2026-04-09] There is an existing Lovable prototype that can be used as a starting point, but it is not accurate.
- [2026-04-09] Figma MCP server is connected and can be used to pull designs.
