import { ExternalLink, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDesigner } from '../../context/DesignerContext';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { mergeCompanyProfile } from '../../utils/companyProfileMerge';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = {
  onClose: () => void;
};

export default function CompanyProfileModal({ onClose }: Props) {
  const copy = useTrustCenterCopy();
  const { state, setSavedCompanyProfile } = useDesigner();
  const merged = mergeCompanyProfile(copy.identity, state.savedCompanyProfile);
  const [displayName, setDisplayName] = useState(merged.displayName);
  const [tagline, setTagline] = useState(merged.tagline);
  const [bodySummary, setBodySummary] = useState(merged.bodySummary);

  useEffect(() => {
    const next = mergeCompanyProfile(copy.identity, state.savedCompanyProfile);
    setDisplayName(next.displayName);
    setTagline(next.tagline);
    setBodySummary(next.bodySummary);
  }, [copy, state.savedCompanyProfile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canSave = displayName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-profile-modal-title"
          className="pointer-events-auto flex max-h-[min(92vh,760px)] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-primary-400 bg-white shadow-xl"
        >
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-primary-400 px-6 py-4">
            <h2
              id="company-profile-modal-title"
              className="text-lg font-medium text-primary-800"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Company Profile
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
            <div className="flex flex-col gap-6">
              <div>
                <label
                  className="mb-2 flex flex-wrap items-baseline gap-1 text-sm font-medium text-primary-800"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
                  htmlFor="company-profile-display-name"
                >
                  Trust Center Display Name
                  <span className="text-failure-400" aria-hidden>
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <p
                  className="mb-2 text-sm leading-relaxed text-primary-600"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                >
                  Name will appear in the top bar and introducing your page in the company profile. To
                  change your organization name, go to{' '}
                  <button
                    type="button"
                    className="inline-flex items-center gap-0.5 text-link-400 underline decoration-solid hover:text-link-400/90"
                    title="Brand Settings are in the right panel"
                  >
                    Brand Settings
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </button>
                  .
                </p>
                <input
                  id="company-profile-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-md border border-primary-400 bg-white px-3 py-2 text-sm text-primary-800 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                  autoComplete="organization"
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-primary-800"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
                  htmlFor="company-profile-tagline"
                >
                  Company Tagline
                </label>
                <input
                  id="company-profile-tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-md border border-primary-400 bg-white px-3 py-2 text-sm text-primary-800 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-primary-800"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
                  htmlFor="company-profile-summary"
                >
                  Company Summary
                </label>
                <p
                  className="mb-2 text-sm leading-relaxed text-primary-600"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                >
                  Add a short description to guide trust center visitors. Visible to both public and
                  authenticated visitors.
                </p>
                <textarea
                  id="company-profile-summary"
                  value={bodySummary}
                  onChange={(e) => setBodySummary(e.target.value)}
                  rows={6}
                  className="min-h-[140px] w-full resize-y rounded-md border border-primary-400 bg-white px-3 py-2 text-sm leading-relaxed text-primary-800 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                />
              </div>
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
              disabled={!canSave}
              onClick={() => {
                if (!canSave) return;
                setSavedCompanyProfile({
                  displayName: displayName.trim(),
                  tagline: tagline.trim(),
                  bodySummary: bodySummary.trim(),
                });
                onClose();
              }}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-40"
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
