/**
 * DocumentsSearchModal
 * Two-part explorer: a stationary search + product-filter header above a
 * horizontally-paged carousel of category panels (Documents, Overview,
 * Access Management, Risk and Vulnerability Management, etc.).
 * Entry points: Trust Center "Documents" big card.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Documents Modal
 */
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Filter,
  Folder,
  Link as LinkIcon,
  Lock,
  Search,
  Unlock,
} from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';
import ProductFilterChips from './ProductFilterChips';
import { productFilters, documentsFaqTiles } from '../../constants/data';
import { useReviewingProductFilter } from '../../contexts/ReviewingProductFilterContext';
import MaterialIcon from '../MaterialIcon';

type Props = {
  onClose: () => void;
  /** Panel key to focus when the modal opens. Defaults to the Documents panel. */
  initialPanelKey?: string;
};

const COMPLIANCE_CHIPS = [
  'MediaCore Policy',
  'ISO 27001',
  'SOC 2 Type II',
  'CSA',
  'ISAE 3000 Type I',
  'GDPR',
  'FedRAMP',
  'Cyber Essentials',
  '21 C.F.R. Part 11',
  'HIPAA',
];

type FolderDoc = { title: string };
type DocumentFolder = { name: string; documents: FolderDoc[] };

const DOCUMENT_FOLDERS: DocumentFolder[] = [
  {
    name: 'Business and Product Marketing',
    documents: [
      { title: 'First Call Deck for Security Questionnaires' },
      { title: 'Second Call Deck for Security Questionnaires' },
    ],
  },
  {
    name: 'Company Policies',
    documents: Array.from({ length: 15 }, (_, i) => ({ title: `Company Policy ${i + 1}` })),
  },
  {
    name: 'General',
    documents: [{ title: 'Overview' }, { title: 'Company Handbook' }],
  },
  {
    name: 'Information Security Policy',
    documents: [{ title: 'Information Security Policy' }],
  },
  {
    name: 'Privacy Program',
    documents: Array.from({ length: 4 }, (_, i) => ({ title: `Privacy Document ${i + 1}` })),
  },
  {
    name: 'Pro Line',
    documents: [{ title: 'Pro Line Overview' }],
  },
  {
    name: 'Quarterly Bias Reports',
    documents: [{ title: 'Q1 Bias Report' }, { title: 'Q2 Bias Report' }],
  },
  {
    name: 'Security Controls Evidence',
    documents: [
      { title: 'Control Evidence Summary' },
      { title: 'Penetration Test Results' },
    ],
  },
];

const COMPLIANCE_BADGE_STYLES: Record<string, { bg: string; fg: string; initials: string }> = {
  'MediaCore Policy': { bg: '#6366F1', fg: '#FFFFFF', initials: 'M' },
  'ISO 27001': { bg: '#0F172A', fg: '#FFFFFF', initials: 'IS' },
  'SOC 2 Type II': { bg: '#1E293B', fg: '#FFFFFF', initials: 'S2' },
  CSA: { bg: '#111827', fg: '#FFFFFF', initials: 'CS' },
  'ISAE 3000 Type I': { bg: '#1E293B', fg: '#FFFFFF', initials: 'I3' },
  GDPR: { bg: '#1D4ED8', fg: '#FFD700', initials: 'GD' },
  FedRAMP: { bg: '#B91C1C', fg: '#FFFFFF', initials: 'FR' },
  'Cyber Essentials': { bg: '#0E7490', fg: '#FFFFFF', initials: 'CE' },
  '21 C.F.R. Part 11': { bg: '#1E3A8A', fg: '#FFFFFF', initials: '21' },
  HIPAA: { bg: '#0D9488', fg: '#FFFFFF', initials: 'H' },
};

type FaqQuestion = { text: string; popular?: boolean; locked?: boolean };

