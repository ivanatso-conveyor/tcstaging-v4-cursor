/**
 * ManageAnnouncementsModal
 * "Update Announcements" — lists every announcement with a drag-to-reorder
 * grip and a pencil to open its detail editor (UpdateAnnouncementModal).
 * Opened from the right panel kebab menu "Edit Announcements" action.
 *
 * Reorder is prototype-only (held in ManageListModal's local state, not
 * persisted back to the data source).
 */
import { useState } from 'react';
import { announcements } from '../../constants/data';
import ManageListModal from './ManageListModal';
import UpdateAnnouncementModal from './UpdateAnnouncementModal';

type Props = { onClose: () => void };

export default function ManageAnnouncementsModal({ onClose }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // key = original array index as string, so we can map back after reordering.
  const items = announcements.map((a, i) => ({
    key: String(i),
    label: a.title,
  }));

  const active = editingIndex !== null ? announcements[editingIndex] : null;

  return (
    <>
      <ManageListModal
        titleId="manage-announcements-title"
        title="Update Announcements"
        heading="Announcements"
        helper="Drag to reorder. Click the pencil to edit an announcement&rsquo;s details."
        items={items}
        onEdit={(item) => setEditingIndex(Number(item.key))}
        onClose={onClose}
        nestedOpen={editingIndex !== null}
      />
      {active ? (
        <UpdateAnnouncementModal
          initial={{
            title: active.title,
            body: active.excerpt,
            publishDate: '',
            alreadyPublished: true,
            notify: 'notify',
          }}
          onClose={() => setEditingIndex(null)}
        />
      ) : null}
    </>
  );
}
