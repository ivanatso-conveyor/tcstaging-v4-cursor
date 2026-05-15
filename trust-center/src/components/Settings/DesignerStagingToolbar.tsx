import { useCallback, useRef, useState } from 'react';
import { ChevronDown, Share2 } from 'lucide-react';
import { getPublishedPresentation, useDesigner } from '../../context/DesignerContext';
import { LANGUAGE_MENU } from '../../constants/previewLocale';
import { DESIGNER_RIGHT_PANEL_WIDTH_PX, DESIGNER_STAGING_CTA_MIN_WIDTH_PX } from '../../constants/designerLayout';
import DraftPreviewSegmentPopover from './DraftPreviewSegmentPopover';
import { DRAFT_PREVIEW_SEGMENT_OPTIONS } from '../../constants/draftPreviewSegment';
import DesignerPreviewTitleBar from './DesignerPreviewTitleBar';
import { PublishConfirmModal, PublishLiveSuccessToast, PUBLISH_LIVE_SUCCESS_TOAST_DURATION_MS } from './RightPanel';

/**
 * Full-width toolbar above both center preview and right panel.
 * Grid matches the preview vs right panel split: preview column holds breadcrumb (left) plus
 * centered Trust Center name and autosave (`DesignerPreviewTitleBar`), right column holds actions.
 * Breadcrumb: **Trust Center Editor > Draft autosaved 9:41AM** (or **Published**), draft step uses `text-xs font-medium text-primary-800` for the whole status phrase.
 * Figma: Designer > Top toolbar (May 2026 mockup).
 */
type ToolbarProps = {
  workspaceTab: 'draft' | 'published';
  onWorkspaceTabChange: (tab: 'draft' | 'published') => void;
};

