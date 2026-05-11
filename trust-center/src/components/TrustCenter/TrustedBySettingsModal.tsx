/**
 * TrustedBySettingsModal
 * Edit the Featured Customers (Trusted By) list shown on the Trust Center.
 * Entry points: preview pencil (Published mode) and RightPanel "Edit Live Content" > Trusted By.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Featured Customers
 */
import { useEffect, useState } from 'react';
import { ChevronDown, GripVertical, X } from 'lucide-react';
import { trustedByLogos } from '../../constants/data';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';
import { localLogos } from './trustedByLocalLogos';

type Props = { onClose: () => void };

type CustomerRow = {
  id: string;
  name: string;
  domain: string;
  circleBg: string;
};

export default function TrustedBySettingsModal({ onClose }: Props) {
  const [rows, setRows] = useState<CustomerRow[]>(() => trustedByLogos.map((l) => ({ ...l })));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const removeAt = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="trusted-by-settings-title"
          className="pointer-events-auto flex h-[min(760px,92vh)] max-h-[min(760px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="trusted-by-settings-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Featured Customers
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

          <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 pt-7 pb-5">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-primary-800">Customers</h3>
              <p className="text-sm leading-[1.35] text-primary-700">
                Feature your customers as social proof.
              </p>
            </div>

            <div className="mt-4">
              <CustomerPickerDropdown />
            </div>

            <div className="mt-4 overflow-hidden rounded border border-primary-400">
              {rows.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-primary-600">
                  No customers featured yet.
                </div>
              ) : (
                rows.map((row, i) => (
                  <div
                    key={row.id}
                    className={`flex items-center gap-2 px-3 py-2.5 ${
                      i < rows.length - 1 ? 'border-b border-primary-400' : ''
                    }`}
                  >
                    <GripVertical
                      size={16}
                      className="shrink-0 cursor-grab text-primary-500"
                      aria-hidden
                    />
                    <div
                      className="h-6 w-6 shrink-0 overflow-hidden rounded border border-grey-1"
                      style={{ backgroundColor: row.circleBg }}
                      aria-hidden
                    >
                      {localLogos[row.domain] ? (
                        <img
                          src={localLogos[row.domain]}
                          alt={`${row.name} logo`}
                          width={24}
                          height={24}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span
                          className="flex h-full w-full items-center justify-center text-[8px] font-bold text-white"
                          style={{ backgroundColor: row.circleBg }}
                        >
                          {row.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-base font-medium leading-[1.35] text-primary-700">
                      {row.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      className="shrink-0 text-primary-500 hover:text-primary-800"
                      aria-label={`Remove ${row.name}`}
                    >
                      <X size={14} strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              className="mt-4 text-sm font-medium text-link-400 hover:underline"
            >
              I don&rsquo;t see the customers I want to feature
            </button>

            <div className="mt-4 rounded border border-primary-400 bg-primary-100 px-4 py-3">
              <p className="text-sm font-medium text-primary-800">
                Don&rsquo;t tick off your best customers!
              </p>
              <p className="mt-1 text-sm leading-[1.45] text-primary-700">
                Make sure you have the appropriate permissions to use these customers&rsquo; logos
                before adding them to your page.
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

function CustomerPickerDropdown() {
  return (
    <button
      type="button"
      aria-haspopup="listbox"
      className="flex h-10 w-full items-center gap-2 rounded border border-primary-400 bg-white px-2.5 text-left shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
    >
      <span className="min-w-0 flex-1 text-sm text-primary-600">&nbsp;</span>
      <ChevronDown size={16} strokeWidth={2} className="shrink-0 text-primary-700" aria-hidden />
    </button>
  );
}
