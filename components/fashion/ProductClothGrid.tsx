'use client';

import { useMemo } from 'react';
import ClothCard from '@/components/fashion/ClothCard';
import type { Product } from '@/components/fashion/ClothCard'; // Import from Card
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
      // 1. Normalize Search (Lowercase and Trim)
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(searchLower)));

      // 2. Normalize Category & Cross-Check with Tags
      const productCat = product.category.toLowerCase().trim();
      const filterCat = category.toLowerCase().trim();

      // "Root" words to handle 's' (e.g., 'Jackets' -> 'Jacket')
      const rootProductCat = productCat.endsWith('s') ? productCat.slice(0, -1) : productCat;
      const rootFilterCat = filterCat.endsWith('s') ? filterCat.slice(0, -1) : filterCat;

      // Check if the selected category matches the product's category OR its tags
      const categoryMatchInTags = Array.isArray(product.tags) && product.tags.some(tag => {
        const t = tag.toLowerCase().trim();
        const rootTag = t.endsWith('s') ? t.slice(0, -1) : t;
        return t === filterCat || rootTag === rootFilterCat;
      });

      const matchesCategory = 
        category === 'All' || 
        productCat === filterCat || 
        rootProductCat === rootFilterCat ||
        categoryMatchInTags; // NEW: Check tags for the category too!

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5">
          {filteredProducts.map((product) => (
            <ClothCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-gray-600 mb-4 text-6xl">😕</div>
          <h3 className="text-xl font-black text-gray-300 uppercase italic tracking-tighter">No products found</h3>
          <p className="text-gray-500 text-xs font-bold uppercase">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}