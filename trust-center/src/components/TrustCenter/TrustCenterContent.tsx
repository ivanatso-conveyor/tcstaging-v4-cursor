import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { ChevronDown, ExternalLink, Share2, Users, User } from 'lucide-react';
import { getDesignerTrustCenterPresentation, getPublishedPresentation, useDesigner } from '../../context/DesignerContext';
import { ProductFilterProvider } from '../../contexts/ProductFilterContext';
import { ReviewingProductFilterProvider } from '../../contexts/ReviewingProductFilterContext';
import { LAYOUT_SECTION_IDS, type LayoutSectionId } from '../../constants/layoutSectionOrder';
import { LANGUAGE_MENU } from '../../constants/previewLocale';
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
import type { EditableTrustSectionId } from '../../contexts/TrustCenterSectionEditContext';
import { TrustCenterSectionEditProvider } from '../../contexts/TrustCenterSectionEditContext';

/** Live-edited sections in Published preview: pencil-only hover, no draft tab jump. */
const PUBLISHED_LIVE_EDIT_SECTION_IDS: readonly EditableTrustSectionId[] = ['profile', 'quick-links', 'badges', 'quick-summary', 'featured-documents', 'trusted-by', 'philosophy', 'coming-soon'];

interface TrustCenterContentProps {
  standalone?: boolean;
  /** Designer right-panel tab. When 'draft' with no draft, the preview is view-only (no pencils). */
  workspaceTab?: 'draft' | 'published';
  /** Switch the workspace tab (syncs right panel + toolbar). */
  onWorkspaceTabChange?: (tab: 'draft' | 'published') => void;
}

function buildRenderPlan(order: readonly string[]): LayoutSectionId[] {
  return order.filter((id): id is LayoutSectionId =>
    (LAYOUT_SECTION_IDS as readonly string[]).includes(id),
  );
}

export default function TrustCenterContent({ standalone = false, workspaceTab, onWorkspaceTabChange }: TrustCenterContentProps) {
  const [editSection, setEditSection] = useState<EditableTrustSectionId | null>(null);
  const { state, openDraftWorkspaceFromPublishedPreview, reorderSections, createDraft, setPreviewMode } = useDesigner();
  /** Preview-side DnD (draft mode only). Indices are into the rendered `plan`. */
  const [draggingPlanIndex, setDraggingPlanIndex] = useState<number | null>(null);
  const [dropIndicatorPlanIndex, setDropIndicatorPlanIndex] = useState<number | null>(null);
  const presentation = useMemo(
    () =>
      standalone ? getPublishedPresentation(state) : getDesignerTrustCenterPresentation(state),
    [standalone, state],
  );
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
      // In draft mode, disable hover-to-edit pencil overlays on the centre preview —
      // section edits are driven from the Section Layout panel (drag-and-drop + pencil
      // icons in the right panel). The user would have to switch to Published preview to
      // get "Draft an Edit" overlays.
      const editEnabled = !standalone && state.previewMode === 'published';
      return {
        enabled: editEnabled,
        previewMode: standalone ? ('published' as const) : state.previewMode,
        onSectionEdit,
      };
    },
    [standalone, state.previewMode, onSectionEdit],
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
          className={`min-w-0 bg-primary-200 ${
            standalone ? 'min-h-screen' : 'min-h-0 w-full flex-1 overflow-y-auto'
          }`}
          style={brandVars}
        >
          <TrustCenterSectionEditProvider value={sectionEditValue}>
            {showPublishedSkeleton ? (
              <PublishedEmptySkeleton hasEverPublished={hasEverPublished} onViewDraft={() => { setPreviewMode('draft'); onWorkspaceTabChange?.('draft'); }} />
            ) : showDraftEmptyState ? (
              <DraftEmptySkeleton onCreateDraft={createDraft} />
            ) : (
            <>
            <StickyNav
              onSectionClick={onSectionClick}
              onDocumentClick={onDocumentClick}
              onAskAI={onAskAI}
              savedTrustCenterImageryOverride={presentation.savedTrustCenterImagery}
            />
            {/* Grey page shell; Trust Center sits in a centered white card (designer preview matches public page). */}
            <div className="px-4 pb-10 pt-0 sm:px-6 md:px-8">
              <div className="mx-auto max-w-[1360px] overflow-hidden rounded-t-none rounded-b-xl bg-white shadow-sm ring-1 ring-primary-400/50">
                <HeaderBanner savedTrustCenterImageryOverride={presentation.savedTrustCenterImagery} />

                <div id="section-just-for-you" className="scroll-mt-20 h-px w-full shrink-0" aria-hidden />

                {(standalone || show('company-profile')) ? <IdentitySection /> : null}

                {(standalone || show('company-profile')) ? <Divider /> : null}

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
            </>
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
            ) : (
              <EditSectionPlaceholderModal section={editSection} onClose={() => setEditSection(null)} />
            )}
          </TrustCenterSectionEditProvider>
          {!standalone && workspaceTab === 'draft' && !showDraftEmptyState && <PreviewAsBar containerRef={previewAreaRef} />}
          {!standalone && workspaceTab === 'published' && isVisitorLive && <PublishedViewBar containerRef={previewAreaRef} />}
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

