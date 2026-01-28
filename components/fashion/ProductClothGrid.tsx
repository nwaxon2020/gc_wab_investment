// components/ProductGrid.tsx
'use client';

import { useMemo } from 'react';
import ClothCard from '@/components/fashion/ClothCard';
import type { Product } from '@/components/fashion/Products';
import { priceRanges } from './FiltersSection';

interface ProductGridProps {
  products: Product[];
  searchTerm: string;
  category: string;
  priceRangeLabel: string | null;
}

export default function ProductGrid({ products, searchTerm, category, priceRangeLabel }: ProductGridProps) {
  
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Logic (Name, Category, or Tags)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower));

      // 2. Category Logic
      const matchesCategory = category === 'All' || product.category.toLowerCase() === category.toLowerCase();

      // 3. Price Logic
      let matchesPrice = true;
      if (priceRangeLabel) {
        const range = priceRanges.find(r => r.label === priceRangeLabel);
        if (range) {
          matchesPrice = product.price >= range.min && product.price <= range.max;
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, category, priceRangeLabel]);

  return (
    <div className="fade-in px-2 md:px-12 pb-20">
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ClothCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-gray-600 mb-4 text-6xl">😕</div>
          <h3 className="text-xl font-black text-gray-300">No products found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
}