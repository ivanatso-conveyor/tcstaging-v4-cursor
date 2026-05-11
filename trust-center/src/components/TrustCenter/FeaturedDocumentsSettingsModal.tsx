/**
 * FeaturedDocumentsSettingsModal
 * Edit the Featured Documents list shown on the Trust Center.
 * Entry points: preview pencil (Published mode) and RightPanel "Edit Live Content" > Featured Documents.
 * Figma: Trust Center Vision HQ > Trust Center Designer > Featured Documents
 */
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, GripVertical, ListChecks, Lock, X } from 'lucide-react';
import { featuredDocuments, productFilters, type FeaturedDocumentItem } from '../../constants/data';
import { featuredDocBadgeSrc } from '../../constants/featuredDocBadges';
import { useDesigner } from '../../context/DesignerContext';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type FeaturedDocumentsLayout = 'column-fill' | 'row-major';

type Props = { onClose: () => void };

/** Exclude sentinels like "+ 12 More" that are just chip-row placeholders. */
const SELECTABLE_PRODUCTS = productFilters.filter(
  (p) => p !== 'All Products' && !p.startsWith('+'),
);

export default function FeaturedDocumentsSettingsModal({ onClose }: Props) {
  const { state, setFeaturedDocumentsLayout } = useDesigner();
  const [rows, setRows] = useState<FeaturedDocumentItem[]>(() => [
    ...featuredDocuments.left,
    ...featuredDocuments.right,
  ]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(SELECTABLE_PRODUCTS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const removeAt = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleProductsChange = (next: string[]) => {
    setSelectedProducts(next);
    setIsDirty(true);
  };

  const handleLayoutChange = (next: 'column-fill' | 'row-major') => {
    setFeaturedDocumentsLayout(next);
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="featured-documents-settings-title"
          className="pointer-events-auto flex h-[min(720px,92vh)] max-h-[min(720px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="featured-documents-settings-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Featured Documents
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-primary-800">Featured Documents</h3>
              <p className="text-sm leading-[1.35] text-primary-700">
                Let your customers know what docs you have for them to explore.
              </p>
              <p className="text-sm leading-[1.45] text-primary-700">
                Add your public docs by updating their access settings to anyone. Preview that you have a
                protected doc available for approved visitors by checking &ldquo;Feature this document&rdquo; on
                the Edit Document modal. The document&rsquo;s title will appear with a lock and clicking on it
                will direct users into your access request flow.
              </p>
            </div>

            <div className="mt-4">
              <label
                htmlFor="featured-docs-product-lines"
                className="text-xs font-medium text-primary-800"
              >
                Select product lines
              </label>
              <div className="mt-2">
                <ProductLineDropdown
                  products={SELECTABLE_PRODUCTS}
                  selected={selectedProducts}
                  onChange={handleProductsChange}
                  triggerId="featured-docs-product-lines"
                />
              </div>
            </div>

            <div
              role="radiogroup"
              aria-label="Featured documents column layout"
              className="mt-4 grid grid-cols-2 items-start gap-2"
            >
              <LayoutRadioCard
                value="column-fill"
                selected={state.featuredDocumentsLayout === 'column-fill'}
                onSelect={handleLayoutChange}
                title="Column fill"
                description="Fills left column then right."
              />
              <LayoutRadioCard
                value="row-major"
                selected={state.featuredDocumentsLayout === 'row-major'}
                onSelect={handleLayoutChange}
                title="Z-flow"
                description="Reads left to right across rows, top to bottom."
              />
            </div>

            <div className="mt-3 overflow-hidden rounded border border-primary-400">
              {rows.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-primary-600">
                  No documents featured yet.
                </div>
              ) : (
                rows.map((doc, i) => {
                  const badgeSrc = doc.badgeAsset ? featuredDocBadgeSrc[doc.badgeAsset] : null;
                  const name = doc.name;
                  return (
                    <div
                      key={`${name}-${i}`}
                      className={`flex items-center gap-2 px-3 py-2.5 ${
                        i < rows.length - 1 ? 'border-b border-primary-400' : ''
                      }`}
                    >
                      <GripVertical
                        size={16}
                        className="shrink-0 cursor-grab text-primary-500"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate text-base font-medium leading-[1.35] text-primary-700">
                        {name}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700">
                        {doc.locked ? (
                          <Lock
                            size={10}
                            strokeWidth={2}
                            className="text-primary-600"
                            aria-label="Protected document"
                          />
                        ) : null}
                        {doc.badge}
                      </span>
                      {badgeSrc ? (
                        <img
                          src={badgeSrc}
                          alt=""
                          className="h-6 w-6 shrink-0 object-contain"
                        />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeAt(i)}
                        className="shrink-0 text-primary-500 hover:text-primary-800"
                        aria-label={`Remove ${name}`}
                      >
                        <X size={14} strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                  );
                })
              )}
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
              onClick={onClose}
              disabled={!isDirty}
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

function ProductLineDropdown({
  products,
  selected,
  onChange,
  triggerId,
}: {
  products: readonly string[];
  selected: string[];
  triggerId?: string;
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const allSelected = selected.length === products.length;
  const noneSelected = selected.length === 0;

  const toggleAll = () => onChange(allSelected ? [] : [...products]);
  const toggleOne = (p: string) =>
    onChange(selected.includes(p) ? selected.filter((x) => x !== p) : [...selected, p]);

  const triggerLabel = allSelected
    ? 'All Products'
    : noneSelected
      ? 'Select products'
      : selected.length === 1
        ? selected[0]
        : `${selected.length} products`;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={triggerId}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2 rounded border px-2.5 text-left shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] transition-colors ${
          open
            ? 'border-brand-400 bg-[color:var(--color-toggle-track)]'
            : 'border-primary-400 bg-white hover:bg-primary-100'
        }`}
      >
        <ListChecks size={16} strokeWidth={2} className="shrink-0 text-primary-700" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary-800">
          {triggerLabel}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`shrink-0 text-primary-700 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label="Product lines"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-[280px] overflow-y-auto rounded border border-primary-400 bg-white shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <DropdownRow
            label="All Products"
            checked={allSelected}
            onToggle={toggleAll}
            emphasis
          />
          <div className="border-t border-primary-300" aria-hidden />
          {products.map((p) => (
            <DropdownRow
              key={p}
              label={p}
              checked={selected.includes(p)}
              onToggle={() => toggleOne(p)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DropdownRow({
  label,
  checked,
  onToggle,
  emphasis = false,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  emphasis?: boolean;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={checked}
      onClick={onToggle}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-primary-100"
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
          checked
            ? 'border-brand-400 bg-brand-400 text-white'
            : 'border-primary-400 bg-white text-transparent'
        }`}
        aria-hidden
      >
        <Check size={12} strokeWidth={3} />
      </span>
      <span className={`min-w-0 truncate text-sm text-primary-800 ${emphasis ? 'font-medium' : ''}`}>
        {label}
      </span>
    </button>
  );
}

function LayoutRadioCard({
  value,
  selected,
  onSelect,
  title,
  description,
}: {
  value: FeaturedDocumentsLayout;
  selected: boolean;
  onSelect: (v: FeaturedDocumentsLayout) => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(value)}
      className={`flex w-full flex-col items-start gap-1.5 rounded border p-3 text-left transition-colors ${
        selected
          ? 'border-brand-400 bg-[color:var(--color-toggle-track)]'
          : 'border-primary-400 bg-white hover:bg-primary-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <LayoutDiagram variant={value} selected={selected} />
        <span className="text-sm font-medium text-primary-800">{title}</span>
      </div>
      <span className="text-xs leading-[1.4] text-primary-700">{description}</span>
    </button>
  );
}

function LayoutDiagram({
  variant,
  selected,
}: {
  variant: FeaturedDocumentsLayout;
  selected: boolean;
}) {
  const stroke = selected ? 'var(--color-brand-400)' : 'var(--color-primary-600)';
  const arrowId = `fd-layout-arrow-${variant}-${selected ? 'on' : 'off'}`;
  return (
    <svg
      viewBox="0 0 20 16"
      width="20"
      height="16"
      role="img"
      aria-hidden
      className="shrink-0"
      fill="none"
    >
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,5 L0,10 Z" fill={stroke} />
        </marker>
      </defs>
      {variant === 'column-fill' ? (
        <g stroke={stroke} strokeWidth={1.25} strokeLinecap="round">
          <line x1={6} y1={2} x2={6} y2={12} markerEnd={`url(#${arrowId})`} />
          <line x1={14} y1={2} x2={14} y2={12} markerEnd={`url(#${arrowId})`} />
        </g>
      ) : (
        <polyline
          points="3,3 17,3 3,8 17,8 3,13 17,13"
          stroke={stroke}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#${arrowId})`}
        />
      )}
    </svg>
  );
}
