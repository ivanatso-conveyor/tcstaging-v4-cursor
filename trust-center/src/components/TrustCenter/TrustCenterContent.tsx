import { Fragment, useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { getDesignerTrustCenterPresentation, getPublishedPresentation, useDesigner } from '../../context/DesignerContext';
import { ProductFilterProvider } from '../../contexts/ProductFilterContext';
import { ReviewingProductFilterProvider } from '../../contexts/ReviewingProductFilterContext';
import { LAYOUT_SECTION_IDS, type LayoutSectionId, TRUST_CENTER_BANNER_VISIBILITY_ID } from '../../constants/layoutSectionOrder';
import { LANGUAGE_MENU } from '../../constants/previewLocale';
import { DESIGNER_PREVIEW_EDGE_PAD_CLASS, DESIGNER_PREVIEW_MAX_WIDTH_CLASS } from '../../constants/designerLayout';
import StickyNav from '../Navigation/StickyNav';
import type { SearchItem } from '../../data/searchData';
import HeaderBanner from './HeaderBanner';
import IdentitySection from './IdentitySection';
import CertificationsSection from './CertificationsSection';
import DocumentsFAQsSection from './DocumentsFAQsSection';
import PhilosophySection from './PhilosophySection';
import QuickSummarySection from './QuickSummarySection';
import SubprocessorsSection from './SubprocessorsSection';
import TrustedBySection from './TrustedBySection';
import FeaturedDocumentsSection from './FeaturedDocumentsSection';
import AnnouncementsSection from './AnnouncementsSection';
import WhatWeOfferSection from './WhatWeOfferSection';
import VideoSection from './VideoSection';
import DraftPreviewFloatingBar from './DraftPreviewFloatingBar';
import DraftFullPagePreviewBanner from './DraftFullPagePreviewBanner';
import FixedSectionDnDHandle from './FixedSectionDnDHandle';
import EditSectionPlaceholderModal from './EditSectionPlaceholderModal';
import CompanyProfileModal from './CompanyProfileModal';
import QuickLinksSettingsModal from './QuickLinksSettingsModal';
import TrustCenterImageryModal from './TrustCenterImageryModal';
import BadgesSettingsModal from './BadgesSettingsModal';
import QuickSummarySettingsModal from './QuickSummarySettingsModal';
import FeaturedDocumentsSettingsModal from './FeaturedDocumentsSettingsModal';
import TrustedBySettingsModal from './TrustedBySettingsModal';
import PhilosophySettingsModal from './PhilosophySettingsModal';
import ComingSoonSettingsModal from './ComingSoonSettingsModal';
import DocumentsSearchModal from './DocumentsSearchModal';
import type { EditableTrustSectionId } from '../../contexts/TrustCenterSectionEditContext';
import { TrustCenterSectionEditProvider } from '../../contexts/TrustCenterSectionEditContext';

/** Live-edited sections in Published preview: pencil-only hover, no draft tab jump. */
const PUBLISHED_LIVE_EDIT_SECTION_IDS: readonly EditableTrustSectionId[] = ['profile', 'quick-links', 'badges', 'quick-summary', 'featured-documents', 'trusted-by', 'philosophy', 'coming-soon'];

interface TrustCenterContentProps {
  standalone?: boolean;
  /** `/trust-center?draftPreview=1` — full-page draft mirror, top **Draft Preview** banner, and blue floating preview bar (prototype). */
  draftPreviewFullPage?: boolean;
  /** `/trust-center?publishedPreview=1` — visitor snapshot like plain `/trust-center`, plus blue floating preview bar only (no draft banner). */
  publishedPreviewFullPage?: boolean;
  /** Designer right-panel tab. When 'draft' with no draft, the preview shows the empty state (no section pencils). */
  workspaceTab?: 'draft' | 'published';
  /** Switch the workspace tab (syncs right panel + toolbar). */
  onWorkspaceTabChange?: (tab: 'draft' | 'published') => void;
}

function buildRenderPlan(order: readonly string[]): LayoutSectionId[] {
  return order.filter((id): id is LayoutSectionId =>
    (LAYOUT_SECTION_IDS as readonly string[]).includes(id),
  );
}

export default function TrustCenterContent({
  standalone = false,
  draftPreviewFullPage = false,
  publishedPreviewFullPage = false,
  workspaceTab,
  onWorkspaceTabChange,
}: TrustCenterContentProps) {
  const [editSection, setEditSection] = useState<EditableTrustSectionId | null>(null);
  const { state, openDraftWorkspaceFromPublishedPreview, reorderSections, createDraft, setPreviewMode } = useDesigner();
  /** Preview-side DnD (draft mode only). Indices are into the rendered `plan`. */
  const [draggingPlanIndex, setDraggingPlanIndex] = useState<number | null>(null);
  const [dropIndicatorPlanIndex, setDropIndicatorPlanIndex] = useState<number | null>(null);
  const presentation = useMemo(() => {
    if (standalone && draftPreviewFullPage && state.drafts.length > 0) {
      return getDesignerTrustCenterPresentation(state);
    }
    if (standalone) {
      return getPublishedPresentation(state);
    }
    return getDesignerTrustCenterPresentation(state);
  }, [standalone, draftPreviewFullPage, state]);
  const v = presentation.sectionVisibility;
  /** Public `/trust-center` ignores designer hide toggles so the page always shows full content. */
  const show = (id: string) => standalone || (v[id] ?? true);
  const sectionOrder = presentation.sectionOrder;

  const onSectionClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onDocumentClick = (_item: SearchItem) => {
    /* Prototype: document viewer not wired */
  };

  const onAskAI = (_query: string) => {
    /* Prototype: chat not wired */
  };

  const plan = buildRenderPlan(sectionOrder).filter((id) => show(id));
  const previewAreaRef = useRef<HTMLDivElement>(null);

  // Show a skeleton placeholder when published preview has no active (visitor-live) Trust Center.
  const pub = getPublishedPresentation(state);
  const isVisitorLive = LANGUAGE_MENU.some((item) => pub.localeLive[item.locale]);
  const hasEverPublished = LANGUAGE_MENU.some((item) => pub.localeEverPublished[item.locale]);
  // Show a draft-specific empty state when the right panel is on Draft but there's no active draft.
  const showDraftEmptyState =
    !standalone && workspaceTab === 'draft' && state.drafts.length === 0;

  const showPublishedSkeleton =
    !standalone && state.previewMode === 'published' && !isVisitorLive && !showDraftEmptyState;

  /**
   * DnD is offered in the designer whenever the user is on the Draft right-panel tab,
   * including the empty-draft state (drag is the one allowed edit there; first drop
   * auto-creates the draft via patchActiveDraft). Published preview and standalone stay static.
   */
  const canReorder =
    !standalone && (state.previewMode === 'draft' || workspaceTab === 'draft');

  const clearDrag = useCallback(() => {
    setDraggingPlanIndex(null);
    setDropIndicatorPlanIndex(null);
  }, []);

  const commitReorder = useCallback(
    (fromPlanIdx: number, insertBeforePlanIdx: number) => {
      if (fromPlanIdx < 0 || fromPlanIdx >= plan.length) return;
      const bounded = Math.max(0, Math.min(insertBeforePlanIdx, plan.length));
      if (bounded === fromPlanIdx || bounded === fromPlanIdx + 1) return;
      const draggedId = plan[fromPlanIdx];
      const fromSectionIdx = sectionOrder.indexOf(draggedId);
      if (fromSectionIdx < 0) return;
      const insertBeforeSectionIdx =
        bounded >= plan.length
          ? sectionOrder.length
          : sectionOrder.indexOf(plan[bounded]);
      if (insertBeforeSectionIdx < 0) return;
      reorderSections(fromSectionIdx, insertBeforeSectionIdx);
    },
    [plan, sectionOrder, reorderSections],
  );

  const brandVars = {
    '--trust-center-header-color': presentation.primaryColor,
    '--trust-center-accent-color': presentation.accentColor,
    '--color-trust-icon': presentation.accentColor,
  } as CSSProperties;

  const onSectionEdit = useCallback(
    (id: EditableTrustSectionId) => {
      if (!standalone && state.previewMode === 'published') {
        if (!PUBLISHED_LIVE_EDIT_SECTION_IDS.includes(id)) {
          openDraftWorkspaceFromPublishedPreview();
        }
        setEditSection(id);
        return;
      }
      setEditSection(id);
    },
    [standalone, state.previewMode, openDraftWorkspaceFromPublishedPreview],
  );

  const sectionEditValue = useMemo(
    () => {
      // Published preview: always show overlays (Draft an Edit / pencil-only).
      // Draft preview: show section pencil overlays when no locale is currently visitor-live.
      // This covers two cases:
      //   1. Brand-new workspace (never published) — pencils let you configure before first publish.
      //   2. Unpublished Trust Center — user toggled off the live TC and it moved to draft;
      //      they can now edit everything freely via pencils until they re-publish.
      // Once any locale is visitor-live, draft edits use drag-and-drop in the right panel
      // and content edits go through the Published tab "Edit Live Content" flow.
      const editEnabled =
        !standalone &&
        (state.previewMode === 'published' ||
          (state.previewMode === 'draft' && !isVisitorLive));
      return {
        enabled: editEnabled,
        previewMode:
          standalone && draftPreviewFullPage ? ('draft' as const) : standalone ? ('published' as const) : state.previewMode,
        onSectionEdit,
      };
    },
    [standalone, draftPreviewFullPage, state.previewMode, isVisitorLive, onSectionEdit],
  );

  const renderSection = (id: LayoutSectionId) => {
    switch (id) {
      case 'badges':
        return <CertificationsSection />;
      case 'find-answer':
        return <DocumentsFAQsSection />;
      case 'philosophy':
        return <PhilosophySection />;
      case 'quick-summary':
        return <QuickSummarySection />;
      case 'subprocessors':
        return <SubprocessorsSection />;
      case 'trusted-by':
        return <TrustedBySection />;
      case 'featured-documents':
        return <FeaturedDocumentsSection />;
      case 'announcements':
        return <AnnouncementsSection />;
      case 'what-we-offer':
        return <WhatWeOfferSection />;
      case 'video-resources':
        return <VideoSection />;
      default:
        return null;
    }
  };

  return (
    <ProductFilterProvider>
      <ReviewingProductFilterProvider>
        <div
          ref={previewAreaRef}
          className={`min-w-0 ${
            standalone ? 'min-h-screen bg-primary-200' : 'flex min-h-0 w-full flex-1 flex-col bg-primary-100'
          }`}
          style={brandVars}
        >
          <TrustCenterSectionEditProvider value={sectionEditValue}>
            {showPublishedSkeleton ? (
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
                <PublishedEmptySkeleton
                  hasEverPublished={hasEverPublished}
                  onViewDraft={() => {
                    setPreviewMode('draft');
                    onWorkspaceTabChange?.('draft');
                  }}
                />
              </div>
            ) : showDraftEmptyState ? (
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
                {isVisitorLive ? (
                  <DraftEmptySkeletonLiveNoDraft onCreateDraft={createDraft} />
                ) : (
                  <DraftEmptySkeleton onCreateDraft={createDraft} />
                )}
              </div>
            ) : (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {!standalone && <div className="h-3 shrink-0" aria-hidden />}
            {standalone ? (
              <>
                {draftPreviewFullPage && state.drafts.length > 0 ? (
                  <DraftFullPagePreviewBanner
                    draftName={
                      state.drafts.find((d) => d.id === state.activeDraftId)?.name ??
                      state.drafts[0]?.name ??
                      'Untitled'
                    }
                  />
                ) : null}
                <StickyNav
                  onSectionClick={onSectionClick}
                  onDocumentClick={onDocumentClick}
                  onAskAI={onAskAI}
                  savedTrustCenterImageryOverride={presentation.savedTrustCenterImagery}
                  useViewportSticky
                />
              </>
            ) : (
              <div
                className={`shrink-0 overflow-hidden rounded-t-lg ${DESIGNER_PREVIEW_EDGE_PAD_CLASS}`}
              >
                <div className={DESIGNER_PREVIEW_MAX_WIDTH_CLASS}>
                  <StickyNav
                    onSectionClick={onSectionClick}
                    onDocumentClick={onDocumentClick}
                    onAskAI={onAskAI}
                    savedTrustCenterImageryOverride={presentation.savedTrustCenterImagery}
                    useViewportSticky={false}
                  />
                </div>
              </div>
            )}
            {/* Designer: scroll is only inside this region so Mediacore bar stays fixed below the staging toolbar. */}
            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            {/* Grey page shell; Trust Center sits in a centered white card (designer preview matches public page). */}
            <div className={`${DESIGNER_PREVIEW_EDGE_PAD_CLASS} pb-10 pt-0`}>
                <div className={`${DESIGNER_PREVIEW_MAX_WIDTH_CLASS} overflow-hidden rounded-t-none rounded-b-xl bg-white shadow-sm ring-1 ring-primary-400/50`}>
                {(standalone || show(TRUST_CENTER_BANNER_VISIBILITY_ID)) ? (
                  canReorder ? (
                    <FixedSectionDnDHandle>
                      <HeaderBanner savedTrustCenterImageryOverride={presentation.savedTrustCenterImagery} />
                    </FixedSectionDnDHandle>
                  ) : (
                    <HeaderBanner savedTrustCenterImageryOverride={presentation.savedTrustCenterImagery} />
                  )
                ) : null}

                <div id="section-just-for-you" className="scroll-mt-20 h-px w-full shrink-0" aria-hidden />

                {canReorder ? (
                  <FixedSectionDnDHandle>
                    <IdentitySection />
                  </FixedSectionDnDHandle>
                ) : (
                  <IdentitySection />
                )}

                <Divider />

                {plan.map((id, idx) => (
                  <Fragment key={id}>
                    {canReorder &&
                    dropIndicatorPlanIndex === idx &&
                    draggingPlanIndex !== null &&
                    draggingPlanIndex !== idx &&
                    draggingPlanIndex !== idx - 1 ? (
                      <SectionDropIndicator />
                    ) : null}
                    <SectionDnDWrapper
                      canReorder={canReorder}
                      index={idx}
                      isDragging={draggingPlanIndex === idx}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', String(idx));
                        setDraggingPlanIndex(idx);
                        setDropIndicatorPlanIndex(null);
                      }}
                      onDragOver={(e) => {
                        if (draggingPlanIndex === null) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const mid = rect.top + rect.height / 2;
                        let insertBefore = e.clientY < mid ? idx : idx + 1;
                        insertBefore = Math.max(0, Math.min(insertBefore, plan.length));
                        if (insertBefore === draggingPlanIndex || insertBefore === draggingPlanIndex + 1) {
                          setDropIndicatorPlanIndex(null);
                        } else {
                          setDropIndicatorPlanIndex(insertBefore);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggingPlanIndex === null) {
                          clearDrag();
                          return;
                        }
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const mid = rect.top + rect.height / 2;
                        let insertBefore = e.clientY < mid ? idx : idx + 1;
                        insertBefore = Math.max(0, Math.min(insertBefore, plan.length));
                        commitReorder(draggingPlanIndex, insertBefore);
                        clearDrag();
                      }}
                      onDragEnd={clearDrag}
                    >
                      {renderSection(id)}
                    </SectionDnDWrapper>
                    {idx < plan.length - 1 ? <Divider /> : null}
                  </Fragment>
                ))}
                {canReorder &&
                dropIndicatorPlanIndex === plan.length &&
                draggingPlanIndex !== null &&
                draggingPlanIndex !== plan.length - 1 ? (
                  <SectionDropIndicator />
                ) : null}
              </div>
            </div>
            </div>
            </div>
            )}
            {editSection === 'quick-links' ? (
              <QuickLinksSettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'profile' ? (
              <CompanyProfileModal onClose={() => setEditSection(null)} />
            ) : editSection === 'banner' || editSection === 'nav-brand' ? (
              <TrustCenterImageryModal onClose={() => setEditSection(null)} />
            ) : editSection === 'badges' ? (
              <BadgesSettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'quick-summary' ? (
              <QuickSummarySettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'featured-documents' ? (
              <FeaturedDocumentsSettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'trusted-by' ? (
              <TrustedBySettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'philosophy' ? (
              <PhilosophySettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'coming-soon' ? (
              <ComingSoonSettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'find-answer' ? (
              <DocumentsSearchModal
                initialPanelKey="documents"
                onClose={() => setEditSection(null)}
              />
            ) : (
              <EditSectionPlaceholderModal section={editSection} onClose={() => setEditSection(null)} />
            )}
          </TrustCenterSectionEditProvider>
          {standalone &&
          ((draftPreviewFullPage && state.drafts.length > 0) || publishedPreviewFullPage) ? (
            <DraftPreviewFloatingBar containerRef={previewAreaRef} />
          ) : null}
        </div>
      </ReviewingProductFilterProvider>
    </ProductFilterProvider>
  );
}

function Divider() {
  return <div className="mx-10 my-10 border-t border-primary-400" />;
}

/**
 * Drag-and-drop wrapper for a Trust Center section in the designer draft preview.
 * Shows a grip handle on hover; the handle is the draggable element so text selection
 * inside the section stays intact. Drop target is the whole section.
 */
function SectionDnDWrapper({
  canReorder,
  index,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  children,
}: {
  canReorder: boolean;
  index: number;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  children: ReactNode;
}) {
  if (!canReorder) {
    return <>{children}</>;
  }
  return (
    <div
      className={`group/tc-drag relative transition-opacity ${
        isDragging ? 'opacity-40' : ''
      }`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <span
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        role="button"
        tabIndex={0}
        aria-label={`Drag to reorder section ${index + 1}`}
        className="absolute left-1 top-8 z-30 flex h-7 w-5 cursor-grab items-center justify-center rounded border border-primary-400 bg-white text-primary-600 opacity-0 shadow-sm transition-opacity hover:text-primary-800 active:cursor-grabbing group-hover/tc-drag:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
      >
        <FontAwesomeIcon icon={faGripVertical} className="h-3 w-3" aria-hidden />
      </span>
      {children}
    </div>
  );
}

/** Blue indicator line that appears between sections while dragging, showing where the drop will land. */
function SectionDropIndicator() {
  return (
    <div className="mx-10 my-3 h-1 rounded-full bg-link-400" aria-hidden />
  );
}

/** Spot illustration for the **Draft** empty-state overlay (inline SVG, patterns.svg from .Empty States). */
function EmptyStateIllustration() {
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="52" cy="52" r="52" fill="#33C69F" fillOpacity="0.15" />
      <g clipPath="url(#es_clip)">
        <rect x="30.047" y="13.5668" width="14.4157" height="14.4157" transform="rotate(90 30.047 13.5668)" fill="white" stroke="#47687D" strokeWidth="2" />
        <rect x="30.047" y="27.6372" width="14.4157" height="14.4157" transform="rotate(90 30.047 27.6372)" fill="white" stroke="#47687D" strokeWidth="2" />
        <rect x="30.047" y="41.7079" width="14.4157" height="14.4157" transform="rotate(90 30.047 41.7079)" fill="white" stroke="#47687D" strokeWidth="2" />
        <rect x="30.047" y="55.7784" width="14.4157" height="14.4157" transform="rotate(90 30.047 55.7784)" fill="white" stroke="#47687D" strokeWidth="2" />
      </g>
      <path d="M91.0197 9.78772L91.0197 22.859L76.6036 22.859L76.6036 9.78772C76.6038 9.04501 77.2066 8.44299 77.9493 8.44299L89.6749 8.44299L89.8116 8.44983C90.4451 8.51394 90.9487 9.01759 91.0128 9.651L91.0197 9.78772Z" fill="white" stroke="#47687D" strokeWidth="2" />
      <rect x="91.0197" y="22.5135" width="14.4157" height="14.4157" transform="rotate(90 91.0197 22.5135)" fill="white" stroke="#47687D" strokeWidth="2" />
      <path d="M91.0197 49.6544C91.0197 50.3972 90.4176 50.9999 89.6749 51.0001L77.9493 51.0001C77.2065 51.0001 76.6036 50.3973 76.6036 49.6544L76.6036 36.5841L91.0197 36.5841L91.0197 49.6544Z" fill="white" stroke="#47687D" strokeWidth="2" />
      <path d="M76.9491 36.9296L63.8788 36.9296C63.1359 36.9296 62.5331 36.3267 62.5331 35.5839L62.5331 23.8583C62.5333 23.1156 63.136 22.5135 63.8788 22.5135L76.9491 22.5135L76.9491 36.9296Z" fill="white" stroke="#47687D" strokeWidth="2" />
      <path d="M46.1177 94.2122L46.1177 81.1409L60.5337 81.1409L60.5337 94.2122C60.5335 94.9549 59.9307 95.5569 59.188 95.5569L47.4624 95.5569L47.3257 95.55C46.6923 95.4859 46.1886 94.9823 46.1245 94.3489L46.1177 94.2122Z" fill="white" stroke="#47687D" strokeWidth="2" />
      <rect x="46.1177" y="81.4863" width="14.4157" height="14.4157" transform="rotate(-90 46.1177 81.4863)" fill="white" stroke="#47687D" strokeWidth="2" />
      <path d="M46.1177 54.3455C46.1177 53.6027 46.7197 53 47.4624 52.9998L59.188 52.9998C59.9309 52.9998 60.5337 53.6026 60.5337 54.3455L60.5337 67.4158L46.1177 67.4158L46.1177 54.3455Z" fill="white" stroke="#47687D" strokeWidth="2" />
      <path d="M60.1882 81.141L73.2585 81.141C74.0014 81.141 74.6042 81.7438 74.6042 82.4867L74.6042 94.2123C74.604 94.955 74.0013 95.557 73.2585 95.557L60.1882 95.557L60.1882 81.141Z" fill="white" stroke="#47687D" strokeWidth="2" />
      <defs>
        <clipPath id="es_clip">
          <rect x="31.047" y="12.5668" width="58.6274" height="16.4157" rx="2.3451" transform="rotate(90 31.047 12.5668)" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/**
 * Published-tab empty state: no visitor-live Trust Center (`Imagery/no-results.png`).
 * Draft empty state keeps `EmptyStateIllustration` SVG.
 * Figma: Trust Center Vision HQ > Designer > Published preview empty state
 */
function PublishedEmptyStateIllustration() {
  const src = `${import.meta.env.BASE_URL}Imagery/no-results.png`;
  return (
    <img
      src={src}
      alt=""
      width={112}
      height={112}
      className="mx-auto h-[112px] w-[112px] object-contain"
      decoding="async"
    />
  );
}

/**
 * Clipboard illustration: Draft tab while visitor-live but no draft (e.g. after publish consumed the draft).
 * Asset: `public/Imagery/draft-tab-live-no-draft-clipboard.png`
 * Figma: Trust Center Vision HQ > Designer > Draft preview > No draft while live
 */
function LiveNoDraftEmptyIllustration() {
  const src = `${import.meta.env.BASE_URL}Imagery/draft-tab-live-no-draft-clipboard.png`;
  return (
    <img
      src={src}
      alt=""
      width={112}
      height={112}
      className="mx-auto h-[112px] w-[112px] object-contain"
      decoding="async"
    />
  );
}

/**
 * Shared grey skeleton + centered white card for draft-tab empty states (cold start vs live-without-draft).
 */
function DraftEmptyStateLayout({
  illustration,
  title,
  description,
  onCreateDraft,
}: {
  illustration: ReactNode;
  title: string;
  description: string;
  onCreateDraft: () => void;
}) {
  const cardTextStyle = {
    fontSize: '14px',
    lineHeight: '135%',
    color: '#204156',
    fontFamily: "'Neue Montreal', sans-serif",
  } as const;

  return (
    <div className="relative px-4 pb-10 pt-0 sm:px-6 md:px-8">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-primary-400/50 opacity-60">
        <div className="flex h-[60px] items-center gap-4 bg-primary-400/30 px-6">
          <div className="h-8 w-8 rounded bg-primary-400/50" />
          <div className="h-4 w-24 rounded bg-primary-400/50" />
          <div className="mx-auto h-8 w-64 rounded-full bg-primary-400/35" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-12 rounded bg-primary-400/35" />
            <div className="h-4 w-16 rounded bg-primary-400/35" />
            <div className="h-8 w-24 rounded-full bg-primary-400/35" />
          </div>
        </div>
        <div className="h-[200px] w-full bg-primary-300/60" />
        <div className="mx-10 pt-10 pb-8">
          <div className="flex gap-10">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="h-7 w-72 rounded bg-primary-300/60" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-primary-300/45" />
                <div className="h-3.5 w-5/6 rounded bg-primary-300/45" />
                <div className="h-3.5 w-4/6 rounded bg-primary-300/45" />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-6 w-28 rounded bg-primary-300/35" />
                <div className="h-6 w-20 rounded bg-primary-300/35" />
                <div className="h-6 w-28 rounded bg-primary-300/35" />
                <div className="h-6 w-32 rounded bg-primary-300/35" />
              </div>
            </div>
            <div className="w-[280px] shrink-0 space-y-3 rounded-lg border border-primary-300/40 p-5">
              <div className="h-4 w-24 rounded bg-primary-300/50" />
              <div className="space-y-2.5">
                <div className="h-3.5 w-36 rounded bg-primary-300/35" />
                <div className="h-3.5 w-28 rounded bg-primary-300/35" />
                <div className="h-3.5 w-24 rounded bg-primary-300/35" />
                <div className="h-3.5 w-32 rounded bg-primary-300/35" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-10 border-t border-primary-300/40" />
        <div className="mx-10 py-10 space-y-5">
          <div className="h-5 w-28 rounded bg-primary-300/50" />
          <div className="flex gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-lg bg-primary-300/40" />
                <div className="h-3 w-12 rounded bg-primary-300/30" />
              </div>
            ))}
          </div>
        </div>
        <div className="mx-10 border-t border-primary-300/40" />
        <div className="mx-10 py-10 space-y-5">
          <div className="h-5 w-52 rounded bg-primary-300/50" />
          <div className="flex gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-primary-300/30" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg border border-primary-300/35 bg-primary-200/30 p-4">
                <div className="h-3.5 w-3/4 rounded bg-primary-300/35" />
                <div className="mt-2 h-3 w-1/2 rounded bg-primary-300/30" />
              </div>
            ))}
          </div>
        </div>
        <div className="mx-10 border-t border-primary-300/40" />
        <div className="mx-10 py-10 space-y-4">
          <div className="h-5 w-32 rounded bg-primary-300/50" />
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-primary-300/35" />
            <div className="h-3.5 w-5/6 rounded bg-primary-300/35" />
            <div className="h-3.5 w-3/4 rounded bg-primary-300/35" />
          </div>
        </div>
        <div className="h-20" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-start justify-center" style={{ paddingTop: '18%' }}>
        <div className="pointer-events-auto flex w-[420px] flex-col items-center rounded-xl bg-white px-10 pb-10 pt-12 text-center shadow-lg ring-1 ring-primary-200">
          {illustration}
          <h3 className="mt-6 font-medium" style={cardTextStyle}>
            {title}
          </h3>
          <p className="mt-2 max-w-[320px]" style={{ ...cardTextStyle, fontWeight: 400 }}>
            {description}
          </p>
          <button
            type="button"
            className="mt-5 rounded-md bg-brand-400 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            onClick={onCreateDraft}
          >
            Create Draft
          </button>
        </div>
      </div>
    </div>
  );
}

/** Empty state: Draft tab, no draft, not visitor-live (cold start or unpublished). */
function DraftEmptySkeleton({ onCreateDraft }: { onCreateDraft: () => void }) {
  return (
    <DraftEmptyStateLayout
      illustration={<EmptyStateIllustration />}
      title="There is no Trust Center Draft."
      description="Start a draft now, and share with a draft preview link."
      onCreateDraft={onCreateDraft}
    />
  );
}

/** Empty state: Draft tab, visitor-live, no draft file (layout/imagery edits need a new draft). */
function DraftEmptySkeletonLiveNoDraft({ onCreateDraft }: { onCreateDraft: () => void }) {
  return (
    <DraftEmptyStateLayout
      illustration={<LiveNoDraftEmptyIllustration />}
      title="Your Trust center is currently live"
      description="To make edits to section layout or imagery, start a draft."
      onCreateDraft={onCreateDraft}
    />
  );
}

/** Skeleton placeholder shown in the center preview when the Published tab has no active Trust Center. */
function PublishedEmptySkeleton({ hasEverPublished, onViewDraft }: { hasEverPublished: boolean; onViewDraft: () => void }) {
  return (
    <div className="relative px-4 pb-10 pt-0 sm:px-6 md:px-8">
      {/* Skeleton background — faded to look inactive but with visible detail */}
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-primary-400/50 opacity-60">
        {/* Nav bar skeleton */}
        <div className="flex h-[60px] items-center gap-4 bg-primary-400/30 px-6">
          <div className="h-8 w-8 rounded bg-primary-400/50" />
          <div className="h-4 w-24 rounded bg-primary-400/50" />
          <div className="mx-auto h-8 w-64 rounded-full bg-primary-400/35" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-12 rounded bg-primary-400/35" />
            <div className="h-4 w-16 rounded bg-primary-400/35" />
            <div className="h-8 w-24 rounded-full bg-primary-400/35" />
          </div>
        </div>

        {/* Banner skeleton */}
        <div className="h-[200px] w-full bg-primary-300/60" />

        {/* Identity section skeleton */}
        <div className="mx-10 pt-10 pb-8">
          <div className="flex gap-10">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="h-7 w-72 rounded bg-primary-300/60" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-primary-300/45" />
                <div className="h-3.5 w-5/6 rounded bg-primary-300/45" />
                <div className="h-3.5 w-4/6 rounded bg-primary-300/45" />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-6 w-28 rounded bg-primary-300/35" />
                <div className="h-6 w-20 rounded bg-primary-300/35" />
                <div className="h-6 w-28 rounded bg-primary-300/35" />
                <div className="h-6 w-32 rounded bg-primary-300/35" />
              </div>
            </div>
            <div className="w-[280px] shrink-0 space-y-3 rounded-lg border border-primary-300/40 p-5">
              <div className="h-4 w-24 rounded bg-primary-300/50" />
              <div className="space-y-2.5">
                <div className="h-3.5 w-36 rounded bg-primary-300/35" />
                <div className="h-3.5 w-28 rounded bg-primary-300/35" />
                <div className="h-3.5 w-24 rounded bg-primary-300/35" />
                <div className="h-3.5 w-32 rounded bg-primary-300/35" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-10 border-t border-primary-300/40" />

        {/* Certifications skeleton */}
        <div className="mx-10 py-10 space-y-5">
          <div className="h-5 w-28 rounded bg-primary-300/50" />
          <div className="flex gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-lg bg-primary-300/40" />
                <div className="h-3 w-12 rounded bg-primary-300/30" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-10 border-t border-primary-300/40" />

        {/* Documents section skeleton */}
        <div className="mx-10 py-10 space-y-5">
          <div className="h-5 w-52 rounded bg-primary-300/50" />
          <div className="flex gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-primary-300/30" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg border border-primary-300/35 bg-primary-200/30 p-4">
                <div className="h-3.5 w-3/4 rounded bg-primary-300/35" />
                <div className="mt-2 h-3 w-1/2 rounded bg-primary-300/30" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-10 border-t border-primary-300/40" />

        {/* Philosophy skeleton */}
        <div className="mx-10 py-10 space-y-4">
          <div className="h-5 w-32 rounded bg-primary-300/50" />
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-primary-300/35" />
            <div className="h-3.5 w-5/6 rounded bg-primary-300/35" />
            <div className="h-3.5 w-3/4 rounded bg-primary-300/35" />
          </div>
        </div>

        {/* Bottom spacer so the skeleton fills behind the overlay */}
        <div className="h-20" />
      </div>

      {/* Centered overlay card on top of the skeleton */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center" style={{ paddingTop: '18%' }}>
        <div className="pointer-events-auto flex w-[420px] flex-col items-center rounded-xl bg-white px-10 pb-10 pt-12 text-center shadow-lg ring-1 ring-primary-200">
          <PublishedEmptyStateIllustration />
          <h3
            className="mt-6 font-medium"
            style={{ fontSize: '14px', lineHeight: '135%', color: '#204156', fontFamily: "'Neue Montreal', sans-serif" }}
          >
            There is no published Trust Center.
          </h3>
          <p
            className="mt-2 max-w-[320px]"
            style={{ fontSize: '14px', lineHeight: '135%', color: '#204156', fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
          >
            {hasEverPublished
              ? 'Your Trust Center has been unpublished. Visit the Draft tab to make changes and republish.'
              : 'Your active trust center will appear here after your draft is published. Reach out to Conveyor Support to claim your branded url.'}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-primary-400 px-5 py-2 text-sm font-medium text-primary-800 shadow-sm transition-colors hover:bg-primary-100"
            >
              Contact Support
            </button>
            <button
              type="button"
              className="rounded-md bg-brand-400 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
              onClick={onViewDraft}
            >
              View Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
