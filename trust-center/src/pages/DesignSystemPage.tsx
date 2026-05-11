import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import MaterialIcon from '../components/MaterialIcon';
import { cn } from '../lib/utils';
import { TRUST_CENTER_DEFAULT_ACCENT, TRUST_CENTER_DEFAULT_PRIMARY } from '../constants/brandDefaults';

const SECTION_IDS = [
  'overview',
  'tokens',
  'colors',
  'brand',
  'typography',
  'icons',
  'utilities',
  'components',
  'layout',
] as const;

/** Mirrors `trust-center/src/index.css` @theme (update both when tokens change). */
const PRIMARY_SCALE: { label: string; var: string; tw: string; hex: string }[] = [
  { label: '900', var: '--color-primary-900', tw: 'bg-primary-900', hex: '#001B28' },
  { label: '800', var: '--color-primary-800', tw: 'text-primary-800', hex: '#204156' },
  { label: '700', var: '--color-primary-700', tw: 'text-primary-700', hex: '#47687D' },
  { label: '600', var: '--color-primary-600', tw: 'text-primary-600', hex: '#86A3B5' },
  { label: '500', var: '--color-primary-500', tw: 'border-primary-500', hex: '#B9C8D2' },
  { label: '400', var: '--color-primary-400', tw: 'border-primary-400', hex: '#DEE7EE' },
  { label: '300', var: '--color-primary-300', tw: 'bg-primary-300', hex: '#EDF3F7' },
  { label: '200', var: '--color-primary-200', tw: 'bg-primary-200', hex: '#F4F7F9' },
  { label: '100', var: '--color-primary-100', tw: 'bg-primary-100', hex: '#F9FBFC' },
];

const SEMANTIC_COLORS: { name: string; var: string; tw: string; hex: string; note: string }[] = [
  { name: 'Secondary text', var: '--color-secondary', tw: 'text-secondary', hex: '#47687d', note: 'Same as primary-700' },
  { name: 'Trust icon (default)', var: '--color-trust-icon', tw: 'text-trust-icon', hex: '#292951', note: 'Matches default accent' },
  { name: 'Icon default', var: '--color-icon-default', tw: 'text-icon-default', hex: '#09334E', note: 'Stat pills, identity icons' },
  { name: 'Hero bg', var: '--color-hero-bg', tw: 'bg-hero-bg', hex: '#1a1040', note: 'Header banner strip' },
  { name: 'Avatar bg', var: '--color-avatar-bg', tw: 'bg-avatar-bg', hex: '#6a6a8f', note: 'Sticky nav avatar circle' },
  { name: 'AI text', var: '--color-ai-text', tw: 'text-ai-text', hex: '#2D296D', note: 'Search Ask AI label' },
  { name: 'Brand teal 600', var: '--color-brand-600', tw: 'bg-brand-600', hex: '#1A9E7A', note: 'CTAs, success emphasis' },
  { name: 'Brand teal 400', var: '--color-brand-400', tw: 'bg-brand-400', hex: '#33C69F', note: 'Share button, hovers' },
  { name: 'Link 400', var: '--color-link-400', tw: 'text-link-400', hex: '#0D7DE4', note: 'Links in Trust Center' },
  { name: 'Purple 600', var: '--color-purple-600', tw: 'text-purple-600', hex: '#604194', note: 'Designer nav accent' },
  { name: 'Purple 500', var: '--color-purple-500', tw: 'text-purple-500', hex: '#7C3AED', note: 'AI pill gradient' },
  { name: 'Purple 400', var: '--color-purple-400', tw: 'text-purple-400', hex: '#8969BD', note: 'Spaces, palette icon' },
  { name: 'Purple 300', var: '--color-purple-300', tw: 'text-purple-300', hex: '#A78BFA', note: 'AI pill gradient' },
  { name: 'Failure 400', var: '--color-failure-400', tw: 'bg-failure-400', hex: '#F25D54', note: 'Badges, errors' },
  { name: 'Surface', var: '--color-surface', tw: 'bg-surface', hex: '#FFFFFF', note: 'Same as background, popover' },
  { name: 'Bg default', var: '--color-bg-default', tw: 'bg-bg-default', hex: '#F9FBFC', note: 'Same as primary-100' },
  { name: 'Border default', var: '--color-border-default', tw: 'border-primary-400', hex: '#DEE7EE', note: 'Same as primary-400, border' },
];

