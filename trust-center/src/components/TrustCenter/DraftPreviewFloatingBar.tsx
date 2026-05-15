import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ExternalLink, Share2 } from 'lucide-react';
import DraftPreviewSegmentPopover from '../Settings/DraftPreviewSegmentPopover';
import { DRAFT_PREVIEW_SEGMENT_OPTIONS } from '../../constants/draftPreviewSegment';

/**
 * Blue floating bar pinned to the bottom of the Trust Center preview (portal).
 * Used on `/trust-center?draftPreview=1` (with drafts) and `/trust-center?publishedPreview=1`
 * so full-page preview matches designer chrome without duplicating the draft top banner.
 * Figma: Trust Center Vision HQ > Designer Page > Draft preview bar
 */
export default function DraftPreviewFloatingBar({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>(DRAFT_PREVIEW_SEGMENT_OPTIONS[0]);
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
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [containerRef]);

  const openDesignerTab = () => {
    const base = import.meta.env.BASE_URL;
    const normalized = base.endsWith('/') ? base : `${base}/`;
    window.open(`${window.location.origin}${normalized}designerstaging`, '_blank', 'noopener,noreferrer');
  };

  if (!pos || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        className="pointer-events-none fixed z-40 flex justify-center"
        style={{ left: pos.left, width: pos.width, bottom: pos.bottom + 16 }}
      >
        <div className="pointer-events-auto flex h-10 w-full max-w-[952px] items-center justify-between rounded-xl bg-preview-as-bar-bg px-5 shadow-lg">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="shrink-0 text-[13px] font-medium text-white">Previewing as:</span>
            <button
              ref={pillRef}
              type="button"
              onClick={() => setSelectorOpen((v) => !v)}
              aria-expanded={selectorOpen}
              className="inline-flex max-w-[min(240px,45vw)] min-w-0 items-center gap-1.5 rounded-full bg-preview-as-bar-pill px-3.5 py-1 text-xs font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="truncate">{activeSegment}</span>
              <ChevronDown size={13} strokeWidth={2} className="shrink-0" aria-hidden />
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white transition-colors hover:text-white/80"
            >
              <Share2 size={13} strokeWidth={2} aria-hidden />
              Share
            </button>
            <button
              type="button"
              onClick={openDesignerTab}
              title="Open designer in a new tab"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white transition-colors hover:text-white/80"
            >
              <ExternalLink size={13} strokeWidth={2} aria-hidden />
              Open in new tab
            </button>
          </div>
        </div>
      </div>
      {selectorOpen && (
        <DraftPreviewSegmentPopover
          anchorRef={pillRef}
          activeSegment={activeSegment}
          placement="above"
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
