/**
 * UpdateVideoResourceModal
 * Edit an existing video resource.
 * Entry points: per-card hover-pencil in VideoSection and RightPanel "Edit Live Content" > Update Video Resource.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Update Video Resource
 */
import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';
import {
  AccessLevelField,
  TitleField,
  VideoField,
} from './NewVideoResourceModal';

type AccessLevel = 'anyone' | 'approved';
type VideoSource = 'upload' | 'link';

type Props = {
  /** Existing video data to preload. Defaults to a demo entry. */
  initial?: {
    title: string;
    accessLevel: AccessLevel;
    videoSource: VideoSource;
    videoLink: string;
  };
  onClose: () => void;
};

const TITLE_MAX = 120;

const DEFAULT_INITIAL = {
  title: 'Video',
  accessLevel: 'anyone' as AccessLevel,
  videoSource: 'link' as VideoSource,
  videoLink: 'https://www.loom.com/share/56badd3db14143bf9ad9b9c10b682dd7',
};

export default function UpdateVideoResourceModal({ initial, onClose }: Props) {
  const start = initial ?? DEFAULT_INITIAL;
  const [title, setTitle] = useState(start.title);
  const [accessLevel, setAccessLevel] = useState<AccessLevel | null>(start.accessLevel);
  const [videoSource, setVideoSource] = useState<VideoSource>(start.videoSource);
  const [videoLink, setVideoLink] = useState(start.videoLink);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const remaining = Math.max(0, TITLE_MAX - title.length);
  const handleTitle = (next: string) => {
    setTitle(next);
    setIsDirty(true);
  };
  const handleAccess = (next: AccessLevel) => {
    setAccessLevel(next);
    setIsDirty(true);
  };
  const handleSource = (next: VideoSource) => {
    setVideoSource(next);
    setIsDirty(true);
  };
  const handleLink = (next: string) => {
    setVideoLink(next);
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="update-video-resource-title"
          className="pointer-events-auto flex h-[min(820px,92vh)] max-h-[min(820px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="update-video-resource-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Update Video Resource
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded text-primary-700 hover:bg-primary-100"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 pt-7 pb-5">
            <TitleField
              title={title}
              remaining={remaining}
              onChange={handleTitle}
              inputId="update-video-resource-title-input"
            />

            <AccessLevelField
              value={accessLevel}
              onChange={handleAccess}
              namePrefix="update-video-access"
            />

            <VideoField
              source={videoSource}
              onSourceChange={handleSource}
              link={videoLink}
              onLinkChange={handleLink}
              namePrefix="update-video-source"
            >
              {videoSource === 'link' && videoLink ? <VideoPreview /> : null}
            </VideoField>
          </div>

          <footer className="flex h-[72px] shrink-0 items-center justify-between gap-2 rounded-b-lg bg-primary-200 px-6 shadow-[0px_-1px_0px_0px_var(--color-primary-400)]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] border border-primary-400 bg-white px-5 text-sm font-medium text-red-600 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-red-50"
            >
              Delete
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 items-center justify-center rounded-[3px] border border-primary-400 bg-white px-5 text-sm font-medium text-primary-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isDirty}
                onClick={onClose}
                className="flex h-10 items-center justify-center rounded-[3px] bg-brand-400 px-5 text-sm font-medium text-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-primary-300 disabled:text-primary-500 disabled:shadow-none disabled:hover:bg-primary-300"
              >
                Update
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function VideoPreview() {
  return (
    <div className="mt-3 relative aspect-[16/9] w-full overflow-hidden rounded bg-primary-800">
      <span
        className="absolute inset-0 bg-gradient-to-br from-primary-900/70 to-primary-800/50"
        aria-hidden
      />
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-400/80 backdrop-blur-sm">
          <Play size={24} className="ml-1 text-white" fill="white" aria-hidden />
        </span>
      </span>
    </div>
  );
}
