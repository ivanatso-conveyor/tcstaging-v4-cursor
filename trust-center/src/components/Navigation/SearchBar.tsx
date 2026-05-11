import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { Search, FileText, Layout, HelpCircle, ChevronRight, ChevronDown, Download } from 'lucide-react';
import { searchItems, type SearchItem, type SearchItemType } from '../../data/searchData';
import { productLines } from '../../data/productLines';
import { Checkbox } from '../ui/checkbox';
import ConveyorAIIcon from '../../assets/search-bar/ConveyorAI_Icon_Purple.svg';
import { useDesigner } from '../../context/DesignerContext';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { mergeSavedAiAgentConfig } from '../../utils/stagingPresentation';

interface SearchBarProps {
  onSectionClick: (sectionId: string) => void;
  onDocumentClick: (item: SearchItem) => void;
  onAskAI?: (query: string) => void;
}

/** Matches @theme tokens `--color-ai-text`, `--color-purple-300`, `--color-purple-500`. */
const ASK_AI_PILL_GRADIENT =
  'linear-gradient(79deg, var(--color-ai-text) 0%, var(--color-purple-300) 30%, var(--color-purple-500) 55%, var(--color-ai-text) 80%, var(--color-purple-300) 100%)';

const SearchBar = ({ onSectionClick, onDocumentClick, onAskAI }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { state } = useDesigner();
  const copy = useTrustCenterCopy();
  const aiAgent = mergeSavedAiAgentConfig(state.savedAiAgentConfig);
  const askAiPillLabel = (aiAgent.buttonLabel ?? '').trim() || copy.sticky.askAiAgent;
  const showAskAiRow = Boolean(onAskAI) && aiAgent.askAiEnabled;
  const { selectedProducts, setSelectedProducts } = useProductFilter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [filterScrolled, setFilterScrolled] = useState(false);
  const [dropdownLeftOffset, setDropdownLeftOffset] = useState(-40);

  const typeConfig: Record<SearchItemType, { label: string; icon: React.ElementType }> = {
    section: { label: 'Trust Center Sections', icon: Layout },
    document: { label: 'Documents', icon: FileText },
    faq: { label: 'FAQ', icon: HelpCircle },
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const clearAllProducts = () => {
    setSelectedProducts([]);
  };

  const filtered =
    query.trim().length > 0
      ? searchItems.filter((item) => {
          const matchesQuery =
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase());
          if (!matchesQuery) return false;
          if (selectedProducts.length === 0) return true;
          if (!item.productLine) return true;
          return selectedProducts.includes(item.productLine);
        })
      : [];

  const grouped = (['section', 'document', 'faq'] as SearchItemType[])
    .map((type) => ({ type, items: filtered.filter((i) => i.type === type) }))
    .filter((g) => g.items.length > 0);

  const flatItems = grouped.flatMap((g) => g.items);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      if (item.type === 'document' || item.type === 'faq') onDocumentClick(item);
      else if (item.sectionId) onSectionClick(item.sectionId);
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSectionClick, onDocumentClick],
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen || flatItems.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? flatItems.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(flatItems[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (isOpen && pillRef.current) {
      const pillWidth = pillRef.current.offsetWidth;
      const sidebarWidth = 220;
      setDropdownLeftOffset(-(sidebarWidth - pillWidth));
    }
  }, [isOpen]);

  const hasQuery = query.trim().length > 0;

  const allSelected = selectedProducts.length === productLines.length;

  const toggleAll = () => {
    if (allSelected) {
      clearAllProducts();
    } else {
      setSelectedProducts(productLines.map((p) => p.id));
    }
  };

  const filterSidebar = (
    <div className="w-[220px] shrink-0 border-r border-border bg-muted/40 rounded-l-lg flex flex-col">
      <div
        className={`px-3 pt-3 pb-1 transition-shadow duration-200 ${
          filterScrolled ? 'border-b border-border shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06)]' : ''
        }`}
      >
        <div className="text-[11px] font-medium uppercase tracking-wider text-primary mb-2 pt-1">
          Filter by Product
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="w-full flex items-center gap-2 px-1.5 py-1.5 text-sm font-medium text-foreground rounded transition-colors hover:bg-muted"
        >
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} className="pointer-events-none" />
          All Products
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto px-3 py-1 border-t border-border"
        onScroll={(e) => setFilterScrolled((e.target as HTMLElement).scrollTop > 0)}
      >
        {productLines.map((product) => {
          const isSelected = selectedProducts.includes(product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => toggleProduct(product.id)}
              className="w-full flex items-center gap-2 px-1.5 py-1.5 text-sm text-foreground rounded transition-colors hover:bg-muted"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleProduct(product.id)}
                className="pointer-events-none"
              />
              {product.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const pillLabel =
    allSelected || selectedProducts.length === 0
      ? 'All Products'
      : `${selectedProducts.length} Product${selectedProducts.length > 1 ? 's' : ''}`;

  return (
    <div ref={containerRef} className="relative w-full group">
      <div className="relative flex items-center rounded-full bg-white/[0.14] border border-white/25 transition-all duration-300 shadow-[0_0_4px_rgba(255,255,255,0.12)] group-focus-within:bg-white/[0.22] group-focus-within:border-white/42 group-focus-within:shadow-[0_0_8px_rgba(255,255,255,0.22)] hover:shadow-[0_0_5px_rgba(255,255,255,0.15)]">
        <div
          ref={pillRef}
          onClick={() => {
            setIsOpen((open) => !open);
            inputRef.current?.focus();
          }}
          className="liquid-glass shrink-0 flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-l-full min-w-[120px] transition-all duration-300 hover:bg-white/20 cursor-pointer"
        >
          <span>{pillLabel}</span>
          <ChevronDown size={14} className={`ml-1 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        <div className="w-px self-stretch bg-white/15 shrink-0" />

        <div className="relative flex-1 flex items-center">
          <Search
            size={16}
            className="absolute left-3 text-white/40 transition-colors duration-300 group-focus-within:text-white/70"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search trust center..."
            className="w-full bg-transparent py-2 pl-9 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none"
            style={{ fontFamily: "'Neue Montreal', sans-serif" }}
          />
          <kbd className="absolute right-3 pointer-events-none hidden sm:flex items-center gap-0.5 rounded-md border border-white/15 bg-white/[0.08] px-1.5 py-0.5 text-[11px] font-medium text-white/40">
            ⌘K
          </kbd>
        </div>
      </div>

      {isOpen && (
        <div
          style={{ left: `${dropdownLeftOffset}px` }}
          className="absolute top-full right-[calc(-10%)] mt-2 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl z-[100] flex min-h-[200px] max-h-[400px]"
        >
          {filterSidebar}

          <div className="flex-1 flex flex-col overflow-hidden">
            {!hasQuery && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 px-3 pt-2 pb-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground pt-1 inline-block">
                    Recommended Documents
                  </span>
                  <div className="mt-1.5 space-y-0.5">
                    {['SOC 2 Type II Report', 'ISO 27001 Certificate'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          setIsOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        <FileText size={14} className="shrink-0" />
                        {term}
                      </button>
                    ))}
                    {showAskAiRow ? (
                      <button
                        type="button"
                        onClick={() => {
                          onAskAI?.('');
                          setIsOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        <img src={ConveyorAIIcon} alt="Conveyor AI" className="h-4 w-4 shrink-0 opacity-90" />
                        Ask questions, gather documents, or fill questionnaires
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {hasQuery && filtered.length > 0 && (
              <>
                <div className="flex-1 overflow-y-auto pt-2">
                  {grouped.map((group) => {
                    const config = typeConfig[group.type];
                    return (
                      <div key={group.type} className={grouped.indexOf(group) > 0 ? 'mt-2 pt-1' : ''}>
                        <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground pt-1">
                          {config.label} ({group.items.length})
                        </div>
                        {group.items.map((item) => {
                          const idx = flatItems.indexOf(item);
                          const isDownloadOnly = item.title.toLowerCase().includes('download');
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                idx === activeIndex ? 'bg-muted text-foreground' : 'hover:bg-muted'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{item.title}</div>
                                {isDownloadOnly ? <Download size={14} className="text-muted-foreground" /> : null}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                {showAskAiRow ? (
                  <div onMouseEnter={() => setActiveIndex(-1)} className="px-3 pb-3 pt-2">
                    <div className="rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-border/30 bg-background">
                      <button
                        type="button"
                        onClick={() => {
                          onAskAI?.(query);
                          setQuery('');
                          setIsOpen(false);
                        }}
                        className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-all duration-200 rounded-lg"
                      >
                        <span
                          className="relative flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-medium z-0 bg-transparent"
                          style={{
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: 'color-mix(in srgb, var(--color-ai-text) 30%, transparent)',
                          }}
                        >
                          <img src={ConveyorAIIcon} alt="" className="h-3 w-3 relative z-10" />
                          <span className="relative z-10 whitespace-nowrap text-ai-text">{askAiPillLabel}</span>
                          <span
                            className="absolute inset-[-2px] rounded-full pointer-events-none -z-10"
                            style={{
                              backgroundImage: ASK_AI_PILL_GRADIENT,
                              backgroundSize: '300% 300%',
                              animation: '3s ease 0s infinite normal none running working-banner-gradient',
                              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                              WebkitMaskComposite: 'xor',
                              maskComposite: 'exclude',
                              padding: '1.5px',
                            }}
                          />
                        </span>
                        <span className="text-foreground leading-none">
                          Ask about &apos;<span className="font-medium">{query}</span>&apos;
                        </span>
                        <ChevronRight
                          size={14}
                          className="ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {hasQuery && filtered.length === 0 && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground px-4 text-center">
                  No results found for &quot;{query}&quot;
                  <br />
                  Try changing your filters or using another keyword.
                </div>
                {showAskAiRow ? (
                  <div onMouseEnter={() => setActiveIndex(-1)} className="px-3 pb-3 pt-2">
                    <div className="rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-border/30 bg-background">
                      <button
                        type="button"
                        onClick={() => {
                          onAskAI?.(query);
                          setQuery('');
                          setIsOpen(false);
                        }}
                        className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-all duration-200 rounded-lg"
                      >
                        <span
                          className="relative flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-medium z-0 bg-transparent"
                          style={{
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: 'color-mix(in srgb, var(--color-ai-text) 30%, transparent)',
                          }}
                        >
                          <img src={ConveyorAIIcon} alt="" className="h-3 w-3 relative z-10" />
                          <span className="relative z-10 whitespace-nowrap text-ai-text">{askAiPillLabel}</span>
                          <span
                            className="absolute inset-[-2px] rounded-full pointer-events-none -z-10"
                            style={{
                              backgroundImage: ASK_AI_PILL_GRADIENT,
                              backgroundSize: '300% 300%',
                              animation: '3s ease 0s infinite normal none running working-banner-gradient',
                              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                              WebkitMaskComposite: 'xor',
                              maskComposite: 'exclude',
                              padding: '1.5px',
                            }}
                          />
                        </span>
                        <span className="text-foreground leading-none">
                          Ask about &apos;<span className="font-medium">{query}</span>&apos;
                        </span>
                        <ChevronRight
                          size={14}
                          className="ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
