import { ChevronDown } from 'lucide-react';
import conveyorAiIcon from '../../assets/icons/conveyor-ai.svg';
import { useDesigner } from '../../context/DesignerContext';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import type { SearchItem } from '../../data/searchData';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import TrustCenterEditableRegion from '../TrustCenter/TrustCenterEditableRegion';
import MaterialIcon from '../MaterialIcon';
import { mergeCompanyProfile } from '../../utils/companyProfileMerge';
import { mergeSavedAiAgentConfig } from '../../utils/stagingPresentation';
import type { SavedTrustCenterImagery } from '../../utils/trustCenterImageryMerge';
import { effectiveSquareLogo } from '../../utils/trustCenterImageryMerge';
import SearchBar from './SearchBar';

export interface StickyNavProps {
  onSectionClick: (sectionId: string) => void;
  onDocumentClick: (item: SearchItem) => void;
  onAskAI?: (query: string) => void;
  /** When set, overrides context imagery for square logo (draft vs published preview). */
  savedTrustCenterImageryOverride?: SavedTrustCenterImagery | null;
  /**
   * When true (default), uses `sticky top-0` so the bar pins while the window or outer page scrolls.
   * When false (designer preview), the parent column pins this bar; only inner content scrolls.
   */
  useViewportSticky?: boolean;
}

export default function StickyNav({
  onSectionClick,
  onDocumentClick,
  onAskAI,
  savedTrustCenterImageryOverride,
  useViewportSticky = true,
}: StickyNavProps) {
  const copy = useTrustCenterCopy();
  const { state } = useDesigner();
  const { enabled: sectionEditEnabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();
  const companyProfile = mergeCompanyProfile(copy.identity, state.savedCompanyProfile);
  const logoSrc = effectiveSquareLogo(savedTrustCenterImageryOverride ?? state.savedTrustCenterImagery);
  const aiAgent = mergeSavedAiAgentConfig(state.savedAiAgentConfig);
  const askAiNavLabel = (aiAgent.buttonLabel ?? '').trim() || copy.sticky.askAiAgent;

  return (
    <div
      className={`z-50 flex h-[60px] shrink-0 items-center px-4 ${useViewportSticky ? 'sticky top-0' : 'relative'}`}
      style={{
        backgroundColor: 'var(--trust-center-header-color, #333366)',
        borderBottom: '1px solid var(--color-grey-600)',
        boxShadow: '0px 4px 8px 0px rgba(0,27,40,0.15)',
      }}
    >
      {/* Left: Logo + Name (designer: hover to edit brand lockup) */}
      <TrustCenterEditableRegion
        sectionId="nav-brand"
        enabled={sectionEditEnabled}
        previewMode={previewMode}
        publishedOverlay="none"
        onEditClick={onSectionEdit}
        className="shrink-0 rounded-md"
      >
        <div className="flex shrink-0 items-center gap-2.5">
          <img
            src={logoSrc}
            alt=""
            className="h-8 w-8 rounded object-cover"
            aria-hidden
          />
          <span
            className="whitespace-nowrap text-white"
            style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: '16px', lineHeight: '1.35', fontWeight: 500 }}
          >
            {companyProfile.displayName}
          </span>
        </div>
      </TrustCenterEditableRegion>

      {/* Center: Search bar (SearchBar-Bundle) */}
      <div className="flex-1 flex justify-center px-4 min-w-0">
        <div className="w-full max-w-[520px]">
          <SearchBar
            onSectionClick={onSectionClick}
            onDocumentClick={onDocumentClick}
            onAskAI={onAskAI}
          />
        </div>
      </div>

      {/* Right: EN, Subscribe, Ask AI Agent, Avatar */}
      <div className="flex items-center gap-[12px] shrink-0">
        <button
          type="button"
          className="flex shrink-0 items-center justify-center gap-1 h-10 w-[80px] rounded-[20px] overflow-hidden hover:bg-white/10 transition-colors"
        >
          <MaterialIcon symbol="language" size={16} color="var(--color-surface)" />
          <span
            className="text-white"
            style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: '14px', lineHeight: '1.35', fontWeight: 500 }}
          >EN</span>
          <ChevronDown className="w-4 h-4 text-white/70" strokeWidth={2} />
        </button>

        <button
          type="button"
          className="flex shrink-0 items-center justify-center gap-1.5 h-10 w-[100px] rounded-[20px] overflow-hidden hover:bg-white/10 transition-colors"
        >
          <MaterialIcon symbol="notifications" size={16} color="var(--color-surface)" />
          <span
            className="text-white"
            style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: '14px', lineHeight: '1.35', fontWeight: 500 }}
          >{copy.sticky.subscribe}</span>
        </button>

        {aiAgent.askAiEnabled ? (
          <>
            <button
              type="button"
              className="relative z-0 flex min-w-0 max-w-[180px] items-center justify-center gap-1.5 h-10 rounded-[20px] px-4 text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              style={{ backgroundColor: 'var(--trust-center-accent-color, #292951)' }}
              onClick={() => {
                /* Chat not wired in prototype */
              }}
              aria-label={askAiNavLabel}
            >
              <img src={conveyorAiIcon} alt="" className="h-4 w-4 shrink-0 relative z-10" aria-hidden />
              <span className="relative z-10 truncate text-xs font-medium">{askAiNavLabel}</span>
              <div
                className="ask-ai-agent-border-glow absolute -inset-px rounded-[20px] pointer-events-none -z-10"
                style={{
                  backgroundImage:
                    'linear-gradient(79deg, rgb(64, 64, 127) -50%, rgb(38, 38, 76) 3%, rgb(255, 255, 255) 76%, rgb(26, 26, 51) 118%)',
                  backgroundSize: '300% 300%',
                  animation: '4s ease 0s infinite normal none running working-banner-gradient',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  padding: '1px',
                }}
                aria-hidden
              />
            </button>

            <div className="w-px h-6 bg-white/20 shrink-0 self-center" aria-hidden />
          </>
        ) : null}

        <div className="flex items-center gap-0.5 relative cursor-pointer">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-avatar-bg)' }}
          >
            <span
              className="text-white text-sm font-semibold"
              style={{ fontFamily: "'Neue Montreal', sans-serif" }}
            >
              J
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-white/70 shrink-0" strokeWidth={2.5} />
          <div className="absolute -top-0.5 left-[20px] w-3.5 h-3.5 bg-failure-400 rounded-full flex items-center justify-center border border-[color:var(--trust-center-header-color,#333366)]">
            <span className="text-white text-[8px] font-bold">3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
