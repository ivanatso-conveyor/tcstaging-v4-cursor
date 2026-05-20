# Project Memory

## Decisions

- [2026-05-20] **Published preview empty overlay variants (`TrustCenterContent.tsx` > `PublishedEmptySkeleton`, `trustCenterProfileUrl.ts`):** Three center cards when nothing is visitor-live. **Cold start** (`!hasEverPublished`, no draft): `no-results.png`, title **There is no published Trust Center**, profile URL copy, **Learn More** + **Contact Support**. **Ready to publish** (draft exists, never published): `public/Imagery/Empty State Spot Illustrations/done.png`, title **Ready to Publish?**, body **Publish your Trust Center draft to trust.mediacore.com**, **Learn More** (opens branded URL) + **Publish Draft** (opens `PublishConfirmModal` goLive). **Unpublished** (had been live): prior republish copy + **Contact Support** / **View Draft**. **Right panel** (`PublishedEmptyState`): cold start uses profile URL + **Account verification is pending approval.**; with draft uses **`trust.mediacore.com`** + publish-draft helper.
- [2026-05-14] **Company Profile visibility toggle (`IdentitySection.tsx`, `RightPanel.tsx`, `layoutSectionOrder.ts`):** The **Company profile** row in `FixedHeaderSections` is no longer locked as "Always visible." It now uses the `company-profile` visibility key (same pattern as Trust Center banner and Quick links). Toggling it off hides just the **body summary paragraph** ("everything you need to complete your security review...") while the headline (company name + tagline), stat tags, and quick links card remain. The `IdentitySection` component always renders; it reads `presentation.sectionVisibility['company-profile']` internally to gate the summary. `COMPANY_PROFILE_VISIBILITY_ID` constant exported from `layoutSectionOrder.ts`; `migrateSectionVisibility` defaults it to `true`. In `TrustCenterContent.tsx`, the `show('company-profile')` gate around the whole section and divider was removed since the section always shows.
- [2026-05-15] **Draft tab empty state when live but no draft (`TrustCenterContent.tsx`):** On **Draft** workspace tab with **`drafts.length === 0`**, if any locale is **visitor-live** (`isVisitorLive`), show **`DraftEmptySkeletonLiveNoDraft`**: clipboard art **`Imagery/draft-tab-live-no-draft-clipboard.png`**, title **Your Trust center is currently live**, body **To make edits to section layout or imagery, start a draft.**, **Create Draft** CTA. Otherwise keep **`DraftEmptySkeleton`** (Tetris SVG, cold-start copy). Shared chrome: **`DraftEmptyStateLayout`**.
- [2026-05-15] **Published preview empty illustration:** `public/Imagery/no-results.png` (stable URL: `` `${import.meta.env.BASE_URL}Imagery/no-results.png` ``). Used only in **`PublishedEmptySkeleton`**. Draft empty state still uses inline SVG **`EmptyStateIllustration`**. Previous `assets/published-trust-center-empty-state.png` removed.
- [2026-05-15] **Section Layout left alignment (`RightPanel.tsx` > `CustomizeLayoutSection`, `FixedHeaderSections`):** Accordion header and expanded body use **`px-5`** so **Section Layout** lines up with **`PublicViewSection`** and other draft card rows. Grip gutter stays **`w-5`**; **`pl-6`** subheaders align with the eye column under **`px-5`**.
- [2026-05-15] **Documents & KB FAQs section: no preview pencil overlay (`DocumentsFAQsSection.tsx`, `TrustCenterContent.tsx`):** `TrustCenterEditableRegion` for `find-answer` uses **`enabled={false}`** so no pencil overlay covers the preview. The section has its own clickable cards (Documents, KB FAQs) and topic tiles (Overview, Access Management, etc.) that each open `DocumentsSearchModal` with the right panel key. A pencil overlay would block those clicks. **Section Layout pencil** in the right panel still works: it uses `setDraftEditSection('find-answer')` which opens `DocumentsSearchModal` through `RightPanel`'s own modal chain. Added explicit `editSection === 'find-answer'` branch in `TrustCenterContent` modal chain to open `DocumentsSearchModal` (was falling through to the generic placeholder). **Drag and drop** still works (separate `SectionDnDWrapper` in `TrustCenterContent`).
- [2026-05-15] **Bug fix: publish go-live did nothing (`DesignerContext.tsx`):** Removing `draftPayload.localeEverPublished.en = true` from the seed broke `publishActiveDraft` with `goLive: true`. The go-live logic only activates locales in `mergedEver` (union of published + draft `localeEverPublished`/`localeLive`). With all flags false, nothing became visitor-live after publish. **Fix:** restored `draftPayload.localeEverPublished = { ...draftPayload.localeEverPublished, en: true }` on the seed draft. This marks English as a configured locale without making the TC visitor-live (the published snapshot still has `localeLive` and `localeEverPublished` all false on cold start).
- [2026-05-14] **Cold start: stay on Draft after refresh (`RightPanel.tsx`, `DesignerContext.tsx`):** `DesignerPage` already defaults the workspace tab to **Draft** and context seeds **`previewMode: 'draft'`**. A **`RightPanel`** `useEffect` syncs the Draft or Published tab when **`publishedSnapshot`** changes. Its old fallback **`else`** called **`onWorkspaceTabChange('published')`**, which ran after **`DesignerProvider`** migration replaced the snapshot object on load and incorrectly switched to **Published** on every refresh. That **`else`** is removed: tab only changes on publish (draft count down), unpublish (live off), or first go-live (live on). **Seed:** **`publishedTrustCenterNames`** starts as **`{}`**.
- [2026-05-14] **Unpublish feedback toast + Draft tab (`UnpublishTrustCenterToast.tsx`, `RightPanel.tsx` > `PublishedOverviewSection`, `DesignerContext.tsx` > `unpublishToDraft`):** Confirming **Unpublish Trust Center** shows a top toast matching the publish success shell (no confetti). Copy: title **Trust Center unpublished**, line two **{name} is your new draft** (draft name from `trustCenterTitle`, same as the new draft row). Duration uses **`DESIGNER_FEEDBACK_TOAST_DURATION_MS`** from `constants/designerFeedbackToast.ts`. Toast state lives on **`RightPanel`** so it survives switching to the Draft tab. Handler **`handleUnpublishSuccess`** calls **`unpublishToDraft`**, **`switchWorkspaceTab('draft')`**, then shows the toast. **`unpublishToDraft`** sets **`previewMode: 'draft'`** so the center preview follows the new draft. **`RightPanel`** sync effect on **`publishedSnapshot`** + **`drafts.length`**: if draft count **decreased** (publish consumed a draft) → **Published** tab; else if visitor-live went from **any live → none** (unpublish) → **Draft** tab; else if **none → any** live → **Published** tab; otherwise the workspace tab is left unchanged (no longer forces **Published** on snapshot-only updates). **Draft started** pill toast is suppressed when drafts go **0→1** while visitor-live flips from **had live → none** (unpublish from zero drafts), so it does not stack with the unpublish toast.
- [2026-05-14] **Full-page draft preview banner (`DraftFullPagePreviewBanner.tsx`, `TrustCenterContent.tsx`):** On **`/trust-center?draftPreview=1`** when at least one draft exists, a full-width strip renders **above** **`StickyNav`**. Background token **`--color-draft-preview-banner-bg`** (`#fdf4e1`, utility **`bg-draft-preview-banner-bg`**), border **`border-primary-400`**, single line copy **Draft Preview: {name}.** (active draft name, else first draft, else **Untitled**). Typography **`text-xs font-medium text-primary-800`**. Same draft-exists gate as **`DraftPreviewFloatingBar`**.
- [2026-05-14] **Designer toolbar Preview As (`DesignerStagingToolbar.tsx`, `PublishedLiveToolbarControls.tsx`, `DraftPreviewSegmentPopover.tsx`):** **Preview As...** and **View: {segment}** use a **split toolbar control**: text on the left, **chevron-only** segment on the right (`border-r`, shared `rounded-lg` shell). **Preview As...** label uses **`text-xs font-medium text-primary-800`** (same as **Publish Draft Now** in `PublishedPublishGuideCard`). Both halves toggle the segment popover; **`pillRef`** is the wrapper **`div`** for popover anchoring. **`DraftPreviewSegmentPopover`** optional **`onOpenPreviewInNewTab`**: when set, the primary CTA is one button: **“View as segment”** then **`ExternalLink`** on the right, which applies the segment **and** opens the new tab. Callers without the prop keep a plain full-width **View as segment** button.
- [2026-05-14] **Publish live success toast (`PublishLiveSuccessToast.tsx`, re-exported from `RightPanel.tsx`; `DesignerStagingToolbar.tsx`):** After confirming **Publish Live URL** in `PublishConfirmModal` (`goLive` true), optional **`onPublishLiveSuccess`** fires before the modal closes. Toast portals to `document.body` with **`fadeInOut`** wrapper. Copy: title **Successfully Published**, line two **Your Trust Center is now live**. Confetti burst uses small rectangles with product palette CSS variables (`index.css` **`publish-confetti-burst`**). Bottom **`publish-toast-progress-shrink`** bar (**`brand-400`** on **`primary-800`**) shrinks **right to left** over **`DESIGNER_FEEDBACK_TOAST_DURATION_MS`** (shared constant in `constants/designerFeedbackToast.ts`; **`PUBLISH_LIVE_SUCCESS_TOAST_DURATION_MS`** is an alias). **`prefers-reduced-motion`:** confetti hidden, progress motion disabled (dim static bar). Wired from staging toolbar and **`PublishedTabContent`** (publish guide path).
- [2026-05-14] **Published empty state + publish guide (`RightPanel.tsx`, `PublishedPublishGuideCard.tsx`):** When **`hasPublishedTC`** is false, a second white card renders below **No Published Trust Center** with title **Publish your Trust Center** (`text-xs font-medium leading-snug text-primary-800`, same tokens as the empty-state card title), a divider, and three plain-text steps (no radios): **Step 1** create a draft via the **Draft tab** (inline button link), **Step 2** confirm branded url **trust.mediacore.com** plus **Need help making a custom domain? Contact Support** (link), **Step 3** publish your draft. The empty-state helper under the inactive URL is only **Publish draft to make URL live and visible to visitors.** Below the steps: **Publish Draft Now** secondary outline button matches staging **Preview As…** chrome: **`border-primary-300`**, **`rounded-lg`**, **`shadow-sm`**, `bg-white`, `text-primary-800`; disabled when no drafts; opens **`PublishConfirmModal`**.
- [2026-05-14] **Right panel left gutter (`RightPanel.tsx`):** Removed left padding from the two stacked wrappers (draft tabs card + scroll card, and the same in Published tab) by replacing `p-3` with `pl-0 pr-3 pt-3` (and explicit `pb-*`). The center preview already has horizontal padding, so `pl-3` on the right column created a double grey strip. White cards now align flush to the column edge on the left.
- [2026-05-14] **Published visibility dropdown (`RightPanel.tsx` > `PublishedOverviewSection` + `VisibilityDropdown`):** Replaced the small teal/grey toggle switch with a full-width **dropdown selector**. Trigger shows a Lucide icon (Globe for Public, LockKeyhole for Private) + label + ChevronDown, styled as `rounded-lg border border-primary-400`. Popover lists two rows with icon, bold label, and description subtitle: **Public** ("Live at trust.mediacore.com") and **Private** ("Hidden from visitors"). Selecting the opposite state fires the existing unpublish/republish confirmation modals (no optimistic switch). Title row sits above the dropdown (Trust Center name + kebab). Old **`PublishedVisitorLocaleSwitch`** component removed.
- [2026-05-14] **Draft / Published tab status dots (`RightPanel.tsx` > `DesignerWorkspaceTabList`):** A 6px circle sits left of each tab label. **Draft:** `--color-designer-draft-indicator` (amber) when `state.drafts.length > 0`, else **`primary-400`** gray. **Published:** **`brand-400`** when any `LANGUAGE_MENU` locale has `localeLive`, else gray. Matches “active draft” and “visitor-live published” semantics used elsewhere in the designer.
- [2026-05-14] **Designer preview area matches right panel background:** Removed `border-l` from `RightPanel` root so there is no vertical line between the preview and the sidebar. Changed Trust Center preview wrapper background from `bg-primary-200` to `bg-primary-100` in designer mode (standalone public page keeps `bg-primary-200`) so both the preview and right panel share the same grey. **Top inset:** spacer above `StickyNav` is **`h-3`** (12px) to match **`RightPanel`** first-stack **`p-3`**, so the Mediacore bar lines up with the **Draft/Published** white card. **Horizontal:** designer `StickyNav` sits in the same **`DESIGNER_PREVIEW_EDGE_PAD_CLASS`** + **`DESIGNER_PREVIEW_MAX_WIDTH_CLASS`** shell as the white Trust Center card (`designerLayout.ts`) with **`rounded-t-lg`** so the bar shares the card column width and reads as one block with the preview.
- [2026-05-14] **Draft pencil icons after unpublish (`TrustCenterContent.tsx`, `RightPanel.tsx`):** Changed the gating condition from "no locale has **ever** been published" (`localeEverPublished`) to "no locale is **currently visitor-live**" (`localeLive`). Now when a user unpublishes their Trust Center (toggles off), the draft preview shows hover pencil overlays on each section AND the Section Layout rows in the right panel show pencil icons. Once any locale goes visitor-live again, pencils hide and edits route through the Published "Edit Live Content" flow.
- [2026-05-14] **Toolbar breadcrumb + centered preview title (`DesignerStagingToolbar.tsx`, `DesignerPreviewTitleBar.tsx`, `DesignerPage.tsx`):** Full-width staging toolbar uses a **two-column grid** (`minmax(0,1fr)` + fixed px from `constants/designerLayout.ts`, same value as `RightPanel` width) so the right toolbar actions sit above the settings column. The preview column uses **`1fr | auto | 1fr`** so the title stays **geometrically centered** in the preview width while the breadcrumb stays left. **`DesignerPreviewTitleBar`:** single line (**`text-sm font-medium`**): active draft **name** when a draft matches **`activeDraftId`**, otherwise **Draft View** or **Published View** using the same rule as the breadcrumb (**`workspaceTab === 'draft'`** or **`previewMode === 'draft'`**). Breadcrumb copy: **`Trust Center Editor > Draft · Autosaved {time}`** (or just **`> Published`** when on Published tab), **`text-xs`**; current step **`font-medium text-primary-800`**; autosave after a `·` separator in **`text-primary-500`**. Toolbar shell uses **`h-12`** (single-line center). `DesignerPreviewTitleBar` is only rendered inside the toolbar (no second strip under it). Shared width constant: **`DESIGNER_RIGHT_PANEL_WIDTH_PX`** (360).
- [2026-05-13] **Published snapshot configuration peek (`RightPanel.tsx`, `PublishedSnapshot`):** When the Active Trust Center row is expanded, the configuration block under Live URL no longer uses a plain "View more" text control alone. It shows a **faded preview** of the same rows (`opacity-40`, clipped height, gradient fade into the card `primary-100` background). The peek region is one **click target** (pointer cursor, light hover wash, focus ring). On **hover**, a small **Show all** pill with chevron appears. **Click** expands the full list; **Show less** collapses back. The decorative peek list is `aria-hidden` so assistive tech does not read duplicate content.
- [2026-05-13] **Draft Change Log bullet peek (`RightPanel.tsx`, `DraftRow`):** When there are **two or more** layout changes, the bullet list defaults to a **single-line peek** (`max-h-6`, faded list, gradient, same hover **Show all** pill and full-surface expand button as the published snapshot). **Show less** returns to peek. **0 changes** and **1 change** skip the peek (empty line or full single row with revert). Whenever the diff signature changes, the list **collapses back to peek** so the card stays compact after edits. Auto-scroll to the latest bullet runs only when the list is **expanded**.
- [2026-05-13] **Full-width toolbar + breadcrumbs (`DesignerStagingToolbar.tsx`, `DesignerPage.tsx`):** Toolbar now spans full width above both center preview and right panel (moved out of the center-only column in `DesignerPage`). Left side shows a short breadcrumb (see 2026-05-14 for current **`Trust Center Editor > Draft`** / **`Trust Center Editor > Published`** pattern and title placement). Right side has three controls: **Preview As...** (segment popover, relabeled from the former split control), **Open in new tab** (icon button), **Publish Live URL** (brand-colored button with minimal confirm modal). The old center Draft/Published toggle and status line are removed from the toolbar. `DraftPreviewToolbarControls` import is no longer used by the toolbar (segment state moved inline).
- [2026-05-13] **Published tab card layout + simplified snapshot:** Published tab now uses the same **two-card layout** as Draft (bg-primary-100 panel, rounded-lg white cards). Card 1: tabs + Active TC overview (toggle row, Live URL, NDA, Details). Card 2: Edit Active Content accordion. **`PublishedSnapshot`** no longer has peek/gradient/Show all. Three always-visible flat rows: **Live URL:** (teal link + copy), **NDA:** (Manage NDAs link + external icon), **Details:** (View All + chevron toggle, opens full config list). Toolbar CTA changes to **Share Live URL** (with Share2 icon) when on Published tab.
- [2026-05-13] **Right panel card containers (`RightPanel.tsx`):** Right panel background changed from `bg-white` to **`bg-primary-100`** (light grey). Content is wrapped in two white cards with **`rounded-lg`** (8px) + `border-primary-400`: (1) Top card: Draft/Published tabs + flat metadata rows. (2) Bottom card: all editor accordions (Section Layout, Public View, Brand Settings, Conveyor AI, Imagery, Localization) in one scrollable card. Cards have `p-3` outer spacing.
- [2026-05-13] **Draft panel flat header (`RightPanel.tsx`, `DraftStagingSection`):** Replaced the old card-in-card layout ("Your Draft" header + bordered DraftRow card) with a **flat definition-list** directly under the Draft/Published tabs. Three rows on white: **Draft Name:** (click to rename, vertical kebab with Rename / Open preview / Delete), **Share Preview:** (teal link + copy icon), **Change Log:** (count label + ChevronDown toggle). Bullet list below uses the same peek/expand behavior. **"Your Draft" header and `PublishDropdownButton`** removed from the right panel (publish action stays in the top staging toolbar only). `DraftStagingSectionWithDraft` and `DraftRow` merged into `DraftStagingSection`. Empty state (no draft) shows the same rows with "No active draft" placeholder. Tab underline changed from `bg-primary-800` (navy) to **`bg-brand-400`** (teal). Changelog peek gradient changed from `from-primary-100` to **`from-white`** to match white panel background.
- [2026-05-13] **Trust Center banner visibility (`trust-center-banner`):** Section Layout **Trust Center imagery** row eye toggles the wide hero **`HeaderBanner`** in the designer preview (not on standalone public `/trust-center`, which still shows full content). Key `TRUST_CENTER_BANNER_VISIBILITY_ID` in `layoutSectionOrder.ts` with default **on** in `migrateSectionVisibility`. **`toggleSection`** in `DesignerContext` now flips with **visible = value !== false** so the first click hides even when the key was previously missing. **`draftDiff`** compares this flag (and `company-profile` / `quick-links`) against published, not only `sectionOrder` layout ids.
- [2026-05-11] **Draft "Previewing as" controls moved to `DesignerStagingToolbar`:** The blue floating `PreviewAsBar` at the bottom of the draft preview was removed so the center column gains full height. Segment selector and "Open in new tab" (public `/trust-center` full page) live in the top staging toolbar on the right when the Draft tab has a draft. Autosaved time moved inline next to the left status line (`Unpublished changes` / `Draft: No unpublished changes`). Published mode still uses the green floating `PublishedViewBar` at the bottom. New files: `constants/draftPreviewSegment.ts`, `DraftPreviewToolbarControls.tsx`, `DraftPreviewSegmentPopover.tsx`.
- [2026-05-11] **Published live preview in staging toolbar:** When visitor-live and Published tab, **`PublishedLiveToolbarControls`** shows **`View: {segment}`** (e.g. `View: External - Approved`) + open-in-new-tab only (no Share). **Secondary outline:** `border-primary-300`, **`bg-white`**, **`text-primary-700`**, same hover and focus pattern as **`DraftPreviewToolbarControls`**. Replaced floating **`PublishedViewBar`**. Left status: **Published Trust Center · Visitor live**.
- [2026-05-14] **`PublishConfirmModal` (go live, `RightPanel.tsx`):** Title **Publish Draft to Live URL?** Body line: **The changes below will be published to your live URL** with **trust.mediacore.com** in **`text-link-400`**, then **and be visible to visitors.** Draft preview-only path copy unchanged.
- [2026-05-14] **Draft-tab publish CTA when already live (`DesignerStagingToolbar.tsx`):** On the **Draft** workspace tab, if at least one draft exists **and** any locale is visitor-live (`isCurrentlyLive`), the primary button label is **Publish Draft**. When nothing is visitor-live yet, it stays **Publish Live URL**. `aria-label`: publish draft to update the live Trust Center vs publish Trust Center to the live URL.
- [2026-05-14] **Published full-page preview URL:** From the **Published** workspace tab, **View as segment** (new tab) uses **`/trust-center?publishedPreview=1`**: same visitor snapshot as plain **`/trust-center`** (`getPublishedPresentation`), blue **`DraftPreviewFloatingBar`** only, **no** **`DraftFullPagePreviewBanner`**. Draft tab still uses **`?draftPreview=1`** (draft mirror + yellow banner + bar). **`PublishedLiveToolbarControls`** new-tab opens **`publishedPreview=1`** for the same chrome.
- [2026-05-11] **Full-page draft preview URL:** Opening **Preview in a new tab** from the staging toolbar goes to `/trust-center?draftPreview=1`. That route renders draft-shaped Trust Center content (`getDesignerTrustCenterPresentation`) and the blue **`DraftPreviewFloatingBar`** at the bottom. Plain `/trust-center` stays published-only. Each new browser tab loads a fresh `DesignerProvider` state (prototype does not persist draft edits across tabs).
- [2026-05-11] **Staging toolbar density:** Draft preview uses a single **rounded-lg split control**: left opens segment popover (`Preview: {segment}`), right is icon-only new tab (`title` / `aria-label`: "Preview in a new tab"). Wrapped in one border so it matches rectangular control language vs the center Draft/Published toggle. Status line uses lighter typography (`font-normal`, softer grays).
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

