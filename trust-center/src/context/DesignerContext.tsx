import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  migrateSectionOrder,
  migrateSectionVisibility,
  moveSectionBlock,
} from '../constants/layoutSectionOrder';
import {
  DESIGNER_DRAFT_EDITOR_DISPLAY_NAME,
  formatDraftLabel,
  formatTrustCenterName,
  MAX_DESIGNER_DRAFTS,
} from '../constants/designerDraftAuthor';
import { defaultLocaleLive, PREVIEW_LOCALES, PRIMARY_TRUST_CENTER_LOCALE, type PreviewLocale } from '../constants/previewLocale';
import type { SavedAiAgentConfig } from '../types/aiAgentConfig';
import type { StageablePresentation, TrustCenterDraft } from '../types/staging';
import type { SavedCompanyProfile } from '../utils/companyProfileMerge';
import type { SavedQuickLinks } from '../utils/quickLinksMerge';
import type { SavedTrustCenterImagery } from '../utils/trustCenterImageryMerge';
import {
  cloneStageable,
  createInitialStageable,
  mergeSavedAiAgentConfig,
  migrateLocaleEverPublishedField,
  stageableToMirror,
  stageablesEqual,
} from '../utils/stagingPresentation';

interface DesignerState {
  isLive: boolean;
  publicView: 'modern' | 'simple';
  accentColor: string;
  primaryColor: string;
  fontFamily: string;
  sectionVisibility: Record<string, boolean>;
  sectionOrder: string[];
  /** Staged with draft/published snapshot: which locales are live for visitors (prototype). */
  localeLive: Record<PreviewLocale, boolean>;
  /** Union of locales that have been visitor-live at least once (mirrors active draft or published snapshot). */
  localeEverPublished: Record<PreviewLocale, boolean>;
  /** Designer-session preview language for Trust Center copy (not stored per draft; publish does not ship locale). */
  previewLocale: PreviewLocale;
  savedQuickLinks: SavedQuickLinks | null;
  savedCompanyProfile: SavedCompanyProfile | null;
  /** Featured Documents column layout — global across drafts since the section edits live in Published. */
  featuredDocumentsLayout: 'column-fill' | 'row-major';
  savedTrustCenterImagery: SavedTrustCenterImagery | null;
  savedAiAgentConfig: SavedAiAgentConfig;
  /** What visitors see at `/trust-center` and in designer when preview is Published. */
  publishedSnapshot: StageablePresentation;
  /** Per-locale display name for live trust centers on the Published tab. */
  publishedTrustCenterNames: Partial<Record<PreviewLocale, string>>;
  /** Changelog note from the most recent publish. */
  publishedChangelogNote: string;
  drafts: TrustCenterDraft[];
  /** Empty string when there is no draft (published-only designer entry). */
  activeDraftId: string;
  /** Center column preview in designer only. */
  previewMode: 'draft' | 'published';
}

interface DesignerContextType {
  state: DesignerState;
  setIsLive: (val: boolean) => void;
  setPublicView: (val: 'modern' | 'simple') => void;
  setAccentColor: (val: string) => void;
  setPrimaryColor: (val: string) => void;
  setFontFamily: (val: string) => void;
  toggleSection: (id: string) => void;
  setSectionVisibility: (id: string, visible: boolean) => void;
  reorderSections: (dragIndex: number, dropIndex: number) => void;
  setPreviewLocale: (val: PreviewLocale) => void;
  toggleLocaleLive: (locale: PreviewLocale) => void;
  /**
   * Published tab only: one visitor-live control for the whole Trust Center.
   * When true, every locale that belongs to this snapshot (`localeEverPublished`) goes visitor-live together.
   */
  setPublishedTrustCenterVisitorLive: (live: boolean) => void;
  /** Unpublish the active TC and save the published snapshot as a draft (overwrites any existing draft). */
  unpublishToDraft: () => void;
  setSavedQuickLinks: (val: SavedQuickLinks | null) => void;
  setSavedCompanyProfile: (val: SavedCompanyProfile | null) => void;
  setFeaturedDocumentsLayout: (val: 'column-fill' | 'row-major') => void;
  setSavedTrustCenterImagery: (val: SavedTrustCenterImagery | null) => void;
  setSavedAiAgentConfig: (patch: Partial<SavedAiAgentConfig>) => void;
  setPreviewMode: (mode: 'draft' | 'published') => void;
  selectDraft: (id: string) => void;
  createDraft: () => void;
  renameDraft: (id: string, name: string) => void;
  deleteDraft: (id: string) => void;
  publishActiveDraft: (changelogNote?: string, options?: { goLive?: boolean }) => void;
  setPublishedChangelogNote: (note: string) => void;
  discardActiveDraft: () => void;
  /** Revert a single staged change in the active draft back to its published value. Field id matches DraftDiffEntry.id. */
  revertDraftField: (fieldId: string) => void;
  /** True when active draft presentation differs from published snapshot. */
  isActiveDraftDirty: boolean;
  /**
   * Right panel registers this (Designer only). Center preview calls
   * `openDraftWorkspaceFromPublishedPreview` so Published hover edits can jump to the Draft tab
   * and create a draft when needed.
   */
  registerOpenDraftWorkspaceHandler: (fn: (() => void) | null) => void;
  openDraftWorkspaceFromPublishedPreview: () => void;
}

