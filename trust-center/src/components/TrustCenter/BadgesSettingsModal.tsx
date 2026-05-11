/**
 * BadgesSettingsModal
 * Figma: Trust Center Vision HQ > Trust Center Designer > Badge Settings (node 1110:43022)
 */
import { useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';
import { certifications } from '../../constants/certifications';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

export default function BadgesSettingsModal({ onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="badges-settings-title"
          className="pointer-events-auto flex h-[min(700px,92vh)] max-h-[min(700px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="badges-settings-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Badges Settings
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-primary-800">Featured Badges</h3>
              <p className="text-sm leading-[1.35] text-primary-700">
                Show off the certifications and frameworks that you comply with. Link supporting evidence or
                documentation by adding badges to supporting documents in{' '}
                <a href="#" className="text-link-400 underline" onClick={(e) => e.preventDefault()}>
                  Knowledge &gt; Documents ↗
                </a>
              </p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="flex h-10 w-full items-center rounded border border-primary-400 bg-white px-2.5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]"
              >
                <span className="min-w-0 flex-1 text-left text-sm text-primary-600">Select...</span>
                <span className="shrink-0 text-sm text-primary-600">▾</span>
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded border border-primary-400">
              {certifications.map((cert, i) => (
                <div
                  key={cert.name}
                  className={`flex items-center gap-2 px-3 py-2.5 ${
                    i < certifications.length - 1 ? 'border-b border-primary-400' : ''
                  }`}
                >
                  <GripVertical size={16} className="shrink-0 text-primary-500" aria-hidden />
                  <img
                    src={cert.image}
                    alt=""
                    className="h-6 w-6 shrink-0 rounded object-contain"
                  />
                  <span className="min-w-0 flex-1 truncate text-base font-medium leading-[1.35] text-primary-700">
                    {cert.name.replace(/\n/g, ' ')}
                  </span>
                  <button
                    type="button"
                    className="shrink-0 text-primary-500 hover:text-primary-800"
                    aria-label={`Remove ${cert.name.replace(/\n/g, ' ')}`}
                  >
                    <X size={14} strokeWidth={2} aria-hidden />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 text-sm font-medium text-link-400 hover:underline"
            >
              Request a new badge
            </button>
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
