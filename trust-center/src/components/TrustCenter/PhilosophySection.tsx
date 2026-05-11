import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

export default function PhilosophySection() {
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();

  return (
    <div id="section-philosophy" className="mx-10 py-8 scroll-mt-20">
      <div className="grid grid-cols-2 gap-5">
        {/* Our Philosophy */}
        <TrustCenterEditableRegion
          sectionId="philosophy"
          enabled={enabled}
          previewMode={previewMode}
          editableInDraft={false}
          draftLockedHint="Switch to publish to edit."
          publishedOverlay="pencil-only"
          onEditClick={onSectionEdit}
          className="rounded-lg"
        >
          <div className="bg-white rounded-lg p-5">
            <h3
              className="text-base mb-4 text-secondary leading-[1.35]"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              {copy.philosophyTitle}
            </h3>
            <p className="text-sm text-primary-700 leading-[1.6] mb-5">{copy.philosophyBody}</p>
            <div className="flex items-center gap-3 mt-4">
              <div
                className="w-10 h-10 shrink-0 rounded-md bg-primary-300 flex items-center justify-center"
                aria-hidden
              >
                <span className="text-sm font-medium text-primary-700">EE</span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-800">{copy.philosophyAuthor}</p>
                <p className="text-xs text-primary-600">{copy.philosophyAuthorTitle}</p>
              </div>
            </div>
          </div>
        </TrustCenterEditableRegion>

        {/* Coming Soon — gray panel, no border; FA solid calendar; skeleton lines */}
        <TrustCenterEditableRegion
          sectionId="coming-soon"
          enabled={enabled}
          previewMode={previewMode}
          editableInDraft={false}
          draftLockedHint="Switch to publish to edit."
          publishedOverlay="pencil-only"
          onEditClick={onSectionEdit}
          className="rounded-lg"
        >
          <div className="bg-primary-200 rounded-lg p-5 flex flex-col min-h-0">
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-secondary text-[1.125rem] w-[1.125rem] h-[1.125rem] mb-3"
              aria-hidden
            />
            <h3
              className="text-base text-secondary mb-5 leading-[1.35] font-medium m-0"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              {copy.comingSoon}
            </h3>
            <div className="space-y-3 flex-1" aria-hidden>
              <div className="h-3.5 bg-primary-400 rounded-full w-full max-w-full" />
              <div className="h-3.5 bg-primary-400 rounded-full w-full max-w-full" />
              <div className="h-3.5 bg-primary-400 rounded-full w-1/3 max-w-full" />
            </div>
          </div>
        </TrustCenterEditableRegion>
      </div>
    </div>
  );
}
