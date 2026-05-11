import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDesigner } from '../../context/DesignerContext';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import {
  mergeQuickLinks,
  rowsFromSaved,
  savedFromRows,
} from '../../utils/quickLinksMerge';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type QuickLinkRow = { display: string; url: string };

type Props = {
  onClose: () => void;
};

export default function QuickLinksSettingsModal({ onClose }: Props) {
  const copy = useTrustCenterCopy();
  const { state, setSavedQuickLinks } = useDesigner();
  const [rows, setRows] = useState<QuickLinkRow[]>(() =>
    rowsFromSaved(mergeQuickLinks(copy.identity, state.savedQuickLinks)),
  );

  useEffect(() => {
    setRows(rowsFromSaved(mergeQuickLinks(copy.identity, state.savedQuickLinks)));
  }, [copy, state.savedQuickLinks]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const updateRow = (index: number, field: keyof QuickLinkRow, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-links-modal-title"
          className="pointer-events-auto flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-primary-400 bg-white shadow-xl"
        >
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-primary-400 px-6 py-4">
            <h2
              id="quick-links-modal-title"
              className="text-lg font-medium text-primary-800"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Quick Link Settings
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-primary-600 hover:bg-primary-100 hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <h3
              className="text-sm font-medium text-primary-800"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Display Quick Links
            </h3>
            <p
              className="mt-2 text-sm leading-relaxed text-primary-600"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
            >
              Add URLs or mailto links to share on your Trust Center. This can include your home page,
              status page, privacy policy, vulnerability reports, and more.
            </p>

            <div className="mt-6 flex flex-col gap-5">
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
                >
                  <div>
                    <label
                      className="mb-1.5 block text-xs text-primary-600"
                      style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                      htmlFor={`quick-link-display-${index}`}
                    >
                      Display Text
                    </label>
                    <input
                      id={`quick-link-display-${index}`}
                      type="text"
                      value={row.display}
                      onChange={(e) => updateRow(index, 'display', e.target.value)}
                      className="w-full rounded-md border border-primary-400 bg-white px-3 py-2 text-sm text-primary-800 placeholder:text-primary-500 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                      style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1.5 block text-xs text-primary-600"
                      style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                      htmlFor={`quick-link-url-${index}`}
                    >
                      URL Link
                    </label>
                    <input
                      id={`quick-link-url-${index}`}
                      type="text"
                      value={row.url}
                      onChange={(e) => updateRow(index, 'url', e.target.value)}
                      className="w-full rounded-md border border-primary-400 bg-white px-3 py-2 text-sm text-primary-800 placeholder:text-primary-500 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                      style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="flex shrink-0 justify-end gap-2 border-t border-primary-400 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-primary-400 bg-white px-4 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setSavedQuickLinks(savedFromRows(rows));
                onClose();
              }}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Save
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
