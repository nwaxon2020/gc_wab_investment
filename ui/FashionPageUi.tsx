// app/page.tsx
'use client'; // This must be here to allow search/filter state

import { useState } from 'react';
import FashionHeroSection from "@/components/fashion/FashionHero";
import ProductGrid from '@/components/fashion/ProductClothGrid';
import CartSidebar from '@/components/fashion/CartSidebar';
import FiltersSection from '@/components/fashion/FiltersSection';
import { products } from '@/components/fashion/Products';
import News from "@/components/News";

export default function ShopPageUi() {
    // 1. Set up the states to hold the filter values
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState<string | null>(null);

    return (
        <>
            <main className="min-h-screen">

                <FashionHeroSection />
                
                <div>
                    {/* 2. Connect the Filter Section to the states */}
                    <div>
                        <FiltersSection 
                            onSearch={setSearchTerm} 
                            onCategoryChange={setCategory} 
                            onPriceChange={setPriceRange} 
                        />
                    </div>

                    {/* 3. Pass the filter states into the Product Grid */}
                    <div>
                        <div id='shophere'/>
                        <ProductGrid 
                            products={products} 
                            searchTerm={searchTerm} 
                            category={category} 
                            priceRangeLabel={priceRange} 
                        />
                    </div>
                </div>
            </main>
             
            <CartSidebar />

            <News />
        </>
    );
}