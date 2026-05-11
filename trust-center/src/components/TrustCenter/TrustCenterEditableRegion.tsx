/**
 * TrustCenterEditableRegion
 * Hover target for designer preview sections. Published preview usually shows **Draft an Edit**;
 * use `publishedOverlay="pencil-only"` for blocks that edit live without the draft flow (company profile, quick links, certifications).
 * Click routing is handled in `TrustCenterContent`.
 * Figma: Trust Center Vision HQ > Designer > Trust Center preview (hover edit targets)
 */
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import type { EditableTrustSectionId } from '../../contexts/TrustCenterSectionEditContext';

const OVERLAY_BG = 'rgba(71, 104, 125, 0.15)';

const ARIA_LABELS: Record<EditableTrustSectionId, string> = {
  banner: 'Edit Trust Center page imagery',
  profile: 'Edit profile and headline',
  badges: 'Edit certifications',
  'nav-brand': 'Edit Trust Center page imagery',
  'quick-links': 'Edit quick links',
  'quick-summary': 'Edit quick summary',
  'featured-documents': 'Edit featured documents',
  'trusted-by': 'Edit featured customers',
  philosophy: 'Edit our philosophy',
  'coming-soon': 'Edit coming soon',
  'what-we-offer': 'Edit what we offer',
  'what-we-offer-product': 'Edit product',
  'video-resources': 'Edit video resources',
  'video-resource': 'Edit video resource',
  'find-answer': 'Edit documents and knowledge base FAQs',
  subprocessors: 'Edit subprocessors',
  announcements: 'Edit announcements',
};

type Props = {
  sectionId: EditableTrustSectionId;
  enabled: boolean;
  /** 'draft' shows a locked overlay (unless editableInDraft); 'published' shows Draft an Edit. */
  previewMode?: 'draft' | 'published';
  /** When true, the edit pencil shows even in draft mode (skips the locked overlay). */
  editableInDraft?: boolean;
  /**
   * When true, skip rendering the draft lock overlay on *this* region — use for inner
   * regions (e.g. per-product cards) when an ancestor region is already rendering the
   * section-wide lock. Published-mode overlay still renders normally.
   */
  suppressDraftLock?: boolean;
  /**
   * Published preview only: `draft-an-edit` (default) shows the pill CTA; `pencil-only` matches draft-style pencil
   * for sections that save live without branching a draft; `none` renders no overlay at all — use this for sections
   * that only have kebab-driven add/edit flows in the right panel (no whole-section edit entry point).
   */
  publishedOverlay?: 'draft-an-edit' | 'pencil-only' | 'none';
  /** Draft preview lock overlay label when `editableInDraft` is false (default: Switch to Published to edit). */
  draftLockedHint?: string;
  onEditClick: (id: EditableTrustSectionId) => void;
  children: ReactNode;
  className?: string;
};

export default function TrustCenterEditableRegion({
  sectionId,
  enabled,
  previewMode = 'published',
  editableInDraft: _editableInDraft = false,
  suppressDraftLock: _suppressDraftLock = false,
  publishedOverlay = 'draft-an-edit',
  draftLockedHint: _draftLockedHint,
  onEditClick,
  children,
  className = '',
}: Props) {
  if (!enabled) {
    return (
      <div data-editable-region={sectionId} className={className}>
        {children}
      </div>
    );
  }

  // Published + no section-level edit entry point (kebab-only flows) — render the
  // children plain. Draft mode still shows the lock overlay below.
  if (previewMode === 'published' && publishedOverlay === 'none') {
    return (
      <div data-editable-region={sectionId} className={className}>
        {children}
      </div>
    );
  }

  // Draft mode: show a pencil overlay on hover so sections are clickable for editing.
  if (previewMode === 'draft') {
    return (
      <div data-editable-region={sectionId} className={`relative isolate group/tc-edit ${className}`.trim()}>
        {children}
        <button
          type="button"
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center opacity-0 pointer-events-none transition-opacity duration-150 motion-reduce:transition-none group-hover/tc-edit:opacity-100 group-hover/tc-edit:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
          style={{ backgroundColor: OVERLAY_BG }}
          onClick={() => onEditClick(sectionId)}
          aria-label={ARIA_LABELS[sectionId]}
        >
          <span className="rounded-full bg-white/95 p-1.5 shadow-sm ring-1 ring-primary-400">
            <FontAwesomeIcon icon={faPencil} className="h-3.5 w-3.5 text-primary-800" aria-hidden />
          </span>
        </button>
      </div>
    );
  }

  const showPublishedDraftCta =
    previewMode === 'published' && publishedOverlay !== 'pencil-only';

  return (
    <div data-editable-region={sectionId} className={`relative isolate group/tc-edit ${className}`.trim()}>
      {children}
      <button
        type="button"
        className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center opacity-0 pointer-events-none transition-opacity duration-150 motion-reduce:transition-none group-hover/tc-edit:opacity-100 group-hover/tc-edit:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
        style={{ backgroundColor: OVERLAY_BG }}
        onClick={() => onEditClick(sectionId)}
        aria-label={
          showPublishedDraftCta
            ? `Draft an edit: ${ARIA_LABELS[sectionId]}`
            : ARIA_LABELS[sectionId]
        }
      >
        {showPublishedDraftCta ? (
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm ring-1 ring-primary-400">
            <FontAwesomeIcon icon={faPencil} className="h-3.5 w-3.5 shrink-0 text-primary-800" aria-hidden />
            <span className="text-xs font-medium text-primary-700">Draft an Edit</span>
          </span>
        ) : (
          <span className="rounded-full bg-white/95 p-1.5 shadow-sm ring-1 ring-primary-400">
            <FontAwesomeIcon icon={faPencil} className="h-3.5 w-3.5 text-primary-800" aria-hidden />
          </span>
        )}
      </button>
    </div>
  );
}
