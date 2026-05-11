/**
 * UpdateProductModal
 * Edit a single product under "What We Offer".
 * Opened directly from a product card on the Trust Center page — each card
 * passes its own `productIndex` so the modal loads that product's fields.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Update Product
 */
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Maximize2, X } from 'lucide-react';
import { products } from '../../constants/data';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = {
  /** Index of the product to edit. Defaults to 0. */
  productIndex?: number;
  /** Label for the secondary dismiss button (default "Cancel", use "Back" when nested). */
  cancelLabel?: string;
  onClose: () => void;
};

const NAME_MAX = 80;

export default function UpdateProductModal({ productIndex, cancelLabel = 'Cancel', onClose }: Props) {
  const safeIndex = Math.max(0, Math.min(productIndex ?? 0, products.length - 1));
  const active = products[safeIndex];

  const initialCertifications = useMemo(
    () => active.certifications.split(',').map((s) => s.trim()).filter(Boolean),
    [active.certifications],
  );

  const [name, setName] = useState(active.name);
  const [description, setDescription] = useState(active.description);
  const [dataAccess, setDataAccess] = useState(active.dataAccess);
  const [certifications, setCertifications] = useState<string[]>(initialCertifications);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleNameChange = (next: string) => {
    setName(next);
    setIsDirty(true);
  };
  const handleDescriptionChange = (next: string) => {
    setDescription(next);
    setIsDirty(true);
  };
  const handleDataAccessChange = (next: string) => {
    setDataAccess(next);
    setIsDirty(true);
  };
  const removeCertification = (cert: string) => {
    setCertifications((prev) => prev.filter((c) => c !== cert));
    setIsDirty(true);
  };
  const clearCertifications = () => {
    setCertifications([]);
    setIsDirty(true);
  };

  const remaining = Math.max(0, NAME_MAX - name.length);

  return (
    <div className="fixed inset-0 z-[210]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="update-product-title"
          className="pointer-events-auto flex h-[min(820px,92vh)] max-h-[min(820px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="update-product-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Update Product
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
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <label htmlFor="update-product-name" className="text-sm font-medium text-primary-800">
                  Name<span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-primary-600">{remaining}</span>
              </div>
              <input
                id="update-product-name"
                type="text"
                value={name}
                maxLength={NAME_MAX}
                onChange={(e) => handleNameChange(e.target.value)}
                className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="update-product-description" className="mb-1 block text-sm font-medium text-primary-800">
                Description<span className="text-red-500">*</span>
              </label>
              <p className="mb-2 text-sm leading-[1.5] text-primary-700">
                What does this product do? The more specific you are, the better your customers will be able to scope
                their security reviews to what&rsquo;s relevant.
              </p>
              <div className="relative">
                <textarea
                  id="update-product-description"
                  rows={6}
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
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

            <div className="mt-5">
              <label htmlFor="update-product-data-access" className="mb-1 block text-sm font-medium text-primary-800">
                Data Access
              </label>
              <p className="mb-2 text-sm leading-[1.5] text-primary-700">
                What type of data access does this product need in order to function? Share with your customers
                directly rather than them having to read the tea leaves in your documentation.
              </p>
              <input
                id="update-product-data-access"
                type="text"
                value={dataAccess}
                onChange={(e) => handleDataAccessChange(e.target.value)}
                className="h-10 w-full rounded border border-primary-400 bg-white px-3 text-sm text-primary-800 placeholder-primary-500 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
              />
            </div>

            <div className="mt-5">
              <p className="mb-1 text-sm font-medium text-primary-800">Certifications and Frameworks</p>
              <p className="mb-2 text-sm leading-[1.5] text-primary-700">
                Add any that this product has been audited for or engineered to comply with.
              </p>
              <div className="flex min-h-10 w-full items-center gap-2 rounded border border-primary-400 bg-white px-2 py-1.5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                  {certifications.length === 0 ? (
                    <span className="px-1 text-sm text-primary-500">Select…</span>
                  ) : (
                    certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1 rounded-[2px] bg-primary-200 px-1.5 py-0.5 text-xs text-primary-800"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(cert)}
                          className="inline-flex h-3.5 w-3.5 items-center justify-center rounded text-primary-600 hover:bg-primary-300 hover:text-primary-800"
                          aria-label={`Remove ${cert}`}
                        >
                          <X size={10} strokeWidth={2} aria-hidden />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                {certifications.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearCertifications}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary-500 hover:text-primary-800"
                    aria-label="Clear all certifications"
                  >
                    <X size={14} strokeWidth={2} aria-hidden />
                  </button>
                ) : null}
                <span className="mx-1 h-5 w-px shrink-0 bg-primary-400" aria-hidden />
                <button
                  type="button"
                  aria-label="Open certifications dropdown"
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary-600 hover:text-primary-800"
                >
                  <ChevronDown size={14} strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>
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
                {cancelLabel}
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
