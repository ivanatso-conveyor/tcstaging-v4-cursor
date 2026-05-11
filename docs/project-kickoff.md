# Project kickoff: Trust Center Staging

This document gives Cursor context for the next phase of work on the Mediacore Trust Center prototype. Read this first, then pair it with `MEMORY.md`, `.cursorrules`, and `docs/design-system-audit.md`.

## What we are building, in one sentence

A **Draft vs Published** ("staging") experience for the Trust Center so admins can safely make changes, preview exactly what customers will see, and only go live with a deliberate publish action.

## Why this matters

Today, every change an admin makes in the Trust Center Designer autosaves straight to the live, customer-facing site. Customers have told us they are nervous about this and want a way to:

1. **Safety**: avoid half-finished or incorrect content appearing to visitors.
2. **Experimentation**: try bigger changes (new layouts, branding, announcements, new features) without risk.
3. **Review and collaboration**: get internal review before anything goes public.
4. **Confidence**: see exactly what customers will see before publishing.
5. **Efficiency**: keep a single source of truth across Trust Center and Questionnaire automation.

## The user story to design against

> As a Trust Center Administrator, I want to freely make changes to my Trust Center, preview exactly what customers would see, and only publish those changes when I am confident they are ready, without impacting live visitors or other user workflows.

## Mental model to hold in your head

- The **Knowledge Library** (documents and curated Q&As) is the single source of truth for security content. It stays globally live.
- The **Trust Center** is a curated, publishable *view* of that content.
- A Trust Center has two states:
  - **Draft**: what the admin is editing and previewing.
  - **Published**: what customers see.
- **Autosave stays.** After first publish, autosave writes to Draft instead of to Published.
- **Publishing is a deliberate action** taken by an admin.

## Three options we are considering

### Option 1, best case
Stage Trust Center native content **and** Trust-Center-facing settings on Documents and Q&As (visibility, ordering, folder, featured, badge and product associations). Document and Q&A *content* stays live. Highest customer value, highest engineering cost.

### Option 2, simpler alternative
Stage only Trust Center native content (quick summary, badges, philosophy, subprocessors, Trusted By, branding, announcements). Documents and Q&As behave exactly as they do today. Faster to ship, but a fuzzier mental model about what is and is not staged.

### Option 3, MVP in under two weeks (recommended starting point)
Stage the obviously "presentation" stuff only:
- Layout
- Colors
- Visibility of different layouts
- Agent enablement
- Logo and cover images
- Fonts

Everything that is "content" stays live. This gives us a clean edge between staged and live, minimal eng cost, and a foundation to progressively add more "stageable modules" later (for example, a document section that opts in to draft mode).

Loom demo of the MVP idea: https://www.loom.com/share/e8081aa2b8ec4951b5324a68052e37f0

## What this prototype needs to show

Start with **Option 3** in the prototype, because it maps cleanly onto the Designer we already have and the existing `DesignerContext` persisted state.

At minimum the prototype should demonstrate:

1. A clear **Draft** state for layout, colors, fonts, logo and cover images, agent enablement, and layout visibility (Modern Landing vs Simple form).
2. A **"You have unpublished changes"** message somewhere visible in the designer shell.
3. A **Preview** affordance that shows the draft exactly as a visitor would see it.
4. A deliberate **Publish** action (button plus confirmation) that moves Draft to Published.
5. A **Discard draft** action that reverts to the last published version, with a confirmation message.
6. Copy that clearly explains what is staged and what is live. This is the single biggest UX risk, so wording matters.

## Open questions to resolve while designing

- How do we handle scheduled announcements in staging mode?
- If a user tries to discard, do we always revert to the last published version? Current lean: yes, with confirmation.
- After the first publish, should users still be able to "save directly to published" the way autosave does today, or must every change go through Draft then Publish? Watch for the first-publish transition (1 draft becoming 0 drafts).
- Do we support **multiple drafts**?
  - Pro: multiple people can work at once, drafts can act as proposals in an approval workflow.
  - Con: drafts go stale, naming and organizing them is its own UX problem, the mental model shifts from "staging area" to "branching".
- Can users preview Published while a draft is in progress?

## Competitive context

- **SafeBase**: no real staging today. Publishing a change is effectively permanent ("reach out to support to unpublish"). They do have a review step for announcement-style updates.
- **Vanta**: has a separate Publish action, surfaces an "unpublished changes" indicator. Closest to what we want.

## How this connects to the existing prototype

Reuse, do not rebuild:

- **Tokens**: everything lives in `trust-center/src/index.css` `@theme` block. Customer-facing brand defaults are in `trust-center/src/constants/brandDefaults.ts` as `TRUST_CENTER_DEFAULT_PRIMARY` and `TRUST_CENTER_DEFAULT_ACCENT`. Do not add a parallel color file.
- **Designer state**: `DesignerContext` already persists `savedQuickLinks`, `savedCompanyProfile`, and `savedTrustCenterImagery`. Staging state (Draft vs Published, last-published snapshot, dirty flag) should live here too.
- **Preview**: we already have a preview renderer for different visitor types. The "preview my draft" flow should extend that, not replace it.
- **Modals**: use the existing `TrustCenterModalBackdrop` pattern for Publish and Discard confirmation modals.
- **Icons**: Google Material Symbols Rounded via CDN, per `MEMORY.md`. Font Awesome only for right-panel Customize Layout row controls.
- **Font**: Neue Montreal, then Inter, then system UI. Do not add new font packages.
- **Living style guide**: `/design-system` route. Add any new tokens or components to `DesignSystemPage.tsx` when you introduce them.

## Suggested first slices of work

1. **State**: add a `publishedSnapshot` and `isDirty` flag to `DesignerContext`. Wire autosave so that after first publish it writes to Draft only.
2. **Indicator**: add an "Unpublished changes" pill near the top of the designer shell when `isDirty` is true.
3. **Publish button**: primary action in the top bar, opens a confirmation modal summarizing what will go live.
4. **Discard draft**: secondary action, opens a confirmation modal, reverts state to `publishedSnapshot`.
5. **Preview draft**: extend the existing preview to render from Draft state and label it clearly as "Draft preview".
6. **Copy pass**: write UI strings that name exactly which parts are staged (layout, colors, fonts, logo, cover images, agent enablement, layout visibility) and which parts are live (documents, Q&As, announcements content).

## Ground rules for this phase

- Follow `.cursorrules`. Do not introduce new hex values; use existing tokens. Announce any new token you need before creating it.
- Ask before installing new packages.
- Beginner-friendly explanations with Figma terminology (frames, auto-layout, variants) where it helps.
- No em dashes.
- Reference the Figma frame in component comment headers.
- Update `MEMORY.md` when a decision is made. Update `docs/design-system-audit.md` if a token is added or changed. Update `DesignSystemPage.tsx` when visual tokens change.

## Source

Notion brief: "Trust Center Staging" (https://www.notion.so/Trust-Center-Staging-2cbbc34a95a18093a043e4906a17bab6)
