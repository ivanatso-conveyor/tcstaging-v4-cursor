/**
 * UpdateSubprocessorModal
 * Edit an existing subprocessor row on the Trust Center.
 * Entry points: preview row pencil (locked vendor) and RightPanel > Update Subprocessors (toggleable vendor picker).
 * Figma: Trust Center Vision HQ > Trust Center Designer > Update Subprocessor
 */
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { subprocessors } from '../../constants/data';
import { subprocessorLogos } from './subprocessorLocalLogos';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = {
  /** When provided, the Vendor picker opens preselected on that subprocessor. */
  initialDomain?: string;
  onClose: () => void;
};

export default function UpdateSubprocessorModal({ initialDomain, onClose }: Props) {
  const [activeDomain, setActiveDomain] = useState<string>(() => initialDomain ?? subprocessors[0].domain);
  const [pickerOpen, setPickerOpen] = useState(false);
  const active = useMemo(
    () => subprocessors.find((s) => s.domain === activeDomain) ?? subprocessors[0],
    [activeDomain],
  );

  const initialLocations = useMemo(
    () => active.location.split(',').map((s) => s.trim()).filter(Boolean),
    [active.location],
  );
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [usage, setUsage] = useState(active.usage);
  const [isDirty, setIsDirty] = useState(false);

  // Reset fields when the active vendor changes (right-panel toggle flow).
  useEffect(() => {
    setLocations(initialLocations);
    setUsage(active.usage);
    setIsDirty(false);
  }, [active.usage, initialLocations]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const removeLocation = (loc: string) => {
    setLocations((prev) => prev.filter((l) => l !== loc));
    setIsDirty(true);
  };
  const clearLocations = () => {
    setLocations([]);
    setIsDirty(true);
  };
  const handleUsageChange = (next: string) => {
    setUsage(next);
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="update-subprocessor-title"
          className="pointer-events-auto flex h-[min(760px,92vh)] max-h-[min(760px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="update-subprocessor-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Update Subprocessor
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
              <p className="mb-2 text-sm font-medium text-primary-800">
                Vendor<span className="text-red-500">*</span>
              </p>
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={pickerOpen}
                  onClick={() => setPickerOpen((v) => !v)}
                  className="flex h-10 w-full items-center gap-2 rounded border border-primary-400 bg-white px-3 text-left shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
                >
                  {subprocessorLogos[active.domain] ? (
                    <img
                      src={subprocessorLogos[active.domain]}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 shrink-0 rounded object-contain"
                    />
                  ) : (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary-300 text-[9px] font-bold text-primary-700">
                      {active.name.charAt(0)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm text-primary-800">{active.name}</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    className={`shrink-0 text-primary-700 transition-transform ${pickerOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                {pickerOpen ? (
                  <ul
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded border border-primary-400 bg-white py-1 shadow-lg"
                  >
                    {subprocessors.map((sp) => {
                      const isActive = sp.domain === active.domain;
                      return (
                        <li key={sp.domain}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => {
                              setActiveDomain(sp.domain);
                              setPickerOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-primary-100 ${
                              isActive ? 'bg-primary-100 text-primary-900' : 'text-primary-800'
                            }`}
                          >
                            {subprocessorLogos[sp.domain] ? (
                              <img
                                src={subprocessorLogos[sp.domain]}
                                alt=""
                                width={20}
                                height={20}
                                className="h-5 w-5 shrink-0 rounded object-contain"
                              />
                            ) : (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary-300 text-[9px] font-bold text-primary-700">
                                {sp.name.charAt(0)}
                              </span>
                            )}
                            <span className="min-w-0 flex-1 truncate">{sp.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-1 text-sm font-medium text-primary-800">
                Location<span className="text-red-500">*</span>
              </p>
              <p className="mb-2 text-sm text-primary-700">Where is the data you send to this vendor processed?</p>
              <div className="flex min-h-10 w-full items-center gap-2 rounded border border-primary-400 bg-white px-2 py-1.5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                  {locations.length === 0 ? (
                    <span className="px-1 text-sm text-primary-500">Select locations…</span>
                  ) : (
                    locations.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1 rounded-[2px] bg-primary-200 px-1.5 py-0.5 text-xs text-primary-800"
                      >
                        {loc}
                        <button
                          type="button"
                          onClick={() => removeLocation(loc)}
                          className="inline-flex h-3.5 w-3.5 items-center justify-center rounded text-primary-600 hover:bg-primary-300 hover:text-primary-800"
                          aria-label={`Remove ${loc}`}
                        >
                          <X size={10} strokeWidth={2} aria-hidden />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                {locations.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearLocations}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary-500 hover:text-primary-800"
                    aria-label="Clear all locations"
                  >
                    <X size={14} strokeWidth={2} aria-hidden />
                  </button>
                ) : null}
                <span className="mx-1 h-5 w-px shrink-0 bg-primary-400" aria-hidden />
                <button
                  type="button"
                  aria-label="Open locations dropdown"
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary-600 hover:text-primary-800"
                >
                  <ChevronDown size={14} strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="update-subprocessor-usage" className="mb-1 block text-sm font-medium text-primary-800">
                Usage<span className="text-red-500">*</span>
              </label>
              <p className="mb-2 text-sm text-primary-700">What do you use this vendor for?</p>
              <textarea
                id="update-subprocessor-usage"
                rows={6}
                value={usage}
                onChange={(e) => handleUsageChange(e.target.value)}
                className="w-full rounded border border-primary-400 bg-white px-3 py-2 text-sm leading-[1.5] text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </div>
          </div>

          <footer className="flex h-[72px] shrink-0 items-center justify-between gap-2 rounded-b-lg bg-primary-200 px-6 shadow-[0px_-1px_0px_0px_var(--color-primary-400)]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] border border-primary-400 bg-white px-5 text-sm font-medium text-red-600 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-red-50"
            >
              Delete
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 items-center justify-center rounded-[3px] border border-primary-400 bg-white px-5 text-sm font-medium text-primary-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isDirty}
                onClick={onClose}
                className="flex h-10 items-center justify-center rounded-[3px] bg-brand-400 px-5 text-sm font-medium text-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-primary-300 disabled:text-primary-500 disabled:shadow-none disabled:hover:bg-primary-300"
              >
                Update
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