export default function DesignerStagingToolbar({ workspaceTab, onWorkspaceTabChange: _onWorkspaceTabChange }: ToolbarProps) {
  void _onWorkspaceTabChange;
  const { state } = useDesigner();
  const noDrafts = state.drafts.length === 0;
  const isDraftSideActive = workspaceTab === 'draft' || state.previewMode === 'draft';
  const activeDraft = state.drafts.find((d) => d.id === state.activeDraftId);
  const autosavedTime = activeDraft
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(
        new Date(activeDraft.updatedAt),
      )
    : null;
  const autosavedTimeCompact =
    autosavedTime?.replace(/\s+(AM|PM)$/i, (_, suffix: string) => suffix.toUpperCase()) ?? null;
  const pub = getPublishedPresentation(state);
  const isCurrentlyLive = LANGUAGE_MENU.some((item) => pub.localeLive[item.locale]);

  // Segment selector state (formerly in DraftPreviewToolbarControls)
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>(DRAFT_PREVIEW_SEGMENT_OPTIONS[0]);
  const pillRef = useRef<HTMLDivElement>(null);

  const openPublicTrustCenterTab = useCallback(() => {
    const base = import.meta.env.BASE_URL;
    const normalized = base.endsWith('/') ? base : `${base}/`;
    const query = workspaceTab === 'published' ? 'publishedPreview=1' : 'draftPreview=1';
    const url = `${window.location.origin}${normalized}trust-center?${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [workspaceTab]);

  // Publish confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishLiveToastVisible, setPublishLiveToastVisible] = useState(false);

  const triggerPublishLiveToast = useCallback(() => {
    setPublishLiveToastVisible(true);
    window.setTimeout(() => setPublishLiveToastVisible(false), PUBLISH_LIVE_SUCCESS_TOAST_DURATION_MS);
  }, []);

  // CTA logic:
  // Draft tab: "Publish Draft" when visitor-live + draft (live site exists); else "Publish Live URL". Disabled with no draft.
  // Published tab: "Share Live URL"; disabled when TC is inactive (not live).
  const showShareCta = workspaceTab === 'published';
  const isPublishDisabled = noDrafts;
  const isShareDisabled = !isCurrentlyLive;
  const showRepublishDraftCta = !noDrafts && isCurrentlyLive;
  const draftTabPublishLabel = showRepublishDraftCta ? 'Publish Draft' : 'Publish Live URL';

  return (
    <>
      <div
        className="relative z-[100] grid h-12 shrink-0 items-center border-b border-primary-400 bg-white shadow-staging-toolbar"
        style={{
          gridTemplateColumns: `minmax(0, 1fr) ${DESIGNER_RIGHT_PANEL_WIDTH_PX}px`,
        }}
      >
        {/* Preview-width column: breadcrumb (left) + centered title (same width as Trust Center below) */}
        <div className="grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 px-6">
          <div className="min-w-0 justify-self-start">
            <nav aria-label="Breadcrumb" className="min-w-0">
              <p className="flex min-w-0 items-center gap-x-1.5 text-xs font-normal leading-snug text-primary-500">
                <span className="min-w-0 truncate">Trust Center Editor</span>
                <span className="shrink-0 text-primary-400" aria-hidden>
                  &gt;
                </span>
                <span className="shrink-0 font-medium text-primary-800" aria-current="page">
                  {isDraftSideActive
                    ? autosavedTimeCompact
                      ? `Draft autosaved ${autosavedTimeCompact}`
                      : 'Draft'
                    : 'Published'}
                </span>
              </p>
            </nav>
          </div>
          <div className="flex min-w-0 justify-center">
            <DesignerPreviewTitleBar workspaceTab={workspaceTab} />
          </div>
          <div className="min-w-0" aria-hidden />
        </div>

        {/* Right panel column: actions (width matches `RightPanel`) */}
        <div className="flex min-h-0 min-w-0 items-center justify-end gap-2 px-6">
          {/* Preview As... split control: label | chevron (both open segment popover) */}
          <div
            ref={pillRef}
            className="inline-flex shrink-0 items-stretch overflow-hidden rounded-lg border border-primary-300 bg-white shadow-sm"
            role="group"
            aria-label="Preview as visitor segment"
          >
            <button
              type="button"
              onClick={() => setSelectorOpen((v) => !v)}
              aria-expanded={selectorOpen}
              aria-haspopup="dialog"
              className="flex shrink-0 items-center border-r border-primary-300 px-3 py-1.5 text-xs font-medium text-primary-800 transition-colors hover:bg-primary-50 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-link-400"
            >
              <span className="whitespace-nowrap">Preview As...</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectorOpen((v) => !v)}
              aria-expanded={selectorOpen}
              aria-haspopup="dialog"
              aria-label="Choose preview segment"
              title="Choose preview segment"
              className="flex w-8 shrink-0 items-center justify-center text-primary-600 transition-colors hover:bg-primary-50 hover:text-link-400 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-link-400"
            >
              <ChevronDown size={13} strokeWidth={2} className="shrink-0 text-primary-500" aria-hidden />
            </button>
          </div>

          {/* CTA: Draft tab = republish vs first publish label; Published tab = "Share Live URL" */}
          {showShareCta ? (
            <button
              type="button"
              disabled={isShareDisabled}
              style={{ minWidth: DESIGNER_STAGING_CTA_MIN_WIDTH_PX }}
              onClick={() => {
                const shareUrl = 'https://trust.mediacore.com';
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(shareUrl).catch(() => {});
                }
              }}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-brand-400 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40 disabled:cursor-not-allowed disabled:bg-brand-400/50 disabled:text-white disabled:shadow-none"
            >
              <Share2 size={14} strokeWidth={2} aria-hidden />
              Share Live URL
            </button>
          ) : (
            <button
              type="button"
              disabled={isPublishDisabled}
              aria-label={
                showRepublishDraftCta
                  ? 'Publish draft to update the live Trust Center'
                  : 'Publish Trust Center to the live URL'
              }
              style={{ minWidth: DESIGNER_STAGING_CTA_MIN_WIDTH_PX }}
              onClick={() => setConfirmOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-brand-400 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40 disabled:cursor-not-allowed disabled:bg-brand-400/50 disabled:text-white disabled:shadow-none"
            >
              {draftTabPublishLabel}
            </button>
          )}
        </div>
      </div>

      {/* Segment popover */}
      {selectorOpen && (
        <DraftPreviewSegmentPopover
          anchorRef={pillRef}
          activeSegment={activeSegment}
          placement="below"
          onOpenPreviewInNewTab={openPublicTrustCenterTab}
          onSelect={(seg) => {
            setActiveSegment(seg);
            setSelectorOpen(false);
          }}
          onClose={() => setSelectorOpen(false)}
        />
      )}

      {/* Publish confirm modal (full version with diff list + changelog note) */}
      {confirmOpen ? (
        <PublishConfirmModal
          goLive
          onClose={() => setConfirmOpen(false)}
          onPublishLiveSuccess={triggerPublishLiveToast}
        />
      ) : null}
      <PublishLiveSuccessToast visible={publishLiveToastVisible} />
    </>
  );
}

