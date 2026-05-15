import { useCallback, useRef, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import DraftPreviewSegmentPopover from './DraftPreviewSegmentPopover';
import { DRAFT_PREVIEW_SEGMENT_OPTIONS } from '../../constants/draftPreviewSegment';

/**
 * Preview cluster: split control (segment dropdown + new tab) in one rounded rectangle so it matches
 * the Draft/Published control shape language and reads as one unit.
 * Figma: Trust Center Vision HQ > Designer Page > Staging toolbar (draft preview)
 */
export default function DraftPreviewToolbarControls() {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>(DRAFT_PREVIEW_SEGMENT_OPTIONS[0]);
  const pillRef = useRef<HTMLButtonElement>(null);

  const openPublicTrustCenterTab = useCallback(() => {
    const base = import.meta.env.BASE_URL;
    const normalized = base.endsWith('/') ? base : `${base}/`;
    const url = `${window.location.origin}${normalized}trust-center?draftPreview=1`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  /** Compact label inside the left segment, e.g. "Preview: External - Approved". */
  const previewPillLabel = `Preview: ${activeSegment}`;

  return (
    <>
      <div
        className="flex min-w-0 max-w-full items-center justify-end"
        role="group"
        aria-label="Preview audience and full-page preview"
      >
        <div className="inline-flex max-w-[min(340px,54vw)] min-w-0 items-stretch overflow-hidden rounded-lg border border-primary-300 bg-white shadow-sm">
          <button
            ref={pillRef}
            type="button"
            onClick={() => setSelectorOpen((v) => !v)}
            aria-expanded={selectorOpen}
            aria-haspopup="dialog"
            title="Change preview segment"
            className="flex min-w-0 flex-1 items-center gap-1 border-r border-primary-200 px-3 py-1.5 text-left text-xs font-normal text-primary-700 transition-colors hover:bg-primary-50 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-link-400"
          >
            <span className="min-w-0 truncate">{previewPillLabel}</span>
            <ChevronDown size={13} strokeWidth={2} className="shrink-0 text-primary-500" aria-hidden />
          </button>
          <button
            type="button"
            onClick={openPublicTrustCenterTab}
            aria-label="Preview in a new tab"
            title="Preview in a new tab"
            className="flex w-9 shrink-0 items-center justify-center text-primary-500 transition-colors hover:bg-primary-50 hover:text-link-400 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-link-400"
          >
            <ExternalLink size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
      {selectorOpen && (
        <DraftPreviewSegmentPopover
          anchorRef={pillRef}
          activeSegment={activeSegment}
          placement="below"
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