- [2026-05-14] **`--color-designer-draft-indicator`**: `#ca8a04` (amber). Used for the “has active draft” dot on Draft/Published tabs so it reads as work-in-progress and stays distinct from live teal (`brand-400`).
- [2026-05-14] **`--color-draft-preview-banner-bg`**: `#fdf4e1`. Light yellow strip for **`DraftFullPagePreviewBanner`** on **`/trust-center?draftPreview=1`**. Tailwind utility **`bg-draft-preview-banner-bg`**.
- [2026-05-15] **`--shadow-staging-toolbar`:** **`DesignerStagingToolbar`** uses **`shadow-staging-toolbar`**. **May 2026:** reduced from three stacked layers to **hairline + one light drop**: `0 1px 0 rgba(32,65,86,0.06)` and `0 2px 8px -3px rgba(32,65,86,0.07)` so the strip still lifts slightly off the Mediacore bar without a heavy shadow.
- [2026-05-11] **Designer preview scroll:** **`DesignerPage`** center column is **`overflow-hidden`**; **`TrustCenterContent`** uses a **`flex flex-col`** shell with the **`h-6`** spacer + **`StickyNav`** as **`shrink-0`** (nav uses **`useViewportSticky={false}`**, no `sticky`). Only the **inner** region below the nav uses **`overflow-y-auto`**, so the Mediacore bar stays fixed while the white Trust Center card scrolls. Standalone **`/trust-center`** still scrolls the full page and keeps **`StickyNav`** **`sticky top-0`**.
- [2026-05-11] **`--color-preview-as-bar-bg`** (#0569CB), **`--color-preview-as-bar-pill`** (#0052B1). Blue draft preview floating bar on `/trust-center?draftPreview=1` (matches former designer `PreviewAsBar`). Added because no existing primary/link token matched those blues.

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

- [2026-05-14] **Draft / Published top card clipped kebab menus (`RightPanel.tsx`):** The white wrapper around tabs + `DraftStagingSection` / `PublishedOverviewSection` used **`overflow-hidden`** with **`rounded-lg`**, which clipped absolutely positioned dropdowns at the card bottom. Removed **`overflow-hidden`** from those two top cards only (kept **`rounded-lg border`**). Modals in the file already use **`createPortal(..., document.body)`**; inline menus rely on escaping the card bounds.

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
