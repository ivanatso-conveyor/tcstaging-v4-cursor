/**
 * FixedSectionDnDHandle
 * Disabled grip handle for fixed (non-movable) sections like banner, company identity, and quick links.
 * Shows a grip icon on hover with a tooltip explaining the section cannot be moved.
 * Mirrors `SectionDnDWrapper` styling but prevents dragging.
 * Figma: Trust Center Vision HQ > Designer > Trust Center preview (fixed section hover handles)
 */
import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';

export default function FixedSectionDnDHandle({ children }: { children: ReactNode }) {
  return (
    <div className="group/tc-fixed relative">
      <span
        role="img"
        aria-label="Section cannot be moved"
        className="group/grip-tip absolute left-1 top-8 z-30 flex h-7 w-5 cursor-not-allowed items-center justify-center rounded border border-primary-400 bg-white text-primary-400 opacity-0 shadow-sm transition-opacity group-hover/tc-fixed:opacity-100"
      >
        <FontAwesomeIcon icon={faGripVertical} className="h-3 w-3" aria-hidden />
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-[9999] ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary-800 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/grip-tip:opacity-100"
        >
          Section cannot be moved
          <span
            className="absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-r-[5px] border-y-transparent border-r-primary-800"
            aria-hidden
          />
        </span>
      </span>
      {children}
    </div>
  );
}
