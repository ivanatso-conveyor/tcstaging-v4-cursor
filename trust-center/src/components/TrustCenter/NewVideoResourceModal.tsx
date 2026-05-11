/**
 * NewVideoResourceModal
 * Create a new video resource shown in the "Video Resources" section.
 * Entry points: inline "Add a Video Resource" card and RightPanel "Edit Live Content" > Add New Video Resource.
 * Figma: Trust Center Vision HQ > Trust Center Designer > New Video Resource
 */
import { useEffect, useState } from 'react';
import { Video, X } from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

type AccessLevel = 'anyone' | 'approved';
type VideoSource = 'upload' | 'link';

const TITLE_MAX = 120;

export default function NewVideoResourceModal({ onClose }: Props) {
  const [title, setTitle] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource>('upload');
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const remaining = Math.max(0, TITLE_MAX - title.length);
  const isValid =
    title.trim().length > 0 &&
    accessLevel !== null &&
    (videoSource === 'upload' || videoLink.trim().length > 0);

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-video-resource-title"
          className="pointer-events-auto flex h-[min(820px,92vh)] max-h-[min(820px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="new-video-resource-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              New Video Resource
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
            <TitleField title={title} remaining={remaining} onChange={setTitle} />

            <AccessLevelField value={accessLevel} onChange={setAccessLevel} />

            <VideoField
              source={videoSource}
              onSourceChange={setVideoSource}
              link={videoLink}
              onLinkChange={setVideoLink}
            />
          </div>

          <footer className="flex h-[72px] shrink-0 items-center justify-end gap-2 rounded-b-lg bg-primary-200 px-6 shadow-[0px_-1px_0px_0px_var(--color-primary-400)]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] border border-primary-400 bg-white px-5 text-sm font-medium text-primary-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isValid}
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] bg-brand-400 px-5 text-sm font-medium text-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-primary-300 disabled:text-primary-500 disabled:shadow-none disabled:hover:bg-primary-300"
            >
              Save
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export function TitleField({
  title,
  remaining,
  onChange,
  inputId = 'video-resource-title',
}: {
  title: string;
  remaining: number;
  onChange: (next: string) => void;
  inputId?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <label htmlFor={inputId} className="text-sm font-medium text-primary-800">
          Title<span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-primary-600">{remaining}</span>
      </div>
      <p className="mb-2 text-sm leading-[1.5] text-primary-700">
        What&rsquo;s the name of the video? Max 120 characters.
      </p>
      <input
        id={inputId}
        type="text"
        value={title}
        maxLength={TITLE_MAX}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
      />
    </div>
  );
}

export function AccessLevelField({
  value,
  onChange,
  namePrefix = 'video-access',
}: {
  value: AccessLevel | null;
  onChange: (next: AccessLevel) => void;
  namePrefix?: string;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-medium text-primary-800">
        Access Level<span className="text-red-500">*</span>
      </legend>
      <p className="mt-1 mb-2 text-sm leading-[1.5] text-primary-700">
        Who can access this video resource?
      </p>
      <div className="flex flex-col gap-1.5">
        <RadioRow
          name={namePrefix}
          id={`${namePrefix}-anyone`}
          checked={value === 'anyone'}
          onChange={() => onChange('anyone')}
          label="Anyone"
        />
        <RadioRow
          name={namePrefix}
          id={`${namePrefix}-approved`}
          checked={value === 'approved'}
          onChange={() => onChange('approved')}
          label="Approved customers who have a valid NDA in place"
        />
      </div>
    </fieldset>
  );
}

export function VideoField({
  source,
  onSourceChange,
  link,
  onLinkChange,
  children,
  namePrefix = 'video-source',
}: {
  source: VideoSource;
  onSourceChange: (next: VideoSource) => void;
  link: string;
  onLinkChange: (next: string) => void;
  children?: React.ReactNode;
  namePrefix?: string;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-medium text-primary-800">
        Video<span className="text-red-500">*</span>
      </legend>
      <p className="mt-1 mb-2 text-sm leading-[1.5] text-primary-700">
        Upload a video file or add a link to a Loom, Wistia, or YouTube video.
      </p>
      <div className="flex flex-col gap-1.5">
        <RadioRow
          name={namePrefix}
          id={`${namePrefix}-upload`}
          checked={source === 'upload'}
          onChange={() => onSourceChange('upload')}
          label="Upload a video file"
        />
        <RadioRow
          name={namePrefix}
          id={`${namePrefix}-link`}
          checked={source === 'link'}
          onChange={() => onSourceChange('link')}
          label="Add a video link"
        />
      </div>
      {source === 'upload' ? (
        <UploadDropZone />
      ) : (
        <div className="mt-3">
          <input
            type="url"
            value={link}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="https://…"
            className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
          />
        </div>
      )}
      {children}
    </fieldset>
  );
}

function UploadDropZone() {
  return (
    <div className="mt-3 flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary-400 bg-white p-6 text-center">
      <Video size={28} strokeWidth={1.5} className="text-primary-500" aria-hidden />
      <p className="text-sm font-medium text-primary-700">Upload a video file</p>
      <p className="text-xs text-primary-600">
        File size limit: 1GB; file types: .mp4, .webm
      </p>
    </div>
  );
}

function RadioRow({
  name,
  id,
  checked,
  onChange,
  label,
  disabled = false,
}: {
  name: string;
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2.5 text-sm ${
        disabled ? 'cursor-not-allowed text-primary-500' : 'text-primary-800'
      }`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 shrink-0 border-primary-400 text-brand-400 focus:ring-brand-400"
      />
      <span>{label}</span>
    </label>
  );
}