const DesignerContext = createContext<DesignerContextType | null>(null);

function newDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function migrateStageablePayload(p: StageablePresentation): StageablePresentation {
  const localeLive = { ...defaultLocaleLive(), ...(p.localeLive ?? {}) };
  return {
    ...p,
    localeLive,
    localeEverPublished: migrateLocaleEverPublishedField({ ...p, localeLive }),
    sectionOrder: migrateSectionOrder(p.sectionOrder),
    sectionVisibility: migrateSectionVisibility(p.sectionVisibility),
    savedAiAgentConfig: mergeSavedAiAgentConfig(p.savedAiAgentConfig),
  };
}

function withMigratedOrderAndVisibility(s: DesignerState): DesignerState | null {
  const sectionOrder = migrateSectionOrder(s.sectionOrder);
  const sectionVisibility = migrateSectionVisibility(s.sectionVisibility);
  const publishedSnapshot = migrateStageablePayload(s.publishedSnapshot);
  const drafts = s.drafts.map((d) => ({
    ...d,
    payload: migrateStageablePayload(d.payload),
  }));
  if (
    sectionOrder.join('\0') === s.sectionOrder.join('\0') &&
    JSON.stringify(sectionVisibility) === JSON.stringify(s.sectionVisibility) &&
    JSON.stringify(publishedSnapshot) === JSON.stringify(s.publishedSnapshot) &&
    JSON.stringify(drafts) === JSON.stringify(s.drafts)
  ) {
    return null;
  }
  const active = drafts.find((d) => d.id === s.activeDraftId);
  const mirror = active ? stageableToMirror(active.payload) : stageableToMirror(cloneStageable(publishedSnapshot));
  return {
    ...s,
    ...mirror,
    sectionOrder,
    sectionVisibility,
    publishedSnapshot,
    drafts,
  };
}

function patchPublishedSnapshot(s: DesignerState, patch: Partial<StageablePresentation>): DesignerState {
  const next: StageablePresentation = { ...s.publishedSnapshot, ...patch };
  if (patch.sectionVisibility) {
    next.sectionVisibility = { ...s.publishedSnapshot.sectionVisibility, ...patch.sectionVisibility };
  }
  if (patch.sectionOrder) {
    next.sectionOrder = [...patch.sectionOrder];
  }
  if (patch.localeLive) {
    next.localeLive = { ...s.publishedSnapshot.localeLive, ...patch.localeLive };
  }
  if (patch.localeEverPublished) {
    next.localeEverPublished = { ...s.publishedSnapshot.localeEverPublished, ...patch.localeEverPublished };
  }
  const publishedSnapshot = cloneStageable(next);
  return {
    ...s,
    publishedSnapshot,
    ...stageableToMirror(next),
  };
}

function replaceActiveDraftPayload(
  s: DesignerState,
  nextPayload: StageablePresentation,
  bumpUpdated = true,
): DesignerState {
  if (!s.activeDraftId || !s.drafts.some((d) => d.id === s.activeDraftId)) return s;
  const now = Date.now();
  const drafts = s.drafts.map((d) =>
    d.id === s.activeDraftId
      ? {
          ...d,
          payload: cloneStageable(nextPayload),
          updatedAt: bumpUpdated ? now : d.updatedAt,
        }
      : d,
  );
  return {
    ...s,
    ...stageableToMirror(nextPayload),
    drafts,
  };
}