const FAQ_BY_TOPIC: Record<string, FaqQuestion[]> = {
  Overview: [
    { text: 'What capabilities are generally available vs roadmap?', popular: true, locked: false },
    { text: 'Describe the technology platform and core architecture.', popular: true, locked: false },
    { text: 'What differentiates your company from competitors?', popular: true, locked: false },
    { text: 'What does the product do?', locked: false },
    { text: 'What is your RTO?', locked: true },
    { text: 'What primary integrations do you support?', locked: false },
    { text: 'Provide annual sales and revenue figures.', locked: true },
    { text: 'Who is your competition in this space?', locked: false },
    { text: 'Describe your standard terms of payment.', locked: true },
  ],
  'Access Management': [
    { text: 'How do you review user access on a recurring basis?', popular: true, locked: true },
    { text: 'Do you use a centralized identity management solution such as Single Sign On?', popular: true, locked: true },
    { text: 'How do you limit shared accounts and enforce named users?', locked: true },
    { text: 'Do you have a password policy aligned with NIST 800-63B?', locked: true },
    { text: 'Do you require multi-factor authentication for privileged access?', locked: true },
  ],
  'Risk and Vulnerability Management': [
    { text: 'How do you identify and prioritize vulnerabilities?', popular: true, locked: true },
    { text: 'What is your remediation SLA for critical findings?', popular: true, locked: true },
    { text: 'Do you perform annual third-party penetration testing?', locked: false },
    { text: 'How frequently do you run vulnerability scans?', locked: true },
    { text: 'Describe your bug bounty or vulnerability disclosure program.', locked: true },
  ],
  'Application and Data Security': [
    { text: 'How is data encrypted at rest and in transit?', popular: true, locked: true },
    { text: 'Do you perform secure code reviews?', locked: true },
    { text: 'How do you manage secrets and API keys?', locked: true },
    { text: 'Describe your SDLC security controls.', locked: true },
  ],
  'Personnel Security': [
    { text: 'Do you perform background checks on new hires?', popular: true, locked: false },
    { text: 'How often do employees complete security awareness training?', locked: true },
    { text: 'Describe your offboarding process for terminated employees.', locked: true },
  ],
  'Incident Management': [
    { text: 'How do you notify customers of security incidents?', popular: true, locked: true },
    { text: 'What is your incident response plan?', locked: true },
  ],
  'Continuity and Disaster Recovery': [
    { text: 'What is your RPO and RTO?', popular: true, locked: true },
  ],
  'Device Management': [
    { text: 'Do you enforce disk encryption on employee devices?', popular: true, locked: true },
    { text: 'How are mobile devices managed?', locked: true },
  ],
  'Cloud Security': [
    { text: 'How do you secure your cloud infrastructure?', popular: true, locked: true },
    { text: 'Which cloud providers do you use?', locked: false },
  ],
  Privacy: [
    { text: 'How do you handle data subject requests?', popular: true, locked: true },
    { text: 'Where is personal data stored geographically?', locked: true },
  ],
  'Vendor Management': [
    { text: 'How do you assess subprocessors and vendors?', popular: true, locked: true },
  ],
  'Security Governance': [
    { text: 'Who is responsible for security program ownership?', popular: true, locked: false },
    { text: 'Describe your security policy framework.', locked: true },
  ],
};

type Panel =
  | { kind: 'documents'; key: string; title: string }
  | { kind: 'faq'; key: string; title: string; icon: string; questions: FaqQuestion[] };

function buildPanels(): Panel[] {
  const seen = new Set<string>();
  const faqPanels: Panel[] = [];
  for (const tile of documentsFaqTiles) {
    if (seen.has(tile.name)) continue;
    seen.add(tile.name);
    const questions = FAQ_BY_TOPIC[tile.name];
    if (!questions) continue;
    faqPanels.push({
      kind: 'faq',
      key: tile.name,
      title: tile.name,
      icon: tile.icon,
      questions,
    });
  }
  return [{ kind: 'documents', key: 'documents', title: 'Documents' }, ...faqPanels];
}

