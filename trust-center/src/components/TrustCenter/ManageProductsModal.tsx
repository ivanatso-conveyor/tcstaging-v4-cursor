/**
 * ManageProductsModal
 * "Update Products" — lists every product offering with a drag-to-reorder grip
 * and a pencil to open its detail editor (UpdateProductModal).
 * Opened from the right panel kebab "Edit Products on Page", Section Layout,
 * and the What we Offer section hover pencil in draft preview.
 *
 * Reorder is prototype-only (held in ManageListModal's local state, not
 * persisted back to the data source).
 */
import { useMemo, useState } from 'react';
import { products } from '../../constants/data';
import { useWhatWeOfferLayout } from '../../state/whatWeOfferLayout';
import ManageListModal from './ManageListModal';
import UpdateProductModal from './UpdateProductModal';

type Props = { onClose: () => void };

export default function ManageProductsModal({ onClose }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { order } = useWhatWeOfferLayout();

  const items = useMemo(
    () =>
      order
        .map((name) => {
          const idx = products.findIndex((p) => p.name === name);
          if (idx < 0) return null;
          return { key: String(idx), label: name };
        })
        .filter((x): x is { key: string; label: string } => Boolean(x)),
    [order],
  );

  return (
    <>
      <ManageListModal
        titleId="manage-products-title"
        title="Update Products"
        heading="Product offerings"
        helper="Drag to reorder. Click the pencil to edit a product&rsquo;s details."
        items={items}
        onEdit={(item) => setEditingIndex(Number(item.key))}
        onClose={onClose}
        nestedOpen={editingIndex !== null}
      />
      {editingIndex !== null ? (
        <UpdateProductModal
          productIndex={editingIndex}
          cancelLabel="Back"
          onClose={() => setEditingIndex(null)}
        />
      ) : null}
    </>
  );
}