function patchActiveDraft(s: DesignerState, patch: Partial<StageablePresentation>): DesignerState {
  // Always-on draft mode: any stageable mutation auto-creates a draft when none exists.
  // Replaces the prior fallback to patchPublishedSnapshot, which silently mutated published.
  let working = s;
  if (working.drafts.length === 0) {
    const base = cloneStageable(working.publishedSnapshot);
    const id = newDraftId();
    const now = Date.now();
    const draft: TrustCenterDraft = {
      id,
      editedBy: DESIGNER_DRAFT_EDITOR_DISPLAY_NAME,
      name: formatDraftLabel(now),
      updatedAt: now,
      payload: base,
    };
    working = {
      ...working,
      drafts: [...working.drafts, draft],
      activeDraftId: id,
      previewMode: 'draft',
      ...stageableToMirror(base),
    };
  }
  const active = working.drafts.find((d) => d.id === working.activeDraftId);
  if (!active) return s;
  const next: StageablePresentation = { ...active.payload, ...patch };
  if (patch.sectionVisibility) next.sectionVisibility = { ...patch.sectionVisibility };
  if (patch.sectionOrder) next.sectionOrder = [...patch.sectionOrder];
  if (patch.localeLive) {
    next.localeLive = { ...active.payload.localeLive, ...patch.localeLive };
    next.localeEverPublished = { ...active.payload.localeEverPublished };
    for (const loc of PREVIEW_LOCALES) {
      if (next.localeLive[loc]) next.localeEverPublished[loc] = true;
    }
  }
  if (patch.localeEverPublished) {
    next.localeEverPublished = { ...active.payload.localeEverPublished, ...patch.localeEverPublished };
  }
  return replaceActiveDraftPayload(working, next);
}