export default function DocumentsSearchModal({ onClose, initialPanelKey }: Props) {
  const { activeReviewingFilter, setActiveReviewingFilter } = useReviewingProductFilter();
  const [query, setQuery] = useState('');
  const panels = useMemo(buildPanels, []);
  const initialIndex = useMemo(() => {
    if (!initialPanelKey) return 0;
    const idx = panels.findIndex((p) => p.key === initialPanelKey);
    return idx >= 0 ? idx : 0;
  }, [panels, initialPanelKey]);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const lastIndex = panels.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') setActiveIndex((i) => Math.max(0, i - 1));
      else if (e.key === 'ArrowRight') setActiveIndex((i) => Math.min(lastIndex, i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, lastIndex]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="documents-search-title"
      className="fixed inset-0 z-[200]"
    >
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center gap-5 py-8">
        <div className="pointer-events-auto flex w-[70vw] shrink-0 flex-col overflow-hidden rounded-xl border border-primary-300 bg-white shadow-[0px_10px_30px_0px_rgba(0,0,0,0.08)]">
          <h2 id="documents-search-title" className="sr-only">
            Search MediaCore documents and answers
          </h2>
          <div className="relative px-6 py-4">
            <Search
              size={18}
              strokeWidth={2}
              className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-primary-600"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across MediaCore's answers and documents"
              className="h-10 w-full rounded-md bg-transparent pl-8 pr-2 text-base text-primary-800 placeholder-primary-600 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="border-t border-primary-300 bg-primary-100 px-6 py-3">
            <ProductFilterChips
              label="I'm reviewing:"
              filters={productFilters}
              activeFilter={activeReviewingFilter}
              onFilterChange={setActiveReviewingFilter}
            />
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 w-full items-stretch overflow-hidden">
          <Carousel panels={panels} activeIndex={activeIndex} />
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex <= 0}
            aria-label="Previous panel"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-400 bg-white text-primary-700 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center gap-2 rounded-full border border-primary-400 bg-white px-5 text-sm font-medium text-primary-800 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] transition-colors hover:bg-primary-100"
          >
            Back to the Trust Center
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.min(lastIndex, i + 1))}
            disabled={activeIndex >= lastIndex}
            aria-label="Next panel"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-400 bg-white text-primary-700 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

const PANEL_WIDTH = '70vw';
const PANEL_GAP = 24;

