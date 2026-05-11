import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { products } from '../../constants/data';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import { useWhatWeOfferLayout } from '../../state/whatWeOfferLayout';
import AddProductModal from './AddProductModal';
import UpdateProductModal from './UpdateProductModal';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

export default function WhatWeOfferSection() {
  const copy = useTrustCenterCopy();
  const [addOpen, setAddOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const { enabled, previewMode } = useTrustCenterSectionEdit();
  const { order, layout } = useWhatWeOfferLayout();

  const orderedProducts = useMemo(
    () => order.map((name) => products.find((p) => p.name === name)).filter((p): p is typeof products[number] => Boolean(p)),
    [order],
  );

  const gridClass = layout === 'z' ? 'grid grid-cols-2 gap-8' : 'space-y-6';

  return (
    <div id="section-what-we-offer" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="what-we-offer"
        enabled={enabled}
        previewMode={previewMode}
        publishedOverlay="none"
        onEditClick={() => {}}
      >
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2
          className="text-base text-primary-700"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
        >
          {copy.whatWeOfferTitle}
        </h2>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex shrink-0 items-center justify-center rounded p-1.5 text-primary-700 transition-colors hover:bg-primary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
          aria-label="Add offering"
        >
          <FontAwesomeIcon icon={faPlus} className="block h-3 w-3" aria-hidden />
        </button>
      </div>
      <div className={gridClass}>
        {orderedProducts.map((product) => {
          const productIdx = products.findIndex((p) => p.name === product.name);
          return (
          <TrustCenterEditableRegion
            key={product.name}
            sectionId="what-we-offer-product"
            enabled={enabled}
            previewMode={previewMode}
            publishedOverlay="pencil-only"
            suppressDraftLock
            onEditClick={() => setEditingProductIndex(productIdx)}
          >
            <div>
              <h3 className="text-sm font-medium text-primary-800">{product.name}</h3>
              <p className="text-xs text-primary-600 mt-1.5">{product.description}</p>
              <div className="mt-4 space-y-1.5">
                <p className="text-xs text-primary-700">
                  <span className="text-primary-600">{copy.typicalData}</span>{' '}
                  {product.dataAccess}
                </p>
                <p className="text-xs text-primary-700">
                  <span className="text-primary-600">{copy.certificationsInline}</span>{' '}
                  {product.certifications}
                </p>
              </div>
            </div>
          </TrustCenterEditableRegion>
          );
        })}
      </div>
      </TrustCenterEditableRegion>
      {addOpen ? <AddProductModal onClose={() => setAddOpen(false)} /> : null}
      {editingProductIndex !== null ? (
        <UpdateProductModal
          productIndex={editingProductIndex}
          onClose={() => setEditingProductIndex(null)}
        />
      ) : null}
    </div>
  );
}
