/**
 * NewAnnouncementModal
 * Create a new announcement for the Trust Center.
 * Entry points: "Add an Announcement" card in AnnouncementsSection and RightPanel "Edit Live Content" > Announcements.
 * Figma: Trust Center Vision HQ > Trust Center Designer > New Announcement
 */
import { useEffect, useState } from 'react';
import { Calendar, Maximize2, X } from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

type NotifyChoice = 'notify' | 'silent';

const SUBSCRIBER_COUNT = 46;

export default function NewAnnouncementModal({ onClose }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [notify, setNotify] = useState<NotifyChoice>('notify');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isValid = title.trim().length > 0 && body.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-announcement-title"
          className="pointer-events-auto flex h-[min(820px,92vh)] max-h-[min(820px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="new-announcement-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              New Announcement
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
            <TitleField title={title} onChange={setTitle} autoFocus />

            <BodyField body={body} onChange={setBody} />

            <PublishDateField value={publishDate} onChange={setPublishDate} />

            <NotifyAudienceField value={notify} onChange={setNotify} />
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
  onChange,
  autoFocus = false,
  inputId = 'announcement-title',
}: {
  title: string;
  onChange: (next: string) => void;
  autoFocus?: boolean;
  inputId?: string;
}) {
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-primary-800">
        Title<span className="text-red-500">*</span>
      </label>
      <p className="mt-1 mb-2 text-sm leading-[1.5] text-primary-700">
        What&rsquo;s this announcement about?
      </p>
      <input
        id={inputId}
        type="text"
        value={title}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
      />
    </div>
  );
}

export function BodyField({
  body,
  onChange,
  inputId = 'announcement-body',
}: {
  body: string;
  onChange: (next: string) => void;
  inputId?: string;
}) {
  return (
    <div className="mt-6">
      <label htmlFor={inputId} className="block text-sm font-medium text-primary-800">
        Body<span className="text-red-500">*</span>
      </label>
      <p className="mt-1 mb-2 text-sm leading-[1.5] text-primary-700">
        Share a brief summary of what&rsquo;s happening and why it&rsquo;s important to your customers and prospects.
        You can also add links if there&rsquo;s other resources they should refer to for more detail.
      </p>
      <div className="relative">
        <textarea
          id={inputId}
          rows={8}
          value={body}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-primary-400 bg-white px-3 py-2 pr-11 text-sm leading-[1.5] text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
        />
        <button
          type="button"
          aria-label="Expand editor"
          className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded border border-primary-400 bg-white text-primary-700 hover:bg-primary-100"
        >
          <Maximize2 size={12} strokeWidth={2} aria-hidden />
        </button>
      </div>
      <p className="mt-1.5 text-xs text-primary-600">Markdown formatting is supported</p>
    </div>
  );
}

export function PublishDateField({
  value,
  onChange,
  disabled = false,
  warning,
  inputId = 'announcement-publish-date',
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  /** Orange warning line shown above the input (used when already published). */
  warning?: string;
  inputId?: string;
}) {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-primary-800">Publish Date</p>
      <p className="mt-1 mb-2 text-sm leading-[1.5] text-primary-700">
        Choose when to publish this announcement. Leave empty to publish immediately.
      </p>
      {warning ? (
        <p className="mb-2 text-sm leading-[1.5] text-orange-600">{warning}</p>
      ) : null}
      <div className="relative w-[260px]">
        <input
          id={inputId}
          type="date"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Select publish date"
          className="h-10 w-full rounded border border-primary-400 bg-white pl-3 pr-10 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400 disabled:cursor-not-allowed disabled:bg-primary-100 disabled:text-primary-500"
        />
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary-600"
          aria-hidden
        >
          <Calendar size={14} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

export function NotifyAudienceField({
  value,
  onChange,
  namePrefix = 'announcement-notify',
}: {
  value: NotifyChoice;
  onChange: (next: NotifyChoice) => void;
  namePrefix?: string;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-medium text-primary-800">Notify Audience</legend>
      <p className="mt-1 mb-2 text-sm leading-[1.5] text-primary-700">
        You currently have {SUBSCRIBER_COUNT} subscribers
      </p>
      <div className="flex flex-col gap-1.5">
        <RadioRow
          name={namePrefix}
          id={`${namePrefix}-notify`}
          checked={value === 'notify'}
          onChange={() => onChange('notify')}
          label="Notify subscribers on the morning of the publish date (9am ET)"
        />
        <RadioRow
          name={namePrefix}
          id={`${namePrefix}-silent`}
          checked={value === 'silent'}
          onChange={() => onChange('silent')}
          label="Do not notify subscribers of the announcement"
        />
      </div>
    </fieldset>
  );
}

function RadioRow({
  name,
  id,
  checked,
  onChange,
  label,
}: {
  name: string;
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-sm text-primary-800">
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 border-primary-400 text-brand-400 focus:ring-brand-400"
      />
      <span>{label}</span>
    </label>
  );
}
