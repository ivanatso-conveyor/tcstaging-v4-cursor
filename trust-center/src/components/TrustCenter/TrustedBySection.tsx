import { trustedByLogos } from '../../constants/data';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';
import { localLogos } from './trustedByLocalLogos';

export default function TrustedBySection() {
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();

  return (
    <div id="section-trusted-by" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="trusted-by"
        enabled={enabled}
        previewMode={previewMode}
        editableInDraft={false}
        draftLockedHint="Switch to publish to edit."
        publishedOverlay="pencil-only"
        onEditClick={onSectionEdit}
      >
        <h2
          className="text-base mb-6 text-primary-700"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
        >{copy.trustedByTitle}</h2>
        <div className="flex items-center justify-center gap-3 py-4 bg-primary-100 border border-primary-400 rounded-lg">
          {trustedByLogos.map((logo) => (
            <div
              key={logo.id}
              className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full border border-grey-1"
              style={{ backgroundColor: logo.circleBg }}
            >
              <img
                src={localLogos[logo.domain]}
                alt={`${logo.name} logo`}
                width={60}
                height={60}
                className="h-full w-full object-contain shrink-0"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </TrustCenterEditableRegion>
    </div>
  );
}
