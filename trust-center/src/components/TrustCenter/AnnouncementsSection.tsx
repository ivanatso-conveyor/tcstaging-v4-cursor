import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Link as LinkIcon, Megaphone, MoreVertical, Pencil } from 'lucide-react';
import { announcements, type AnnouncementItem } from '../../constants/data';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import NewAnnouncementModal from './NewAnnouncementModal';
import UpdateAnnouncementModal from './UpdateAnnouncementModal';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

const ANNOUNCEMENT_PAGE = 2;

export default function AnnouncementsSection() {
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();
  const maxOffset = Math.max(0, announcements.length - ANNOUNCEMENT_PAGE);
  const [offset, setOffset] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => announcements.slice(offset, offset + ANNOUNCEMENT_PAGE),
    [offset],
  );

  const cardTopAccentStyle = {
    backgroundColor: 'var(--trust-center-accent-color, #292951)',
  } as const;

  const editing = editIndex !== null ? announcements[editIndex] : null;

  return (
    <div id="section-announcements" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="announcements"
        enabled={enabled}
        previewMode={previewMode}
        publishedOverlay="none"
        onEditClick={onSectionEdit}
      >
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2
          className="text-base text-primary-700"
          style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
        >
          {copy.announcementsTitle}
        </h2>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-primary-400 text-primary-700 hover:bg-primary-100 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Previous announcements"
            disabled={offset <= 0}
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
          >
            <ChevronLeft size={18} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-primary-400 text-primary-700 hover:bg-primary-100 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Next announcements"
            disabled={offset >= maxOffset}
            onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
          >
            <ChevronRight size={18} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap lg:flex-nowrap">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="w-[320px] shrink-0 bg-primary-100 border border-primary-400 rounded-lg flex flex-col items-center justify-center py-12 px-4 text-center min-h-[200px] transition-colors hover:bg-primary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link-400"
        >
          <Megaphone className="text-primary-500 mb-3" size={28} strokeWidth={1.5} aria-hidden />
          <span
            className="text-sm text-primary-600"
            style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
          >
            {copy.announcementsAddCard}
          </span>
        </button>

        {visible.map((ann, i) => (
          <AnnouncementCard
            key={`${ann.title}-${offset + i}`}
            announcement={ann}
            accentStyle={cardTopAccentStyle}
            onEdit={() => setEditIndex(offset + i)}
          />
        ))}
      </div>

      </TrustCenterEditableRegion>
      {addOpen ? <NewAnnouncementModal onClose={() => setAddOpen(false)} /> : null}
      {editing ? (
        <UpdateAnnouncementModal
          initial={{
            title: editing.title,
            body: editing.excerpt,
            publishDate: '',
            alreadyPublished: true,
            notify: 'notify',
          }}
          onClose={() => setEditIndex(null)}
        />
      ) : null}
    </div>
  );
}

function AnnouncementCard({
  announcement,
  accentStyle,
  onEdit,
}: {
  announcement: AnnouncementItem;
  accentStyle: React.CSSProperties;
  onEdit: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <div
      ref={rootRef}
      className="group/announcement relative w-[320px] shrink-0 overflow-hidden rounded-lg border border-primary-400 bg-white transition-shadow hover:shadow-md"
    >
      <div className="h-2" style={accentStyle} />
      <div className="flex flex-col gap-2 p-4">
        <p className="text-[11px] text-primary-600">{announcement.date}</p>
        <h3
          className="pr-8 text-sm font-medium text-primary-800"
          style={{ fontFamily: "'Neue Montreal', sans-serif" }}
        >
          {announcement.title}
        </h3>
        <p className="text-xs leading-[1.5] text-primary-700">{announcement.excerpt}</p>
      </div>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={`Open ${announcement.title} options`}
        className={`absolute right-2 top-4 inline-flex h-7 w-7 items-center justify-center rounded border border-primary-400 bg-white text-primary-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-opacity hover:bg-primary-100 focus-visible:opacity-100 group-hover/announcement:opacity-100 ${
          menuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MoreVertical size={14} strokeWidth={2} aria-hidden />
      </button>
      {menuOpen ? (
        <div
          role="menu"
          aria-label={`${announcement.title} actions`}
          className="absolute right-2 top-12 z-20 w-[180px] overflow-hidden rounded border border-primary-400 bg-white shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary-800 hover:bg-primary-100"
          >
            <Pencil size={13} strokeWidth={2} className="text-primary-600" aria-hidden />
            <span>Edit Announcement</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary-800 hover:bg-primary-100"
          >
            <LinkIcon size={13} strokeWidth={2} className="text-primary-600" aria-hidden />
            <span>Copy Link</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
