import { useCallback, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DraftPreviewSegmentPopover from './DraftPreviewSegmentPopover';
import { DRAFT_PREVIEW_SEGMENT_OPTIONS } from '../../constants/draftPreviewSegment';

/**
 * Published (visitor-live) preview cluster: secondary outline style (grey border, white fill), same language as draft preview.
 * Single trigger opens the segment popover; open-in-new-tab lives beside **View as segment** in the popover footer.
 * Figma: Trust Center Vision HQ > Designer Page > Staging toolbar (published live)
 */
export default function PublishedLiveToolbarControls() {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>(DRAFT_PREVIEW_SEGMENT_OPTIONS[0]);
  const pillRef = useRef<HTMLDivElement>(null);

  const openPublishedTrustCenterTab = useCallback(() => {
    const base = import.meta.env.BASE_URL;
    const normalized = base.endsWith('/') ? base : `${base}/`;
    window.open(
      `${window.location.origin}${normalized}trust-center?publishedPreview=1`,
      '_blank',
      'noopener,noreferrer',
    );
  }, []);

  /** Visitor-as segment label from the picker (e.g. External - Approved). */
  const previewPillLabel = `View: ${activeSegment}`;

  return (
    <>
      <div
        className="flex min-w-0 max-w-full items-center justify-end"
        role="group"
        aria-label="Published live Trust Center visitor preview"
      >
        <div
          ref={pillRef}
          className="inline-flex max-w-[min(400px,58vw)] min-w-0 shrink-0 items-stretch overflow-hidden rounded-lg border border-primary-300 bg-white shadow-sm"
          role="group"
          aria-label="Published live visitor preview segment"
        >
          <button
            type="button"
            onClick={() => setSelectorOpen((v) => !v)}
            aria-expanded={selectorOpen}
            aria-haspopup="dialog"
            title="Change visitor preview segment"
            className="flex min-w-0 flex-1 items-center gap-1 border-r border-primary-300 px-3 py-1.5 text-left text-xs font-normal text-primary-700 transition-colors hover:bg-primary-50 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-link-400"
          >
            <span className="min-w-0 truncate">{previewPillLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectorOpen((v) => !v)}
            aria-expanded={selectorOpen}
            aria-haspopup="dialog"
            aria-label="Choose visitor preview segment"
            title="Choose visitor preview segment"
            className="flex w-8 shrink-0 items-center justify-center text-primary-600 transition-colors hover:bg-primary-50 hover:text-link-400 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-link-400"
          >
            <ChevronDown size={13} strokeWidth={2} className="shrink-0 text-primary-500" aria-hidden />
          </button>
        </div>
      </div>
      {selectorOpen && (
        <DraftPreviewSegmentPopover
          anchorRef={pillRef}
          activeSegment={activeSegment}
          placement="below"
          onOpenPreviewInNewTab={openPublishedTrustCenterTab}
          onSelect={(seg) => {
            setActiveSegment(seg);
            setSelectorOpen(false);
          }}
          onClose={() => setSelectorOpen(false)}
        />
      )}
    </>
  );
}