function Carousel({ panels, activeIndex }: { panels: Panel[]; activeIndex: number }) {
  return (
    <div className="relative flex w-full items-stretch overflow-hidden">
      <div
        className="pointer-events-none mx-auto flex h-full transition-transform duration-300 ease-out"
        style={{
          gap: `${PANEL_GAP}px`,
          width: PANEL_WIDTH,
          transform: `translateX(calc(50% - (${PANEL_WIDTH} / 2) - ${activeIndex} * (${PANEL_WIDTH} + ${PANEL_GAP}px)))`,
        }}
      >
        {panels.map((panel, i) => {
          const dimmed = i !== activeIndex;
          return (
            <div
              key={panel.key}
              aria-hidden={dimmed}
              className={`shrink-0 ${dimmed ? '' : 'pointer-events-auto'}`}
              style={{ width: PANEL_WIDTH }}
            >
              {panel.kind === 'documents' ? (
                <DocumentsPanel dimmed={dimmed} />
              ) : (
                <FaqPanel panel={panel} dimmed={dimmed} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PanelShell({ children, dimmed }: { children: React.ReactNode; dimmed?: boolean }) {
  return (
    <div className="flex h-full max-h-[560px] flex-col overflow-hidden rounded-lg border border-primary-300 bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
      <div
        className={`flex min-h-0 flex-1 flex-col transition-opacity duration-300 ${
          dimmed ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function PanelHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-primary-200 px-6 pt-6 pb-4">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--trust-center-accent-color, #292951) 15%, transparent)',
        }}
      >
        {icon}
      </div>
      <h3
        className="text-lg font-medium text-primary-800"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
      >
        {title}
      </h3>
    </div>
  );
}

function DocumentsPanel({ dimmed }: { dimmed?: boolean }) {
  const [activeChip, setActiveChip] = useState('MediaCore Policy');
  const [openFolders, setOpenFolders] = useState<Set<string>>(
    () => new Set(['Business and Product Marketing']),
  );

  const toggleFolder = (name: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <PanelShell dimmed={dimmed}>
      <PanelHeader
        icon={
          <MaterialIcon
            symbol="description"
            size={18}
            color="var(--trust-center-accent-color, #292951)"
            filled
          />
        }
        title="Documents"
      />
      <div className="flex shrink-0 items-center gap-3 border-b border-primary-200 bg-primary-100 px-6 py-3">
        <button
          type="button"
          aria-label="Filter by compliance"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-primary-700 hover:bg-primary-200"
        >
          <Filter size={16} strokeWidth={2} aria-hidden />
        </button>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {COMPLIANCE_CHIPS.map((chip) => {
            const selected = chip === activeChip;
            const badge = COMPLIANCE_BADGE_STYLES[chip];
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveChip(chip)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-2xl border px-2 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? 'border-transparent bg-[color-mix(in_srgb,var(--trust-center-accent-color,#292951)_15%,transparent)] text-primary-800 shadow-[inset_0_0_0_1px_var(--trust-center-accent-color,#292951)]'
                    : 'border-primary-400 bg-white text-primary-700 hover:border-primary-600'
                }`}
                style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
              >
                {badge ? (
                  <span
                    aria-hidden
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold leading-none"
                    style={{ backgroundColor: badge.bg, color: badge.fg }}
                  >
                    {badge.initials}
                  </span>
                ) : null}
                {chip}
              </button>
            );
          })}
        </div>
        <div className="flex shrink-0 flex-col items-end leading-tight">
          <span className="text-[10px] text-primary-600">Sort:</span>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 text-xs font-medium text-primary-800"
          >
            A → Z
            <ChevronDown size={12} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {DOCUMENT_FOLDERS.map((folder) => {
          const isOpen = openFolders.has(folder.name);
          return (
            <li
              key={folder.name}
              className={`border-b border-primary-200 last:border-b-0 ${
                isOpen ? 'bg-primary-100' : 'bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFolder(folder.name)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-primary-200/60"
              >
                <ChevronRight
                  size={16}
                  strokeWidth={2}
                  className={`shrink-0 text-primary-700 transition-transform ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                  aria-hidden
                />
                <Folder
                  size={18}
                  strokeWidth={2}
                  className="shrink-0"
                  style={{ color: 'var(--trust-center-accent-color, #292951)' }}
                  aria-hidden
                />
                <span className="flex-1 text-sm font-medium text-primary-800">{folder.name}</span>
                <span className="text-xs text-primary-600">
                  {folder.documents.length}{' '}
                  {folder.documents.length === 1 ? 'document' : 'documents'}
                </span>
              </button>
              {isOpen ? (
                <div className="grid grid-cols-4 gap-3 px-6 pb-4 pt-1">
                  {folder.documents.map((doc, i) => (
                    <DocumentCard key={`${folder.name}-${i}`} title={doc.title} />
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </PanelShell>
  );
}

function DocumentCard({ title }: { title: string }) {
  return (
    <div className="flex h-[190px] flex-col overflow-hidden rounded-md border border-primary-300 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div
        className="h-1.5 w-full shrink-0"
        style={{ backgroundColor: 'var(--trust-center-accent-color, #292951)' }}
        aria-hidden
      />
      <div className="flex min-h-0 flex-1 items-start px-4 pt-4">
        <h4
          className="text-sm font-medium leading-snug text-primary-800"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
        >
          {title}
        </h4>
      </div>
      <div className="flex shrink-0 items-center gap-4 border-t border-primary-200 px-4 py-2.5">
        <button type="button" className="text-xs font-medium text-primary-800 hover:underline">
          View
        </button>
        <button type="button" className="text-xs font-medium text-primary-800 hover:underline">
          Download
        </button>
        <div className="flex-1" aria-hidden />
        <button
          type="button"
          aria-label="Copy link"
          className="flex h-6 w-6 items-center justify-center rounded text-primary-600 hover:bg-primary-100"
        >
          <LinkIcon size={14} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function FaqPanel({
  panel,
  dimmed,
}: {
  panel: Extract<Panel, { kind: 'faq' }>;
  dimmed?: boolean;
}) {
  return (
    <PanelShell dimmed={dimmed}>
      <PanelHeader
        icon={
          <MaterialIcon
            symbol={panel.icon}
            size={18}
            color="var(--trust-center-accent-color, #292951)"
            filled
          />
        }
        title={panel.title}
      />
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {panel.questions.map((q, i) => (
          <li key={`${panel.key}-${i}`}>
            <button
              type="button"
              className="flex w-full items-center gap-3 border-b border-primary-200 px-6 py-4 text-left transition-colors last:border-b-0 hover:bg-primary-100"
            >
              <span className="flex-1 text-sm text-primary-800">{q.text}</span>
              {q.popular ? (
                <span className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--color-brand-400)_15%,transparent)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-brand-600">
                  Popular
                </span>
              ) : null}
              {q.locked ? (
                <Lock size={14} strokeWidth={2} className="shrink-0 text-primary-600" aria-hidden />
              ) : (
                <Unlock
                  size={14}
                  strokeWidth={2}
                  className="shrink-0 text-primary-600"
                  aria-hidden
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

