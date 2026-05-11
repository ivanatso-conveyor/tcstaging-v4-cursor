/**
 * QuickSummarySettingsModal
 * Edit which yes/no indicators appear in the Trust Center Quick Summary.
 * Entry points: preview pencil (Published mode) and RightPanel "Edit Live Content" > Quick Summary.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Update Summary
 */
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { faArrowUpRightFromSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

type IndicatorRow = {
  id: string;
  label: string;
  enabled: boolean;
  hasLink: boolean;
};

const DEFAULT_ROWS: IndicatorRow[] = [
  { id: 'audit', label: 'One or more annual third-party audit(s)', enabled: true, hasLink: false },
  { id: 'penetration', label: 'Annual third-party penetration testing', enabled: true, hasLink: false },
  { id: 'subprocessors', label: 'Subprocessors list available', enabled: true, hasLink: false },
  { id: 'dpa', label: 'Will enter into a DPA', enabled: true, hasLink: false },
  { id: 'deleteData', label: 'Deletes customer data on request', enabled: true, hasLink: false },
  { id: 'statusPage', label: 'Has a status page', enabled: true, hasLink: true },
  { id: 'mdm', label: 'Has a formal mobile device management (MDM) program', enabled: false, hasLink: false },
  { id: 'iam', label: 'Uses a centralized IAM solution (SSO) to manage employee access', enabled: true, hasLink: false },
  { id: 'disasterRecovery', label: 'Has a disaster recovery plan', enabled: true, hasLink: false },
  { id: 'cyberInsurance', label: 'Has cyber insurance', enabled: false, hasLink: false },
  { id: 'bugBounty', label: 'Has a bug bounty or vulnerability disclosure program', enabled: true, hasLink: true },
  { id: 'api', label: 'Has an API available', enabled: true, hasLink: false },
  { id: 'privacyPolicy', label: 'Has a privacy policy', enabled: true, hasLink: false },
  { id: 'aiPolicy', label: 'Has an AI policy', enabled: true, hasLink: false },
];

export default function QuickSummarySettingsModal({ onClose }: Props) {
  const [rows, setRows] = useState<IndicatorRow[]>(DEFAULT_ROWS);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleEnabled = (id: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  const toggleLink = (id: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, hasLink: !r.hasLink } : r)));

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-summary-settings-title"
          className="pointer-events-auto flex h-[min(720px,92vh)] max-h-[min(720px,92vh)] w-full max-w-[520px] flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="quick-summary-settings-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Update Summary
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded text-primary-700 hover:bg-primary-100"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 py-5">
            <p className="text-sm leading-[1.35] text-primary-700">
              Toggle on all that apply for your company to populate your summary.
            </p>

            <ul className="mt-5 space-y-3">
              {rows.map((row) => (
                <li key={row.id} className="flex items-start gap-3">
                  <EnableSwitch
                    enabled={row.enabled}
                    onChange={() => toggleEnabled(row.id)}
                    ariaLabel={`${row.enabled ? 'Disable' : 'Enable'} ${row.label}`}
                  />
                  <LinkButton
                    active={row.hasLink}
                    onClick={() => toggleLink(row.id)}
                    ariaLabel={`${row.hasLink ? 'Remove link from' : 'Add link to'} ${row.label}`}
                  />
                  <span className="min-w-0 flex-1 pt-0.5 text-sm leading-[1.35] text-primary-800">
                    {row.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-md bg-primary-200 px-4 py-3">
              <p className="text-sm leading-[1.35] text-primary-700">
                Have an idea for a new yes/no indicator you'd like to feature?{' '}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-baseline gap-1 text-link-400 underline hover:opacity-90"
                >
                  <span>Submit a suggestion</span>
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="size-3 shrink-0 translate-y-px"
                    aria-hidden
                  />
                </a>
              </p>
            </div>
          </div>

          <footer className="flex h-[72px] shrink-0 items-center justify-end gap-2 rounded-b-lg bg-primary-200 px-6 shadow-[0px_-1px_0px_0px_var(--color-primary-400)]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] border border-primary-400 bg-white px-5 text-sm font-medium text-primary-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] bg-brand-400 px-5 text-sm font-medium text-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-600"
            >
              Save
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

function EnableSwitch({
  enabled,
  onChange,
  ariaLabel,
}: {
  enabled: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-800/25 ${
        enabled ? 'bg-brand-400' : 'bg-primary-300'
      }`}
    >
      <span
        className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-[left,right] ${
          enabled ? 'right-[2px]' : 'left-[2px]'
        }`}
      />
    </button>
  );
}

function LinkButton({
  active,
  onClick,
  ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-800/25 ${
        active
          ? 'bg-[color:var(--color-toggle-track)] text-link-400'
          : 'bg-primary-300 text-primary-600 hover:text-primary-800'
      }`}
    >
      <FontAwesomeIcon icon={faLink} className="h-3 w-3" aria-hidden />
    </button>
  );
}
