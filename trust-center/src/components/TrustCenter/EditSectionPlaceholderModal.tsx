import { useEffect } from 'react';
import type { EditableTrustSectionId } from '../../contexts/TrustCenterSectionEditContext';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

const TITLES: Record<EditableTrustSectionId, string> = {
  banner: 'Edit hero banner',
  profile: 'Edit profile & headline',
  badges: 'Edit certifications',
  'nav-brand': 'Edit logo & site name',
  'quick-links': 'Edit quick links',
  'quick-summary': 'Edit quick summary',
  'featured-documents': 'Edit featured documents',
  'trusted-by': 'Edit featured customers',
  philosophy: 'Edit our philosophy',
  'coming-soon': 'Edit coming soon',
  'what-we-offer-product': 'Edit product',
  'what-we-offer': 'Edit what we offer',
  'video-resource': 'Edit video resource',
  'video-resources': 'Edit video resources',
  'find-answer': 'Edit documents & knowledge base FAQs',
  subprocessors: 'Edit subprocessors',
  announcements: 'Edit announcements',
};

type Props = {
  section: EditableTrustSectionId | null;
  onClose: () => void;
};

export default function EditSectionPlaceholderModal({ section, onClose }: Props) {
  useEffect(() => {
    if (!section) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [section, onClose]);

  if (!section) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-section-modal-title"
          className="pointer-events-auto w-full max-w-md rounded-lg border border-primary-400 bg-white p-6 shadow-xl"
        >
          <h2
            id="edit-section-modal-title"
            className="text-base font-medium text-primary-800"
            style={{ fontFamily: "'Neue Montreal', sans-serif" }}
          >
            {TITLES[section]}
          </h2>
          <p className="mt-2 text-sm text-primary-600 leading-relaxed">
            Editor content will go here. Replace this modal when your designs are ready.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-primary-400 bg-white px-4 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
