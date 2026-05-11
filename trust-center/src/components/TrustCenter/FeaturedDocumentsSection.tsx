import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLines, faLock } from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { productFilters, featuredDocuments, type FeaturedDocumentItem } from '../../constants/data';
import { ArrowRight } from 'lucide-react';
import { useReviewingProductFilter } from '../../contexts/ReviewingProductFilterContext';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import { useDesigner } from '../../context/DesignerContext';
import { featuredDocBadgeSrc } from '../../constants/featuredDocBadges';
import ProductFilterChips from './ProductFilterChips';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

export default function FeaturedDocumentsSection() {
  const { activeReviewingFilter, setActiveReviewingFilter } = useReviewingProductFilter();
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();
  const { state } = useDesigner();
  const { leftCol, rightCol } = useMemo(() => {
    const all = [...featuredDocuments.left, ...featuredDocuments.right];
    if (state.featuredDocumentsLayout === 'row-major') {
      return {
        leftCol: all.filter((_, i) => i % 2 === 0),
        rightCol: all.filter((_, i) => i % 2 === 1),
      };
    }
    const half = Math.ceil(all.length / 2);
    return { leftCol: all.slice(0, half), rightCol: all.slice(half) };
  }, [state.featuredDocumentsLayout]);

  return (
    <div id="section-featured-documents" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="featured-documents"
        enabled={enabled}
        previewMode={previewMode}
        editableInDraft={false}
        draftLockedHint="Switch to publish to edit."
        publishedOverlay="pencil-only"
        onEditClick={onSectionEdit}
      >
        <h2
          className="mb-5 text-base text-secondary"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
        >
          {copy.featuredTitle}
        </h2>

        <ProductFilterChips
          label={copy.reviewingLabel}
          filters={productFilters}
          activeFilter={activeReviewingFilter}
          onFilterChange={setActiveReviewingFilter}
          className="mb-5"
        />

        <div className="grid grid-cols-2 gap-x-10 gap-y-0 lg:gap-x-16">
          <div className="flex flex-col gap-3">
            {leftCol.map((doc, i) => (
              <DocumentCard key={`l-${doc.name}-${i}`} doc={doc} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {rightCol.map((doc, i) => (
              <DocumentCard key={`r-${doc.name}-${i}`} doc={doc} />
            ))}
          </div>
        </div>
      </TrustCenterEditableRegion>

      <button
        type="button"
        className="mt-5 flex items-center gap-1 text-sm font-medium text-link-400 hover:underline"
        style={{ fontFamily: "'Neue Montreal', sans-serif" }}
      >
        {copy.featuredViewAll}
        <ArrowRight size={14} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}

function DocumentCard({ doc }: { doc: FeaturedDocumentItem }) {
  const badgeSrc = doc.badgeAsset ? featuredDocBadgeSrc[doc.badgeAsset] : null;

  return (
    <button
      type="button"
      className="flex h-10 max-h-10 w-full items-center gap-2 rounded-md border border-grey-1 bg-white px-2 text-left transition-colors hover:bg-primary-100/60"
    >
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-primary-500" aria-hidden>
        <FontAwesomeIcon icon={faGripLines} className="h-3.5 w-3.5" />
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className="min-w-0 truncate text-sm font-medium leading-[1.35] text-foreground"
          style={{ fontFamily: "'Neue Montreal', sans-serif" }}
        >
          {doc.name}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700">
          {doc.locked && (
            <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5 text-primary-600" aria-hidden />
          )}
          {doc.badge}
        </span>
      </div>
      {badgeSrc ? (
        <img
          src={badgeSrc}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </button>
  );
}
