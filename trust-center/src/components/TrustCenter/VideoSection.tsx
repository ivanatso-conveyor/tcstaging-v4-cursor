import { useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';
import NewVideoResourceModal from './NewVideoResourceModal';
import UpdateVideoResourceModal from './UpdateVideoResourceModal';

export type VideoResource = {
  title: string;
};

export const videoResources: VideoResource[] = [
  { title: 'Security Overview' },
  { title: 'Platform Architecture' },
];

export default function VideoSection() {
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();
  const [addOpen, setAddOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  return (
    <div id="section-video-resources" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="video-resources"
        enabled={enabled}
        previewMode={previewMode}
        publishedOverlay="none"
        onEditClick={onSectionEdit}
      >
      <h2
        className="mb-5 text-base text-primary-700"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
      >
        {copy.videoTitle}
      </h2>
      <div className="grid grid-cols-3 gap-5">
        <AddVideoCard onClick={() => setAddOpen(true)} />
        {videoResources.map((video, i) => (
          <TrustCenterEditableRegion
            key={video.title}
            sectionId="video-resource"
            enabled={enabled}
            previewMode={previewMode}
            publishedOverlay="pencil-only"
            suppressDraftLock
            onEditClick={() => setEditIndex(i)}
          >
            <VideoCard title={video.title} />
          </TrustCenterEditableRegion>
        ))}
      </div>
      </TrustCenterEditableRegion>
      {addOpen ? <NewVideoResourceModal onClose={() => setAddOpen(false)} /> : null}
      {editIndex !== null ? (
        <UpdateVideoResourceModal
          initial={{
            title: videoResources[editIndex].title,
            accessLevel: 'anyone',
            videoSource: 'link',
            videoLink: 'https://www.loom.com/share/56badd3db14143bf9ad9b9c10b682dd7',
          }}
          onClose={() => setEditIndex(null)}
        />
      ) : null}
    </div>
  );
}

function VideoCard({ title }: { title: string }) {
  return (
    <button
      type="button"
      aria-label={`Play ${title}`}
      className="group relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-primary-800 transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
    >
      <span
        className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-primary-800/60"
        aria-hidden
      />
      <span
        className="absolute left-4 top-4 rounded px-2 py-1 text-xs font-medium uppercase tracking-wide text-white/90"
        style={{ fontFamily: "'Neue Montreal', sans-serif" }}
      >
        {title}
      </span>
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-white/30">
          <Play size={24} className="ml-1 text-white" fill="white" aria-hidden />
        </span>
      </span>
    </button>
  );
}

function AddVideoCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary-400 bg-primary-100/50 text-primary-600 transition-colors hover:border-primary-500 hover:bg-primary-100 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
    >
      <Plus size={28} strokeWidth={1.5} aria-hidden />
      <span
        className="text-base"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
      >
        Add a Video Resource
      </span>
    </button>
  );
}
