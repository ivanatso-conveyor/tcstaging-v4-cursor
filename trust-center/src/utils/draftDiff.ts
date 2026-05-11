import { LAYOUT_SECTION_LABELS, type LayoutSectionId } from '../constants/layoutSectionOrder';
import { previewLocaleLabel, PREVIEW_LOCALES } from '../constants/previewLocale';
import type { StageablePresentation } from '../types/staging';

/**
 * One entry in the human-readable diff between an active draft and the published snapshot.
 * `id` is a stable identifier consumed by `revertDraftField` to undo this specific change.
 * `label` is the human-readable bullet text shown in the right panel and publish modal.
 */
export type DraftDiffEntry = {
  id: string;
  label: string;
};

/**
 * Compares a draft payload against the published snapshot and returns
 * structured entries describing what changed.
 */
export function computeDraftDiff(
  draft: StageablePresentation,
  published: StageablePresentation,
): DraftDiffEntry[] {
  const changes: DraftDiffEntry[] = [];

  if (draft.publicView !== published.publicView) {
    const label = draft.publicView === 'modern' ? 'Modern landing' : 'Simple form';
    changes.push({ id: 'publicView', label: `Public view changed to ${label}` });
  }

  if (draft.isLive !== published.isLive) {
    changes.push({ id: 'isLive', label: `Go Live turned ${draft.isLive ? 'on' : 'off'}` });
  }

  if (draft.accentColor !== published.accentColor) {
    changes.push({
      id: 'accentColor',
      label: `Accent color changed to ${draft.accentColor.toUpperCase()}`,
    });
  }

  if (draft.primaryColor !== published.primaryColor) {
    changes.push({
      id: 'primaryColor',
      label: `Primary color changed to ${draft.primaryColor.toUpperCase()}`,
    });
  }

  if (draft.fontFamily !== published.fontFamily) {
    changes.push({
      id: 'fontFamily',
      label: draft.fontFamily ? `Font changed to ${draft.fontFamily}` : 'Font reset to default',
    });
  }

  const orderChanged = draft.sectionOrder.join(',') !== published.sectionOrder.join(',');
  if (orderChanged) {
    changes.push({ id: 'sectionOrder', label: 'Section order changed' });
  }

  const visChanges: string[] = [];
  for (const id of draft.sectionOrder) {
    const draftVis = draft.sectionVisibility[id] !== false;
    const pubVis = published.sectionVisibility[id] !== false;
    if (draftVis !== pubVis) {
      const label = LAYOUT_SECTION_LABELS[id as LayoutSectionId] ?? id;
      visChanges.push(`${label} ${draftVis ? 'shown' : 'hidden'}`);
    }
  }
  if (visChanges.length > 0) {
    changes.push({ id: 'sectionVisibility', label: `Section visibility: ${visChanges.join(', ')}` });
  }

  for (const loc of PREVIEW_LOCALES) {
    const draftLive = !!draft.localeLive[loc];
    const pubLive = !!published.localeLive[loc];
    if (draftLive !== pubLive) {
      const label = previewLocaleLabel(loc);
      changes.push({
        id: `localeLive:${loc}`,
        label: `${label} ${draftLive ? 'turned live' : 'turned off'}`,
      });
    }
  }

  const draftImg = draft.savedTrustCenterImagery;
  const pubImg = published.savedTrustCenterImagery;
  const imgChanged =
    (draftImg?.squareLogoSrc ?? null) !== (pubImg?.squareLogoSrc ?? null) ||
    (draftImg?.headerImageSrc ?? null) !== (pubImg?.headerImageSrc ?? null) ||
    (draftImg?.thumbnailImageSrc ?? null) !== (pubImg?.thumbnailImageSrc ?? null);
  if (imgChanged) {
    changes.push({ id: 'imagery', label: 'Trust Center imagery updated' });
  }

  const da = draft.savedAiAgentConfig;
  const pa = published.savedAiAgentConfig;
  if (da.askAiEnabled !== pa.askAiEnabled) {
    changes.push({
      id: 'aiAgent:askAiEnabled',
      label: `Trust Center Agent ${da.askAiEnabled ? 'enabled' : 'disabled'}`,
    });
  }
  if (!!da.surfaceDocuments !== !!pa.surfaceDocuments) {
    changes.push({
      id: 'aiAgent:surfaceDocuments',
      label: `Surface documents ${da.surfaceDocuments ? 'enabled' : 'disabled'}`,
    });
  }
  if (!!da.allowQuestionnaire !== !!pa.allowQuestionnaire) {
    changes.push({
      id: 'aiAgent:allowQuestionnaire',
      label: `Questionnaire support ${da.allowQuestionnaire ? 'enabled' : 'disabled'}`,
    });
  }

  return changes;
}
