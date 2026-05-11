import { createContext, useContext, useState, type ReactNode } from 'react';
import { productLines } from '../data/productLines';

interface ProductFilterContextType {
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export function ProductFilterProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(productLines.map((p) => p.id));
  return (
    <ProductFilterContext.Provider value={{ selectedProducts, setSelectedProducts }}>
      {children}
    </ProductFilterContext.Provider>
  );
}

export function useProductFilter() {
  const context = useContext(ProductFilterContext);
  if (!context) throw new Error('useProductFilter must be used within ProductFilterProvider');
  return context;
}
