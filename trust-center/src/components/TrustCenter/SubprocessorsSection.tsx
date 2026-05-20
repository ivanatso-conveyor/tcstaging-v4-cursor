import { useState } from 'react';
import { subprocessors } from '../../constants/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { ChevronDown, ChevronUp, LayoutGrid, List, MapPin, Plus } from 'lucide-react';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import { subprocessorLogos } from './subprocessorLocalLogos';
import AddSubprocessorModal from './AddSubprocessorModal';
import UpdateSubprocessorModal from './UpdateSubprocessorModal';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

const ROW_GRID =
  'grid grid-cols-[minmax(0,1.35fr)_minmax(0,1.2fr)_minmax(0,1fr)_44px]';

export default function SubprocessorsSection() {
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [addOpen, setAddOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const displayed = showAll ? subprocessors : subprocessors.slice(0, 4);
  const copy = useTrustCenterCopy();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();

  return (
    <div id="section-subprocessors" className="mx-10 py-8 scroll-mt-20">
      <TrustCenterEditableRegion
        sectionId="subprocessors"
        enabled={enabled}
        previewMode={previewMode}
        publishedOverlay="none"
        onEditClick={onSectionEdit}
      >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2
            className="text-base text-secondary"
            style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
          >
            {copy.subprocessorsTitle}
          </h2>
          <span
            className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center bg-primary-300 px-1.5 text-xs font-medium text-primary-700 outline-none ring-0"
            style={{ borderRadius: '4px' }}
          >
            {subprocessors.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="shrink-0 rounded p-1.5 text-primary-700 transition-colors hover:bg-primary-200"
          aria-label="Add subprocessor"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-primary-400 bg-white">
        <div className={`${ROW_GRID} border-b border-primary-400 bg-primary-100`}>
          <div
            className="border-r border-primary-400 px-3 py-2.5 text-sm font-medium leading-[1.35] text-primary-800"
            style={{ fontFamily: "'Neue Montreal', sans-serif" }}
          >
            {copy.spColName}
          </div>
          <div
            className="border-r border-primary-400 px-3 py-2.5 text-sm font-medium leading-[1.35] text-primary-800"
            style={{ fontFamily: "'Neue Montreal', sans-serif" }}
          >
            {copy.spColLocation}
          </div>
          <div
            className="border-r border-primary-400 px-3 py-2.5 text-sm font-medium leading-[1.35] text-primary-800"
            style={{ fontFamily: "'Neue Montreal', sans-serif" }}
          >
            {copy.spColUsage}
          </div>
          <div className="px-2 py-2.5" aria-hidden />
        </div>

        {displayed.map((sp) => (
          <div
            key={sp.domain}
            className={`${ROW_GRID} border-b border-primary-400 transition-colors hover:bg-[rgba(71,104,125,0.15)]`}
          >
            <div className="flex items-center gap-2 border-r border-primary-400 px-3 py-3">
              {subprocessorLogos[sp.domain] ? (
                <img
                  src={subprocessorLogos[sp.domain]}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0 rounded object-contain"
                />
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary-300 text-[9px] font-bold text-primary-700">
                  {sp.name.charAt(0)}
                </span>
              )}
              <span className="text-sm text-primary-800">{sp.name}</span>
            </div>
            <div className="flex items-center gap-2 border-r border-primary-400 px-3 py-3">
              <MapPin size={14} className="shrink-0 text-primary-600" aria-hidden />
              <span className="text-sm text-primary-700">{sp.location}</span>
            </div>
            <div className="border-r border-primary-400 px-3 py-3">
              <span className="text-sm text-primary-700">{sp.usage}</span>
            </div>
            <div className="flex items-center justify-center px-2 py-3">
              <button
                type="button"
                onClick={() => setEditingDomain(sp.domain)}
                className="rounded p-1 text-primary-600 transition-colors hover:bg-primary-200 hover:text-primary-800"
                aria-label={`Edit ${sp.name}`}
              >
                <FontAwesomeIcon icon={faPencil} className="h-2.5 w-2.5" aria-hidden />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="flex w-full items-center justify-center gap-2 border-t border-primary-400 bg-primary-200 py-2.5 text-xs font-medium text-primary-800 transition-colors hover:bg-primary-300/70"
        >
          {showAll ? (
            <>
              <ChevronUp size={12} className="text-primary-600" strokeWidth={2.5} />
              {copy.spShowLess}
              <ChevronUp size={12} className="text-primary-600" strokeWidth={2.5} />
            </>
          ) : (
            <>
              <ChevronDown size={12} className="text-primary-600" strokeWidth={2.5} />
              {copy.spShowAll}
              <ChevronDown size={12} className="text-primary-600" strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-primary-600">
          {copy.spLastUpdated}{' '}
          <a href="#" className="text-link-400 hover:underline">
            {copy.spSubscribeUpdates}
          </a>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary-600">{copy.spViewAs}</span>
          <div className="flex overflow-hidden rounded-[2px] border border-primary-400">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-primary-300' : 'bg-white'}`}
              aria-label="List view"
            >
              <List size={14} className="text-primary-700" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary-300' : 'bg-white'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={14} className="text-primary-700" />
            </button>
          </div>
        </div>
      </div>

      </TrustCenterEditableRegion>
      {addOpen ? <AddSubprocessorModal onClose={() => setAddOpen(false)} /> : null}
      {editingDomain ? (
        <UpdateSubprocessorModal
          initialDomain={editingDomain}
          onClose={() => setEditingDomain(null)}
        />
      ) : null}
    </div>
  );
}
