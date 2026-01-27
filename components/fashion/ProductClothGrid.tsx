// components/ProductGrid.tsx
'use client';

import { useState, useMemo } from 'react';
import ClothCard from '@/components/fashion/ClothCard';
import type { Product } from '@/components/fashion/Products';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filter functions would be implemented based on FiltersSection
  // For now, using all products

  return (
    <div className="fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
        {filteredProducts.map((product) => (
          <ClothCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}