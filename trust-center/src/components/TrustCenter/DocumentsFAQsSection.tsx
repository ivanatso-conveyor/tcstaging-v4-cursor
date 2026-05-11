import { useState } from 'react';
import { productFilters, bigCards, documentsFaqTiles } from '../../constants/data';
import { certifications } from '../../constants/certifications';
import { useReviewingProductFilter } from '../../contexts/ReviewingProductFilterContext';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import MaterialIcon from '../MaterialIcon';
import ProductFilterChips from './ProductFilterChips';
import DocumentsSearchModal from './DocumentsSearchModal';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

const CARD_SHADOW =
  '0px 1px 2px 0px rgba(67,90,111,0.22), 0px 0px 1px 0px rgba(67,90,111,0.45)';
/** First four badges from `src/assets/badges` (shared with Certifications section). */
const DOCUMENTS_CARD_BADGES = certifications.slice(0, 4);

function DocumentComplianceBadges() {
  return (
    <div className="flex gap-2 flex-1 min-w-0 justify-start items-center flex-wrap">
      {DOCUMENTS_CARD_BADGES.map((cert) => (
        <img
          key={cert.name}
          src={cert.image}
          alt=""
          className="h-8 w-8 max-h-8 max-w-8 shrink-0 object-contain"
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

/** Documents + Knowledge Base FAQs big cards, FAQ topic tiles, and filters — one designer “find-answer” block. */
export default function DocumentsFAQsSection() {
  const { activeReviewingFilter, setActiveReviewingFilter } = useReviewingProductFilter();
  const copy = useTrustCenterCopy();
  const { enabled, previewMode } = useTrustCenterSectionEdit();
  const [searchOpen, setSearchOpen] = useState<string | null>(null);

  return (
    <div id="section-find-answer" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="find-answer"
        enabled={enabled}
        previewMode={previewMode}
        publishedOverlay="none"
        onEditClick={() => {}}
        className="flex flex-col gap-4"
      >
      <h2
        className="text-base font-medium text-primary-700 leading-[1.35] shrink-0"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
      >
        {copy.documentsFaqsTitle}
      </h2>

      <div className="flex flex-col gap-4">
        <ProductFilterChips
          label={copy.reviewingLabel}
          filters={productFilters}
          activeFilter={activeReviewingFilter}
          onFilterChange={setActiveReviewingFilter}
        />

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            {bigCards.map((card) => {
              const isDocs = card.title === 'Documents';
              const title = isDocs ? copy.documentsCardTitle : copy.knowledgeFaqsCardTitle;
              const showBadges = card.showComplianceBadges;
              return (
                <button
                  key={card.title}
                  id={isDocs ? 'section-documents' : 'section-knowledge-base-faqs'}
                  type="button"
                  onClick={() => setSearchOpen(isDocs ? 'documents' : 'Overview')}
                  className={`flex flex-col bg-white border border-primary-400 rounded-lg overflow-hidden text-left group hover:border-primary-500 transition-colors ${isDocs ? 'scroll-mt-20' : ''}`}
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <div
                    className="h-2 w-full shrink-0"
                    style={{ backgroundColor: 'var(--trust-center-accent-color, #292951)' }}
                  />
                  <div className="p-5 flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-base font-medium text-primary-800 leading-[1.35] whitespace-nowrap"
                        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
                      >
                        {title}
                      </span>
                      <div className="bg-primary-300 flex h-6 min-w-[24px] items-center justify-center px-2 rounded overflow-hidden shrink-0">
                        <span
                          className="text-sm font-medium text-primary-800 leading-[1.35]"
                          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
                        >
                          {card.count}
                        </span>
                      </div>
                    </div>
                    <div className="flex min-h-10 w-full items-center gap-5">
                      {showBadges ? (
                        <DocumentComplianceBadges />
                      ) : (
                        <div className="min-h-10 flex-1" aria-hidden />
                      )}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: 'var(--trust-center-accent-color, #292951)' }}
                      >
                        <MaterialIcon symbol="arrow_forward" size={18} color="var(--color-surface)" filled />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            {Array.from({ length: Math.ceil(documentsFaqTiles.length / 3) }, (_, row) => (
              <div key={row} className="grid grid-cols-3 gap-2">
                {documentsFaqTiles.slice(row * 3, row * 3 + 3).map((doc, col) => (
                  <button
                    key={`tile-${row * 3 + col}`}
                    type="button"
                    onClick={() => setSearchOpen(doc.name)}
                    className="flex items-center gap-4 p-3 bg-white border border-primary-400 rounded-lg hover:border-primary-500 transition-colors text-left min-h-[64px]"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          'color-mix(in srgb, var(--trust-center-accent-color, #292951) 15%, transparent)',
                      }}
                    >
                      <MaterialIcon
                        symbol={doc.icon}
                        size={18}
                        color="var(--trust-center-accent-color, #292951)"
                        filled
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 justify-center">
                      <span
                        className="text-sm font-medium text-primary-800 leading-[1.35]"
                        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
                      >
                        {doc.name}
                      </span>
                      <span
                        className="text-xs text-primary-700 leading-tight whitespace-nowrap"
                        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
                      >
                        {doc.answers} {copy.answersSuffix}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      </TrustCenterEditableRegion>
      {searchOpen ? (
        <DocumentsSearchModal
          initialPanelKey={searchOpen}
          onClose={() => setSearchOpen(null)}
        />
      ) : null}
    </div>
  );
}
