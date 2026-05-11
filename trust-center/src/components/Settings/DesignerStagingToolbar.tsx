import { getPublishedPresentation, useDesigner } from '../../context/DesignerContext';
import { LANGUAGE_MENU } from '../../constants/previewLocale';

/**
 * Designer shell: preview toggle, publish status, and quick publish above the Trust Center column.
 */
type ToolbarProps = {
  workspaceTab: 'draft' | 'published';
  onWorkspaceTabChange: (tab: 'draft' | 'published') => void;
};

export default function DesignerStagingToolbar({ workspaceTab, onWorkspaceTabChange }: ToolbarProps) {
  const { state, setPreviewMode, isActiveDraftDirty } = useDesigner();
  const activeDraft = state.drafts.find((d) => d.id === state.activeDraftId);
  const noDrafts = state.drafts.length === 0;
  const draftToggleLabel = noDrafts
    ? 'Draft Preview'
    : activeDraft
      ? activeDraft.name
      : 'Draft';
  const draftToggleTitle = noDrafts
    ? 'Preview draft workspace — create a draft from the right panel to start editing'
    : activeDraft
      ? `Preview this draft in the center: ${activeDraft.name}`
      : 'Preview staged draft in the center column';
  const isDraftSideActive = workspaceTab === 'draft' || state.previewMode === 'draft';
  const pub = getPublishedPresentation(state);
  const isVisitorLive = LANGUAGE_MENU.some((item) => pub.localeLive[item.locale]);
  const autosavedTime = activeDraft
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(
        new Date(activeDraft.updatedAt),
      )
    : null;
  const statusTooltip = noDrafts
    ? 'Preview matches the live Trust Center'
    : isActiveDraftDirty
      ? `Unpublished changes${autosavedTime ? ` · Autosaved ${autosavedTime}` : ''}`
      : `Draft: No unpublished changes${autosavedTime ? ` · Autosaved ${autosavedTime}` : ''}`;

  return (
    <>
      <div className="z-[100] flex h-12 shrink-0 items-center gap-3 border-b border-primary-400 bg-white px-6">
        <div className="min-w-0 flex-1">
          {noDrafts && isDraftSideActive ? null : (
            <p className="flex min-w-0 items-center gap-x-2 text-xs leading-snug truncate" title={statusTooltip}>
              {!isDraftSideActive ? (
                isVisitorLive ? (
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-600"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand-400" aria-hidden />
                    Published view
                  </span>
                ) : null
              ) : isActiveDraftDirty ? (
                <span className="truncate font-semibold text-primary-800">Unpublished changes</span>
              ) : (
                <span className="truncate text-primary-700">Draft: No unpublished changes</span>
              )}
            </p>
          )}
        </div>

        <div className="flex min-w-0 items-center justify-center">
          <div
            className="flex w-[31rem] min-w-0 rounded border border-primary-400 bg-white p-0.5"
            role="group"
            aria-label="Center column preview source"
          >
            <button
              type="button"
              title={draftToggleLabel}
              aria-label={draftToggleTitle}
              className={`min-w-0 flex-1 truncate rounded py-1 text-center text-xs font-medium ${
                isDraftSideActive ? 'bg-primary-800 text-white' : 'text-primary-800 hover:bg-primary-100'
              }`}
              onClick={() => {
                onWorkspaceTabChange('draft');
                setPreviewMode('draft');
              }}
            >
              {draftToggleLabel}
            </button>
            <button
              type="button"
              title="Published"
              className={`min-w-0 flex-1 truncate rounded py-1 text-center text-xs font-medium ${
                !isDraftSideActive ? 'bg-primary-800 text-white' : 'text-primary-800 hover:bg-primary-100'
              }`}
              onClick={() => {
                onWorkspaceTabChange('published');
                setPreviewMode('published');
              }}
            >
              Published
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end">
          {autosavedTime && isDraftSideActive ? (
            <span className="text-xs text-primary-600" title={`Autosaved ${autosavedTime}`}>
              Autosaved {autosavedTime}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
}
