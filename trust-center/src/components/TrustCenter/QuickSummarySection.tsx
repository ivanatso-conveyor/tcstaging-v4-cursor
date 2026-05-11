import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faBug,
  faCloudShowersHeavy,
  faEarthEurope,
  faIdBadge,
  faLaptop,
  faMoneyCheckDollar,
  faPlug,
  faShieldHalved,
  faSignal,
  faTrash,
  faUserSecret,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { indicators, type QuickSummaryIconKey } from '../../constants/data';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

const QUICK_SUMMARY_ICONS: Record<QuickSummaryIconKey, IconDefinition> = {
  /** Figma uses FA5 Pro U+F2F7 (not in FA6 Free); solid halved shield matches trust / audit cue. */
  audit: faShieldHalved,
  /** U+F21B — user-secret in FA6 Free (Figma “penetration testing” row). */
  penetration: faUserSecret,
  /** U+F0C0 */
  subprocessors: faUsers,
  /** U+F7A2 */
  dpa: faEarthEurope,
  /** U+F1F8 */
  deleteData: faTrash,
  /** U+F2C1 — id-badge */
  iam: faIdBadge,
  /** U+F109 */
  mdm: faLaptop,
  /** U+F740 — cloud-showers-heavy */
  disasterRecovery: faCloudShowersHeavy,
  /** U+F53D — money-check-dollar (Figma cyber insurance) */
  cyberInsurance: faMoneyCheckDollar,
  /** U+F188 */
  bugBounty: faBug,
  /** U+F1E6 */
  api: faPlug,
  /** U+F012 */
  statusPage: faSignal,
};

export default function QuickSummarySection() {
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();
  return (
    <div id="section-quick-summary" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="quick-summary"
        enabled={enabled}
        previewMode={previewMode}
        editableInDraft={false}
        draftLockedHint="Switch to publish to edit."
        publishedOverlay="pencil-only"
        onEditClick={onSectionEdit}
      >
        <h2
          className="text-base mb-6 text-secondary leading-[1.35] font-medium"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
        >
          {copy.quickSummaryTitle}
        </h2>
        <div className="grid grid-cols-2 gap-x-[60px] gap-y-3">
          <div className="space-y-3">
            {indicators.left.map((ind, i) => (
              <IndicatorRow key={`l-${i}`} {...ind} />
            ))}
          </div>
          <div className="space-y-3">
            {indicators.right.map((ind, i) => (
              <IndicatorRow key={`r-${i}`} {...ind} />
            ))}
          </div>
        </div>
      </TrustCenterEditableRegion>
    </div>
  );
}

function IndicatorRow({ text, icon, href }: { text: string; icon: QuickSummaryIconKey; href: string | null }) {
  const def = QUICK_SUMMARY_ICONS[icon];
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-trust-icon"
        style={{ fontSize: '12px' }}
        aria-hidden
      >
        <FontAwesomeIcon icon={def} className="size-[1em]" />
      </span>
      <div className="min-w-0 text-sm leading-[1.35]" style={{ fontFamily: "'Neue Montreal', sans-serif" }}>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 flex-wrap items-baseline gap-1.5 text-link-400 hover:opacity-90"
          >
            <span className="underline decoration-solid [text-decoration-skip-ink:none]">{text}</span>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="size-3 shrink-0 translate-y-px"
              aria-hidden
            />
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        ) : (
          <span className="text-primary-800">{text}</span>
        )}
      </div>
    </div>
  );
}
