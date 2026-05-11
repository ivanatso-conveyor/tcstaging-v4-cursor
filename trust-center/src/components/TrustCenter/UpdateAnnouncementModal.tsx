/**
 * UpdateAnnouncementModal
 * Edit an existing announcement. Publish date is locked once published.
 * Entry points: card ellipsis menu > "Edit Announcement".
 * Figma: Trust Center Vision HQ > Trust Center Designer > Update Announcement
 */
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';
import {
  BodyField,
  NotifyAudienceField,
  PublishDateField,
  TitleField,
} from './NewAnnouncementModal';

type NotifyChoice = 'notify' | 'silent';

type Props = {
  initial: {
    title: string;
    body: string;
    publishDate: string;
    /** True once the announcement has gone live — locks the publish date. */
    alreadyPublished: boolean;
    notify: NotifyChoice;
  };
  onClose: () => void;
};

export default function UpdateAnnouncementModal({ initial, onClose }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [publishDate, setPublishDate] = useState(initial.publishDate);
  const [notify, setNotify] = useState<NotifyChoice>(initial.notify);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleTitle = (next: string) => {
    setTitle(next);
    setIsDirty(true);
  };
  const handleBody = (next: string) => {
    setBody(next);
    setIsDirty(true);
  };
  const handlePublishDate = (next: string) => {
    setPublishDate(next);
    setIsDirty(true);
  };
  const handleNotify = (next: NotifyChoice) => {
    setNotify(next);
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="update-announcement-title"
          className="pointer-events-auto flex h-[min(820px,92vh)] max-h-[min(820px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="update-announcement-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Update Announcement
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
              onChange={handleTitle}
              inputId="update-announcement-title-input"
              autoFocus
            />

            <BodyField
              body={body}
              onChange={handleBody}
              inputId="update-announcement-body-input"
            />

            <PublishDateField
              value={publishDate}
              onChange={handlePublishDate}
              disabled={initial.alreadyPublished}
              warning={
                initial.alreadyPublished
                  ? 'This announcement has already been published and the publish date cannot be changed.'
                  : undefined
              }
              inputId="update-announcement-publish-date"
            />

            <NotifyAudienceField
              value={notify}
              onChange={handleNotify}
              namePrefix="update-announcement-notify"
            />
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