const SEGMENT_OPTIONS = ['External - Approved', 'External - Not approved', 'Myself'] as const;

/** Floating blue bar pinned to the visible bottom of the Trust Center preview area via a portal. */
function PreviewAsBar({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>(SEGMENT_OPTIONS[0]);
  const [pos, setPos] = useState<{ left: number; width: number; bottom: number } | null>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      // Use the container's left/width but clamp bottom to the viewport
      // (the container may extend below the viewport when not height-constrained).
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      setPos({ left: rect.left, width: rect.width, bottom: window.innerHeight - visibleBottom });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [containerRef]);

  if (!pos || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        className="pointer-events-none fixed z-40 flex justify-center"
        style={{ left: pos.left, width: pos.width, bottom: pos.bottom + 16 }}
      >
        <div
          className="pointer-events-auto flex h-10 w-full max-w-[952px] items-center justify-between rounded-xl px-5 shadow-lg"
          style={{ backgroundColor: '#0569CB' }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="text-[13px] font-medium text-white"
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              Previewing as:
            </span>
            <button
              ref={pillRef}
              type="button"
              onClick={() => setSelectorOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{ backgroundColor: '#0052B1' }}
            >
              {activeSegment}
              <ChevronDown size={13} strokeWidth={2} aria-hidden />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white transition-colors hover:text-white/80"
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <Share2 size={13} strokeWidth={2} aria-hidden />
              Share
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white transition-colors hover:text-white/80"
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <ExternalLink size={13} strokeWidth={2} aria-hidden />
              Open in new tab
            </button>
          </div>
        </div>
      </div>
      {selectorOpen && (
        <SegmentSelectorPopover
          anchorRef={pillRef}
          activeSegment={activeSegment}
          onSelect={(seg) => {
            setActiveSegment(seg);
            setSelectorOpen(false);
          }}
          onClose={() => setSelectorOpen(false)}
        />
      )}
    </>,
    document.body,
  );
}

/** Popover anchored above the segment pill for choosing a preview segment or email. */
function SegmentSelectorPopover({
  anchorRef,
  activeSegment,
  onSelect,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  activeSegment: string;
  onSelect: (segment: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'segment' | 'email'>('segment');
  const [selected, setSelected] = useState(activeSegment);
  const [anchor, setAnchor] = useState<{ left: number; bottom: number } | null>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setAnchor({ left: rect.left, bottom: window.innerHeight - rect.top + 8 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [anchorRef]);

  if (!anchor) return null;

  return (
    <>
      <div className="fixed inset-0 z-[199]" onClick={onClose} />
      <div
        className="fixed z-[200] w-[380px] rounded-xl border border-primary-300 bg-white shadow-2xl"
        style={{ left: anchor.left, bottom: anchor.bottom }}
      >
        {/* Toggle tabs — pill-style segmented control */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex rounded-lg border border-primary-300 bg-primary-100 p-0.5">
            <button
              type="button"
              onClick={() => setTab('segment')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === 'segment'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-primary-500 hover:text-primary-700'
              }`}
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <Users size={13} strokeWidth={2} />
              User segment
            </button>
            <button
              type="button"
              onClick={() => setTab('email')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === 'email'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-primary-500 hover:text-primary-700'
              }`}
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <User size={13} strokeWidth={2} />
              User email address
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pb-4">
          {tab === 'segment' ? (
            <>
              <p
                className="mb-2 text-xs font-medium text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              >
                Select option:
              </p>
              <div className="flex gap-1.5">
                {SEGMENT_OPTIONS.map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setSelected(seg)}
                    className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected === seg
                        ? 'border-brand-400 bg-brand-400/10 text-primary-800'
                        : 'border-primary-300 text-primary-700 hover:border-primary-500 hover:bg-primary-100'
                    }`}
                    style={{ fontFamily: "'Neue Montreal', sans-serif" }}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              <p
                className="mb-1.5 mt-4 text-xs font-medium text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              >
                Add access group (Optional)
              </p>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-md border border-primary-300 bg-white px-2.5 py-1.5 pr-7 text-xs text-primary-500"
                  style={{ fontFamily: "'Neue Montreal', sans-serif" }}
                  defaultValue=""
                >
                  <option value="" disabled>Search for an access group</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-500"
                />
              </div>
            </>
          ) : (
            <>
              <p
                className="mb-2 text-xs font-medium text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              >
                Enter email address:
              </p>
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full rounded-md border border-primary-300 bg-white px-2.5 py-1.5 text-xs text-primary-800 placeholder-primary-500 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              />
            </>
          )}

          <button
            type="button"
            onClick={() => onSelect(selected)}
            className="mt-3 w-full rounded-lg bg-brand-400 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40"
            style={{ fontFamily: "'Neue Montreal', sans-serif" }}
          >
            View as segment
          </button>
        </div>
      </div>
    </>
  );
}

/** Floating green bar pinned to the visible bottom of the Published preview showing the active visitor segment. */
function PublishedViewBar({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>(SEGMENT_OPTIONS[0]);
  const [pos, setPos] = useState<{ left: number; width: number; bottom: number } | null>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      setPos({ left: rect.left, width: rect.width, bottom: window.innerHeight - visibleBottom });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [containerRef]);

  if (!pos || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        className="pointer-events-none fixed z-40 flex justify-center"
        style={{ left: pos.left, width: pos.width, bottom: pos.bottom + 16 }}
      >
        <div
          className="pointer-events-auto flex h-10 w-full max-w-[952px] items-center justify-between rounded-xl px-5 shadow-lg"
          style={{ backgroundColor: '#0B815A' }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="text-[13px] font-medium text-white"
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              Viewing active Trust Center as:
            </span>
            <button
              ref={pillRef}
              type="button"
              onClick={() => setSelectorOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{ backgroundColor: '#07694A' }}
            >
              {activeSegment}
              <ChevronDown size={13} strokeWidth={2} aria-hidden />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white transition-colors hover:text-white/80"
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <Share2 size={13} strokeWidth={2} aria-hidden />
              Share Live URL
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white transition-colors hover:text-white/80"
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <ExternalLink size={13} strokeWidth={2} aria-hidden />
              Open in new tab
            </button>
          </div>
        </div>
      </div>
      {selectorOpen && (
        <PublishedSegmentSelectorPopover
          anchorRef={pillRef}
          activeSegment={activeSegment}
          onSelect={(seg) => {
            setActiveSegment(seg);
            setSelectorOpen(false);
          }}
          onClose={() => setSelectorOpen(false)}
        />
      )}
    </>,
    document.body,
  );
}

/** Popover anchored above the segment pill for the Published view bar. */
function PublishedSegmentSelectorPopover({
  anchorRef,
  activeSegment,
  onSelect,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  activeSegment: string;
  onSelect: (segment: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'segment' | 'email'>('segment');
  const [selected, setSelected] = useState(activeSegment);
  const [anchor, setAnchor] = useState<{ left: number; bottom: number } | null>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setAnchor({ left: rect.left, bottom: window.innerHeight - rect.top + 8 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [anchorRef]);

  if (!anchor) return null;

  return (
    <>
      <div className="fixed inset-0 z-[199]" onClick={onClose} />
      <div
        className="fixed z-[200] w-[380px] rounded-xl border border-primary-300 bg-white shadow-2xl"
        style={{ left: anchor.left, bottom: anchor.bottom }}
      >
        {/* Toggle tabs — pill-style segmented control */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex rounded-lg border border-primary-300 bg-primary-100 p-0.5">
            <button
              type="button"
              onClick={() => setTab('segment')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === 'segment'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-primary-500 hover:text-primary-700'
              }`}
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <Users size={13} strokeWidth={2} />
              User segment
            </button>
            <button
              type="button"
              onClick={() => setTab('email')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === 'email'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-primary-500 hover:text-primary-700'
              }`}
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              <User size={13} strokeWidth={2} />
              User email address
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pb-4">
          {tab === 'segment' ? (
            <>
              <p
                className="mb-2 text-xs font-medium text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              >
                Select option:
              </p>
              <div className="flex gap-1.5">
                {SEGMENT_OPTIONS.map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setSelected(seg)}
                    className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected === seg
                        ? 'border-brand-400 bg-brand-400/10 text-primary-800'
                        : 'border-primary-300 text-primary-700 hover:border-primary-500 hover:bg-primary-100'
                    }`}
                    style={{ fontFamily: "'Neue Montreal', sans-serif" }}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              <p
                className="mb-1.5 mt-4 text-xs font-medium text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              >
                Add access group (Optional)
              </p>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-md border border-primary-300 bg-white px-2.5 py-1.5 pr-7 text-xs text-primary-500"
                  style={{ fontFamily: "'Neue Montreal', sans-serif" }}
                  defaultValue=""
                >
                  <option value="" disabled>Search for an access group</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-500"
                />
              </div>
            </>
          ) : (
            <>
              <p
                className="mb-2 text-xs font-medium text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              >
                Enter email address:
              </p>
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full rounded-md border border-primary-300 bg-white px-2.5 py-1.5 text-xs text-primary-800 placeholder-primary-500 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              />
            </>
          )}

          <button
            type="button"
            onClick={() => onSelect(selected)}
            className="mt-3 w-full rounded-lg bg-brand-400 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40"
            style={{ fontFamily: "'Neue Montreal', sans-serif" }}
          >
            View as segment
          </button>
        </div>
      </div>
    </>
  );
}

/** Spot illustration for the empty-state overlay (patterns.svg from .Empty States). */
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

/** Empty state shown in draft preview when there's no draft and no published Trust Center. */
function DraftEmptySkeleton({ onCreateDraft }: { onCreateDraft: () => void }) {
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

        {/* Bottom spacer */}
        <div className="h-20" />
      </div>

      {/* Centered overlay card */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center" style={{ paddingTop: '18%' }}>
        <div className="pointer-events-auto flex w-[420px] flex-col items-center rounded-xl bg-white px-10 pb-10 pt-12 text-center shadow-lg ring-1 ring-primary-200">
          <EmptyStateIllustration />
          <h3
            className="mt-6 font-medium"
            style={{ fontSize: '14px', lineHeight: '135%', color: '#204156', fontFamily: "'Neue Montreal', sans-serif" }}
          >
            There is no Trust Center Draft.
          </h3>
          <p
            className="mt-2 max-w-[320px]"
            style={{ fontSize: '14px', lineHeight: '135%', color: '#204156', fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
          >
            Start a draft now, and share with a draft preview link.
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
          <EmptyStateIllustration />
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