export function DesignerProvider({ children }: { children: ReactNode }) {
  const openDraftWorkspaceHandlerRef = useRef<(() => void) | null>(null);

  const registerOpenDraftWorkspaceHandler = useCallback((fn: (() => void) | null) => {
    openDraftWorkspaceHandlerRef.current = fn;
  }, []);

  const openDraftWorkspaceFromPublishedPreview = useCallback(() => {
    openDraftWorkspaceHandlerRef.current?.();
  }, []);

  const initial = createInitialStageable();
  // Published snapshot starts with "simple" public view so the seeded draft
  // diff shows "Public view changed to Modern landing" (1 demo change).
  const publishedSnapshot = cloneStageable(initial);
  publishedSnapshot.publicView = 'simple';

  // Seed one draft whose payload keeps the default "modern" public view.
  // Mark English as "ever published" so Publish Live URL activates it (the diff
  // logic only checks localeLive, so this doesn't add a visible change).
  const draftPayload = cloneStageable(initial); // publicView: 'modern'
  draftPayload.localeEverPublished = { ...draftPayload.localeEverPublished, en: true };
  const seedDraftId = newDraftId();
  const seedNow = Date.now();
  const seedDraft: TrustCenterDraft = {
    id: seedDraftId,
    editedBy: DESIGNER_DRAFT_EDITOR_DISPLAY_NAME,
    name: formatDraftLabel(seedNow),
    updatedAt: seedNow,
    payload: draftPayload,
  };

  const [state, setState] = useState<DesignerState>(() => ({
    ...stageableToMirror(draftPayload),
    previewLocale: 'en',
    savedQuickLinks: null,
    savedCompanyProfile: null,
    featuredDocumentsLayout: 'column-fill',
    publishedSnapshot,
    publishedTrustCenterNames: { en: formatTrustCenterName() },
    publishedChangelogNote: '',
    drafts: [seedDraft],
    activeDraftId: seedDraftId,
    previewMode: 'draft',
  }));

  useLayoutEffect(() => {
    setState((s) => {
      const next = withMigratedOrderAndVisibility(s);
      return next ?? s;
    });
  }, []);

  const isActiveDraftDirty = useMemo(() => {
    if (state.drafts.length === 0) return false;
    const active = state.drafts.find((d) => d.id === state.activeDraftId);
    if (!active) return false;
    return !stageablesEqual(active.payload, state.publishedSnapshot);
  }, [state.drafts, state.activeDraftId, state.publishedSnapshot]);

  const setIsLive = (val: boolean) => setState((s) => patchActiveDraft(s, { isLive: val }));
  const setPublicView = (val: 'modern' | 'simple') => setState((s) => patchActiveDraft(s, { publicView: val }));
  const setAccentColor = (val: string) => setState((s) => patchActiveDraft(s, { accentColor: val }));
  const setPrimaryColor = (val: string) => setState((s) => patchActiveDraft(s, { primaryColor: val }));
  const setFontFamily = (val: string) => setState((s) => patchActiveDraft(s, { fontFamily: val }));
  const setPreviewLocale = (val: PreviewLocale) =>
    setState((s) => ({
      ...s,
      previewLocale: val,
      savedQuickLinks: null,
      savedCompanyProfile: null,
    }));

  const toggleLocaleLive = (locale: PreviewLocale) =>
    setState((s) => {
      const nextLive = { ...s.localeLive, [locale]: !s.localeLive[locale] };
      return patchActiveDraft(s, { localeLive: nextLive });
    });
  const setSavedQuickLinks = (val: SavedQuickLinks | null) =>
    setState((s) => ({ ...s, savedQuickLinks: val }));
  const setSavedCompanyProfile = (val: SavedCompanyProfile | null) =>
    setState((s) => ({ ...s, savedCompanyProfile: val }));
  const setFeaturedDocumentsLayout = (val: 'column-fill' | 'row-major') =>
    setState((s) => ({ ...s, featuredDocumentsLayout: val }));
  const setSavedTrustCenterImagery = (val: SavedTrustCenterImagery | null) =>
    setState((s) => patchActiveDraft(s, { savedTrustCenterImagery: val }));

  const setSavedAiAgentConfig = (patch: Partial<SavedAiAgentConfig>) =>
    setState((s) => {
      const source =
        s.drafts.length === 0 ? s.publishedSnapshot : s.drafts.find((d) => d.id === s.activeDraftId)?.payload;
      const base = mergeSavedAiAgentConfig(source?.savedAiAgentConfig);
      return patchActiveDraft(s, { savedAiAgentConfig: { ...base, ...patch } });
    });

  const toggleSection = (id: string) =>
    setState((s) => {
      const v = { ...s.sectionVisibility, [id]: !s.sectionVisibility[id] };
      return patchActiveDraft(s, { sectionVisibility: v });
    });

  const setSectionVisibility = (id: string, visible: boolean) =>
    setState((s) => patchActiveDraft(s, { sectionVisibility: { ...s.sectionVisibility, [id]: visible } }));

  const reorderSections = (dragIndex: number, dropIndex: number) =>
    setState((s) =>
      patchActiveDraft(s, {
        sectionOrder: moveSectionBlock(s.sectionOrder, dragIndex, dropIndex),
      }),
    );

  const setPreviewMode = (mode: 'draft' | 'published') =>
    setState((s) => {
      if (mode === 'draft' && s.drafts.length === 0) return s;
      return { ...s, previewMode: mode };
    });

  const selectDraft = (id: string) =>
    setState((s) => {
      const d = s.drafts.find((x) => x.id === id);
      if (!d) return s;
      return {
        ...s,
        activeDraftId: id,
        ...stageableToMirror(d.payload),
      };
    });

  const createDraft = () =>
    setState((s) => {
      if (s.drafts.length >= MAX_DESIGNER_DRAFTS) return s;
      const base = cloneStageable(s.publishedSnapshot);
      // Mark English as "ever published" so Publish Live URL activates it
      // (mirrors the seed-draft setup on line 266).
      base.localeEverPublished = { ...base.localeEverPublished, en: true };
      const id = newDraftId();
      const now = Date.now();
      const draft: TrustCenterDraft = {
        id,
        editedBy: DESIGNER_DRAFT_EDITOR_DISPLAY_NAME,
        name: formatDraftLabel(now),
        updatedAt: now,
        payload: base,
      };
      return {
        ...s,
        drafts: [...s.drafts, draft],
        activeDraftId: id,
        previewMode: 'draft',
        ...stageableToMirror(base),
      };
    });

  const renameDraft = (id: string, name: string) =>
    setState((s) => ({
      ...s,
      drafts: s.drafts.map((d) => (d.id === id ? { ...d, name: name.trim() || d.name } : d)),
    }));

  const deleteDraft = (id: string) =>
    setState((s) => {
      if (s.drafts.length === 0) return s;
      const remaining = s.drafts.filter((d) => d.id !== id);
      if (remaining.length === 0) {
        const pub = cloneStageable(s.publishedSnapshot);
        return {
          ...s,
          drafts: [],
          activeDraftId: '',
          previewMode: 'published',
          ...stageableToMirror(pub),
        };
      }
      if (s.activeDraftId === id) {
        const next = remaining[0];
        return {
          ...s,
          drafts: remaining,
          activeDraftId: next.id,
          ...stageableToMirror(next.payload),
        };
      }
      return { ...s, drafts: remaining };
    });

  const publishActiveDraft = (changelogNote?: string, options?: { goLive?: boolean }) =>
    setState((s) => {
      if (s.drafts.length === 0) return s;
      const active = s.drafts.find((d) => d.id === s.activeDraftId);
      if (!active) return s;
      const prevPub = s.publishedSnapshot;
      const publishedSnapshot = cloneStageable(active.payload);
      const mergedEver = {} as Record<PreviewLocale, boolean>;
      for (const loc of PREVIEW_LOCALES) {
        mergedEver[loc] = !!(
          prevPub.localeEverPublished[loc] ||
          prevPub.localeLive[loc] ||
          active.payload.localeEverPublished[loc] ||
          active.payload.localeLive[loc]
        );
      }
      publishedSnapshot.localeEverPublished = mergedEver;
      // "Publish live" forces visitor-on for any locale that has ever been live.
      // "Publish to preview link" leaves visitor visibility untouched (uses the draft's localeLive).
      if (options?.goLive === true) {
        const onLive = {} as Record<PreviewLocale, boolean>;
        for (const loc of PREVIEW_LOCALES) {
          onLive[loc] = !!(mergedEver[loc] || active.payload.localeLive[loc]);
        }
        publishedSnapshot.localeLive = onLive;
      }
      const nextNames = { ...s.publishedTrustCenterNames };
      /** Live rows show the active draft name after publish. Inactive locales keep their stored name (e.g. Future Another TC). */
      for (const loc of PREVIEW_LOCALES) {
        if (publishedSnapshot.localeLive[loc]) {
          nextNames[loc] = active.name;
        }
      }
      const remaining = s.drafts.filter((d) => d.id !== s.activeDraftId);
      const nextActive = remaining.length > 0 ? remaining[0] : null;
      return {
        ...s,
        publishedSnapshot,
        publishedTrustCenterNames: nextNames,
        publishedChangelogNote: changelogNote?.trim() || '',
        drafts: remaining,
        activeDraftId: nextActive?.id ?? '',
        ...stageableToMirror(nextActive ? nextActive.payload : publishedSnapshot),
        previewMode: 'published',
      };
    });

  const setPublishedTrustCenterVisitorLive = (live: boolean) =>
    setState((s) => {
      const pub = s.publishedSnapshot;
      const nextLive = {} as Record<PreviewLocale, boolean>;
      for (const loc of PREVIEW_LOCALES) {
        nextLive[loc] = live ? !!pub.localeEverPublished[loc] : false;
      }
      return patchPublishedSnapshot(s, { localeLive: nextLive });
    });

  const unpublishToDraft = () =>
    setState((s) => {
      // 1. Clone the published snapshot as the draft payload.
      const draftPayload = cloneStageable(s.publishedSnapshot);
      draftPayload.localeEverPublished = { ...draftPayload.localeEverPublished, en: true };

      // 2. Use the published TC name for the draft.
      const tcName =
        s.publishedTrustCenterNames[PRIMARY_TRUST_CENTER_LOCALE] ||
        PREVIEW_LOCALES.map((loc) => s.publishedTrustCenterNames[loc]).find(Boolean) ||
        formatTrustCenterName();

      const now = Date.now();
      const id = newDraftId();
      const draft: TrustCenterDraft = {
        id,
        editedBy: DESIGNER_DRAFT_EDITOR_DISPLAY_NAME,
        name: tcName,
        updatedAt: now,
        payload: draftPayload,
      };

      // 3. Flip localeLive to all false on the published snapshot.
      const nextLive = {} as Record<PreviewLocale, boolean>;
      for (const loc of PREVIEW_LOCALES) {
        nextLive[loc] = false;
      }
      const nextPublished = { ...s.publishedSnapshot, localeLive: nextLive };

      // 4. Overwrite any existing draft. Stay on published view so the user
      //    immediately sees the empty state; they can switch to draft when ready.
      return {
        ...s,
        publishedSnapshot: nextPublished,
        drafts: [draft],
        activeDraftId: id,
        previewMode: 'published',
        ...stageableToMirror(draftPayload),
      };
    });

  const setPublishedChangelogNote = (note: string) =>
    setState((s) => ({ ...s, publishedChangelogNote: note.trim() }));

  const discardActiveDraft = () =>
    setState((s) => {
      if (s.drafts.length === 0) return s;
      const pub = cloneStageable(s.publishedSnapshot);
      return replaceActiveDraftPayload(s, pub, true);
    });

  /**
   * Revert a single field in the active draft back to its published value.
   * Field id format matches DraftDiffEntry.id from draftDiff.ts.
   */
  const revertDraftField = (fieldId: string) =>
    setState((s) => {
      if (s.drafts.length === 0) return s;
      const active = s.drafts.find((d) => d.id === s.activeDraftId);
      if (!active) return s;
      const pub = s.publishedSnapshot;

      if (fieldId === 'publicView') return patchActiveDraft(s, { publicView: pub.publicView });
      if (fieldId === 'isLive') return patchActiveDraft(s, { isLive: pub.isLive });
      if (fieldId === 'accentColor') return patchActiveDraft(s, { accentColor: pub.accentColor });
      if (fieldId === 'primaryColor') return patchActiveDraft(s, { primaryColor: pub.primaryColor });
      if (fieldId === 'fontFamily') return patchActiveDraft(s, { fontFamily: pub.fontFamily });
      if (fieldId === 'sectionOrder') return patchActiveDraft(s, { sectionOrder: [...pub.sectionOrder] });
      if (fieldId === 'sectionVisibility') {
        return patchActiveDraft(s, { sectionVisibility: { ...pub.sectionVisibility } });
      }
      if (fieldId === 'imagery') {
        return patchActiveDraft(s, { savedTrustCenterImagery: pub.savedTrustCenterImagery });
      }
      if (fieldId.startsWith('localeLive:')) {
        const locale = fieldId.slice('localeLive:'.length) as PreviewLocale;
        return patchActiveDraft(s, {
          localeLive: { ...active.payload.localeLive, [locale]: !!pub.localeLive[locale] },
        });
      }
      if (fieldId.startsWith('aiAgent:')) {
        const flag = fieldId.slice('aiAgent:'.length);
        const next = { ...active.payload.savedAiAgentConfig };
        if (flag === 'askAiEnabled') next.askAiEnabled = pub.savedAiAgentConfig.askAiEnabled;
        else if (flag === 'surfaceDocuments') next.surfaceDocuments = pub.savedAiAgentConfig.surfaceDocuments;
        else if (flag === 'allowQuestionnaire') next.allowQuestionnaire = pub.savedAiAgentConfig.allowQuestionnaire;
        return patchActiveDraft(s, { savedAiAgentConfig: next });
      }
      return s;
    });

  return (
    <DesignerContext.Provider
      value={{
        state,
        setIsLive,
        setPublicView,
        setAccentColor,
        setPrimaryColor,
        setFontFamily,
        toggleSection,
        setSectionVisibility,
        reorderSections,
        setPreviewLocale,
        toggleLocaleLive,
        setPublishedTrustCenterVisitorLive,
        unpublishToDraft,
        setPublishedChangelogNote,
        setSavedQuickLinks,
        setSavedCompanyProfile,
        setFeaturedDocumentsLayout,
        setSavedTrustCenterImagery,
        setSavedAiAgentConfig,
        setPreviewMode,
        selectDraft,
        createDraft,
        renameDraft,
        deleteDraft,
        publishActiveDraft,
        discardActiveDraft,
        revertDraftField,
        isActiveDraftDirty,
        registerOpenDraftWorkspaceHandler,
        openDraftWorkspaceFromPublishedPreview,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}

export function useDesigner() {
  const ctx = useContext(DesignerContext);
  if (!ctx) throw new Error('useDesigner must be used within DesignerProvider');
  return ctx;
}

/** Published-only presentation for `/trust-center` (and comparisons). */
export function getPublishedPresentation(state: DesignerState): StageablePresentation {
  return cloneStageable(state.publishedSnapshot);
}

/** What the designer center column should render for Trust Center chrome. */
export function getDesignerTrustCenterPresentation(state: DesignerState): StageablePresentation {
  if (state.previewMode === 'published') {
    return cloneStageable(state.publishedSnapshot);
  }
  const active = state.drafts.find((d) => d.id === state.activeDraftId);
  return active ? cloneStageable(active.payload) : cloneStageable(state.publishedSnapshot);
}
