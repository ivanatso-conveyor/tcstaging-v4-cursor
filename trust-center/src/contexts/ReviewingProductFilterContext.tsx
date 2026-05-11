import { createContext, useContext, useState, type ReactNode } from 'react';

type ReviewingProductFilterContextType = {
  /** Single selected chip in Documents & Knowledge Base FAQs and Featured Documents — kept in sync. */
  activeReviewingFilter: string;
  setActiveReviewingFilter: React.Dispatch<React.SetStateAction<string>>;
};

const ReviewingProductFilterContext = createContext<ReviewingProductFilterContextType | undefined>(
  undefined,
);

const DEFAULT_FILTER = 'All Products';

export function ReviewingProductFilterProvider({ children }: { children: ReactNode }) {
  const [activeReviewingFilter, setActiveReviewingFilter] = useState(DEFAULT_FILTER);
  return (
    <ReviewingProductFilterContext.Provider value={{ activeReviewingFilter, setActiveReviewingFilter }}>
      {children}
    </ReviewingProductFilterContext.Provider>
  );
}

export function useReviewingProductFilter() {
  const ctx = useContext(ReviewingProductFilterContext);
  if (!ctx) {
    throw new Error('useReviewingProductFilter must be used within ReviewingProductFilterProvider');
  }
  return ctx;
}
