import { useDesigner } from '../../context/DesignerContext';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import type { SavedTrustCenterImagery } from '../../utils/trustCenterImageryMerge';
import { effectiveHeaderBanner } from '../../utils/trustCenterImageryMerge';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

type HeaderBannerProps = {
  /** When set (e.g. draft vs published preview), overrides `DesignerContext` imagery for this render. */
  savedTrustCenterImageryOverride?: SavedTrustCenterImagery | null;
};

export default function HeaderBanner({ savedTrustCenterImageryOverride }: HeaderBannerProps) {
  const { state } = useDesigner();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();
  const imagery = savedTrustCenterImageryOverride ?? state.savedTrustCenterImagery;
  const bannerSrc = effectiveHeaderBanner(imagery);

  return (
    <TrustCenterEditableRegion
      sectionId="banner"
      enabled={enabled}
      previewMode={previewMode}
      editableInDraft
      publishedOverlay="none"
      onEditClick={onSectionEdit}
      className="h-[200px] w-full"
    >
      <div className="relative h-full w-full overflow-hidden bg-hero-bg">
        <img
          src={bannerSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1600}
          height={400}
          loading="eager"
          decoding="async"
        />
      </div>
    </TrustCenterEditableRegion>
  );
}
