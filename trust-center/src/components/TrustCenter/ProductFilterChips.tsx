import { ChevronDown } from 'lucide-react';

const neue = { fontFamily: "'Neue Montreal', sans-serif" } as const;

export type ProductFilterChipsProps = {
  /** e.g. copy.reviewingLabel — “I'm reviewing:” */
  label: string;
  filters: readonly string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  /** Extra classes on the outer row (e.g. `mb-5` below Featured Documents heading). */
  className?: string;
};

/** Shared “I’m reviewing:” product filter bar — matches Documents & Knowledge Base FAQs chips (lavender selected, + More chevron). */
export default function ProductFilterChips({
  label,
  filters,
  activeFilter,
  onFilterChange,
  className,
}: ProductFilterChipsProps) {
  return (
    <div className={`flex min-h-[50px] flex-wrap items-center gap-2 ${className ?? ''}`}>
      <span
        className="shrink-0 text-sm leading-[1.35] text-primary-700"
        style={{ ...neue, fontWeight: 400 }}
      >
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1">
        {filters.map((filter) => {
          const selected = activeFilter === filter;
          const isMore = filter.startsWith('+');
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-2 py-1.5 text-xs font-medium leading-[1.35] transition-colors ${
                selected
                  ? 'border-transparent bg-[color-mix(in_srgb,var(--trust-center-accent-color,#292951)_15%,transparent)] text-primary-800 shadow-[inset_0_0_0_1px_var(--trust-center-accent-color,#292951)]'
                  : 'border-primary-500 bg-white text-primary-700 hover:border-primary-600'
              }`}
              style={{ ...neue, fontWeight: 500 }}
            >
              {filter}
              {isMore ? <ChevronDown size={16} className="shrink-0 text-primary-700" strokeWidth={2} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
