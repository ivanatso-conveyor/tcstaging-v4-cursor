import type { PreviewLocale } from '../constants/previewLocale';
import type { SavedAiAgentConfig } from './aiAgentConfig';
import type { SavedTrustCenterImagery } from '../utils/trustCenterImageryMerge';

/**
 * Presentation-only fields that Draft vs Published can diverge on (Option 3, kickoff).
 * Quick links and company profile stay global on DesignerState, not part of this snapshot.
 */
export type StageablePresentation = {
  isLive: boolean;
  publicView: 'modern' | 'simple';
  accentColor: string;
  primaryColor: string;
  fontFamily: string;
  sectionVisibility: Record<string, boolean>;
  sectionOrder: string[];
  savedTrustCenterImagery: SavedTrustCenterImagery | null;
  savedAiAgentConfig: SavedAiAgentConfig;
  /** Which locales are enabled for the live Trust Center (designer prototype). */
  localeLive: Record<PreviewLocale, boolean>;
  /**
   * Locales that have been live on the published Trust Center at least once (prototype).
   * Used to list “inactive” locales that can be turned back on from the Published tab.
   */
  localeEverPublished: Record<PreviewLocale, boolean>;
};

export type TrustCenterDraft = {
  id: string;
  /** Who last edited this draft branch (prototype: session display name). */
  editedBy: string;
  /** User-editable display name for this draft. */
  name: string;
  updatedAt: number;
  payload: StageablePresentation;
};