const COMPONENT_GROUPS: { group: string; items: { name: string; path: string; purpose: string }[] }[] = [
  {
    group: 'Shared',
    items: [
      { name: 'MaterialIcon', path: 'components/MaterialIcon.tsx', purpose: 'Material Symbols Rounded via ligature `symbol` prop' },
      { name: 'LogoDevMark', path: 'components/LogoDevMark.tsx', purpose: 'Logo.dev image with `brandName` fallback initial' },
      { name: 'checkbox (ui)', path: 'components/ui/checkbox.tsx', purpose: 'Radix checkbox primitive' },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { name: 'LeftNav', path: 'components/Navigation/LeftNav.tsx', purpose: 'Designer shell sidebar' },
      { name: 'SearchBar', path: 'components/Navigation/SearchBar.tsx', purpose: 'Trust Center preview search' },
      { name: 'StickyNav', path: 'components/Navigation/StickyNav.tsx', purpose: 'Preview sticky bar, Ask AI, locale' },
    ],
  },
  {
    group: 'Settings',
    items: [
      { name: 'RightPanel', path: 'components/Settings/RightPanel.tsx', purpose: 'Brand, layout, locale controls' },
      {
        name: 'DesignerStagingToolbar',
        path: 'components/Settings/DesignerStagingToolbar.tsx',
        purpose: 'Draft picker, publish or discard, draft vs published preview strip',
      },
    ],
  },
  {
    group: 'Trust Center',
    items: [
      { name: 'TrustCenterContent', path: 'components/TrustCenter/TrustCenterContent.tsx', purpose: 'Preview column, modals host' },
      { name: 'TrustCenterEditableRegion', path: 'components/TrustCenter/TrustCenterEditableRegion.tsx', purpose: 'Designer hover edit chrome' },
      { name: 'HeaderBanner', path: 'components/TrustCenter/HeaderBanner.tsx', purpose: 'Hero banner + brand strip' },
      { name: 'IdentitySection', path: 'components/TrustCenter/IdentitySection.tsx', purpose: 'Company block, stats, quick links' },
      { name: 'AnnouncementsSection', path: 'components/TrustCenter/AnnouncementsSection.tsx', purpose: 'Announcement cards' },
      { name: 'QuickSummarySection', path: 'components/TrustCenter/QuickSummarySection.tsx', purpose: 'Three-column summary' },
      { name: 'PhilosophySection', path: 'components/TrustCenter/PhilosophySection.tsx', purpose: 'Philosophy copy block' },
      { name: 'WhatWeOfferSection', path: 'components/TrustCenter/WhatWeOfferSection.tsx', purpose: 'Product tiles' },
      { name: 'VideoSection', path: 'components/TrustCenter/VideoSection.tsx', purpose: 'Embedded video block' },
      { name: 'CertificationsSection', path: 'components/TrustCenter/CertificationsSection.tsx', purpose: 'Badge grid' },
      { name: 'TrustedBySection', path: 'components/TrustCenter/TrustedBySection.tsx', purpose: 'Logo strip' },
      { name: 'FeaturedDocumentsSection', path: 'components/TrustCenter/FeaturedDocumentsSection.tsx', purpose: 'Featured docs cards' },
      { name: 'DocumentsFAQsSection', path: 'components/TrustCenter/DocumentsFAQsSection.tsx', purpose: 'Documents and FAQ tiles' },
      { name: 'SubprocessorsSection', path: 'components/TrustCenter/SubprocessorsSection.tsx', purpose: 'Subprocessor table' },
      { name: 'ProductFilterChips', path: 'components/TrustCenter/ProductFilterChips.tsx', purpose: 'Product filter row' },
      { name: 'QuickLinksSettingsModal', path: 'components/TrustCenter/QuickLinksSettingsModal.tsx', purpose: 'Edit quick links' },
      { name: 'CompanyProfileModal', path: 'components/TrustCenter/CompanyProfileModal.tsx', purpose: 'Edit profile copy' },
      { name: 'TrustCenterImageryModal', path: 'components/TrustCenter/TrustCenterImageryModal.tsx', purpose: 'Logo, banner, thumbnail uploads' },
      { name: 'TrustCenterModalBackdrop', path: 'components/TrustCenter/TrustCenterModalBackdrop.tsx', purpose: 'Shared modal scrim' },
      { name: 'EditSectionPlaceholderModal', path: 'components/TrustCenter/EditSectionPlaceholderModal.tsx', purpose: 'Placeholder edit flows' },
    ],
  },
  {
    group: 'Pages',
    items: [
      { name: 'DesignerPage', path: 'pages/DesignerPage.tsx', purpose: 'Three-column designer shell' },
      { name: 'TrustCenterPage', path: 'pages/TrustCenterPage.tsx', purpose: 'Public-style Trust Center only' },
      { name: 'DesignSystemPage', path: 'pages/DesignSystemPage.tsx', purpose: 'This reference' },
    ],
  },
];

