import { ImageIcon, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { uiAssets } from '../../constants/uiAssets';
import { useDesigner } from '../../context/DesignerContext';
import { normalizeTrustCenterImagery, type SavedTrustCenterImagery } from '../../utils/trustCenterImageryMerge';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

type Props = {
  onClose: () => void;
};

export default function TrustCenterImageryModal({ onClose }: Props) {
  const { state, setSavedTrustCenterImagery } = useDesigner();
  const baseId = useId();
  const [draft, setDraft] = useState<SavedTrustCenterImagery>(() =>
    normalizeTrustCenterImagery(state.savedTrustCenterImagery),
  );

  const squareInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onPickFile = useCallback(
    async (kind: keyof SavedTrustCenterImagery, file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setDraft((d) => ({ ...d, [kind]: dataUrl }));
      } catch {
        /* ignore read errors in prototype */
      }
    },
    [],
  );

  const clearSlot = (kind: keyof SavedTrustCenterImagery) => {
    setDraft((d) => ({ ...d, [kind]: null }));
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${baseId}-imagery-title`}
          className="pointer-events-auto flex h-[min(700px,92vh)] max-h-[min(700px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-primary-400 bg-white shadow-xl"
        >
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-primary-400 px-6 py-4">
            <h2
              id={`${baseId}-imagery-title`}
              className="text-lg font-medium text-primary-800"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Trust Center Page Imagery
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-primary-600 hover:bg-primary-100 hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-8">
              <ImagerySlot
                title="Square Logo Image (320×320 px)*"
                description="This will be used to represent your company on Conveyor. If you only update one thing, make it this one."
                primaryCta="Add a Logo"
                sizeHint="320×320 px recommended"
                value={draft.squareLogoSrc}
                defaultPreviewSrc={uiAssets.mediacoreLogo}
                onPick={() => squareInputRef.current?.click()}
                onClear={() => clearSlot('squareLogoSrc')}
                aspectClass="block h-[180px] w-[180px]"
                inputRef={squareInputRef}
                inputId={`${baseId}-square`}
                onChangeFile={(f) => onPickFile('squareLogoSrc', f)}
              />

              <ImagerySlot
                title="Header Image (1100×200 px)"
                description="Give your profile some personality."
                primaryCta="Add a Header Image"
                sizeHint="1100×200 px · wide banner"
                value={draft.headerImageSrc}
                defaultPreviewSrc={uiAssets.tcBanner}
                onPick={() => headerInputRef.current?.click()}
                onClear={() => clearSlot('headerImageSrc')}
                aspectClass="aspect-[1100/200] w-full"
                inputRef={headerInputRef}
                inputId={`${baseId}-header`}
                onChangeFile={(f) => onPickFile('headerImageSrc', f)}
              />

              <ImagerySlot
                title="Thumbnail Image (300×150 px recommended)"
                description="This image will be used when your profile is shared in Slack or on social media platforms."
                primaryCta="Add a Thumbnail Image"
                sizeHint="300×150 px recommended"
                value={draft.thumbnailImageSrc}
                onPick={() => thumbInputRef.current?.click()}
                onClear={() => clearSlot('thumbnailImageSrc')}
                aspectClass="aspect-[2/1] w-full max-h-32"
                inputRef={thumbInputRef}
                inputId={`${baseId}-thumb`}
                onChangeFile={(f) => onPickFile('thumbnailImageSrc', f)}
              />
            </div>
          </div>

          <footer className="flex shrink-0 justify-end gap-2 border-t border-primary-400 bg-primary-100/40 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-primary-400 bg-white px-4 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const n = normalizeTrustCenterImagery(draft);
                const allEmpty = !n.squareLogoSrc && !n.headerImageSrc && !n.thumbnailImageSrc;
                setSavedTrustCenterImagery(allEmpty ? null : n);
                onClose();
              }}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              Save
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

function ImagerySlot({
  title,
  description,
  primaryCta,
  sizeHint,
  value,
  defaultPreviewSrc,
  onPick,
  onClear,
  aspectClass,
  inputRef,
  inputId,
  onChangeFile,
}: {
  title: string;
  description: string;
  primaryCta: string;
  sizeHint: string;
  value: string | null;
  /** Bundled asset shown when no custom upload (same source as live Trust Center). */
  defaultPreviewSrc?: string;
  onPick: () => void;
  onClear: () => void;
  aspectClass: string;
  inputRef: RefObject<HTMLInputElement | null>;
  inputId: string;
  onChangeFile: (file: File | undefined) => void;
}) {
  const previewSrc = value ?? defaultPreviewSrc ?? null;
  const showFullBleed = previewSrc !== null;

  return (
    <div>
      <h3
        className="text-sm font-medium text-primary-800"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-sm leading-relaxed text-primary-600"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
      >
        {description}
      </p>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          onChangeFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={onPick}
        aria-label={primaryCta}
        className={`relative mt-3 cursor-pointer overflow-hidden rounded-lg border border-dashed border-primary-500 bg-primary-100/40 transition-colors hover:bg-primary-100/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400 ${aspectClass} ${
          showFullBleed
            ? 'p-0'
            : 'flex flex-col items-center justify-center gap-2 px-4 py-6 text-center'
        }`}
      >
        {showFullBleed ? (
          <img src={previewSrc} alt="" className="absolute inset-0 block h-full w-full object-cover" />
        ) : (
          <>
            <ImageIcon className="h-8 w-8 text-primary-500" strokeWidth={1.25} aria-hidden />
            <span
              className="text-sm font-medium text-primary-700"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
            >
              {primaryCta}
            </span>
            <span className="text-xs text-primary-600">{sizeHint}</span>
          </>
        )}
      </button>
      {showFullBleed ? (
        <p
          className="mt-1.5 text-[11px] text-primary-600"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
        >
          {sizeHint} · click to replace
        </p>
      ) : null}
      {value ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="mt-2 text-xs font-medium text-link-400 hover:underline"
        >
          Remove and use default
        </button>
      ) : null}
    </div>
  );
}
