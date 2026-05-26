/**
 * Designer right panel — Trust Center Editor workspace, staging controls, and published summary.
 *
 * **Product / UX spec (full annotated mockups):** open from repo root
 * [`docs/right-panel-spec.html`](../../../../docs/right-panel-spec.html) in a browser.
 * (Path from this file: `../../../../docs/right-panel-spec.html`.)
 *
 * ## Three states (from that spec)
 *
 * **State 1 — No draft yet**
 * 1. Panel framing: prefer short “Staging” title + one explainer sentence (not duplicate Draft/Published; top strip owns view switching).
 * 2. Single empty-state card, primary **Create draft**; after drafts exist, list rows with view / edit / delete instead of a dropdown.
 * 3. (Implementation) Public View, Brand Settings, Localization, and Trust Center features / layout are hidden until the first draft exists; only the staging empty state is shown before then.
 * 4. Secondary **Open published** as a quiet link, not competing with the primary CTA.
 *
 * **State 2 — Editing a draft**
 * 1. Title reflects **what the user is doing** (e.g. editing draft); overflow (e.g. open published) in a menu.
 * 2. Status pill + timestamp instead of long intro copy where possible.
 * 3. Publish from the top staging toolbar; staging card has no duplicate publish/discard row.
 * 4. Editable areas as **accordions**; spec suggests moving preview language to the **center preview toolbar** next to visitor-type (prototype may still keep locale in-panel until that ships).
 *
 * **State 3 — Published view**
 * 1. Title **Published**; no duplicate segmented control vs top strip.
 * 2. One **status card**: live pill, URL, last-published time, Share — instead of scattered key-value rows only.
 * 3. Primary **Edit in draft** (confirm live here, edit in draft).
 * 4. Long read-only section list tucked into a collapsed **What is published** accordion if still needed.
 *
 * ## Before vs after (at a glance, from spec table)
 *
 * | Area | Proposed direction |
 * |------|-------------------|
 * | View switcher | Top strip only, single source of truth |
 * | No-draft | Empty card + Create draft; drop clutter |
 * | Draft actions | Staging card: drafts list + link; publish in top toolbar |
 * | Published info | Status card + Edit in draft + optional accordion |
 * | Language | Spec: center preview toolbar; codebase may differ until wired |
 * | Sections | Prefer spacing/headings; cards for grouped units (e.g. thumbnails) |
 * | Labels | Title Case headings; caps mainly for status pills |
 */

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { computeDraftDiff } from '../../utils/draftDiff';
import TrustCenterModalBackdrop from '../TrustCenter/TrustCenterModalBackdrop';
import { PublishLiveSuccessToast, PUBLISH_LIVE_SUCCESS_TOAST_DURATION_MS } from './PublishLiveSuccessToast';
import { UnpublishTrustCenterToast } from './UnpublishTrustCenterToast';
import { DESIGNER_FEEDBACK_TOAST_DURATION_MS } from '../../constants/designerFeedbackToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLink } from '@fortawesome/free-solid-svg-icons';
import { getPublishedPresentation, useDesigner } from '../../context/DesignerContext';
import type { StageablePresentation } from '../../types/staging';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import {
  LAYOUT_SECTION_IDS,
  LAYOUT_SECTION_LABELS,
  TRUST_CENTER_BANNER_VISIBILITY_ID,
  type LayoutSectionId,
} from '../../constants/layoutSectionOrder';
import { formatTrustCenterName } from '../../constants/designerDraftAuthor';
import { DESIGNER_RIGHT_PANEL_WIDTH_PX } from '../../constants/designerLayout';
import { DEFAULT_TRUST_CENTER_PROFILE_DISPLAY } from '../../constants/trustCenterProfileUrl';
import {
  LANGUAGE_MENU,
  PRIMARY_TRUST_CENTER_LOCALE,
  type PreviewLocale,
} from '../../constants/previewLocale';
import { uiAssets } from '../../constants/uiAssets';
import { icons } from '../../constants/icons';
import { ChevronDown, ChevronUp, Copy, ExternalLink, EyeOff, Globe, GripVertical, ImageIcon, Info, MoreVertical, Pencil, Plus, TriangleAlert, Undo2, X } from 'lucide-react';
import { normalizeTrustCenterImagery, type SavedTrustCenterImagery } from '../../utils/trustCenterImageryMerge';
import CompanyProfileModal from '../TrustCenter/CompanyProfileModal';
import QuickLinksSettingsModal from '../TrustCenter/QuickLinksSettingsModal';
import TrustCenterImageryModal from '../TrustCenter/TrustCenterImageryModal';
import BadgesSettingsModal from '../TrustCenter/BadgesSettingsModal';
import QuickSummarySettingsModal from '../TrustCenter/QuickSummarySettingsModal';
import FeaturedDocumentsSettingsModal from '../TrustCenter/FeaturedDocumentsSettingsModal';
import TrustedBySettingsModal from '../TrustCenter/TrustedBySettingsModal';
import PhilosophySettingsModal from '../TrustCenter/PhilosophySettingsModal';
import ComingSoonSettingsModal from '../TrustCenter/ComingSoonSettingsModal';
import AddSubprocessorModal from '../TrustCenter/AddSubprocessorModal';
import ManageSubprocessorsModal from '../TrustCenter/ManageSubprocessorsModal';
import ManageAnnouncementsModal from '../TrustCenter/ManageAnnouncementsModal';
import ManageVideoResourcesModal from '../TrustCenter/ManageVideoResourcesModal';
import ManageProductsModal from '../TrustCenter/ManageProductsModal';
import AddProductModal from '../TrustCenter/AddProductModal';
import NewVideoResourceModal from '../TrustCenter/NewVideoResourceModal';
import DocumentsSearchModal from '../TrustCenter/DocumentsSearchModal';
import NewAnnouncementModal from '../TrustCenter/NewAnnouncementModal';
import ShareViaInviteModal from '../TrustCenter/ShareViaInviteModal';
import { ReviewingProductFilterProvider } from '../../contexts/ReviewingProductFilterContext';
import TrustCenterAgentConfigurationSection from './TrustCenterAgentConfigurationSection';
import PublishedPublishGuideCard from './PublishedPublishGuideCard';

/**
 * Draftable Content accordion (Imagery / Branding shortcuts + link to Published live edits).
 * Set to `true` to show it again. Kept off temporarily (see project memory).
 */
const SHOW_DRAFTABLE_CONTENT_ACCORDION = false;

type RightPanelProps = {
  workspaceTab: 'draft' | 'published';
  onWorkspaceTabChange: (tab: 'draft' | 'published') => void;
};