function Code({ children, className }: { children: string; className?: string }) {
  return (
    <code className={cn('rounded bg-primary-300 px-1.5 py-0.5 text-xs font-medium text-primary-800', className)}>{children}</code>
  );
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-lg font-semibold text-primary-900">
      {children}
    </h2>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-full bg-bg-default text-primary-800">
      <header className="sticky top-0 z-20 border-b border-primary-400 bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">Mediacore prototype</p>
            <h1 className="text-xl font-semibold text-primary-900" style={{ fontFamily: "'Neue Montreal', sans-serif" }}>
              Design system reference
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              to="/designerstaging"
              className="rounded-lg border border-primary-400 px-3 py-2 text-sm font-medium text-primary-800 transition-colors hover:bg-primary-300"
            >
              Back to designer
            </Link>
            <Link
              to="/trust-center"
              className="rounded-lg border border-primary-400 px-3 py-2 text-sm font-medium text-primary-800 transition-colors hover:bg-primary-300"
            >
              Public preview
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-6 pb-20 pt-8">
        <nav
          className="sticky top-24 hidden h-fit w-48 shrink-0 flex-col gap-1 text-sm lg:flex"
          aria-label="On this page"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-600">On this page</p>
          {SECTION_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-md px-2 py-1.5 text-primary-700 transition-colors hover:bg-primary-300 hover:text-primary-900"
            >
              {id === 'tokens' && 'Token sources'}
              {id === 'colors' && 'Color tokens'}
              {id === 'brand' && 'Customer brand'}
              {id === 'typography' && 'Typography'}
              {id === 'icons' && 'Icons'}
              {id === 'utilities' && 'CSS utilities'}
              {id === 'components' && 'Components'}
              {id === 'layout' && 'Layout rules'}
              {id === 'overview' && 'Overview'}
            </a>
          ))}
        </nav>

        <main className="min-w-0 flex-1 space-y-14">
          <section className="space-y-3">
            <SectionTitle id="overview">Overview</SectionTitle>
            <p className="max-w-3xl text-sm leading-relaxed text-primary-700">
              This page documents how styling and components are organized in the Trust Center prototype. Product chrome (sidebar,
              top bar, settings) uses the neutral <Code>primary-*</Code> scale and semantic tokens from{' '}
              <Code>src/index.css</Code>. The Trust Center preview column can also use runtime <Code>--brand-primary</Code>,{' '}
              <Code>--brand-accent</Code>, and related CSS variables set from the designer.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-primary-700">
              <li>
                Canonical palette: Tailwind <Code>@theme</Code> in <Code>trust-center/src/index.css</Code>
              </li>
              <li>
                Default customer header and accent hex values: <Code>constants/brandDefaults.ts</Code>
              </li>
              <li>
                Written audit and duplicate-hex map: <Code>docs/design-system-audit.md</Code> (repo root)
              </li>
              <li>
                One component per file, PascalCase file name matching the default export where possible
              </li>
            </ul>
            <p className="max-w-3xl text-sm leading-relaxed text-primary-700">
              <strong className="font-medium text-primary-900">Semantic shadcn-style tokens</strong> (<Code>border</Code>,{' '}
              <Code>foreground</Code>, <Code>muted</Code>, and so on) repeat the same hex values as <Code>primary-*</Code> and{' '}
              <Code>surface</Code>. Either naming style is fine. See the audit doc for the full equivalence table.
            </p>
          </section>

          <section className="space-y-4">
            <SectionTitle id="tokens">Token sources</SectionTitle>
            <div className="overflow-hidden rounded-xl border border-primary-400 bg-surface">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-primary-400 bg-primary-100 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  <tr>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-400">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-primary-800">src/index.css → @theme</td>
                    <td className="px-4 py-3 text-primary-700">Product UI colors, font stack, layout token for FA row icons</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-primary-800">constants/brandDefaults.ts</td>
                    <td className="px-4 py-3 text-primary-700">Trust Center default primary and accent for pickers and preview</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-primary-800">context/DesignerContext.tsx</td>
                    <td className="px-4 py-3 text-primary-700">Session brand colors, saved layout copy, imagery, quick links</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle id="colors">Primary scale (Conveyor shell)</SectionTitle>
            <p className="text-sm text-primary-700">Use Tailwind utilities such as <Code>bg-primary-100</Code>, <Code>text-primary-800</Code>, <Code>border-primary-400</Code>.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRIMARY_SCALE.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-lg border border-primary-400 bg-surface p-3"
                >
                  <div
                    className="h-12 w-12 shrink-0 rounded-md border border-primary-400 shadow-sm"
                    style={{ backgroundColor: row.hex }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary-900">primary-{row.label}</p>
                    <p className="truncate font-mono text-xs text-primary-600">{row.var}</p>
                    <p className="truncate font-mono text-[11px] text-primary-500">{row.hex}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="pt-4 text-base font-semibold text-primary-900">Semantic and supporting colors</h3>
            <div className="overflow-x-auto rounded-xl border border-primary-400">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-primary-400 bg-primary-100 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  <tr>
                    <th className="px-4 py-3">Preview</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Variable</th>
                    <th className="px-4 py-3">Example class</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-400 bg-surface">
                  {SEMANTIC_COLORS.map((row) => (
                    <tr key={row.var}>
                      <td className="px-4 py-2">
                        <div className="h-8 w-8 rounded border border-primary-400" style={{ backgroundColor: row.hex }} />
                      </td>
                      <td className="px-4 py-2 font-medium text-primary-900">{row.name}</td>
                      <td className="px-4 py-2 font-mono text-xs text-primary-700">{row.var}</td>
                      <td className="px-4 py-2 font-mono text-xs text-primary-600">{row.tw}</td>
                      <td className="px-4 py-2 text-primary-600">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle id="brand">Customer brand (Trust Center preview)</SectionTitle>
            <p className="text-sm text-primary-700">
              Applied inside the preview wrapper. Defaults below match <Code>TRUST_CENTER_DEFAULT_PRIMARY</Code> and{' '}
              <Code>TRUST_CENTER_DEFAULT_ACCENT</Code>.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-primary-400 bg-surface p-4">
                <div
                  className="h-14 w-14 shrink-0 rounded-lg border border-primary-400 shadow-inner"
                  style={{ backgroundColor: TRUST_CENTER_DEFAULT_PRIMARY }}
                />
                <div>
                  <p className="text-sm font-semibold text-primary-900">Primary (header)</p>
                  <p className="font-mono text-xs text-primary-600">--brand-primary</p>
                  <p className="font-mono text-xs text-primary-500">{TRUST_CENTER_DEFAULT_PRIMARY}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-primary-400 bg-surface p-4">
                <div
                  className="h-14 w-14 shrink-0 rounded-lg border border-primary-400 shadow-inner"
                  style={{ backgroundColor: TRUST_CENTER_DEFAULT_ACCENT }}
                />
                <div>
                  <p className="text-sm font-semibold text-primary-900">Accent (UI accents)</p>
                  <p className="font-mono text-xs text-primary-600">--brand-accent</p>
                  <p className="font-mono text-xs text-primary-500">{TRUST_CENTER_DEFAULT_ACCENT}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-primary-700">
              Fallbacks in theme: <Code>--trust-center-header-color</Code>, <Code>--trust-center-accent-color</Code> when the
              preview wrapper is not mounted.
            </p>
          </section>

          <section className="space-y-4">
            <SectionTitle id="typography">Typography</SectionTitle>
            <div className="rounded-xl border border-primary-400 bg-surface p-6 space-y-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-600">Font stack</p>
                <p className="text-sm text-primary-800" style={{ fontFamily: 'var(--font-family-sans)' }}>
                  Neue Montreal, Inter, system UI. Set globally on <Code>body</Code> via <Code>--font-family-sans</Code>.
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-600">Neue Montreal, 500, 28px</p>
                <p className="text-[28px] text-primary-900" style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}>
                  Company name and hero headlines
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-600">Neue Montreal, 500, 16px</p>
                <p className="text-base text-primary-800" style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}>
                  Section titles and nav labels
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-600">Body</p>
                <p className="text-sm leading-relaxed text-primary-700">
                  Default body copy uses 14px class utilities or inline stack. Muted supporting text uses <Code>text-primary-600</Code> or{' '}
                  <Code>text-primary-700</Code>.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle id="icons">Icons</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-primary-400 bg-surface p-5">
                <p className="mb-2 text-sm font-semibold text-primary-900">Material Symbols Rounded</p>
                <p className="mb-4 text-sm text-primary-700">
                  Use <Code>MaterialIcon</Code> with a <Code>symbol</Code> string (ligature name). Loaded from Google Fonts in{' '}
                  <Code>index.html</Code>.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-primary-800">
                  <MaterialIcon symbol="palette" size={24} color="var(--color-purple-600)" filled />
                  <MaterialIcon symbol="shield" size={24} color="var(--color-primary-700)" />
                  <MaterialIcon symbol="link" size={24} color="var(--color-link-400)" />
                </div>
              </div>
              <div className="rounded-xl border border-primary-400 bg-surface p-5">
                <p className="mb-2 text-sm font-semibold text-primary-900">Lucide and Font Awesome</p>
                <p className="text-sm text-primary-700">
                  <strong className="font-medium text-primary-900">Lucide</strong> for general UI marks (chevrons, panels).{' '}
                  <strong className="font-medium text-primary-900">Font Awesome</strong> only for small Customize Layout row
                  controls in the right panel, sized with <Code>--layout-customize-row-icon-size</Code> and class{' '}
                  <Code>right-panel-layout-row-icon</Code>.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle id="utilities">Global CSS utilities</SectionTitle>
            <p className="text-sm text-primary-700">Defined in <Code>src/index.css</Code> outside <Code>@theme</Code>.</p>
            <ul className="space-y-2 text-sm text-primary-800">
              <li>
                <Code>.liquid-glass</Code>: frosted pill styling (SearchBar All Products)
              </li>
              <li>
                <Code>.ask-ai-agent-border-glow</Code>: Ask AI animated border (see <Code>@keyframes working-banner-gradient</Code>)
              </li>
              <li>
                <Code>.right-panel-layout-row-icon</Code>: FA icon sizing in layout rows
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <SectionTitle id="components">Component map</SectionTitle>
            <p className="text-sm text-primary-700">
              Paths are relative to <Code>trust-center/src/</Code>. Use this table when adding imports or filing bugs.
            </p>
            {COMPONENT_GROUPS.map((group) => (
              <div key={group.group}>
                <h3 className="mb-2 text-sm font-semibold text-primary-900">{group.group}</h3>
                <div className="overflow-x-auto rounded-xl border border-primary-400">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-primary-400 bg-primary-100 text-xs font-semibold uppercase tracking-wide text-primary-700">
                      <tr>
                        <th className="px-4 py-3">Component</th>
                        <th className="px-4 py-3">Path</th>
                        <th className="px-4 py-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-400 bg-surface">
                      {group.items.map((row) => (
                        <tr key={row.path}>
                          <td className="px-4 py-2.5 font-medium text-primary-900">{row.name}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-primary-700">{row.path}</td>
                          <td className="px-4 py-2.5 text-primary-700">{row.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <SectionTitle id="layout">Layout and motion</SectionTitle>
            <ul className="list-inside list-disc space-y-2 text-sm text-primary-700">
              <li>
                <strong className="font-medium text-primary-900">Designer shell</strong> (<Code>DesignerPage</Code>): fixed viewport,
                window scroll locked, center and right columns scroll inside flex children.
              </li>
              <li>
                <strong className="font-medium text-primary-900">Trust Center sections</strong>: use <Code>scroll-mt-*</Code> on
                headings so in-page anchors clear the sticky preview nav.
              </li>
              <li>
                <strong className="font-medium text-primary-900">Motion</strong>: respect <Code>prefers-reduced-motion</Code> for
                liquid glass and Ask AI border animations.
              </li>
            </ul>
          </section>

          <footer className="border-t border-primary-400 pt-8 text-center text-xs text-primary-600">
            <p>
              Bookmark <Code className="text-[11px]">/design-system</Code> on your dev server. Update this page when you add tokens
              or new top-level components.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
