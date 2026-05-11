/**
 * ManageSubprocessorsModal
 * "Update Subprocessors" — lists every subprocessor with a drag-to-reorder
 * grip and a pencil to open its detail editor (UpdateSubprocessorModal
 * seeded with the row's domain). Opened from the right panel kebab menu
 * "Edit Subprocessors" action.
 *
 * Reorder is prototype-only (held in ManageListModal's local state, not
 * persisted back to the data source).
 */
import { useState } from 'react';
import { subprocessors } from '../../constants/data';
import ManageListModal from './ManageListModal';
import UpdateSubprocessorModal from './UpdateSubprocessorModal';

type Props = { onClose: () => void };

export default function ManageSubprocessorsModal({ onClose }: Props) {
  const [editingDomain, setEditingDomain] = useState<string | null>(null);

  // key = vendor domain, which UpdateSubprocessorModal uses to preselect the vendor.
  const items = subprocessors.map((s) => ({
    key: s.domain,
    label: s.name,
  }));

  return (
    <>
      <ManageListModal
        titleId="manage-subprocessors-title"
        title="Update Subprocessors"
        heading="Subprocessors"
        helper="Drag to reorder. Click the pencil to edit a subprocessor&rsquo;s details."
        items={items}
        onEdit={(item) => setEditingDomain(item.key)}
        onClose={onClose}
        nestedOpen={editingDomain !== null}
      />
      {editingDomain !== null ? (
        <UpdateSubprocessorModal
          initialDomain={editingDomain}
          onClose={() => setEditingDomain(null)}
        />
      ) : null}
    </>
  );
}