export default function RightPanel({ workspaceTab, onWorkspaceTabChange }: RightPanelProps) {
  const {
    state,
    setPublicView,
    setAccentColor,
    setPrimaryColor,
    setFontFamily,
    toggleSection,
    reorderSections,
    setPreviewMode,
    createDraft,
    registerOpenDraftWorkspaceHandler,
  } = useDesigner();

  useEffect(() => {
    registerOpenDraftWorkspaceHandler(() => {
      onWorkspaceTabChange('draft');
      if (state.drafts.length === 0) {
        createDraft();
      } else {
        setPreviewMode('draft');
      }
    });
    return () => registerOpenDraftWorkspaceHandler(null);
  }, [state.drafts.length, createDraft, setPreviewMode, registerOpenDraftWorkspaceHandler]);

  // When drafts are cleared, stay on draft tab (no longer force to published).

  const prevPublishedRef = useRef(state.publishedSnapshot);
  const prevDraftsLenForTabSyncRef = useRef(state.drafts.length);
  const anyVisitorLiveOnPublished = (snap: typeof state.publishedSnapshot) =>
    LANGUAGE_MENU.some((item) => snap.localeLive[item.locale]);

  useEffect(() => {
    const pubChanged = state.publishedSnapshot !== prevPublishedRef.current;
    if (pubChanged) {
      const prevSnap = prevPublishedRef.current;
      const wasLive = anyVisitorLiveOnPublished(prevSnap);
      const nowLive = anyVisitorLiveOnPublished(state.publishedSnapshot);
      const draftCountDecreased = state.drafts.length < prevDraftsLenForTabSyncRef.current;

      if (draftCountDecreased) {
        onWorkspaceTabChange('published');
      } else if (wasLive && !nowLive) {
        onWorkspaceTabChange('draft');
      } else if (!wasLive && nowLive) {
        onWorkspaceTabChange('published');
      }
      // Cold start / migration: snapshot ref can change with visitor-live still false for all locales.
      // Do not switch workspace tab here, so refresh stays on Draft like a user still editing before first publish.
      prevPublishedRef.current = state.publishedSnapshot;
    }
    prevDraftsLenForTabSyncRef.current = state.drafts.length;
  }, [state.publishedSnapshot, state.drafts.length, onWorkspaceTabChange]);

  // Toast: announce when a draft auto-creates from the user's first edit (drafts.length 0 -> 1).
  const prevDraftsCountRef = useRef(state.drafts.length);
  const prevVisitorLiveOnPublishedRef = useRef(anyVisitorLiveOnPublished(state.publishedSnapshot));
  const [draftStartedToast, setDraftStartedToast] = useState(false);
  useEffect(() => {
    const hasVisitorLive = anyVisitorLiveOnPublished(state.publishedSnapshot);

    if (prevDraftsCountRef.current === 0 && state.drafts.length === 1) {
      const hadVisitorLiveBefore = prevVisitorLiveOnPublishedRef.current;
      const skipDraftStartedBecauseUnpublish = hadVisitorLiveBefore && !hasVisitorLive;
      prevDraftsCountRef.current = state.drafts.length;
      prevVisitorLiveOnPublishedRef.current = hasVisitorLive;
      if (skipDraftStartedBecauseUnpublish) return undefined;
      setDraftStartedToast(true);
      const t = window.setTimeout(() => setDraftStartedToast(false), 2500);
      return () => window.clearTimeout(t);
    }

    prevDraftsCountRef.current = state.drafts.length;
    prevVisitorLiveOnPublishedRef.current = hasVisitorLive;
    return undefined;
  }, [state.drafts.length, state.publishedSnapshot]);

  const publishedForScope = getPublishedPresentation(state);
  /**
   * True when no locale on the published snapshot is currently visitor-live.
   * Enables Section Layout row pencils in draft mode when:
   *   1. Never published (fresh workspace), OR
   *   2. Previously published but now unpublished (user toggled off the live TC).
   * Once any locale is visitor-live again, pencils are hidden and edits use the
   * Published tab "Edit Live Content" flow instead.
   */
  const noPublishedTC = !LANGUAGE_MENU.some(
    (item) => publishedForScope.localeLive[item.locale],
  );

  /** Section edit modal triggered from pencil icons in the Section Layout (draft mode, no published TC). */
  const [draftEditSection, setDraftEditSection] = useState<string | null>(null);

  const [unpublishToastVisible, setUnpublishToastVisible] = useState(false);
  const [unpublishToastDraftName, setUnpublishToastDraftName] = useState('');

  const switchWorkspaceTab = (tab: 'draft' | 'published') => {
    onWorkspaceTabChange(tab);
    if (tab === 'published') {
      setPreviewMode('published');
    } else {
      setPreviewMode('draft');
    }
  };

  const handleUnpublishSuccess = (draftName: string) => {
    switchWorkspaceTab('draft');
    setUnpublishToastDraftName(draftName);
    setUnpublishToastVisible(true);
    window.setTimeout(() => setUnpublishToastVisible(false), DESIGNER_FEEDBACK_TOAST_DURATION_MS);
  };

  return (
    <>
      {draftStartedToast && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="status"
              aria-live="polite"
              style={{ animation: 'fadeInOut 2.5s ease-out forwards' }}
              className="pointer-events-none fixed left-1/2 top-16 z-[300]"
            >
              <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-primary-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden />
                Draft started
              </div>
            </div>,
            document.body,
          )
        : null}
      <UnpublishTrustCenterToast visible={unpublishToastVisible} draftName={unpublishToastDraftName} />
    <div
      className="flex h-full min-h-0 shrink-0 flex-col self-stretch bg-primary-100"
      style={{ width: DESIGNER_RIGHT_PANEL_WIDTH_PX }}
    >
      {workspaceTab === 'draft' ? (
        <>
          {/* Card 1: Draft/Published tabs + draft metadata rows — no pl: preview already has horizontal pad; avoids double grey gutter */}
          <div className="z-10 shrink-0 pb-1.5 pl-0 pr-3 pt-3">
            {/* No overflow-hidden: kebab menus in DraftStagingSection use position absolute and must paint past this card edge. */}
            <div className="rounded-lg border border-primary-400 bg-white">
              <DesignerWorkspaceTabList value={workspaceTab} onChange={switchWorkspaceTab} />
              <DraftStagingSection />
            </div>
          </div>
          {/* Card 2: All editor accordions in one scrollable card */}
          <div
            id="draft-editor-settings"
            className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-3 pl-0 pr-3 pt-0"
          >
            <div className="overflow-hidden rounded-lg border border-primary-400 bg-white">
              <CustomizeLayoutSection
                sectionOrder={state.sectionOrder}
                sectionVisibility={state.sectionVisibility}
                onToggle={toggleSection}
                reorderSections={reorderSections}
                noPublishedTC={noPublishedTC}
                onEditSection={setDraftEditSection}
              />
              <PublicViewSection publicView={state.publicView} onChange={setPublicView} />
              {SHOW_DRAFTABLE_CONTENT_ACCORDION ? (
                <DraftableContentSection onSwitchToPublished={() => switchWorkspaceTab('published')} />
              ) : null}
              <BrandSettingsSection
                accentColor={state.accentColor}
                primaryColor={state.primaryColor}
                fontFamily={state.fontFamily}
                onAccentChange={setAccentColor}
                onPrimaryChange={setPrimaryColor}
                onFontChange={setFontFamily}
              />
              <TrustCenterAgentConfigurationSection />
              <ImagerySection />
              <LocalizationSection />
            </div>
          </div>
        </>
      ) : (
        <PublishedTabContent
          workspaceTab={workspaceTab}
          switchWorkspaceTab={switchWorkspaceTab}
          onUnpublishSuccess={handleUnpublishSuccess}
        />
      )}
    </div>
    {/* Modals triggered from Section Layout pencil icons (draft mode, no published TC) */}
    {draftEditSection === 'banner' ? (
      <TrustCenterImageryModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'profile' ? (
      <CompanyProfileModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'quick-links' ? (
      <QuickLinksSettingsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'badges' ? (
      <BadgesSettingsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'find-answer' ? (
      <ReviewingProductFilterProvider>
        <DocumentsSearchModal
          initialPanelKey="documents"
          onClose={() => setDraftEditSection(null)}
        />
      </ReviewingProductFilterProvider>
    ) : draftEditSection === 'philosophy' ? (
      <PhilosophySettingsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'quick-summary' ? (
      <QuickSummarySettingsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'subprocessors' || draftEditSection === 'subprocessors-update' ? (
      <ManageSubprocessorsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'subprocessors-add' ? (
      <AddSubprocessorModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'trusted-by' ? (
      <TrustedBySettingsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'featured-documents' ? (
      <FeaturedDocumentsSettingsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'announcements' || draftEditSection === 'announcements-update' ? (
      <ManageAnnouncementsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'announcements-add' ? (
      <NewAnnouncementModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'what-we-offer-add' ? (
      <AddProductModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'what-we-offer' || draftEditSection === 'what-we-offer-update' ? (
      <ManageProductsModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'video-resources' || draftEditSection === 'video-resources-update' ? (
      <ManageVideoResourcesModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'video-resources-add' ? (
      <NewVideoResourceModal onClose={() => setDraftEditSection(null)} />
    ) : draftEditSection === 'coming-soon' ? (
      <ComingSoonSettingsModal onClose={() => setDraftEditSection(null)} />
    ) : null}
    </>
  );
}

/**
 * DesignerWorkspaceTabList
 * Draft and Published tabs for the right panel white card. Active tab shows a teal underline.
 * Each label has a small status dot: draft uses amber when at least one draft exists, gray otherwise.
 * Published uses teal (live) when any locale is visitor-live, gray otherwise.
 * Figma: Trust Center Vision HQ > Designer Page > Right Sidebar > Draft / Published tabs
 */
function DesignerWorkspaceTabList({
  value,
  onChange,
}: {
  value: 'draft' | 'published';
  onChange: (tab: 'draft' | 'published') => void;
}) {
  const { state } = useDesigner();
  const pub = getPublishedPresentation(state);
  const hasActiveDraft = state.drafts.length > 0;
  const hasActivePublished = LANGUAGE_MENU.some((item) => pub.localeLive[item.locale]);

  return (
    <div
      className="flex w-full border-b border-primary-400"
      role="tablist"
      aria-label="Designer workspace"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 'draft'}
        onClick={() => onChange('draft')}
        className={`relative flex flex-1 items-center justify-center gap-1.5 pb-2.5 pt-3 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-800/25 ${
          value === 'draft'
            ? 'text-primary-800'
            : 'text-primary-500 hover:text-primary-700'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${hasActiveDraft ? 'bg-designer-draft-indicator' : 'bg-primary-400'}`}
          aria-hidden
        />
        Draft
        {value === 'draft' ? (
          <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-brand-400" aria-hidden />
        ) : null}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'published'}
        onClick={() => onChange('published')}
        className={`relative flex flex-1 items-center justify-center gap-1.5 pb-2.5 pt-3 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-800/25 ${
          value === 'published'
            ? 'text-primary-800'
            : 'text-primary-500 hover:text-primary-700'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${hasActivePublished ? 'bg-brand-400' : 'bg-primary-400'}`}
          aria-hidden
        />
        Published
        {value === 'published' ? (
          <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-brand-400" aria-hidden />
        ) : null}
      </button>
    </div>
  );
}

/** Confirmation modal for "Publish to preview link" / publish draft to live URL with diff list and changelog input. */
export function PublishConfirmModal({
  goLive,
  onClose,
  onPublishLiveSuccess,
}: {
  goLive: boolean;
  onClose: () => void;
  /** Called after a successful **live** publish (visitor-visible URL). Not used for preview-link-only publish. */
  onPublishLiveSuccess?: () => void;
}) {
  const { state, publishActiveDraft } = useDesigner();
  const [changelogNote, setChangelogNote] = useState('');
  const activeDraft = state.drafts.find((d) => d.id === state.activeDraftId);
  const draftChanges = useMemo(() => {
    if (!activeDraft) return [];
    return computeDraftDiff(activeDraft.payload, state.publishedSnapshot);
  }, [activeDraft, state.publishedSnapshot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const title = goLive ? 'Publish Draft to Live URL?' : 'Publish to draft preview link?';
  const previewLinkOnlySubtitle =
    'Saves changes to the sharable draft preview link only. Visitor visibility is unchanged.';
  const confirmLabel = goLive ? 'Publish Live URL' : 'Publish to draft preview link';
  const PRELAUNCH_URL = 'https://pr-3348.preview.chq';
  const [linkCopied, setLinkCopied] = useState(false);
  const copyPrelaunchLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(PRELAUNCH_URL).catch(() => {});
    }
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-confirm-title"
          className="pointer-events-auto w-full max-w-md rounded-lg border border-primary-400 bg-white p-6 shadow-xl"
        >
          <h2 id="publish-confirm-title" className="mb-1 text-base font-semibold text-primary-800">
            {title}
          </h2>
          <p className="mb-4 text-xs leading-relaxed text-primary-700">
            {goLive ? (
              <>
                The changes below will be published to your live URL{' '}
                <span className="font-medium text-link-400">trust.mediacore.com</span>
                {' '}
                and be visible to visitors.
              </>
            ) : (
              previewLinkOnlySubtitle
            )}
          </p>

          {draftChanges.length > 0 ? (
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium text-primary-800">Changes in {activeDraft?.name || 'this draft'}:</p>
              <ul className="space-y-1 text-xs font-medium leading-relaxed text-primary-700">
                {draftChanges.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden />
                    <span>{entry.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mb-4 text-sm text-primary-600">No differences from the published version.</p>
          )}

          {!goLive ? (
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium text-primary-800">Share draft preview link</p>
              <div className="flex items-center gap-2 rounded-md border border-primary-400 bg-primary-100 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-xs text-primary-800">{PRELAUNCH_URL}</span>
                <button
                  type="button"
                  onClick={copyPrelaunchLink}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded border border-primary-400 bg-white px-2 py-1 text-[11px] font-medium text-primary-700 transition-colors hover:bg-primary-100"
                  aria-label="Copy pre-launch link"
                >
                  <Copy size={11} strokeWidth={2} aria-hidden />
                  {linkCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ) : null}

          <div className="mb-4">
            <label htmlFor="publish-confirm-changelog" className="mb-1.5 block text-xs font-medium text-primary-800">
              Changelog note <span className="font-normal text-primary-500">(optional)</span>
            </label>
            <textarea
              id="publish-confirm-changelog"
              className="w-full rounded border border-primary-400 px-3 py-2 text-xs text-primary-800 placeholder-primary-500 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              rows={3}
              placeholder="Describe what changed and why..."
              value={changelogNote}
              onChange={(e) => setChangelogNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded border border-primary-400 px-3 py-1.5 text-sm font-medium text-primary-800 hover:bg-primary-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded bg-brand-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
              onClick={() => {
                publishActiveDraft(changelogNote, { goLive });
                if (goLive) {
                  onPublishLiveSuccess?.();
                }
                onClose();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export { PublishLiveSuccessToast, PUBLISH_LIVE_SUCCESS_TOAST_DURATION_MS };

/**
 * Flat draft header rows directly under the Draft/Published tabs.
 * Shows Draft Name, Share Preview, and Change Log as definition-list style rows on white.
 * When no draft exists, rows show placeholder values.
 * Figma: Designer > Draft panel top bar (May 2026 flat mockup).
 */
function DraftStagingSection() {
  const { state, setPreviewMode, selectDraft, renameDraft, deleteDraft, revertDraftField, createDraft } = useDesigner();
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const draft = state.drafts[0] ?? null;

  const publishedPresentation = getPublishedPresentation(state);
  const diff = useMemo(() => {
    if (!draft) return [];
    const d = state.drafts.find((x) => x.id === draft.id);
    return d ? computeDraftDiff(d.payload, publishedPresentation) : [];
  }, [state.drafts, draft?.id, publishedPresentation]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isEditing = draft != null && editingDraftId === draft.id;

  const startRename = () => {
    if (!draft) return;
    selectDraft(draft.id);
    setMenuOpen(false);
    setEditingDraftId(draft.id);
    setEditingName(draft.name);
  };

  const onDelete = () => {
    if (!draft) return;
    setMenuOpen(false);
    if (state.drafts.length === 1 && !window.confirm('Remove this draft and return to published-only view?')) return;
    if (state.drafts.length > 1 && !window.confirm('Delete this draft? Unpublished changes on this branch will be lost.')) return;
    deleteDraft(draft.id);
  };

  const changeLogSummaryRight =
    diff.length === 0
      ? '0 changes'
      : diff.length === 1
        ? '1 Layout Change'
        : `${diff.length} Layout Changes`;

  return (
    <div className="flex flex-col rounded-b-lg bg-white px-5 py-3">
      {/* ── Draft Name row ── */}
      <div className="flex h-8 items-center justify-between gap-2">
        <span className="shrink-0 text-xs text-primary-600">Draft Name:</span>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          {draft == null ? (
            <button
              type="button"
              onClick={() => createDraft()}
              className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs font-medium text-link-400 transition-colors hover:text-link-400/80 hover:underline hover:underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link-400/30"
            >
              <Plus size={12} strokeWidth={2.5} className="shrink-0" aria-hidden />
              Create Draft
            </button>
          ) : isEditing ? (
            <input
              type="text"
              autoFocus
              className="min-w-0 flex-1 rounded border border-primary-400 bg-white px-1.5 py-0.5 text-xs font-normal text-primary-800 outline-none focus:border-link-400 focus:ring-1 focus:ring-link-400"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => {
                if (editingName.trim()) renameDraft(draft.id, editingName);
                setEditingDraftId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (editingName.trim()) renameDraft(draft.id, editingName);
                  setEditingDraftId(null);
                }
                if (e.key === 'Escape') setEditingDraftId(null);
              }}
            />
          ) : (
            <span
              className="min-w-0 cursor-text truncate text-xs font-normal text-primary-800 hover:underline hover:underline-offset-2"
              role="button"
              tabIndex={0}
              title="Click to rename"
              onClick={() => {
                setEditingDraftId(draft.id);
                setEditingName(draft.name);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setEditingDraftId(draft.id);
                  setEditingName(draft.name);
                }
              }}
            >
              {draft.name}
            </span>
          )}
          {/* Kebab — same menu: Rename, Open preview, Delete */}
          {draft != null ? (
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label={`More actions for ${draft.name}`}
                className="rounded p-0.5 text-primary-600 transition-colors hover:bg-primary-100 hover:text-primary-900"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <MoreVertical size={14} strokeWidth={2} aria-hidden />
              </button>
              {menuOpen ? (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-[180px] overflow-hidden rounded-md border border-primary-400 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-primary-800 hover:bg-primary-100"
                      onClick={startRename}
                    >
                      Rename
                    </button>
                    <a
                      href={`${import.meta.env.BASE_URL}trust-center`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-primary-800 hover:bg-primary-100"
                      onClick={() => {
                        setMenuOpen(false);
                        selectDraft(draft.id);
                        setPreviewMode('draft');
                      }}
                    >
                      Open preview in new tab
                    </a>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-700 hover:bg-primary-100"
                      onClick={onDelete}
                    >
                      Delete draft
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Share Preview row ── */}
      <div className="flex h-8 items-center justify-between gap-2">
        <span className="shrink-0 text-xs text-primary-600">Share Preview:</span>
        {draft != null ? (
          <a
            href="https://pr-3348.preview.chq"
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1 truncate text-xs text-link-400 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText('https://pr-3348.preview.chq').catch(() => {});
              }
              window.open('https://pr-3348.preview.chq', '_blank', 'noreferrer');
            }}
          >
            pr-3348.preview.chq
            <Copy size={12} strokeWidth={2} className="shrink-0" aria-hidden />
          </a>
        ) : (
          <span className="shrink-0 text-xs text-primary-500">No sharable draft</span>
        )}
      </div>

      {/* ── Change Log row ── */}
      <div className="flex h-8 items-center justify-between gap-2">
        <span className="shrink-0 text-xs text-primary-600">Change Log:</span>
        {draft != null ? (
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-xs font-normal text-primary-800"
            aria-expanded={detailOpen}
            aria-label={`${changeLogSummaryRight}. Click to ${detailOpen ? 'collapse' : 'expand'}.`}
            onClick={() => setDetailOpen((v) => !v)}
          >
            {changeLogSummaryRight}
            <ChevronDown
              size={14}
              strokeWidth={2}
              className={`shrink-0 text-primary-500 transition-transform duration-150 ${detailOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        ) : (
          <span className="text-xs text-primary-500">0 changes</span>
        )}
      </div>

      {/* ── Bullet list (change log details, shown when accordion is open) ── */}
      {draft != null && detailOpen ? (
        <div className="ml-1 pb-1">
          {diff.length === 0 ? (
            <div className="flex items-start gap-2 text-[11px] leading-[15px] text-primary-700" role="status">
              <span aria-hidden className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-primary-700" />
              <span>No Changes</span>
            </div>
          ) : (
            <ul className="space-y-1 text-[11px] leading-[15px] text-primary-700" role="list">
              {diff.map((entry) => (
                <li key={entry.id} className="group/revert flex items-start gap-2">
                  <span aria-hidden className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-primary-700" />
                  <span className="min-w-0 flex-1">{entry.label}</span>
                  <button
                    type="button"
                    className="shrink-0 rounded p-0.5 text-primary-600 opacity-0 transition-opacity group-hover/revert:opacity-100 hover:bg-primary-200 hover:text-primary-900 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-link-400/40"
                    title="Revert this change"
                    aria-label={`Revert: ${entry.label}`}
                    onClick={() => revertDraftField(entry.id)}
                  >
                    <Undo2 size={12} strokeWidth={2} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}


/**
 * VisibilityDropdown
 * A select-style control that shows "Public" (visitor-live) or "Private" (hidden).
 * Selecting the opposite value fires the appropriate callback so the parent can open a confirmation modal.
 * Figma: Trust Center Vision HQ > Designer > Published > Visibility selector
 */
function VisibilityDropdown({
  isPublic,
  onSelectPublic,
  onSelectPrivate,
}: {
  isPublic: boolean;
  onSelectPublic: () => void;
  onSelectPrivate: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: 'public' | 'private') => {
    setOpen(false);
    if (value === 'public' && !isPublic) onSelectPublic();
    if (value === 'private' && isPublic) onSelectPrivate();
  };

  return (
    <div className="relative mt-3">
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Visibility: ${isPublic ? 'Public' : 'Unpublished'}`}
        className="flex w-full items-center gap-2.5 rounded-lg border border-primary-400 bg-white px-3 py-2.5 text-left transition-colors hover:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-800/25"
        onClick={() => setOpen((v) => !v)}
      >
        {isPublic ? (
          <Globe size={16} strokeWidth={2} className="shrink-0 text-brand-400" aria-hidden />
        ) : (
          <EyeOff size={16} strokeWidth={2} className="shrink-0 text-primary-500" aria-hidden />
        )}
        <span className="flex-1 text-xs font-medium text-primary-800">
          {isPublic ? 'Public' : 'Unpublished'}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`shrink-0 text-primary-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {/* Popover */}
      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            aria-label="Trust Center visibility"
            className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-primary-400 bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              role="option"
              aria-selected={isPublic}
              className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-primary-100 ${isPublic ? 'bg-primary-100' : ''}`}
              onClick={() => handleSelect('public')}
            >
              <Globe size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-400" aria-hidden />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary-800">Public</span>
                <span className="text-[10px] leading-tight text-primary-600">Visible to visitors at trust.mediacore.com</span>
              </div>
            </button>
            <button
              type="button"
              role="option"
              aria-selected={!isPublic}
              className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-primary-100 ${!isPublic ? 'bg-primary-100' : ''}`}
              onClick={() => handleSelect('private')}
            >
              <EyeOff size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-primary-500" aria-hidden />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary-800">Unpublished</span>
                <span className="text-[10px] leading-tight text-primary-600">Branded URL deactivated, not visible to visitors</span>
              </div>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function formatLanguageList(labels: string[]): string {
  if (labels.length === 0) return '—';
  if (labels.length <= 2) return labels.join(', ');
  return `${labels.length} languages`;
}

/**
 * Read-only key/value rows for the published Trust Center snapshot (public view, languages, brand, changelog).
 * Figma: Trust Center Vision HQ > Designer > Published > Active Trust Center card (configuration list)
 */
function PublishedSnapshotConfigDl({
  pub,
  liveLocaleLabels,
  changelogNote,
  className,
  id,
  ariaHidden,
}: {
  pub: StageablePresentation;
  liveLocaleLabels: string[];
  changelogNote?: string;
  className?: string;
  id?: string;
  ariaHidden?: boolean;
}) {
  return (
    <dl id={id} aria-hidden={ariaHidden} className={className}>
      <div className="flex items-start justify-between gap-3">
        <dt className="shrink-0 text-primary-600">Public view</dt>
        <dd className="text-right font-medium text-primary-800">
          {pub.publicView === 'modern' ? 'Modern landing' : 'Simple form'}
        </dd>
      </div>
      <div className="flex items-start justify-between gap-3">
        <dt className="shrink-0 text-primary-600">Language</dt>
        <dd
          className="text-right font-medium text-primary-800"
          title={liveLocaleLabels.join(', ')}
        >
          {formatLanguageList(liveLocaleLabels)}
        </dd>
      </div>
      <div className="flex items-start justify-between gap-3">
        <dt className="shrink-0 text-primary-600">Accent</dt>
        <dd className="flex items-center gap-2">
          <span
            className="h-5 w-5 shrink-0 rounded border border-primary-400 shadow-sm"
            style={{ backgroundColor: pub.accentColor }}
            title={pub.accentColor}
          />
          <span className="font-mono text-[10px] text-primary-700">{pub.accentColor}</span>
        </dd>
      </div>
      <div className="flex items-start justify-between gap-3">
        <dt className="shrink-0 text-primary-600">Primary</dt>
        <dd className="flex items-center gap-2">
          <span
            className="h-5 w-5 shrink-0 rounded border border-primary-400 shadow-sm"
            style={{ backgroundColor: pub.primaryColor }}
            title={pub.primaryColor}
          />
          <span className="font-mono text-[10px] text-primary-700">{pub.primaryColor}</span>
        </dd>
      </div>
      <div className="flex items-start justify-between gap-3">
        <dt className="shrink-0 text-primary-600">Font</dt>
        <dd className="text-right font-medium text-primary-800">{pub.fontFamily || '—'}</dd>
      </div>
      {changelogNote ? (
        <div className="border-t border-primary-300 pt-2">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-600">Changelog</p>
          <p className="text-xs leading-relaxed text-primary-700">{changelogNote}</p>
        </div>
      ) : null}
    </dl>
  );
}

/**
 * Published configuration rows under the Active Trust Center header row.
 * Always visible: Live URL, NDA. Collapsible: Details (View All toggle shows full config).
 * Figma: Trust Center Vision HQ > Designer > Published > Active Trust Center card (May 2026 flat mockup)
 */
function PublishedSnapshot({
  pub,
  liveLocaleLabels,
  changelogNote,
  isVisitorLive,
}: {
  pub: StageablePresentation;
  liveLocaleLabels: string[];
  changelogNote?: string;
  isVisitorLive: boolean;
}) {
  const url = 'https://trust.mediacore.com';
  const urlDisplay = 'trust.mediacore.com';
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2.5 pr-3 pt-3">
      {/* Branded URL row: shows as "Live URL" when public, "Branded URL" (inactive style) when unpublished */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="shrink-0 text-primary-600">{isVisitorLive ? 'Live URL:' : 'Branded URL:'}</span>
        <div className="min-w-0 flex-1 flex justify-end">
          {isVisitorLive ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex max-w-full min-w-0 items-center gap-1 text-link-400 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(url).catch(() => {});
                }
                window.open(url, '_blank', 'noreferrer');
              }}
            >
              <span className="min-w-0 truncate">{urlDisplay}</span>
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                <Copy size={14} strokeWidth={2} />
              </span>
            </a>
          ) : (
            <button
              type="button"
              title="Copy inactive URL"
              className="flex max-w-full min-w-0 items-center gap-1 font-normal text-primary-800 hover:text-primary-900"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(url).catch(() => {});
                }
              }}
            >
              <span className="min-w-0 truncate">{urlDisplay}</span>
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-primary-500" aria-hidden>
                <Copy size={14} strokeWidth={2} />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* NDA row */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="shrink-0 text-primary-600">NDA:</span>
        <div className="min-w-0 flex-1 flex justify-end">
          <a
            href="#"
            className="flex items-center gap-1 text-link-400 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Manage NDAs
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
              <ExternalLink size={14} strokeWidth={2} />
            </span>
          </a>
        </div>
      </div>

      {/* Details row (accordion toggle) */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="shrink-0 text-primary-600">Details:</span>
        <div className="min-w-0 flex-1 flex justify-end">
          <button
            type="button"
            className="flex items-center gap-1 font-normal text-primary-800"
            aria-expanded={detailsOpen}
            onClick={() => setDetailsOpen((v) => !v)}
          >
            View All
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`text-primary-500 transition-transform duration-150 ${detailsOpen ? 'rotate-180' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Full config list (shown when Details is open; indented under the Details row like nested auto-layout) */}
      {detailsOpen ? (
        <div className="ml-0.5 border-l border-primary-300 pl-3">
          <PublishedSnapshotConfigDl
            pub={pub}
            liveLocaleLabels={liveLocaleLabels}
            changelogNote={changelogNote}
            className="space-y-2.5 pb-1 text-xs"
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * PublishedEmptyState
 * Shown inside card 1 when the Published tab has no active Trust Center.
 * Displays "No Published Trust Center" title with kebab, the branded URL in an
 * inactive dropdown-style control, and helper text (publish visibility only; custom domain help lives in the publish guide Step 2).
 * Figma: Trust Center Vision HQ > Designer > Published > Empty state (May 2026)
 */
function PublishedEmptyState() {
  const { state } = useDesigner();
  const isColdStart = state.drafts.length === 0;
  const url = isColdStart ? DEFAULT_TRUST_CENTER_PROFILE_DISPLAY : 'trust.mediacore.com';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="rounded-b-lg px-5 py-4">
      {/* Title row */}
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-xs font-medium leading-snug text-primary-800">
          No Published Trust Center
        </span>
        <div className="relative flex shrink-0 items-center">
          <button
            type="button"
            aria-label="More actions"
            className="rounded p-1 text-primary-700 transition-colors hover:bg-primary-100 hover:text-primary-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={14} strokeWidth={2} aria-hidden />
          </button>
          {menuOpen ? (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-[180px] overflow-hidden rounded-md border border-primary-400 bg-white py-1 shadow-lg">
                <a
                  href={`${import.meta.env.BASE_URL}trust-center`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-primary-800 hover:bg-primary-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Open preview in new tab
                </a>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Inactive URL control (styled like the visibility dropdown but non-interactive) */}
      <div className="mt-3 flex w-full items-center gap-2.5 rounded-lg border border-primary-400 bg-white px-3 py-2.5">
        <EyeOff size={16} strokeWidth={2} className="shrink-0 text-primary-500" aria-hidden />
        <span className="flex-1 truncate text-xs text-primary-600">{url}</span>
        <ChevronDown size={14} strokeWidth={2} className="shrink-0 text-primary-400" aria-hidden />
      </div>

      {/* Helper text */}
      <p className="mt-3 text-xs leading-relaxed text-primary-600">
        {isColdStart
          ? 'Account verification is pending approval.'
          : 'Publish draft to make URL live and visible to visitors.'}
      </p>
    </div>
  );
}

/** Wrapper for the Published tab — shows an empty state when no TC has been published, or the full UI otherwise. */
function PublishedTabContent({
  workspaceTab,
  switchWorkspaceTab,
  onUnpublishSuccess,
}: {
  workspaceTab: 'draft' | 'published';
  switchWorkspaceTab: (tab: 'draft' | 'published') => void;
  onUnpublishSuccess: (draftName: string) => void;
}) {
  const { state } = useDesigner();
  const pub = getPublishedPresentation(state);
  const hasPublishedTC = LANGUAGE_MENU.some(
    (item) => pub.localeLive[item.locale] || pub.localeEverPublished[item.locale],
  );
  const [publishGuideModalOpen, setPublishGuideModalOpen] = useState(false);
  const [publishLiveToastVisible, setPublishLiveToastVisible] = useState(false);

  const triggerPublishLiveToast = () => {
    setPublishLiveToastVisible(true);
    window.setTimeout(() => setPublishLiveToastVisible(false), PUBLISH_LIVE_SUCCESS_TOAST_DURATION_MS);
  };

  return (
    <>
      {/* Card 1: Draft/Published tabs + Active Trust Center overview */}
      <div className="z-10 shrink-0 pb-1.5 pl-0 pr-3 pt-3">
        {/* No overflow-hidden: PublishedOverviewSection kebab menu is absolute and must extend below this card. */}
        <div className="rounded-lg border border-primary-400 bg-white">
          <DesignerWorkspaceTabList value={workspaceTab} onChange={switchWorkspaceTab} />
          {hasPublishedTC ? (
            <PublishedOverviewSection onUnpublishSuccess={onUnpublishSuccess} />
          ) : (
            <PublishedEmptyState />
          )}
        </div>
      </div>
      {/* Card: publish guide (only when nothing has been published yet) */}
      {!hasPublishedTC ? (
        <div className="z-10 shrink-0 pb-3 pl-0 pr-3 pt-1.5">
          <div className="overflow-hidden rounded-lg border border-primary-400 bg-white">
            <PublishedPublishGuideCard
              isPublishDisabled={state.drafts.length === 0}
              onPublishNow={() => setPublishGuideModalOpen(true)}
              onGoToDraftTab={() => switchWorkspaceTab('draft')}
            />
          </div>
        </div>
      ) : null}
      {publishGuideModalOpen ? (
        <PublishConfirmModal
          goLive
          onClose={() => setPublishGuideModalOpen(false)}
          onPublishLiveSuccess={triggerPublishLiveToast}
        />
      ) : null}
      <PublishLiveSuccessToast visible={publishLiveToastVisible} />
      {/* Card 2: Edit Active Content (scrollable) */}
      {hasPublishedTC ? (
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-3 pl-0 pr-3 pt-0">
          <div className="overflow-hidden rounded-lg border border-primary-400 bg-white">
            <PublishedContentSection />
          </div>
        </div>
      ) : null}
    </>
  );
}

function PublishedOverviewSection({ onUnpublishSuccess }: { onUnpublishSuccess: (draftName: string) => void }) {
  const { state, setPreviewLocale, setPreviewMode, setPublishedTrustCenterVisitorLive, unpublishToDraft, setPublishedChangelogNote, publishActiveDraft } =
    useDesigner();
  const pub = getPublishedPresentation(state);
  /** Locales that belong to this Trust Center (draft checkboxes + publish history), not separate published centers. */
  const includedLocales = LANGUAGE_MENU.filter(
    (item) => pub.localeLive[item.locale] || pub.localeEverPublished[item.locale],
  );
  const hasTrustCenter = includedLocales.length > 0;
  const isVisitorLive = LANGUAGE_MENU.some((item) => pub.localeLive[item.locale]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [changelogModalOpen, setChangelogModalOpen] = useState(false);
  const [changelogDraft, setChangelogDraft] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [unpublishConfirmOpen, setUnpublishConfirmOpen] = useState(false);
  const [republishConfirmOpen, setRepublishConfirmOpen] = useState(false);
  const defaultTcName = formatTrustCenterName();

  const trustCenterTitle =
    state.publishedTrustCenterNames[PRIMARY_TRUST_CENTER_LOCALE] ||
    LANGUAGE_MENU.map((item) => state.publishedTrustCenterNames[item.locale]).find(Boolean) ||
    defaultTcName;

  const includedLanguageLabels = includedLocales.map((l) => l.label);

  const focusPreviewLocale = () => {
    const firstVisitorLive = includedLocales.find((item) => pub.localeLive[item.locale]);
    const loc = firstVisitorLive?.locale ?? includedLocales[0]?.locale ?? PRIMARY_TRUST_CENTER_LOCALE;
    setPreviewLocale(loc);
    setPreviewMode('published');
  };

  return (
    <div className="rounded-b-lg px-5 py-4">
      {!hasTrustCenter ? (
        <p className="rounded-lg border border-dashed border-primary-400 bg-primary-100/60 px-3 py-2.5 text-xs text-primary-700">
          No trust centers yet. On the Draft tab, turn languages live and publish.
        </p>
      ) : (
        <>
          {/* Title row: TC name (clickable to focus preview) + kebab */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`${trustCenterTitle}. Click to focus preview.`}
              className="min-w-0 flex-1 truncate text-left text-xs font-medium text-primary-800 transition-colors hover:text-primary-900"
              onClick={() => {
                if (isVisitorLive) focusPreviewLocale();
              }}
            >
              {trustCenterTitle}
            </button>
            <div className="relative flex shrink-0 items-center">
              <button
                type="button"
                aria-label={`More actions for ${trustCenterTitle}`}
                className="rounded p-1 text-primary-700 transition-colors hover:bg-primary-100 hover:text-primary-900"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <MoreVertical size={14} strokeWidth={2} aria-hidden />
              </button>
              {menuOpen ? (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-[180px] overflow-hidden rounded-md border border-primary-400 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-primary-800 hover:bg-primary-100"
                      onClick={() => {
                        setMenuOpen(false);
                        setChangelogDraft(state.publishedChangelogNote);
                        setChangelogModalOpen(true);
                      }}
                    >
                      Edit changelog
                    </button>
                    <a
                      href={`${import.meta.env.BASE_URL}trust-center`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-primary-800 hover:bg-primary-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Open preview in new tab
                    </a>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-primary-800 hover:bg-primary-100"
                      onClick={() => {
                        setMenuOpen(false);
                        setShareModalOpen(true);
                      }}
                    >
                      Share via invite
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Visibility dropdown: Public / Private */}
          <VisibilityDropdown
            isPublic={isVisitorLive}
            onSelectPublic={() => setRepublishConfirmOpen(true)}
            onSelectPrivate={() => setUnpublishConfirmOpen(true)}
          />

          <PublishedSnapshot
            pub={pub}
            isVisitorLive={isVisitorLive}
            liveLocaleLabels={includedLanguageLabels}
            changelogNote={state.publishedChangelogNote}
          />
        </>
      )}

      {changelogModalOpen ? (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/20" onClick={() => setChangelogModalOpen(false)} />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-changelog-title"
              className="pointer-events-auto w-full max-w-md rounded-lg border border-primary-400 bg-white shadow-xl"
            >
              <div className="border-b border-primary-400 px-6 py-4">
                <h2 id="edit-changelog-title" className="text-base font-semibold text-primary-800">
                  Published changelog
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-primary-700">
                  Document the most recent changes in this published version. This note is visible on the Published tab.
                </p>
              </div>
              <div className="px-6 py-4">
                {state.publishedChangelogNote ? (
                  <div className="mb-4 rounded border border-primary-200 bg-primary-100/60 px-3 py-2.5">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-primary-600">Current note</p>
                    <p className="text-xs leading-relaxed text-primary-800">{state.publishedChangelogNote}</p>
                  </div>
                ) : null}
                <label htmlFor="edit-changelog-note" className="mb-1.5 block text-xs font-medium text-primary-800">
                  {state.publishedChangelogNote ? 'Update note' : 'Add a note'}
                </label>
                <textarea
                  id="edit-changelog-note"
                  className="w-full rounded border border-primary-400 px-3 py-2 text-xs text-primary-800 placeholder-primary-500 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                  rows={3}
                  placeholder="Describe what changed and why..."
                  value={changelogDraft}
                  onChange={(e) => setChangelogDraft(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-primary-400 bg-primary-100/40 px-6 py-4">
                <button
                  type="button"
                  className="rounded border border-primary-400 px-3 py-1.5 text-sm font-medium text-primary-800 hover:bg-primary-100"
                  onClick={() => setChangelogModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded bg-brand-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
                  onClick={() => {
                    setPublishedChangelogNote(changelogDraft);
                    setChangelogModalOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {shareModalOpen ? <ShareViaInviteModal onClose={() => setShareModalOpen(false)} /> : null}

      {unpublishConfirmOpen
        ? createPortal(
            <div className="fixed inset-0 z-[200]">
              <TrustCenterModalBackdrop onClose={() => setUnpublishConfirmOpen(false)} />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="unpublish-confirm-title"
                  className="pointer-events-auto flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-primary-400 bg-white shadow-xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-primary-200 px-6 py-4">
                    <h2 id="unpublish-confirm-title" className="text-base font-semibold text-primary-800">
                      Unpublish Trust Center?
                    </h2>
                    <button
                      type="button"
                      className="rounded p-1 text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-800"
                      onClick={() => setUnpublishConfirmOpen(false)}
                      aria-label="Close"
                    >
                      <X size={16} aria-hidden />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="bg-primary-50 px-6 py-5">
                    <p className="text-xs leading-relaxed text-primary-700">
                      Are you sure you want to unpublish your Trust Center?
                    </p>
                    {state.drafts.length > 0 ? (
                      <div className="mt-4 flex items-start gap-2.5 rounded-md bg-amber-50 px-3.5 py-2.5">
                        <TriangleAlert size={14} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
                        <p className="text-xs leading-relaxed text-primary-700">
                          Unpublishing will overwrite current draft, <span className="font-semibold">{state.drafts.find((d) => d.id === state.activeDraftId)?.name ?? 'your draft'}</span>.
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 border-t border-primary-200 bg-white px-6 py-4">
                    <button
                      type="button"
                      className="rounded border border-primary-400 px-4 py-1.5 text-sm font-medium text-primary-800 hover:bg-primary-100"
                      onClick={() => setUnpublishConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                      onClick={() => {
                        const nameForToast = trustCenterTitle;
                        unpublishToDraft();
                        setUnpublishConfirmOpen(false);
                        onUnpublishSuccess(nameForToast);
                      }}
                    >
                      Unpublish Trust Center
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
      {republishConfirmOpen
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center">
              <TrustCenterModalBackdrop onClose={() => setRepublishConfirmOpen(false)} />
              <div
                className="pointer-events-none fixed inset-0 z-[201] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="republish-confirm-title"
              >
                <div className="pointer-events-auto flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-primary-400 bg-white shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-primary-200 px-6 py-4">
                    <h2 id="republish-confirm-title" className="text-base font-semibold text-primary-800">
                      Publish Trust Center?
                    </h2>
                    <button
                      type="button"
                      className="rounded p-1 text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-800"
                      onClick={() => setRepublishConfirmOpen(false)}
                      aria-label="Close"
                    >
                      <X size={16} aria-hidden />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="bg-primary-50 px-6 py-5">
                    <p className="text-xs leading-relaxed text-primary-700">
                      Are you sure you want to publish current draft, <span className="font-semibold">{state.drafts.find((d) => d.id === state.activeDraftId)?.name ?? 'your draft'}</span> to active URL?
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 border-t border-primary-200 bg-white px-6 py-4">
                    <button
                      type="button"
                      className="rounded border border-primary-400 px-4 py-1.5 text-sm font-medium text-primary-800 hover:bg-primary-100"
                      onClick={() => setRepublishConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded bg-brand-400 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
                      onClick={() => {
                        if (state.drafts.length > 0) {
                          publishActiveDraft(undefined, { goLive: true });
                        } else {
                          setPublishedTrustCenterVisitorLive(true);
                        }
                        focusPreviewLocale();
                        setRepublishConfirmOpen(false);
                      }}
                    >
                      Publish Trust Center
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

const DRAFTABLE_CONTENT_ITEMS: { id: string; label: string; editId: string }[] = [
  { id: 'imagery', label: 'Imagery', editId: 'banner' },
  { id: 'branding', label: 'Branding', editId: 'branding' },
];

function DraftableContentSection({ onSwitchToPublished }: { onSwitchToPublished: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const [editingContent, setEditingContent] = useState<string | null>(null);

  return (
    <>
      <div className="border-b border-primary-400 bg-white">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex h-10 w-full items-center px-5 text-left"
        >
          <span className="min-w-0 flex-1 text-sm font-medium leading-[1.35] text-primary-700">Draftable Content</span>
          <span className="shrink-0 text-primary-500">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>
        {expanded ? (
          <div className="px-5 pb-5 pt-2">
            <p className="mb-2 text-xs leading-relaxed text-primary-700">
              Edit or hover over sections to make drafted changes. Edit live content at{' '}
              <button
                type="button"
                className="text-link-400 hover:underline"
                onClick={onSwitchToPublished}
              >
                Published&gt;Edit Live Content
              </button>
              .
            </p>
            <div>
              {DRAFTABLE_CONTENT_ITEMS.map((item) => (
                <div key={item.id} className="flex h-8 items-center gap-3 px-2">
                  <span className="min-w-0 flex-1 text-xs font-medium leading-[1.35] text-primary-700">{item.label}</span>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-medium leading-[1.35] text-link-400 hover:underline"
                    onClick={() => setEditingContent(item.editId)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {editingContent === 'banner' ? (
        <TrustCenterImageryModal onClose={() => setEditingContent(null)} />
      ) : editingContent ? (
        <ContentPlaceholderModal
          title={DRAFTABLE_CONTENT_ITEMS.find((i) => i.editId === editingContent)?.label ?? editingContent}
          onClose={() => setEditingContent(null)}
        />
      ) : null}
    </>
  );
}

function ContentPlaceholderModal({ title, onClose }: { title: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="pointer-events-auto w-full max-w-md rounded-lg border border-primary-400 bg-white p-6 shadow-xl"
        >
          <h2 className="text-base font-medium text-primary-800">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-600">
            Editor content will go here. Replace this modal when your designs are ready.
          </p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-primary-400 bg-white px-4 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type LiveContentItem = {
  id: string;
  label: string;
  editId: string;
  visibilityId?: string;
  /** When set, consecutive items sharing this key collapse into one expandable group row. */
  groupKey?: string;
  /** Heading shown on the group row (only the first item in the group needs to set it). */
  groupLabel?: string;
};

/**
 * Map editId → CSS selector for the section to scroll into view when a user
 * clicks a row's pencil / kebab action in the "Edit Live Content" list.
 * Always the section root so sticky-nav `scroll-mt-20` applies cleanly.
 */
const SCROLL_TARGETS: Record<string, string> = {
  banner: '[data-editable-region="banner"]',
  profile: '#section-company-identity',
  'quick-links': '#section-company-identity',
  badges: '#section-badges',
  'quick-summary': '#section-quick-summary',
  philosophy: '#section-philosophy',
  'coming-soon': '#section-philosophy',
  'featured-documents': '#section-featured-documents',
  'find-answer': '#section-find-answer',
  documents: '#section-find-answer',
  'knowledge-base': '#section-find-answer',
  'announcements-add': '#section-announcements',
  'announcements-update': '#section-announcements',
  subprocessors: '#section-subprocessors',
  'subprocessors-add': '#section-subprocessors',
  'subprocessors-update': '#section-subprocessors',
  'trusted-by': '#section-trusted-by',
  'what-we-offer-add': '#section-what-we-offer',
  'what-we-offer-update': '#section-what-we-offer',
  'video-resources-add': '#section-video-resources',
  'video-resources-update': '#section-video-resources',
};

/**
 * When the section-level scroll target is too broad (e.g. clicking "Quick Links"
 * should glow just the Quick Links card inside `section-company-identity`, not
 * the whole row), override the highlight selector here. TrustCenterEditableRegion
 * exposes `data-editable-region` for this purpose.
 */
const HIGHLIGHT_OVERRIDES: Record<string, string> = {
  banner: '[data-editable-region="banner"]',
  profile: '[data-editable-region="profile"]',
  'quick-links': '[data-editable-region="quick-links"]',
  philosophy: '[data-editable-region="philosophy"]',
  'coming-soon': '[data-editable-region="coming-soon"]',
};

/** After smooth-scroll settles, dwell this long before opening the modal — tuned to feel snappy without losing the highlight beat. */
const HIGHLIGHT_DWELL_MS = 80;
/** Hard cap on "wait for scroll to finish" — if we never detect a quiet period we proceed anyway. */
const SCROLL_WAIT_MAX_MS = 1400;
/** Debounce window used to decide scrolling has stopped (no scroll event for this long → settled). */
const SCROLL_SETTLE_MS = 80;
/** How soon to give up waiting when no scroll events fire at all (target already in view). */
const SCROLL_NO_EVENT_MS = 120;
/** Fade-out duration for the highlight (matches .is-editing-target--leaving keyframe). */
const HIGHLIGHT_FADE_OUT_MS = 200;
/** When NOT opening a modal (kebab "Edit on Page"), keep the highlight visible this long so the user registers the section. */
const HIGHLIGHT_KEEP_MS = 500;

/**
 * Smooth-scroll `el` into view inside its nearest scrollable ancestor **only**.
 * Unlike `Element.scrollIntoView`, this never touches `document.documentElement`
 * or `document.body`, so the designer shell toolbar and StickyNav stay put.
 */
function scrollContainerTo(el: Element) {
  const container = findScrollContainer(el);
  if (container === window) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const c = container as HTMLElement;
  const cRect = c.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const target = c.scrollTop + (elRect.top - cRect.top);
  c.scrollTo({ top: target, behavior: 'smooth' });
}

/**
 * Safety net: zero out body/html scrollTop in case any browser path
 * (e.g. focus management, modal portals) shifts the shell.
 */
function resetShellScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Walk up the DOM to find the nearest scrollable ancestor of `el`. Falls back
 * to `window` when nothing vertical scrolls between `el` and the document root.
 */
function findScrollContainer(el: Element): Element | Window {
  let parent: HTMLElement | null = el.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

/**
 * Resolve once the smooth scroll triggered on `el`'s scroll container has settled,
 * using a debounced `scroll` listener. If no scroll event fires within
 * SCROLL_NO_EVENT_MS, assume the target was already in view and resolve. Always
 * bounded by SCROLL_WAIT_MAX_MS so the modal never stalls.
 */
function waitForScrollEnd(el: Element): Promise<void> {
  return new Promise<void>((resolve) => {
    const scroller = findScrollContainer(el) as (Element & EventTarget) | (Window & EventTarget);
    let settled = false;
    let settleTimer: number | null = null;

    const finish = () => {
      if (settled) return;
      settled = true;
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      window.clearTimeout(hardCap);
      scroller.removeEventListener('scroll', onScroll as EventListener);
      resolve();
    };
    const onScroll = () => {
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(finish, SCROLL_SETTLE_MS);
    };

    scroller.addEventListener('scroll', onScroll as EventListener, { passive: true });
    // If no scroll events fire shortly after scrollIntoView, the element was
    // already in view — no need to wait longer.
    settleTimer = window.setTimeout(finish, SCROLL_NO_EVENT_MS);
    // Safety cap so long / janky scrolls can't block the modal forever.
    const hardCap = window.setTimeout(finish, SCROLL_WAIT_MAX_MS);
  });
}

const HEADER_IDENTITY_IDS = new Set(['profile', 'quick-links']);

const LIVE_CONTENT_ITEMS: LiveContentItem[] = [
  { id: 'profile', label: 'Company Profile', editId: 'profile', visibilityId: 'company-profile' },
  { id: 'quick-links', label: 'Quick Links', editId: 'quick-links' },
  { id: 'badges', label: 'Certifications', editId: 'badges', visibilityId: 'badges' },
  { id: 'quick-summary', label: 'Quick Summary', editId: 'quick-summary', visibilityId: 'quick-summary' },
  { id: 'philosophy', label: 'Our Philosophy', editId: 'philosophy', visibilityId: 'philosophy' },
  { id: 'coming-soon', label: 'Coming Soon', editId: 'coming-soon', visibilityId: 'philosophy' },
  { id: 'featured-documents', label: 'Featured Documents', editId: 'featured-documents', visibilityId: 'featured-documents' },
  { id: 'documents', label: 'Documents', editId: 'documents', visibilityId: 'find-answer' },
  { id: 'knowledge-base', label: 'Knowledge Base FAQs', editId: 'knowledge-base', visibilityId: 'find-answer' },
  { id: 'announcements-add', label: 'Add Announcement', editId: 'announcements-add', visibilityId: 'announcements', groupKey: 'announcements', groupLabel: 'Announcements' },
  { id: 'announcements-update', label: 'Edit Announcement', editId: 'announcements-update', visibilityId: 'announcements', groupKey: 'announcements' },
  { id: 'subprocessors-add', label: 'Add Subprocessor', editId: 'subprocessors-add', visibilityId: 'subprocessors', groupKey: 'subprocessors', groupLabel: 'Subprocessors' },
  { id: 'subprocessors-update', label: 'Update Subprocessors', editId: 'subprocessors-update', visibilityId: 'subprocessors', groupKey: 'subprocessors' },
  { id: 'trusted-by', label: 'Trusted By', editId: 'trusted-by', visibilityId: 'trusted-by' },
  { id: 'what-we-offer-add', label: 'Add New Product Offering', editId: 'what-we-offer-add', visibilityId: 'what-we-offer', groupKey: 'what-we-offer', groupLabel: 'What we Offer' },
  { id: 'what-we-offer-update', label: 'Update Products', editId: 'what-we-offer-update', visibilityId: 'what-we-offer', groupKey: 'what-we-offer' },
  { id: 'video-resources-add', label: 'Add New Video Resource', editId: 'video-resources-add', visibilityId: 'video-resources', groupKey: 'video-resources', groupLabel: 'Video Resources' },
  { id: 'video-resources-update', label: 'Update Video Resource', editId: 'video-resources-update', visibilityId: 'video-resources', groupKey: 'video-resources' },
];

type LiveContentRow =
  | { kind: 'single'; item: LiveContentItem }
  | {
      kind: 'dual';
      groupKey: string;
      groupLabel: string;
      addItem: LiveContentItem;
      primaryItem: LiveContentItem;
    };

function PublishedContentSection() {
  const { state } = useDesigner();
  const pub = getPublishedPresentation(state);
  const isVisitorLive = LANGUAGE_MENU.some((item) => pub.localeLive[item.locale]);
  const sectionOrder = state.sectionOrder;
  const sectionVisibility = state.sectionVisibility;
  const [expanded, setExpanded] = useState(true);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  // Exploration: Video Resources renders as a kebab menu with two items. This
  // holds which row's popover is open (keyed by groupKey); `null` means closed.
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /**
   * Scroll the center preview to the target section and tint the exact
   * region being edited (same color as the hover overlay). Wait for the
   * smooth scroll to actually finish, then dwell briefly so the user can
   * register the highlighted section.
   *
   * - `openModal: true` (default) — after the dwell, open the edit modal
   *   on top. Used by every pencil row and by the kebab "Add X" item.
   * - `openModal: false` — scroll and highlight only (no modal). Reserved for
   *   flows that edit inline on the page; kebab "Edit X" items open their manage
   *   modals with the default `openModal: true`.
   *
   * When no target is wired (or the element isn't in the DOM, e.g. a
   * hidden section), fall back to opening the modal immediately — there's
   * nothing to scroll to.
   */
  const focusAndEdit = async (
    editId: string,
    options: { openModal?: boolean } = {},
  ) => {
    const { openModal = true } = options;
    const scrollSel = SCROLL_TARGETS[editId];
    const highlightSel = HIGHLIGHT_OVERRIDES[editId] ?? scrollSel;
    const scrollEl = scrollSel ? document.querySelector(scrollSel) : null;
    const highlightEl = highlightSel ? document.querySelector(highlightSel) : null;

    if (!scrollEl || !highlightEl) {
      if (openModal) setEditingContent(editId);
      return;
    }

    highlightEl.classList.add('is-editing-target');
    scrollContainerTo(scrollEl);
    await waitForScrollEnd(scrollEl);
    resetShellScroll();
    await new Promise<void>((resolve) => window.setTimeout(resolve, HIGHLIGHT_DWELL_MS));

    const cleanupHighlight = () => {
      highlightEl.classList.remove('is-editing-target');
      highlightEl.classList.remove('is-editing-target--leaving');
    };

    if (openModal) {
      // Mount the modal and fade the highlight out simultaneously — the
      // backdrop fade-in (tc-modal-backdrop-enter) covers the dissolve so the
      // user just sees one continuous motion into the dialog.
      setEditingContent(editId);
      highlightEl.classList.add('is-editing-target--leaving');
      window.setTimeout(cleanupHighlight, HIGHLIGHT_FADE_OUT_MS);
    } else {
      // Kebab "Edit on Page" flow: no modal, so let the highlight dwell long
      // enough for the user to see where to click, then fade it out.
      window.setTimeout(() => {
        highlightEl.classList.add('is-editing-target--leaving');
        window.setTimeout(cleanupHighlight, HIGHLIGHT_FADE_OUT_MS);
      }, HIGHLIGHT_KEEP_MS);
    }
  };

  useEffect(() => {
    if (!openMenuKey) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuKey(null);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuKey(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [openMenuKey]);

  const rows = useMemo<LiveContentRow[]>(() => {
    const layoutIds = new Set<string>(LAYOUT_SECTION_IDS);
    // Hide rows whose backing section has been toggled off via Customize Layout —
    // if the user made it invisible, they shouldn't see an edit row for it.
    const visibleItems = LIVE_CONTENT_ITEMS.filter((item) => {
      if (!item.visibilityId) return true;
      return sectionVisibility[item.visibilityId] !== false;
    });
    const fixed = visibleItems.filter(
      (item) => !item.visibilityId || !layoutIds.has(item.visibilityId),
    );
    const byLayoutId = new Map<string, LiveContentItem[]>();
    visibleItems.forEach((item) => {
      if (item.visibilityId && layoutIds.has(item.visibilityId)) {
        const list = byLayoutId.get(item.visibilityId) ?? [];
        list.push(item);
        byLayoutId.set(item.visibilityId, list);
      }
    });
    const reordered: LiveContentItem[] = [];
    sectionOrder.forEach((id) => {
      const group = byLayoutId.get(id);
      if (group) reordered.push(...group);
    });
    const flat = [...fixed, ...reordered];

    // Collapse consecutive items that share a `groupKey` into one dual-action row.
    const out: LiveContentRow[] = [];
    let i = 0;
    while (i < flat.length) {
      const item = flat[i];
      if (!item.groupKey) {
        out.push({ kind: 'single', item });
        i += 1;
        continue;
      }
      const groupKey = item.groupKey;
      const groupLabel = item.groupLabel ?? groupKey;
      const groupItems: LiveContentItem[] = [];
      while (i < flat.length && flat[i].groupKey === groupKey) {
        groupItems.push(flat[i]);
        i += 1;
      }
      // Each group has exactly one "add" and one "primary" (edit/update).
      const addItem = groupItems.find((g) => g.id.includes('-add')) ?? groupItems[0];
      const primaryItem = groupItems.find((g) => g !== addItem) ?? groupItems[0];
      out.push({ kind: 'dual', groupKey, groupLabel, addItem, primaryItem });
    }
    return out;
  }, [sectionOrder, sectionVisibility]);

  return (
    <>
      <div className="bg-white">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex h-10 w-full items-center px-5 text-left"
        >
          <span className="min-w-0 flex-1 text-sm font-medium leading-[1.35] text-primary-700">Edit Active Content</span>
          <span className="shrink-0 text-primary-500">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>
        {expanded ? (
          <div className={`px-5 pb-5 pt-2${!isVisitorLive ? ' opacity-50 pointer-events-none' : ''}`}>
            <p className="mb-2 text-xs leading-relaxed text-primary-700">
              {isVisitorLive
                ? 'Content below will publish live to users on save. Click edit below or hover over the section of the trust center.'
                : 'Publish your Trust Center to edit active content.'}
            </p>
            <div>
              <p className="mb-1 mt-3 px-2 text-[10px] font-medium uppercase tracking-wider text-primary-500">Header and Identity</p>
              <div className="flex h-8 items-center gap-3 px-2">
                <span className="min-w-0 flex-1 text-xs font-medium leading-[1.35] text-primary-700">Trust Center imagery</span>
                <span className="group/imagery-tip relative inline-flex">
                  <span
                    aria-label="Edit in draft"
                    className="flex h-5 w-5 shrink-0 cursor-not-allowed items-center justify-center rounded text-primary-400"
                  >
                    <Pencil size={12} strokeWidth={2} aria-hidden />
                  </span>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute right-full top-1/2 z-[9999] mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary-800 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/imagery-tip:opacity-100"
                  >
                    Edit in draft
                    <span
                      className="absolute left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-primary-800"
                      aria-hidden
                    />
                  </span>
                </span>
              </div>
              {rows.map((row, idx) => {
                const isIdentity = row.kind === 'single' && HEADER_IDENTITY_IDS.has(row.item.id);
                const prevRow = idx > 0 ? rows[idx - 1] : null;
                const prevIsIdentity = prevRow && prevRow.kind === 'single' && HEADER_IDENTITY_IDS.has(prevRow.item.id);
                const showPageHeader = !isIdentity && (idx === 0 || prevIsIdentity);
                if (row.kind === 'single') {
                  const editTip = `Edit ${row.item.label}`;
                  return (
                    <Fragment key={row.item.id}>
                      {showPageHeader && <p className="mb-1 mt-3 px-2 text-[10px] font-medium uppercase tracking-wider text-primary-500">Page Sections</p>}
                      <div className="flex h-8 items-center gap-3 px-2">
                        <span className="min-w-0 flex-1 text-xs font-medium leading-[1.35] text-primary-700">{row.item.label}</span>
                      <button
                        type="button"
                        onClick={() => focusAndEdit(row.item.editId)}
                        aria-label={editTip}
                        title={editTip}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-primary-600 hover:bg-primary-100 hover:text-primary-800"
                      >
                        <Pencil size={12} strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                    </Fragment>
                  );
                }

                // Dual-action rows render as a kebab menu: "Add X" and "Edit X on Page"
                // (both open their modals after scrolling to the section).
                const open = openMenuKey === row.groupKey;
                const menuTip = `${row.groupLabel} actions`;
                const editLabel = `Edit ${row.groupLabel} on Page`;
                return (
                  <Fragment key={row.groupKey}>
                    {showPageHeader && <p className="mb-1 mt-3 px-2 text-[10px] font-medium uppercase tracking-wider text-primary-500">Page Sections</p>}
                    <div className="relative flex h-8 items-center gap-3 px-2">
                    <span className="min-w-0 flex-1 text-xs font-medium leading-[1.35] text-primary-700">
                      {row.groupLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenMenuKey(open ? null : row.groupKey)}
                      aria-label={menuTip}
                      aria-haspopup="menu"
                      aria-expanded={open}
                      title={menuTip}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-primary-600 hover:bg-primary-100 hover:text-primary-800"
                    >
                      <MoreVertical size={14} strokeWidth={2} aria-hidden />
                    </button>
                    {open ? (
                      <div
                        ref={menuRef}
                        role="menu"
                        className="absolute right-2 top-8 z-20 w-52 rounded-md border border-primary-300 bg-white py-1 shadow-lg"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-primary-700 hover:bg-primary-100"
                          onClick={() => {
                            setOpenMenuKey(null);
                            focusAndEdit(row.addItem.editId);
                          }}
                        >
                          <Plus size={12} strokeWidth={2} aria-hidden className="text-primary-600" />
                          {row.addItem.label}
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-primary-700 hover:bg-primary-100"
                          onClick={() => {
                            setOpenMenuKey(null);
                            focusAndEdit(row.primaryItem.editId);
                          }}
                        >
                          <Pencil size={12} strokeWidth={2} aria-hidden className="text-primary-600" />
                          {editLabel}
                        </button>
                      </div>
                    ) : null}
                  </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {editingContent === 'profile' ? (
        <CompanyProfileModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'quick-links' ? (
        <QuickLinksSettingsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'badges' ? (
        <BadgesSettingsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'quick-summary' ? (
        <QuickSummarySettingsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'featured-documents' ? (
        <FeaturedDocumentsSettingsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'trusted-by' ? (
        <TrustedBySettingsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'philosophy' ? (
        <PhilosophySettingsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'coming-soon' ? (
        <ComingSoonSettingsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'subprocessors-add' ? (
        <AddSubprocessorModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'subprocessors-update' ? (
        <ManageSubprocessorsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'what-we-offer-add' ? (
        <AddProductModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'what-we-offer-update' ? (
        <ManageProductsModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'video-resources-add' ? (
        <NewVideoResourceModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'video-resources-update' ? (
        <ManageVideoResourcesModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'documents' ? (
        <ReviewingProductFilterProvider>
          <DocumentsSearchModal
            initialPanelKey="documents"
            onClose={() => setEditingContent(null)}
          />
        </ReviewingProductFilterProvider>
      ) : editingContent === 'knowledge-base' ? (
        <ReviewingProductFilterProvider>
          <DocumentsSearchModal
            initialPanelKey="Overview"
            onClose={() => setEditingContent(null)}
          />
        </ReviewingProductFilterProvider>
      ) : editingContent === 'announcements-add' ? (
        <NewAnnouncementModal onClose={() => setEditingContent(null)} />
      ) : editingContent === 'announcements-update' ? (
        <ManageAnnouncementsModal onClose={() => setEditingContent(null)} />
      ) : editingContent ? (
        <ContentPlaceholderModal
          title={LIVE_CONTENT_ITEMS.find((i) => i.editId === editingContent)?.label ?? editingContent}
          onClose={() => setEditingContent(null)}
        />
      ) : null}
    </>
  );
}

function PublicViewSection({
  publicView,
  onChange,
}: {
  publicView: 'modern' | 'simple';
  onChange: (val: 'modern' | 'simple') => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-primary-400">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between"
      >
        <span className="text-sm font-medium text-primary-700">Public View</span>
        {expanded ? (
          <ChevronUp size={14} className="text-primary-500" />
        ) : (
          <ChevronDown size={14} className="text-primary-500" />
        )}
      </button>
      {expanded && (
        <div className="px-5 pb-4">
          <p className="text-xs text-primary-600 mb-3">
            Your trust center link will direct unauthenticated users into the selected experience.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ViewOption
              label="Modern Landing"
              previewSrc={uiAssets.modernLandingThumb}
              active={publicView === 'modern'}
              onClick={() => onChange('modern')}
            />
            <ViewOption
              label="Simple form"
              previewSrc={uiAssets.simpleFormThumb}
              active={publicView === 'simple'}
              onClick={() => onChange('simple')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ViewOption({
  label,
  previewSrc,
  active,
  onClick,
}: {
  label: string;
  previewSrc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-2 p-0 rounded-md transition-all ${
        active ? '' : 'opacity-70'
      }`}
    >
      <div
        className={`w-full h-[90px] rounded-md border transition-colors overflow-hidden bg-primary-100 ${
          active ? 'border-grey-600' : 'border-primary-400'
        }`}
      >
        <img
          src={previewSrc}
          alt=""
          className="w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-primary-800">{label}</span>
        {active && (
          <img src={icons.checkmarkBadge} alt="" className="w-3 h-3" />
        )}
      </div>
    </button>
  );
}

function BrandSettingsSection({
  accentColor,
  primaryColor,
  fontFamily,
  onAccentChange,
  onPrimaryChange,
  onFontChange,
}: {
  accentColor: string;
  primaryColor: string;
  fontFamily: string;
  onAccentChange: (val: string) => void;
  onPrimaryChange: (val: string) => void;
  onFontChange: (val: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-primary-400">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-3"
      >
        <span className="text-sm font-medium text-primary-700">Brand Settings</span>
        {expanded ? (
          <ChevronUp size={14} className="text-primary-500" />
        ) : (
          <ChevronDown size={14} className="text-primary-500" />
        )}
      </button>
      {expanded && (
        <div className="space-y-5 px-5 pb-4">
          {/* Accent Color */}
          <div>
            <label className="text-xs font-medium text-primary-800 block mb-1">Accent Color</label>
            <p className="text-xs text-primary-600 mb-2">
              Trust Center: Ask AI Agent button, Documents & FAQs and announcement card top
              accents, topic icons and chip highlights (tints use a low mix of this color).
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => onAccentChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-5 h-5 rounded border border-primary-400"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
              <input
                type="text"
                value={accentColor.toUpperCase()}
                onChange={(e) => onAccentChange(e.target.value)}
                className="px-2.5 py-1.5 border border-primary-400 rounded-md text-xs text-primary-800 w-[90px] focus:outline-none focus:border-link-400"
              />
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="text-xs font-medium text-primary-800 block mb-1">Primary Color</label>
            <p className="text-xs text-primary-600 mb-2">
              Trust Center: sticky navigation background and other primary chrome aligned with
              the header.
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onPrimaryChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-5 h-5 rounded border border-primary-400"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <input
                type="text"
                value={primaryColor.toUpperCase()}
                onChange={(e) => onPrimaryChange(e.target.value)}
                className="px-2.5 py-1.5 border border-primary-400 rounded-md text-xs text-primary-800 w-[90px] focus:outline-none focus:border-link-400"
              />
            </div>
          </div>

          <div className="border-t border-primary-400" />

          {/* Fonts */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-xs font-medium text-primary-800">Customize Fonts</label>
              <Info size={12} className="text-primary-500" />
            </div>
            <p className="text-xs text-primary-600 mb-2">
              Use any{' '}
              <a href="https://fonts.google.com" target="_blank" className="text-link-400 hover:underline">
                Google Font
              </a>{' '}
              by typing the name below and hitting enter or choosing a font from the dropdown.
            </p>
            <input
              type="text"
              placeholder="Choose or type a font name"
              value={fontFamily}
              onChange={(e) => onFontChange(e.target.value)}
              className="w-full px-3 py-2 border border-primary-400 rounded-md text-xs text-primary-800 placeholder-primary-500 focus:outline-none focus:border-link-400"
            />
            <div className="mt-3 bg-primary-300 rounded-md p-3">
              <p className="text-xs font-medium text-primary-800 mb-1">
                Want to bring your own typeface?
              </p>
              <p className="text-[11px] text-primary-700">
                Using fully custom font is included in paid plans. Contact us at{' '}
                <a href="mailto:support@conveyor.com" className="text-link-400 hover:underline">
                  support@conveyor.com
                </a>{' '}
                for details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function InlineImagerySlot({
  label,
  sizeHint,
  value,
  defaultSrc,
  aspectClass,
  onChange,
}: {
  label: string;
  sizeHint: string;
  value: string | null;
  defaultSrc?: string;
  aspectClass: string;
  onChange: (src: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewSrc = value ?? defaultSrc ?? null;

  const onPick = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <p className="mb-1 text-xs font-medium text-primary-800">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          onPick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer overflow-hidden rounded-md border border-dashed border-primary-500 bg-primary-100/40 transition-colors hover:bg-primary-100/80 ${aspectClass} ${
          previewSrc ? 'p-0' : 'flex flex-col items-center justify-center gap-1 px-3 py-4 text-center'
        }`}
      >
        {previewSrc ? (
          <img src={previewSrc} alt="" className="absolute inset-0 block h-full w-full object-cover" />
        ) : (
          <>
            <ImageIcon className="h-5 w-5 text-primary-500" strokeWidth={1.25} aria-hidden />
            <span className="text-[11px] text-primary-600">{sizeHint}</span>
          </>
        )}
      </button>
      {previewSrc ? (
        <p className="mt-1 text-[10px] text-primary-500">{sizeHint} · click to replace</p>
      ) : null}
      {value ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-1 text-[10px] font-medium text-link-400 hover:underline"
        >
          Remove
        </button>
      ) : null}
    </div>
  );
}

function ImagerySection() {
  const { state, setSavedTrustCenterImagery } = useDesigner();
  const [expanded, setExpanded] = useState(true);
  const imagery = normalizeTrustCenterImagery(state.savedTrustCenterImagery);

  const update = (patch: Partial<SavedTrustCenterImagery>) => {
    const next = { ...imagery, ...patch };
    const allEmpty = !next.squareLogoSrc && !next.headerImageSrc && !next.thumbnailImageSrc;
    setSavedTrustCenterImagery(allEmpty ? null : next);
  };

  return (
    <div className="border-b border-primary-400">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-sm font-medium text-primary-700">Trust Center Imagery</span>
        {expanded ? (
          <ChevronUp size={14} className="text-primary-500" />
        ) : (
          <ChevronDown size={14} className="text-primary-500" />
        )}
      </button>
      {expanded ? (
        <div className="space-y-4 px-5 pb-4">
          <InlineImagerySlot
            label="Square Logo (320x320)"
            sizeHint="320x320 px"
            value={imagery.squareLogoSrc}
            defaultSrc={uiAssets.mediacoreLogo}
            aspectClass="h-[100px] w-[100px]"
            onChange={(src) => update({ squareLogoSrc: src })}
          />
          <InlineImagerySlot
            label="Header Image (1100x200)"
            sizeHint="1100x200 px"
            value={imagery.headerImageSrc}
            defaultSrc={uiAssets.tcBanner}
            aspectClass="aspect-[1100/200] w-full"
            onChange={(src) => update({ headerImageSrc: src })}
          />
          <InlineImagerySlot
            label="Thumbnail (300x150)"
            sizeHint="300x150 px"
            value={imagery.thumbnailImageSrc}
            aspectClass="aspect-[2/1] w-full max-h-[80px]"
            onChange={(src) => update({ thumbnailImageSrc: src })}
          />
        </div>
      ) : null}
    </div>
  );
}

function LocalizationSection() {
  const { state, setPreviewLocale, setPreviewMode, toggleLocaleLive } = useDesigner();
  const [expanded, setExpanded] = useState(true);

  const onPreviewLocale = (locale: PreviewLocale) => {
    setPreviewLocale(locale);
    if (state.drafts.length > 0) {
      setPreviewMode('draft');
    }
  };

  return (
    <div className="border-b border-primary-400">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-sm font-medium text-primary-700">Localization</span>
        {expanded ? (
          <ChevronUp size={14} className="text-primary-500" />
        ) : (
          <ChevronDown size={14} className="text-primary-500" />
        )}
      </button>
      {expanded ? (
        <div className="space-y-3 px-5 pb-4">
          <p className="text-[11px] leading-snug text-primary-600">
            Select the language you&apos;d like to preview your trust center in. Check the languages you want to
            publish live for users.
          </p>
          <div>
            <div className="mb-2 flex items-center border-b border-primary-300 pb-2">
              <p className="min-w-0 flex-1 text-[10px] font-semibold uppercase tracking-wide text-primary-600">
                View language
              </p>
              <span className="group/live relative flex shrink-0 items-center gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-600">Enable</span>
                <span className="cursor-help text-primary-500 transition-colors hover:text-primary-700">
                  <Info size={12} aria-hidden />
                </span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute right-0 top-full z-50 mt-1.5 hidden w-[220px] group-hover/live:block"
                >
                  <span className="block rounded-[3px] bg-primary-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-white">
                    Selecting a language will add a version of your trust center that can be automatically served to
                    visitors with this default language. Optionally, it can be accessed by any visitor via the language
                    switcher.
                  </span>
                  <span
                    className="absolute -top-[3px] right-4 h-0 w-0 border-x-[4px] border-b-[4px] border-x-transparent border-b-primary-900"
                    aria-hidden
                  />
                </span>
              </span>
            </div>
            <ul className="divide-y divide-primary-300">
              {LANGUAGE_MENU.map((item) => (
                <li key={item.locale} className="flex items-center gap-2 py-2.5">
                  <input
                    type="radio"
                    name="designer-localization-preview"
                    id={`loc-preview-${item.locale}`}
                    className="h-3.5 w-3.5 shrink-0 border-primary-400 text-link-400 focus:ring-link-400"
                    checked={state.previewLocale === item.locale}
                    onChange={() => onPreviewLocale(item.locale)}
                  />
                  <label
                    htmlFor={`loc-preview-${item.locale}`}
                    className="min-w-0 flex-1 cursor-pointer text-xs font-medium text-primary-800"
                  >
                    {item.label}
                  </label>
                  <input
                    type="checkbox"
                    id={`loc-live-${item.locale}`}
                    className="h-3.5 w-3.5 shrink-0 rounded border-primary-400 text-brand-400 focus:ring-brand-400"
                    checked={state.localeLive[item.locale]}
                    onChange={() => toggleLocaleLive(item.locale)}
                    aria-label={`Show in trust center: ${item.label}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Section Layout list rows: eye + label line up with the accordion title (`px-5`).
 * The drag grip sits in the card’s left padding (`-ml-5` + absolute `w-5` gutter).
 */
const SECTION_LAYOUT_ROW_CLASS =
  'group/row relative -ml-5 flex items-center gap-1 rounded-md py-2 pl-5 pr-2';
const SECTION_LAYOUT_GRIP_GUTTER_CLASS =
  'absolute left-0 top-1/2 flex w-5 -translate-y-1/2 items-center justify-center text-primary-400';

function DropSlotPreview({
  insertBeforeIndex,
  draggingIndex,
  onCommit,
  onClear,
}: {
  insertBeforeIndex: number;
  draggingIndex: number;
  onCommit: (from: number, insertBefore: number) => void;
  onClear: () => void;
}) {
  /** Same flex + padding as a layout row so dashed slot height matches a real row (no extra margin / thick border). */
  return (
    <div
      aria-hidden
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e) => {
        e.preventDefault();
        onCommit(draggingIndex, insertBeforeIndex);
        onClear();
      }}
      className={`${SECTION_LAYOUT_ROW_CLASS} shrink-0 border border-dashed border-primary-500 bg-primary-100/60`}
    >
      <span className={`${SECTION_LAYOUT_GRIP_GUTTER_CLASS} invisible`} aria-hidden>
        <GripVertical size={14} />
      </span>
      <span className="invisible shrink-0 p-0.5">
        <FontAwesomeIcon icon={faEye} className="right-panel-layout-row-icon" />
      </span>
      <div className="invisible flex min-w-0 flex-1 items-center gap-1.5">
        <span className="truncate text-xs font-medium text-primary-700">.</span>
        <span className="shrink-0 p-0.5">
          <FontAwesomeIcon icon={faLink} className="right-panel-layout-row-icon" />
        </span>
      </div>
    </div>
  );
}

function FixedSectionTooltip({
  text,
  children,
  position = 'right',
}: {
  text: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
}) {
  const isRight = position === 'right';
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-[9999] whitespace-nowrap rounded-md bg-primary-800 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/tip:opacity-100 ${
          isRight
            ? 'left-full top-1/2 ml-2 -translate-y-1/2'
            : 'right-full top-1/2 mr-2 -translate-y-1/2'
        }`}
      >
        {text}
        <span
          className={`absolute h-0 w-0 ${
            isRight
              ? 'right-full top-1/2 -translate-y-1/2 border-y-[5px] border-r-[5px] border-y-transparent border-r-primary-800'
              : 'left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-primary-800'
          }`}
          aria-hidden
        />
      </span>
    </span>
  );
}

function FixedHeaderSections({ sectionVisibility, onToggle, noPublishedTC = false, onEditSection }: { sectionVisibility: Record<string, boolean>; onToggle: (id: string) => void; noPublishedTC?: boolean; onEditSection?: (editId: string) => void }) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  /** Scroll center preview to section, highlight, then open modal. */
  const focusAndEdit = async (editId: string) => {
    const scrollSel = SCROLL_TARGETS[editId];
    const highlightSel = HIGHLIGHT_OVERRIDES[editId] ?? scrollSel;
    const scrollEl = scrollSel ? document.querySelector(scrollSel) : null;
    const highlightEl = highlightSel ? document.querySelector(highlightSel) : null;
    if (!scrollEl || !highlightEl) { onEditSection?.(editId); return; }
    highlightEl.classList.add('is-editing-target');
    scrollContainerTo(scrollEl);
    await waitForScrollEnd(scrollEl);
    resetShellScroll();
    await new Promise<void>((r) => window.setTimeout(r, HIGHLIGHT_DWELL_MS));
    onEditSection?.(editId);
    highlightEl.classList.add('is-editing-target--leaving');
    window.setTimeout(() => { highlightEl.classList.remove('is-editing-target', 'is-editing-target--leaving'); }, HIGHLIGHT_FADE_OUT_MS);
  };

  const lockedRows: { label: string; alwaysVisible: boolean; visibilityId?: string; anchor?: string; editId?: string }[] = [
    {
      label: 'Trust Center imagery',
      alwaysVisible: false,
      visibilityId: TRUST_CENTER_BANNER_VISIBILITY_ID,
      anchor: '#section-just-for-you',
      editId: 'banner',
    },
    { label: 'Company profile', alwaysVisible: false, visibilityId: 'company-profile', anchor: '#section-company-identity', editId: 'profile' },
    { label: 'Quick links', alwaysVisible: false, visibilityId: 'quick-links', anchor: '#section-company-identity', editId: 'quick-links' },
  ];
  return (
    <div className="mb-1">
      {lockedRows.map(({ label, alwaysVisible, visibilityId, anchor, editId }) => {
        const isRowVisible =
          visibilityId != null ? sectionVisibility[visibilityId] !== false : alwaysVisible;
        return (
          <div key={label} className={SECTION_LAYOUT_ROW_CLASS}>
            {/* 6-dot grip — absolute gutter (tooltip must not wrap positioning; see page section rows) */}
            <span
              className={`${SECTION_LAYOUT_GRIP_GUTTER_CLASS} cursor-not-allowed opacity-0 transition-opacity group-hover/row:opacity-100`}
              aria-hidden
            >
              <FixedSectionTooltip text="Section cannot be moved" position="right">
                <span className="flex h-5 w-5 items-center justify-center">
                  <GripVertical size={14} />
                </span>
              </FixedSectionTooltip>
            </span>
            {/* Eye toggle */}
            {alwaysVisible ? (
              <FixedSectionTooltip text="Always visible" position="right">
                <span className="shrink-0 p-0.5 text-primary-400 cursor-not-allowed">
                  <FontAwesomeIcon icon={faEye} className="right-panel-layout-row-icon" />
                </span>
              </FixedSectionTooltip>
            ) : (
              <button
                type="button"
                onClick={() => (visibilityId ? onToggle(visibilityId) : undefined)}
                className="shrink-0 p-0.5 text-primary-700 hover:opacity-80"
                title={isRowVisible ? `Hide ${label}` : `Show ${label}`}
                aria-label={isRowVisible ? `Hide ${label}` : `Show ${label}`}
              >
                <FontAwesomeIcon
                  icon={isRowVisible ? faEye : faEyeSlash}
                  className={`right-panel-layout-row-icon ${isRowVisible ? 'text-primary-700' : 'text-primary-500 opacity-40'}`}
                />
              </button>
            )}
            {/* Label — clickable to scroll + edit */}
            <div
              className={`flex min-w-0 flex-1 items-center gap-1.5 ${noPublishedTC && editId ? 'cursor-pointer' : ''}`}
              onClick={() => { if (noPublishedTC && editId) focusAndEdit(editId); }}
            >
              <span className="truncate text-xs font-medium text-primary-700">
                {label}
              </span>
              {/* Link copy — hover only */}
              <span className="group/copy-link relative inline-flex opacity-0 group-hover/row:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="shrink-0 p-0.5 text-primary-500 hover:text-primary-700"
                  aria-label={`Copy link for ${label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `${window.location.origin}${window.location.pathname}${anchor ?? ''}`;
                    navigator.clipboard?.writeText(url).catch(() => {});
                    setCopiedLabel(label);
                    setTimeout(() => setCopiedLabel(null), 1500);
                  }}
                >
                  <FontAwesomeIcon icon={faLink} className="right-panel-layout-row-icon" />
                </button>
                <span
                  role="tooltip"
                  className={`pointer-events-none absolute right-full top-1/2 z-[9999] mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary-800 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg transition-opacity ${
                    copiedLabel === label ? 'opacity-100' : 'opacity-0 group-hover/copy-link:opacity-100'
                  }`}
                >
                  {copiedLabel === label ? 'Link copied!' : 'Copy link'}
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-primary-800"
                    aria-hidden
                  />
                </span>
              </span>
            </div>
            {/* Pencil edit: draft tab only before any locale is live or ever published on the snapshot */}
            {noPublishedTC && editId && (
              <button
                type="button"
                className="shrink-0 p-0.5 text-primary-500 hover:text-primary-700"
                aria-label={`Edit ${label}`}
                onClick={() => focusAndEdit(editId)}
              >
                <Pencil size={12} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Section IDs that get a kebab ⋮ menu instead of a pencil (multi-action sections). */
const KEBAB_SECTION_IDS = new Set(['subprocessors', 'announcements', 'what-we-offer', 'video-resources']);
/** Kebab menu items for each multi-action section. */
const KEBAB_MENU_ITEMS: Record<string, { addLabel: string; addEditId: string; editLabel: string; editEditId: string }> = {
  subprocessors: { addLabel: 'Add Subprocessor', addEditId: 'subprocessors-add', editLabel: 'Edit Subprocessors on Page', editEditId: 'subprocessors-update' },
  announcements: { addLabel: 'Add Announcement', addEditId: 'announcements-add', editLabel: 'Edit Announcements on Page', editEditId: 'announcements-update' },
  'what-we-offer': { addLabel: 'Add New Product Offering', addEditId: 'what-we-offer-add', editLabel: 'Edit Products on Page', editEditId: 'what-we-offer-update' },
  'video-resources': { addLabel: 'Add New Video Resource', addEditId: 'video-resources-add', editLabel: 'Edit Video Resources on Page', editEditId: 'video-resources-update' },
};

function CustomizeLayoutSection({
  sectionOrder,
  sectionVisibility,
  onToggle,
  reorderSections,
  noPublishedTC = false,
  onEditSection,
}: {
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  onToggle: (id: string) => void;
  reorderSections: (dragIndex: number, dropIndex: number) => void;
  /** When true (no published TC yet), show pencil edit icons on each section row. */
  noPublishedTC?: boolean;
  /** Callback to open the edit modal for a section (pencil icon click). */
  onEditSection?: (sectionId: string) => void;
}) {
  const copy = useTrustCenterCopy();
  const [expanded, setExpanded] = useState(true);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  /** Insert before this index in the current list (0 … length). */
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  /** Kebab menu state: which section's menu is open. */
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  /** "Link copied" feedback. */
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close kebab menu on outside click / Escape
  useEffect(() => {
    if (!openMenuKey) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuKey(null);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenMenuKey(null); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onEsc); };
  }, [openMenuKey]);

  /** Scroll center preview to section, highlight, then open modal. */
  const focusAndEdit = async (editId: string, options: { openModal?: boolean } = {}) => {
    const { openModal = true } = options;
    const scrollSel = SCROLL_TARGETS[editId];
    const highlightSel = HIGHLIGHT_OVERRIDES[editId] ?? scrollSel;
    const scrollEl = scrollSel ? document.querySelector(scrollSel) : null;
    const highlightEl = highlightSel ? document.querySelector(highlightSel) : null;

    if (!scrollEl || !highlightEl) {
      if (openModal) onEditSection?.(editId);
      return;
    }

    highlightEl.classList.add('is-editing-target');
    scrollContainerTo(scrollEl);
    await waitForScrollEnd(scrollEl);
    resetShellScroll();
    await new Promise<void>((r) => window.setTimeout(r, HIGHLIGHT_DWELL_MS));

    const cleanupHighlight = () => {
      highlightEl.classList.remove('is-editing-target');
      highlightEl.classList.remove('is-editing-target--leaving');
    };

    if (openModal) {
      onEditSection?.(editId);
      highlightEl.classList.add('is-editing-target--leaving');
      window.setTimeout(cleanupHighlight, HIGHLIGHT_FADE_OUT_MS);
    } else {
      window.setTimeout(() => {
        highlightEl.classList.add('is-editing-target--leaving');
        window.setTimeout(cleanupHighlight, HIGHLIGHT_FADE_OUT_MS);
      }, HIGHLIGHT_KEEP_MS);
    }
  };

  const clearDrag = () => {
    setDraggingIndex(null);
    setDropIndicatorIndex(null);
  };

  const updateDropIndicator = (e: React.DragEvent, rowIndex: number) => {
    if (draggingIndex === null) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    let insertBefore = e.clientY < mid ? rowIndex : rowIndex + 1;
    insertBefore = Math.max(0, Math.min(insertBefore, sectionOrder.length));
    if (insertBefore === draggingIndex || insertBefore === draggingIndex + 1) {
      setDropIndicatorIndex(null);
    } else {
      setDropIndicatorIndex(insertBefore);
    }
  };

  const commitReorder = (from: number, insertBefore: number) => {
    const bounded = Math.max(0, Math.min(insertBefore, sectionOrder.length));
    if (bounded === from || bounded === from + 1) return;
    reorderSections(from, bounded);
  };

  return (
    <div className="border-b border-primary-400">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 px-5 py-3 text-left"
      >
        <span className="text-sm font-medium text-primary-700">Section Layout</span>
        {expanded ? (
          <ChevronUp size={14} className="shrink-0 text-primary-500" />
        ) : (
          <ChevronDown size={14} className="shrink-0 text-primary-500" />
        )}
      </button>
      {expanded && (
        <div className="px-5 pb-4">
          <p className="mb-1 mt-1 pr-2 text-[10px] font-medium uppercase tracking-wider text-primary-500">
            Header and Identity
          </p>
          <FixedHeaderSections sectionVisibility={sectionVisibility} onToggle={onToggle} noPublishedTC={noPublishedTC} onEditSection={onEditSection} />
          <p className="mb-1 mt-3 pr-2 text-[10px] font-medium uppercase tracking-wider text-primary-500">Page Sections</p>
          <div
            ref={listRef}
            role="list"
            className="space-y-0"
            onDragLeave={(e) => {
              if (draggingIndex === null || !listRef.current) return;
              const related = e.relatedTarget as Node | null;
              if (!related || !listRef.current.contains(related)) {
                setDropIndicatorIndex(null);
              }
            }}
          >
            {sectionOrder.map((id, index) => {
              const label =
                id === 'find-answer'
                  ? copy.documentsFaqsTitle
                  : (LAYOUT_SECTION_LABELS[id as LayoutSectionId] ?? id);
              const visible = sectionVisibility[id] ?? true;
              const isDragging = draggingIndex === index;
              return (
                <Fragment key={id}>
                  {dropIndicatorIndex === index && draggingIndex !== null ? (
                    <DropSlotPreview
                      insertBeforeIndex={index}
                      draggingIndex={draggingIndex}
                      onCommit={commitReorder}
                      onClear={clearDrag}
                    />
                  ) : null}
                  <div
                    role="listitem"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', String(index));
                      setDraggingIndex(index);
                      setDropIndicatorIndex(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      updateDropIndicator(e, index);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggingIndex === null) {
                        clearDrag();
                        return;
                      }
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      const mid = rect.top + rect.height / 2;
                      let insertBefore = e.clientY < mid ? index : index + 1;
                      insertBefore = Math.max(0, Math.min(insertBefore, sectionOrder.length));
                      commitReorder(draggingIndex, insertBefore);
                      clearDrag();
                    }}
                    onDragEnd={clearDrag}
                    className={`${SECTION_LAYOUT_ROW_CLASS} select-none transition-shadow ${
                      isDragging
                        ? 'z-10 cursor-grabbing bg-white shadow-[0_8px_24px_rgba(0,27,40,0.12)] ring-1 ring-primary-400'
                        : 'cursor-grab hover:bg-primary-100'
                    }`}
                  >
                    {/* 6-dot grip — left gutter (outside eye/label column) */}
                    <span
                      className={`${SECTION_LAYOUT_GRIP_GUTTER_CLASS} transition-opacity ${
                        isDragging ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100'
                      }`}
                      aria-hidden
                    >
                      <GripVertical size={14} />
                    </span>
                    {/* Eye toggle */}
                    <button
                      type="button"
                      draggable={false}
                      onClick={(e) => { e.stopPropagation(); onToggle(id); }}
                      className="shrink-0 p-0.5 text-primary-700 hover:opacity-80"
                      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
                    >
                      <FontAwesomeIcon
                        icon={visible ? faEye : faEyeSlash}
                        className={`right-panel-layout-row-icon ${visible ? 'text-primary-700' : 'text-primary-500 opacity-40'}`}
                      />
                    </button>
                    {/* Label — clicking the label area triggers scroll + edit */}
                    <div
                      className="flex min-w-0 flex-1 items-center gap-1.5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!noPublishedTC) return;
                        if (KEBAB_SECTION_IDS.has(id)) {
                          // For kebab sections, scroll to the section (no modal)
                          focusAndEdit(id, { openModal: false });
                        } else {
                          focusAndEdit(id);
                        }
                      }}
                    >
                      <span className="truncate text-xs font-medium text-primary-700">{label}</span>
                      {/* Link copy — hover only */}
                      <span className="group/copy-link relative inline-flex opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <button
                          type="button"
                          draggable={false}
                          className="shrink-0 p-0.5 text-primary-500 hover:text-primary-700"
                          aria-label={`Copy link for ${label}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const anchor = SCROLL_TARGETS[id];
                            const url = `${window.location.origin}${window.location.pathname}${anchor ?? ''}`;
                            navigator.clipboard?.writeText(url).catch(() => {});
                            setCopiedId(id);
                            setTimeout(() => setCopiedId(null), 1500);
                          }}
                        >
                          <FontAwesomeIcon icon={faLink} className="right-panel-layout-row-icon" />
                        </button>
                        <span
                          role="tooltip"
                          className={`pointer-events-none absolute right-full top-1/2 z-[9999] mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary-800 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg transition-opacity ${
                            copiedId === id ? 'opacity-100' : 'opacity-0 group-hover/copy-link:opacity-100'
                          }`}
                        >
                          {copiedId === id ? 'Link copied!' : 'Copy link'}
                          <span className="absolute left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-primary-800" aria-hidden />
                        </span>
                      </span>
                    </div>
                    {/* Action icon: pencil for simple sections, kebab for multi-action */}
                    {noPublishedTC && (
                      KEBAB_SECTION_IDS.has(id) ? (
                        <>
                          <button
                            type="button"
                            draggable={false}
                            className="shrink-0 flex h-5 w-5 items-center justify-center rounded text-primary-500 hover:bg-primary-200 hover:text-primary-700"
                            aria-label={`${label} actions`}
                            aria-haspopup="menu"
                            aria-expanded={openMenuKey === id}
                            onClick={(e) => { e.stopPropagation(); setOpenMenuKey(openMenuKey === id ? null : id); }}
                          >
                            <MoreVertical size={14} />
                          </button>
                          {openMenuKey === id && KEBAB_MENU_ITEMS[id] && (
                            <div
                              ref={menuRef}
                              role="menu"
                              className="absolute right-2 top-8 z-20 w-56 rounded-md border border-primary-300 bg-white py-1 shadow-lg"
                            >
                              <button
                                type="button"
                                role="menuitem"
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-primary-700 hover:bg-primary-100"
                                onClick={() => { setOpenMenuKey(null); focusAndEdit(KEBAB_MENU_ITEMS[id].addEditId); }}
                              >
                                <Plus size={12} strokeWidth={2} aria-hidden className="text-primary-600" />
                                {KEBAB_MENU_ITEMS[id].addLabel}
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-primary-700 hover:bg-primary-100"
                                onClick={() => { setOpenMenuKey(null); focusAndEdit(KEBAB_MENU_ITEMS[id].editEditId); }}
                              >
                                <Pencil size={12} strokeWidth={2} aria-hidden className="text-primary-600" />
                                {KEBAB_MENU_ITEMS[id].editLabel}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          draggable={false}
                          className="shrink-0 p-0.5 text-primary-500 hover:text-primary-700"
                          aria-label={`Edit ${label}`}
                          onClick={(e) => { e.stopPropagation(); focusAndEdit(id); }}
                        >
                          <Pencil size={12} />
                        </button>
                      )
                    )}
                  </div>
                </Fragment>
              );
            })}
            {dropIndicatorIndex === sectionOrder.length && draggingIndex !== null ? (
              <DropSlotPreview
                insertBeforeIndex={sectionOrder.length}
                draggingIndex={draggingIndex}
                onCommit={commitReorder}
                onClear={clearDrag}
              />
            ) : null}
          </div>
          <button
            type="button"
            className="mt-4 inline-flex items-center rounded-md border border-primary-400 bg-white px-3 py-2 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100/80"
          >
            Customize Headers
          </button>
        </div>
      )}
    </div>
  );
}
