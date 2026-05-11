import { createContext, useContext, type ReactNode } from 'react';

export type EditableTrustSectionId =
  | 'banner'
  | 'profile'
  | 'badges'
  | 'nav-brand'
  | 'quick-links'
  | 'quick-summary'
  | 'featured-documents'
  | 'trusted-by'
  | 'philosophy'
  | 'coming-soon'
  | 'what-we-offer'
  | 'what-we-offer-product'
  | 'video-resources'
  | 'video-resource'
  | 'find-answer'
  | 'subprocessors'
  | 'announcements';

export type TrustCenterSectionEditValue = {
  enabled: boolean;
  /** 'draft' or 'published'; controls whether the edit overlay or a "no edits" hint shows. */
  previewMode: 'draft' | 'published';
  onSectionEdit: (id: EditableTrustSectionId) => void;
};

const TrustCenterSectionEditContext = createContext<TrustCenterSectionEditValue | null>(null);

export function TrustCenterSectionEditProvider({
  value,
  children,
}: {
  value: TrustCenterSectionEditValue;
  children: ReactNode;
}) {
  return (
    <TrustCenterSectionEditContext.Provider value={value}>{children}</TrustCenterSectionEditContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider
export function useTrustCenterSectionEdit(): TrustCenterSectionEditValue {
  const ctx = useContext(TrustCenterSectionEditContext);
  return ctx ?? { enabled: false, previewMode: 'published', onSectionEdit: () => {} };
}
