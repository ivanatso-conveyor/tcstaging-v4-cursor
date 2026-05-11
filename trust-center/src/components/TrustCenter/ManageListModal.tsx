/**
 * ManageListModal
 * Shared shell for the "list-with-pencils" pattern used by Update Subprocessors,
 * Update Announcements, and Update Video Resources.
 *
 * Includes prototype-only drag-to-reorder: items can be dragged via the grip
 * handle at the left of each row; reorder is held in local state and not
 * persisted back to the data source. Per-row pencil opens the nested single-
 * item detail editor supplied by the caller.
 *
 * When a detail editor is open (`nestedOpen`), backdrop/escape close on the
 * outer shell is suppressed.
 */
import { Fragment, useEffect, useMemo, useState, type DragEvent } from 'react';
import { Pencil, X } from 'lucide-react';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

export type ManageListModalItem = {
  /** Stable key for React + identity in callbacks. */
  key: string;
  /** Row label (also used in the Edit button's aria-label). */
  label: string;
};

type Props = {
  titleId: string;
  title: string;
  heading: string;
  helper: string;
  items: ManageListModalItem[];
  /** Fired when the user clicks the pencil on a row. */
  onEdit: (item: ManageListModalItem) => void;
  onClose: () => void;
  /** When true, a nested detail modal is open — disable Escape close. */
  nestedOpen?: boolean;
};

export default function ManageListModal({
  titleId,
  title,
  heading,
  helper,
  items,
  onEdit,
  onClose,
  nestedOpen,
}: Props) {
  // Draft reorder, keyed by item.key; prototype-only (not persisted across opens).
  const [draftOrder, setDraftOrder] = useState<string[]>(() => items.map((i) => i.key));
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);

  const itemsByKey = useMemo(() => {
    const m = new Map<string, ManageListModalItem>();
    items.forEach((it) => m.set(it.key, it));
    return m;
  }, [items]);

  const orderedItems = useMemo(
    () => draftOrder.map((k) => itemsByKey.get(k)).filter((x): x is ManageListModalItem => Boolean(x)),
    [draftOrder, itemsByKey],
  );

  useEffect(() => {
    if (nestedOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, nestedOpen]);

  const clearDrag = () => {
    setDraggingIndex(null);
    setDropIndicatorIndex(null);
  };

  const updateDropIndicator = (e: DragEvent, rowIndex: number) => {
    if (draggingIndex === null) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    let insertBefore = e.clientY < mid ? rowIndex : rowIndex + 1;
    insertBefore = Math.max(0, Math.min(insertBefore, draftOrder.length));
    if (insertBefore === draggingIndex || insertBefore === draggingIndex + 1) {
      setDropIndicatorIndex(null);
    } else {
      setDropIndicatorIndex(insertBefore);
    }
  };

  const commitReorder = (from: number, insertBefore: number) => {
    const bounded = Math.max(0, Math.min(insertBefore, draftOrder.length));
    if (bounded === from || bounded === from + 1) return;
    setDraftOrder((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(bounded > from ? bounded - 1 : bounded, 0, moved);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={nestedOpen ? () => {} : onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto flex h-[min(680px,92vh)] max-h-[min(680px,92vh)] w-full max-w-xl flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id={titleId}
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              {title}
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
              <p className="mb-2 text-sm font-medium text-primary-800">{heading}</p>
              <p className="mb-3 text-sm leading-[1.5] text-primary-700">{helper}</p>
              <div className="overflow-hidden rounded border border-primary-400 bg-white">
                {orderedItems.map((item, index) => {
                  const isDragging = draggingIndex === index;
                  const isLast = index === orderedItems.length - 1;
                  return (
                    <Fragment key={item.key}>
                      {dropIndicatorIndex === index && draggingIndex !== null ? (
                        <div
                          aria-hidden
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            commitReorder(draggingIndex, index);
                            clearDrag();
                          }}
                          className="mx-2 my-1 h-10 rounded border border-dashed border-primary-500 bg-primary-100/60"
                        />
                      ) : null}
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', String(index));
                          setDraggingIndex(index);
                          setDropIndicatorIndex(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          updateDropIndicator(e, index);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggingIndex === null) {
                            clearDrag();
                            return;
                          }
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          const mid = rect.top + rect.height / 2;
                          const insertBefore = e.clientY < mid ? index : index + 1;
                          commitReorder(draggingIndex, insertBefore);
                          clearDrag();
                        }}
                        onDragEnd={clearDrag}
                        className={`flex select-none items-center gap-3 px-3 py-2.5 transition-shadow ${
                          isLast ? '' : 'border-b border-primary-400'
                        } ${
                          isDragging
                            ? 'relative z-10 cursor-grabbing bg-white shadow-[0_8px_24px_rgba(0,27,40,0.12)] ring-1 ring-primary-400'
                            : 'cursor-grab hover:bg-primary-100'
                        }`}
                      >
                        <span className="shrink-0 text-primary-500" aria-hidden>
                          <FontAwesomeIcon icon={faGripLines} className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-primary-800">
                          {item.label}
                        </span>
                        <button
                          type="button"
                          draggable={false}
                          onClick={() => onEdit(item)}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-primary-600 hover:bg-primary-200 hover:text-primary-800"
                          aria-label={`Edit ${item.label}`}
                          title={`Edit ${item.label}`}
                        >
                          <Pencil size={12} strokeWidth={2} aria-hidden />
                        </button>
                      </div>
                    </Fragment>
                  );
                })}
                {dropIndicatorIndex === orderedItems.length && draggingIndex !== null ? (
                  <div
                    aria-hidden
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      commitReorder(draggingIndex, orderedItems.length);
                      clearDrag();
                    }}
                    className="mx-2 my-1 h-10 rounded border border-dashed border-primary-500 bg-primary-100/60"
                  />
                ) : null}
              </div>
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
              className="flex h-10 items-center justify-center rounded-[3px] bg-brand-400 px-5 text-sm font-medium text-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-600"
            >
              Save
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
