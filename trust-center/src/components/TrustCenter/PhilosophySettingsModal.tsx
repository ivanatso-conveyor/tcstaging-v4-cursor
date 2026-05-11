/**
 * PhilosophySettingsModal
 * Edit the "Our Philosophy" statement and signatory shown on the Trust Center.
 * Entry points: preview pencil (Published mode) and RightPanel "Edit Live Content" > Our Philosophy.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Our Philosophy
 */
import { useEffect, useRef, useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function PhilosophySettingsModal({ onClose }: Props) {
  const copy = useTrustCenterCopy();
  const [statement, setStatement] = useState(copy.philosophyBody);
  const [signatoryName, setSignatoryName] = useState(copy.philosophyAuthor);
  const [signatoryTitle, setSignatoryTitle] = useState(copy.philosophyAuthorTitle);
  const [headshot, setHeadshot] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleStatementChange = (next: string) => {
    setStatement(next);
    setIsDirty(true);
  };
  const handleNameChange = (next: string) => {
    setSignatoryName(next);
    setIsDirty(true);
  };
  const handleTitleChange = (next: string) => {
    setSignatoryTitle(next);
    setIsDirty(true);
  };
  const onHeadshotPick = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setHeadshot(dataUrl);
      setIsDirty(true);
    } catch {
      /* ignore */
    }
  };
  const removeHeadshot = () => {
    setHeadshot(null);
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="philosophy-settings-title"
          className="pointer-events-auto flex h-[min(760px,92vh)] max-h-[min(760px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="philosophy-settings-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Our Philosophy
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
            <div>
              <label htmlFor="philosophy-statement" className="mb-1 block text-sm font-medium text-primary-800">
                Statement
              </label>
              <p className="mb-2 text-xs text-primary-600">Markdown formatting is supported.</p>
              <textarea
                id="philosophy-statement"
                rows={6}
                value={statement}
                onChange={(e) => handleStatementChange(e.target.value)}
                className="w-full rounded border border-primary-400 bg-white px-3 py-2 text-sm leading-[1.5] text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="philosophy-signatory-name" className="mb-1 block text-sm font-medium text-primary-800">
                Signatory&rsquo;s Name
              </label>
              <p className="mb-2 text-xs text-primary-600">
                The name of the person who is signing off on this statement.
              </p>
              <input
                id="philosophy-signatory-name"
                type="text"
                value={signatoryName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="philosophy-signatory-title" className="mb-1 block text-sm font-medium text-primary-800">
                Signatory&rsquo;s Title
              </label>
              <p className="mb-2 text-xs text-primary-600">
                The role of the person who is signing off on this statement.
              </p>
              <input
                id="philosophy-signatory-title"
                type="text"
                value={signatoryTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </div>

            <div className="mt-5">
              <p className="mb-1 text-sm font-medium text-primary-800">Headshot</p>
              <p className="mb-2 text-xs text-primary-600">A photo of the person signing off on this statement.</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  onHeadshotPick(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`relative flex h-[96px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-primary-500 bg-primary-100/40 transition-colors hover:bg-primary-100/80 ${
                  headshot ? 'p-0' : 'flex-col gap-1 text-center'
                }`}
                aria-label={headshot ? 'Replace headshot' : 'Upload headshot'}
              >
                {headshot ? (
                  <img src={headshot} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5 text-primary-500" strokeWidth={1.25} aria-hidden />
                    <span className="text-[11px] text-primary-600">Upload</span>
                  </>
                )}
              </button>
              {headshot ? (
                <button
                  type="button"
                  onClick={removeHeadshot}
                  className="mt-2 block text-xs font-medium text-link-400 hover:underline"
                >
                  Remove
                </button>
              ) : null}
            </div>
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
              disabled={!isDirty}
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
