/**
 * ManageVideoResourcesModal
 * "Update Video Resources" — lists every video with a drag-to-reorder grip
 * and a pencil to open its detail editor (UpdateVideoResourceModal seeded
 * with the row's data). Opened from the right panel kebab menu
 * "Edit Video Resources" action.
 *
 * Reorder is prototype-only (held in ManageListModal's local state, not
 * persisted back to the data source).
 */
import { useState } from 'react';
import ManageListModal from './ManageListModal';
import UpdateVideoResourceModal from './UpdateVideoResourceModal';
import { videoResources } from './VideoSection';

type Props = { onClose: () => void };

// Demo defaults matching VideoSection — real impl would store per-video fields in data.
const DEMO_VIDEO_LINK = 'https://www.loom.com/share/56badd3db14143bf9ad9b9c10b682dd7';

export default function ManageVideoResourcesModal({ onClose }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // key = original array index as string, so we can map back after reordering.
  const items = videoResources.map((v, i) => ({
    key: String(i),
    label: v.title,
  }));

  const active = editingIndex !== null ? videoResources[editingIndex] : null;

  return (
    <>
      <ManageListModal
        titleId="manage-video-resources-title"
        title="Update Video Resources"
        heading="Video Resources"
        helper="Drag to reorder. Click the pencil to edit a video resource&rsquo;s details."
        items={items}
        onEdit={(item) => setEditingIndex(Number(item.key))}
        onClose={onClose}
        nestedOpen={editingIndex !== null}
      />
      {active ? (
        <UpdateVideoResourceModal
          initial={{
            title: active.title,
            accessLevel: 'anyone',
            videoSource: 'link',
            videoLink: DEMO_VIDEO_LINK,
          }}
          onClose={() => setEditingIndex(null)}
        />
      ) : null}
    </>
  );
}
