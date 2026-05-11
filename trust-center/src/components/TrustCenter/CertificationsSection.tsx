/**
 * CertificationsSection
 * Certification badges row. Edits are live from the Published tab (pencil hover), not from Draft.
 * Figma: Trust Center Vision HQ > Trust Center preview > Certifications
 */
import { certifications } from '../../constants/certifications';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

export default function CertificationsSection() {
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();

  return (
    <div id="section-badges" className="mx-10 py-5 scroll-mt-20" data-trust-section="certification-seals">
      <TrustCenterEditableRegion
        sectionId="badges"
        enabled={enabled}
        previewMode={previewMode}
        editableInDraft={false}
        draftLockedHint="Switch to publish to edit."
        publishedOverlay="pencil-only"
        onEditClick={onSectionEdit}
        className="flex flex-col"
      >
        <h2
          className="mb-4 text-base text-primary-700"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
        >
          {copy.certificationsTitle}
        </h2>
        <div className="flex items-center justify-center rounded-lg border border-primary-400 bg-primary-200 p-3">
          <div className="flex items-start justify-center gap-3">
            {certifications.map((cert) => (
              <button
                key={cert.name}
                type="button"
                className="group flex cursor-pointer flex-col items-center gap-1.5"
                onClick={() => console.log(`Clicked ${cert.name}`)}
              >
                <div className="h-[60px] w-[60px] overflow-hidden rounded transition-transform group-hover:scale-[1.03]">
                  <img
                    src={cert.image}
                    alt={cert.name.replace(/\n/g, ' ')}
                    width={60}
                    height={60}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span
                  className="max-w-[74px] text-center text-[11px] leading-tight whitespace-pre-line text-link-400 group-hover:underline"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                >
                  {cert.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </TrustCenterEditableRegion>
    </div>
  );
}
