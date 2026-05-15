import { useDesigner } from '../../context/DesignerContext';

type DesignerPreviewTitleBarProps = {
  /** Matches right-panel Draft / Published tab with `previewMode` (same rule as staging breadcrumb). */
  workspaceTab: 'draft' | 'published';
  /** Extra layout classes (toolbar passes flex + min width for the centered stack). */
  className?: string;
};

/**
 * Trust Center display name for the designer shell.
 * Rendered inside `DesignerStagingToolbar` in the preview-width column, geometrically centered
 * between equal `1fr` side tracks (breadcrumb stays left in the first track).
 * Shows the active draft name when a draft exists; otherwise **Draft View** or **Published View**
 * when `workspaceTab === 'draft'` or `previewMode === 'draft'` (same as breadcrumb Draft step).
 * (`text-sm font-medium`). Autosave time lives in the breadcrumb row instead.
 * Figma: Designer > Top toolbar > center context (May 2026 mockup).
 */
export default function DesignerPreviewTitleBar({ workspaceTab, className = '' }: DesignerPreviewTitleBarProps) {
  const { state } = useDesigner();
  const activeDraft = state.drafts.find((d) => d.id === state.activeDraftId);
  const isDraftSideActive = workspaceTab === 'draft' || state.previewMode === 'draft';
  const displayName = activeDraft ? activeDraft.name : isDraftSideActive ? 'Draft View' : 'Published View';

  return (
    <div
      className={[
        'flex min-w-0 max-w-full items-center justify-center text-center leading-tight',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="min-w-0 truncate text-sm font-medium text-primary-800">{displayName}</span>
    </div>
  );
}
