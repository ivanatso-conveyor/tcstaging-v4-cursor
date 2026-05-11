import { type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { uiAssets } from '../../constants/uiAssets';
import MaterialIcon from '../MaterialIcon';
import { ChevronDown, PanelLeftOpen } from 'lucide-react';

interface LeftNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function LeftNav({ collapsed, onToggleCollapse }: LeftNavProps) {
  if (collapsed) {
    return (
      <div className="flex h-full min-h-0 w-[48px] shrink-0 flex-col items-center self-stretch overflow-hidden border-r border-primary-400 bg-bg-default py-3">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded hover:bg-primary-300 text-primary-700 mb-4"
        >
          <PanelLeftOpen size={16} />
        </button>
        <div className="flex flex-col gap-3 items-center mt-2">
          <img
            src={uiAssets.mediacoreLogo}
            alt="Mediacore"
            className="w-5 h-5 rounded-sm object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-[240px] shrink-0 flex-col self-stretch overflow-hidden border-r border-primary-400 bg-bg-default">
      {/* Org header */}
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 px-1 rounded hover:bg-primary-300 py-1 cursor-pointer">
          <img
            src={uiAssets.mediacoreLogo}
            alt="Mediacore"
            className="w-6 h-6 rounded-sm object-cover"
          />
          <span
            className="text-primary-800"
            style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: '14px', lineHeight: '1.35', fontWeight: 500 }}
          >MediaCore</span>
          <ChevronDown size={14} className="text-primary-700" />
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-primary-300 text-primary-700"
        >
          <MaterialIcon symbol="keyboard_tab_rtl" size={20} color="var(--color-primary-700)" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-2.5 py-2 bg-primary-300 rounded-lg">
          <MaterialIcon symbol="search" size={16} color="var(--color-primary-600)" />
          <span
            className="text-primary-600"
            style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: '14px', lineHeight: '1.35', fontWeight: 500 }}
          >Get an answer (⌘K)</span>
        </div>
      </div>

      {/* Main nav — no scroll: column is fixed to viewport height; center/right columns scroll instead */}
      <nav className="min-h-0 flex-1 overflow-hidden px-2">
        <div className="space-y-0.5 mb-2">
          <NavItem icon={<MaterialIcon symbol="rocket_launch" size={18} color="var(--color-primary-600)" filled />} label="Launchpad" />
          <NavItem icon={<MaterialIcon symbol="trending_up" size={18} color="var(--color-primary-600)" />} label="Insights" />
        </div>

        <NavSection title="Knowledge Management">
          <NavItem icon={<MaterialIcon symbol="chat_bubble" size={18} color="var(--color-primary-600)" filled />} label="Knowledge Base" />
          <NavItem icon={<MaterialIcon symbol="auto_stories" size={18} color="var(--color-primary-600)" filled />} label="Documents" />
        </NavSection>

        <NavSection title="Spaces">
          <SpaceItem color="var(--color-purple-400)" label="Security Questionnaires" />
          <SpaceItem color="var(--color-link-400)" label="RFxs" />
        </NavSection>

        <NavSection title="Trust Center">
          <NavItem
            icon={<MaterialIcon symbol="palette" size={16} color="var(--color-purple-400)" filled />}
            label="Editor"
            active
            activeColor="purple"
          />
          <NavItem
            icon={<MaterialIcon symbol="groups" size={16} color="var(--color-primary-700)" filled />}
            label="Audience"
            badge="9 Requests"
          />
        </NavSection>
      </nav>

      {/* Bottom bar — overflow-visible so notification badge is not clipped */}
      <div className="flex items-center gap-2 overflow-visible px-3 py-2.5">
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-400 text-primary-700 hover:bg-primary-300"
          aria-label="Help"
        >
          <FontAwesomeIcon
            icon={faQuestion}
            className="block h-[16px] w-[16px] max-h-[16px] max-w-[16px] shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
            aria-hidden
          />
        </button>
        <button
          type="button"
          className="rounded-full border border-primary-400 px-3.5 py-1.5 text-xs font-medium text-primary-800 hover:bg-primary-300"
        >
          What's New
        </button>
        <button
          type="button"
          className="relative ml-auto flex h-9 w-9 shrink-0 items-center justify-center overflow-visible rounded-full border border-primary-400 text-primary-700 hover:bg-primary-300"
          aria-label="Notifications, 1 unread"
        >
          <FontAwesomeIcon
            icon={faBell}
            className="pointer-events-none block h-[16px] w-[16px] max-h-[16px] max-w-[16px] shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
            aria-hidden
          />
          {/* Badge ~30% smaller than 16px (11.2px); center on outer ring ~45° */}
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-[11.2px] w-[11.2px] shrink-0 items-center justify-center rounded-full bg-failure-400 text-[7px] font-bold tabular-nums leading-none text-white shadow-sm"
            style={{ transform: 'translate(-50%, -50%) translate(7px, -7px)' }}
          >
            1
          </span>
        </button>
      </div>
    </div>
  );
}

function NavSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-4 mb-1">
      <p className="px-3 text-[11px] font-medium text-primary-600 tracking-wide mb-1.5">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  activeColor = 'blue',
  badge,
  trailing,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  activeColor?: 'blue' | 'purple';
  badge?: string;
  trailing?: ReactNode;
}) {
  const activeBg = activeColor === 'purple' ? 'bg-purple-200/30' : 'bg-link-100';
  const activeText = activeColor === 'purple' ? 'text-primary-800' : 'text-link-400';

  return (
    <button
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-colors ${
        active
          ? `${activeBg} ${activeText}`
          : 'text-primary-700 hover:bg-primary-300'
      }`}
      style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: '14px', lineHeight: '1.35', fontWeight: 500 }}
    >
      <span className="shrink-0 flex items-center">{icon}</span>
      <span className={`text-left ${badge ? 'flex-1' : trailing ? '' : 'flex-1'}`}>{label}</span>
      {badge && (
        <span className="text-[11px] text-primary-700 font-medium shrink-0 bg-primary-300 px-1.5 py-0.5 rounded ml-auto">
          {badge}
        </span>
      )}
      {trailing && <span className="shrink-0" style={{ marginLeft: '4px' }}>{trailing}</span>}
    </button>
  );
}

function SpaceItem({ color, label }: { color: string; label: string }) {
  return (
    <button
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-300 transition-colors"
      style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: '14px', lineHeight: '1.35', fontWeight: 500 }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </button>
  );
}
