/**
 * ComingSoonSettingsModal
 * Edit the "Coming Soon" details shown alongside Our Philosophy.
 * Entry points: preview pencil (Published mode) and RightPanel "Edit Live Content" > Coming Soon.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Coming Soon
 */
import { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

const DEFAULT_DETAILS =
  'Let your customers know what to expect and when by showcasing upcoming changes or updates to information. New certifications, regular audit or pen testing periods, and new security-related product releases are all fair game here. We recommend using a bulleted list with specific quarters or months for easy scanning.';

export default function ComingSoonSettingsModal({ onClose }: Props) {
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDetailsChange = (next: string) => {
    setDetails(next);
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-settings-title"
          className="pointer-events-auto flex h-[min(620px,92vh)] max-h-[min(620px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="coming-soon-settings-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Coming Soon
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
              <h3 className="text-sm font-medium text-primary-800">Details</h3>
              <p className="text-sm leading-[1.5] text-primary-700">
                Let your customers know what to expect and when by showcasing upcoming changes or updates to
                information. New certifications, regular audit or pen testing periods, and new security-related
                product releases are all fair game here. We recommend using a bulleted list with specific quarters
                or months for easy scanning.
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="coming-soon-details" className="sr-only">
                Coming Soon details
              </label>
              <div className="relative">
                <textarea
                  id="coming-soon-details"
                  rows={7}
                  value={details}
                  onChange={(e) => handleDetailsChange(e.target.value)}
                  className="w-full rounded border border-primary-400 bg-white px-3 py-2 pr-11 text-sm leading-[1.5] text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                />
                <button
                  type="button"
                  aria-label="Expand editor"
                  className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded border border-primary-400 bg-white text-primary-700 hover:bg-primary-100"
                >
                  <Maximize2 size={12} strokeWidth={2} aria-hidden />
                </button>
              </div>
              <p className="mt-1.5 text-xs text-primary-600">Markdown formatting is supported</p>
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
              disabled={!isDirty}
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
