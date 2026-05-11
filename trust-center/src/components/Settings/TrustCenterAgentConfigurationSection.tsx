/**
 * TrustCenterAgentConfigurationSection
 * Draft right panel: Conveyor AI visibility configuration. Single visibility toggle
 * for the Trust Center AI agent chat — the underlying capability checkboxes
 * (surface documents, allow questionnaire) live on the dedicated AI Agent Settings
 * page; we link out to it from here.
 * Values live on the draft snapshot via savedAiAgentConfig.
 * Figma: Trust Center Vision HQ > Designer > Draft > Conveyor AI visibility configuration
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDesigner } from '../../context/DesignerContext';
import { mergeSavedAiAgentConfig } from '../../utils/stagingPresentation';

export default function TrustCenterAgentConfigurationSection() {
  const { state, setSavedAiAgentConfig } = useDesigner();
  const [expanded, setExpanded] = useState(true);
  const cfg = mergeSavedAiAgentConfig(state.savedAiAgentConfig);

  return (
    <div className="border-b border-primary-400">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-sm font-medium text-primary-700">Conveyor AI visibility configuration</span>
        {expanded ? (
          <ChevronUp size={14} className="text-primary-500" />
        ) : (
          <ChevronDown size={14} className="text-primary-500" />
        )}
      </button>
      {expanded && (
        <div className="space-y-3 px-5 pb-4">
          {/* Intro copy — sets context before the user decides whether to toggle on/off */}
          <p className="text-xs text-primary-600">
            Show AI agent chat for visitors on the Trust Center page. For more options, configure on{' '}
            <a
              href="#ai-agent-settings"
              className="text-link-400 underline hover:text-link-400/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
            >
              AI Agent Settings Page
            </a>
            .
          </p>

          {/* Toggle row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={cfg.askAiEnabled}
              aria-label="Enable Trust Center agent visibility"
              onClick={() => setSavedAiAgentConfig({ askAiEnabled: !cfg.askAiEnabled })}
              className={`relative inline-flex h-3.5 w-[26px] shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-800/25 ${
                cfg.askAiEnabled ? 'bg-brand-400' : 'bg-primary-300'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full bg-white shadow-sm ${
                  cfg.askAiEnabled ? 'right-[1px]' : 'left-[1px]'
                }`}
              />
            </button>
            <span className="text-xs font-medium text-primary-800">Enable Trust Center agent visibility</span>
          </div>
        </div>
      )}
    </div>
  );
}
