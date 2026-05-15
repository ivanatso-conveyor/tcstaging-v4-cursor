/**
 * IDs for Trust Center sections in “Customize Layout” (designer) and main-column order.
 * Order matches the Trust Center page top-to-bottom after Identity + banner.
 */
export const LAYOUT_SECTION_IDS = [
  'badges',
  'find-answer',
  'philosophy',
  'quick-summary',
  'subprocessors',
  'trusted-by',
  'featured-documents',
  'announcements',
  'what-we-offer',
  'video-resources',
] as const;

export type LayoutSectionId = (typeof LAYOUT_SECTION_IDS)[number];

/**
 * Designer "Section Layout" visibility for the hero banner image (wide image under the nav).
 * Distinct from layout section IDs; toggled from the Trust Center imagery row eye control.
 */
export const TRUST_CENTER_BANNER_VISIBILITY_ID = 'trust-center-banner';

/**
 * Designer "Section Layout" visibility for the company profile summary paragraph.
 * When off, the headline and stat tags remain but the body text is hidden.
 */
export const COMPANY_PROFILE_VISIBILITY_ID = 'company-profile';

export const DEFAULT_SECTION_ORDER: LayoutSectionId[] = [...LAYOUT_SECTION_IDS];

/** Static labels for the right panel (locale-specific titles use copy where noted in UI). */
export const LAYOUT_SECTION_LABELS: Record<LayoutSectionId, string> = {
  badges: 'Certifications',
  'find-answer': 'Documents & Knowledge Base FAQs',
  philosophy: 'Our philosophy',
  'quick-summary': 'Quick summary',
  subprocessors: 'Sub processors',
  'trusted-by': 'Trusted by',
  'featured-documents': 'Featured Documents',
  announcements: 'Announcements',
  'what-we-offer': 'What we offer',
  'video-resources': 'Video resources',
};

/** One slot per layout id — drag moves a single row. */
export function moveSectionBlock(order: readonly string[], dragIndex: number, dropIndex: number): string[] {
  const next = [...order];
  const [removed] = next.splice(dragIndex, 1);
  let insertAt = dropIndex;
  if (dragIndex < dropIndex) insertAt -= 1;
  insertAt = Math.max(0, Math.min(insertAt, next.length));
  next.splice(insertAt, 0, removed);
  return next;
}

/**
 * Migrate designer state from older `documents` + `knowledge-base-faqs` rows to one `find-answer` slot.
 */
export function migrateSectionOrder(order: readonly string[]): string[] {
  if (!order.length) return [...DEFAULT_SECTION_ORDER];
  const hasLegacy = order.some((id) => id === 'documents' || id === 'knowledge-base-faqs');
  if (!hasLegacy && order.length === LAYOUT_SECTION_IDS.length) {
    const set = new Set(order);
    if (LAYOUT_SECTION_IDS.every((id) => set.has(id))) return [...order] as LayoutSectionId[];
  }

  const out: string[] = [];
  let i = 0;
  while (i < order.length) {
    const id = order[i];
    if (id === 'documents' || id === 'knowledge-base-faqs') {
      if (!out.includes('find-answer')) out.push('find-answer');
      while (i < order.length && (order[i] === 'documents' || order[i] === 'knowledge-base-faqs')) i++;
      continue;
    }
    if ((LAYOUT_SECTION_IDS as readonly string[]).includes(id) && !out.includes(id)) {
      out.push(id);
    }
    i++;
  }
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!out.includes(id)) out.push(id);
  }
  return out.filter((id, idx) => out.indexOf(id) === idx);
}

export function migrateSectionVisibility(v: Record<string, boolean>): Record<string, boolean> {
  const next = { ...v };
  const doc = next.documents;
  const kb = next['knowledge-base-faqs'];
  if (doc !== undefined || kb !== undefined) {
    next['find-answer'] = (doc !== false) && (kb !== false);
    delete next.documents;
    delete next['knowledge-base-faqs'];
  }
  LAYOUT_SECTION_IDS.forEach((id) => {
    if (next[id] === undefined) next[id] = true;
  });
  if (next[TRUST_CENTER_BANNER_VISIBILITY_ID] === undefined) {
    next[TRUST_CENTER_BANNER_VISIBILITY_ID] = true;
  }
  if (next[COMPANY_PROFILE_VISIBILITY_ID] === undefined) {
    next[COMPANY_PROFILE_VISIBILITY_ID] = true;
  }
  return next;
}
