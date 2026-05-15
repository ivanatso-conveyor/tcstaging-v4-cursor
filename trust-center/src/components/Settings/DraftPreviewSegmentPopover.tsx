import { useEffect, useState } from 'react';
import { ChevronDown, ExternalLink, User, Users } from 'lucide-react';
import { DRAFT_PREVIEW_SEGMENT_OPTIONS } from '../../constants/draftPreviewSegment';

/**
 * Segment / email picker for draft preview. Anchors to the toolbar split control (wrapper `div`) or a single button when used with a bottom floating bar (placement="above").
 * Figma: Trust Center Vision HQ > Designer Page > Preview as segment
 */
type Placement = 'above' | 'below';

export default function DraftPreviewSegmentPopover({
  anchorRef,
  activeSegment,
  onSelect,
  onClose,
  onOpenPreviewInNewTab,
  placement = 'above',
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  activeSegment: string;
  onSelect: (segment: string) => void;
  onClose: () => void;
  /** Opens full-page preview in a new tab after applying the segment (toolbar passes this; footer CTA shows **View as segment** then **ExternalLink** on the right). */
  onOpenPreviewInNewTab?: () => void;
  placement?: Placement;
}) {
  const [tab, setTab] = useState<'segment' | 'email'>('segment');
  const [selected, setSelected] = useState(activeSegment);
  const [anchor, setAnchor] = useState<{ right: number; top?: number; bottom?: number } | null>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const rightFromViewport = window.innerWidth - rect.right;
      if (placement === 'below') {
        setAnchor({ right: rightFromViewport, top: rect.bottom + 8 });
      } else {
        setAnchor({ right: rightFromViewport, bottom: window.innerHeight - rect.top + 8 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [anchorRef, placement]);

  if (!anchor) return null;

  const panelPosition =
    anchor.top !== undefined
      ? ({ right: anchor.right, top: anchor.top } as const)
      : ({ right: anchor.right, bottom: anchor.bottom } as const);

  return (
    <>
      <div className="fixed inset-0 z-[199]" onClick={onClose} aria-hidden />
      <div
        className="fixed z-[200] w-[380px] rounded-xl border border-primary-300 bg-white shadow-2xl"
        style={panelPosition}
      >
        <div className="px-4 pb-3 pt-4">
          <div className="flex rounded-lg border border-primary-300 bg-primary-100 p-0.5">
            <button
              type="button"
              onClick={() => setTab('segment')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === 'segment'
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-primary-500 hover:text-primary-700'
              }`}
            >
              <Users size={13} strokeWidth={2} aria-hidden />
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
            >
              <User size={13} strokeWidth={2} aria-hidden />
              User email address
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          {tab === 'segment' ? (
            <>
              <p className="mb-2 text-xs font-medium text-primary-800">Select option:</p>
              <div className="flex gap-1.5">
                {DRAFT_PREVIEW_SEGMENT_OPTIONS.map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setSelected(seg)}
                    className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected === seg
                        ? 'border-brand-400 bg-brand-400/10 text-primary-800'
                        : 'border-primary-300 text-primary-700 hover:border-primary-500 hover:bg-primary-100'
                    }`}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              <p className="mb-1.5 mt-4 text-xs font-medium text-primary-800">Add access group (Optional)</p>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-md border border-primary-300 bg-white px-2.5 py-1.5 pr-7 text-xs text-primary-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Search for an access group
                  </option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-500"
                  aria-hidden
                />
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 text-xs font-medium text-primary-800">Enter email address:</p>
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full rounded-md border border-primary-300 bg-white px-2.5 py-1.5 text-xs text-primary-800 placeholder-primary-500 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </>
          )}

          {onOpenPreviewInNewTab ? (
            <button
              type="button"
              onClick={() => {
                onSelect(selected);
                onOpenPreviewInNewTab();
              }}
              aria-label="View as segment and open preview in a new tab"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-400 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40"
            >
              View as segment
              <ExternalLink size={16} strokeWidth={2} aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(selected)}
              className="mt-3 w-full rounded-lg bg-brand-400 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40"
            >
              View as segment
            </button>
          )}
        </div>
      </div>
    </>
  );
}
