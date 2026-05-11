import { DEFAULT_SECTION_ORDER, LAYOUT_SECTION_IDS } from '../constants/layoutSectionOrder';
import { TRUST_CENTER_DEFAULT_ACCENT, TRUST_CENTER_DEFAULT_PRIMARY } from '../constants/brandDefaults';
import { defaultLocaleLive, PREVIEW_LOCALES, type PreviewLocale } from '../constants/previewLocale';
import { DEFAULT_SAVED_AI_AGENT_CONFIG, type SavedAiAgentConfig } from '../types/aiAgentConfig';
import type { StageablePresentation } from '../types/staging';
import type { SavedTrustCenterImagery } from './trustCenterImageryMerge';

export function mergeSavedAiAgentConfig(c?: SavedAiAgentConfig | null): SavedAiAgentConfig {
  return { ...DEFAULT_SAVED_AI_AGENT_CONFIG, ...(c ?? {}) };
}

const defaultVisibility: Record<string, boolean> = {};
LAYOUT_SECTION_IDS.forEach((id) => {
  defaultVisibility[id] = true;
});

function initialLocaleEverPublished(localeLive: Record<PreviewLocale, boolean>): Record<PreviewLocale, boolean> {
  const r = {} as Record<PreviewLocale, boolean>;
  for (const loc of PREVIEW_LOCALES) {
    r[loc] = !!localeLive[loc];
  }
  return r;
}

/** Backfill `localeEverPublished` when loading snapshots that predate the field. */
export function migrateLocaleEverPublishedField(p: StageablePresentation): Record<PreviewLocale, boolean> {
  const mergedLive = { ...defaultLocaleLive(), ...(p.localeLive ?? {}) };
  const existing = p.localeEverPublished;
  const r = {} as Record<PreviewLocale, boolean>;
  for (const loc of PREVIEW_LOCALES) {
    r[loc] = existing?.[loc] ?? !!mergedLive[loc];
  }
  return r;
}

export function createInitialStageable(): StageablePresentation {
  const localeLive = defaultLocaleLive();
  const localeEverPublished = initialLocaleEverPublished(localeLive);
  return {
    isLive: true,
    publicView: 'modern',
    accentColor: TRUST_CENTER_DEFAULT_ACCENT,
    primaryColor: TRUST_CENTER_DEFAULT_PRIMARY,
    fontFamily: '',
    sectionVisibility: { ...defaultVisibility },
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    savedTrustCenterImagery: null,
    savedAiAgentConfig: { ...DEFAULT_SAVED_AI_AGENT_CONFIG },
    localeLive,
    localeEverPublished,
  };
}

export function cloneStageable(s: StageablePresentation): StageablePresentation {
  return {
    ...s,
    sectionVisibility: { ...s.sectionVisibility },
    sectionOrder: [...s.sectionOrder],
    localeLive: { ...s.localeLive },
    localeEverPublished: { ...s.localeEverPublished },
    savedTrustCenterImagery: s.savedTrustCenterImagery
      ? {
          squareLogoSrc: s.savedTrustCenterImagery.squareLogoSrc,
          headerImageSrc: s.savedTrustCenterImagery.headerImageSrc,
          thumbnailImageSrc: s.savedTrustCenterImagery.thumbnailImageSrc,
        }
      : null,
    savedAiAgentConfig: mergeSavedAiAgentConfig(s.savedAiAgentConfig),
  };
}

export function stageablesEqual(a: StageablePresentation, b: StageablePresentation): boolean {
  return (
    a.isLive === b.isLive &&
    a.publicView === b.publicView &&
    a.accentColor === b.accentColor &&
    a.primaryColor === b.primaryColor &&
    a.fontFamily === b.fontFamily &&
    a.sectionOrder.join('\0') === b.sectionOrder.join('\0') &&
    JSON.stringify(a.sectionVisibility) === JSON.stringify(b.sectionVisibility) &&
    JSON.stringify(a.savedTrustCenterImagery) === JSON.stringify(b.savedTrustCenterImagery) &&
    JSON.stringify(a.savedAiAgentConfig) === JSON.stringify(b.savedAiAgentConfig) &&
    JSON.stringify(a.localeLive) === JSON.stringify(b.localeLive) &&
    JSON.stringify(a.localeEverPublished) === JSON.stringify(b.localeEverPublished)
  );
}

/** Flatten stageable into the shape legacy components read from `state` for presentation fields. */
export function stageableToMirror(s: StageablePresentation) {
  return {
    isLive: s.isLive,
    publicView: s.publicView,
    accentColor: s.accentColor,
    primaryColor: s.primaryColor,
    fontFamily: s.fontFamily,
    sectionVisibility: s.sectionVisibility,
    sectionOrder: s.sectionOrder,
    savedTrustCenterImagery: s.savedTrustCenterImagery,
    savedAiAgentConfig: mergeSavedAiAgentConfig(s.savedAiAgentConfig),
    localeLive: s.localeLive,
    localeEverPublished: s.localeEverPublished,
  };
}

export function mirrorToStageable(m: {
  isLive: boolean;
  publicView: 'modern' | 'simple';
  accentColor: string;
  primaryColor: string;
  fontFamily: string;
  sectionVisibility: Record<string, boolean>;
  sectionOrder: string[];
  savedTrustCenterImagery: SavedTrustCenterImagery | null;
  savedAiAgentConfig: SavedAiAgentConfig;
  localeLive: StageablePresentation['localeLive'];
  localeEverPublished: StageablePresentation['localeEverPublished'];
}): StageablePresentation {
  return cloneStageable({
    isLive: m.isLive,
    publicView: m.publicView,
    accentColor: m.accentColor,
    primaryColor: m.primaryColor,
    fontFamily: m.fontFamily,
    sectionVisibility: { ...m.sectionVisibility },
    sectionOrder: [...m.sectionOrder],
    localeLive: { ...m.localeLive },
    localeEverPublished: { ...m.localeEverPublished },
    savedTrustCenterImagery: m.savedTrustCenterImagery
      ? {
          squareLogoSrc: m.savedTrustCenterImagery.squareLogoSrc,
          headerImageSrc: m.savedTrustCenterImagery.headerImageSrc,
          thumbnailImageSrc: m.savedTrustCenterImagery.thumbnailImageSrc,
        }
      : null,
    savedAiAgentConfig: mergeSavedAiAgentConfig(m.savedAiAgentConfig),
  });
}
