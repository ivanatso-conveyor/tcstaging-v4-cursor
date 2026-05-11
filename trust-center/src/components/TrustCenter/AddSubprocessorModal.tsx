/**
 * AddSubprocessorModal
 * Create a new subprocessor row on the Trust Center.
 * Entry points: preview section "+" button and RightPanel "Edit Live Content" > Add Subprocessor.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Add New Subprocessor
 */
import { useEffect, useState } from 'react';
import { Bell, ChevronDown, X } from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

export default function AddSubprocessorModal({ onClose }: Props) {
  const [vendor, setVendor] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [usage, setUsage] = useState('');
  const [notify, setNotify] = useState(false);
  void setLocations; // prototype: list picker UX wired later

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isValid = vendor.trim().length > 0 && locations.length > 0 && usage.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-subprocessor-title"
          className="pointer-events-auto flex h-[min(760px,92vh)] max-h-[min(760px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="add-subprocessor-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Add New Subprocessor
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
            <div>
              <label htmlFor="add-subprocessor-vendor" className="mb-2 block text-sm font-medium text-primary-800">
                Vendor<span className="text-red-500">*</span>
              </label>
              <input
                id="add-subprocessor-vendor"
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="Find a vendor"
                className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
              <button
                type="button"
                className="mt-2 text-sm font-medium text-link-400 hover:underline"
              >
                I don&rsquo;t see the vendor I want to add
              </button>
            </div>

            <div className="mt-5">
              <p className="mb-1 text-sm font-medium text-primary-800">
                Location<span className="text-red-500">*</span>
              </p>
              <p className="mb-2 text-sm text-primary-700">Where is the data you send to this vendor processed?</p>
              <button
                type="button"
                aria-haspopup="listbox"
                className="flex h-10 w-full items-center gap-2 rounded border border-primary-400 bg-white px-3 text-left shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
              >
                <span className="min-w-0 flex-1 text-sm text-primary-500">Select locations…</span>
                <ChevronDown size={16} strokeWidth={2} className="shrink-0 text-primary-700" aria-hidden />
              </button>
            </div>

            <div className="mt-5">
              <label htmlFor="add-subprocessor-usage" className="mb-1 block text-sm font-medium text-primary-800">
                Usage<span className="text-red-500">*</span>
              </label>
              <p className="mb-2 text-sm text-primary-700">What do you use this vendor for?</p>
              <textarea
                id="add-subprocessor-usage"
                rows={6}
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="w-full rounded border border-primary-400 bg-white px-3 py-2 text-sm leading-[1.5] text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </div>

            <div className="mt-5 border-t border-primary-400 pt-4">
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-primary-400 text-brand-400 focus:ring-brand-400"
                />
                <span className="text-sm font-medium text-primary-800">Notify Subscribers</span>
              </label>
              <div className="mt-2 flex items-start gap-2 text-sm leading-[1.45] text-primary-700">
                <Bell size={14} className="mt-0.5 shrink-0 text-primary-600" strokeWidth={2} aria-hidden />
                <p>
                  Your 46 subscribers will be notified that you have a new subprocessor tomorrow morning (9am ET time).
                </p>
              </div>
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
              disabled={!isValid}
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] bg-brand-400 px-5 text-sm font-medium text-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-primary-300 disabled:text-primary-500 disabled:shadow-none disabled:hover:bg-primary-300"
            >
              Save
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
