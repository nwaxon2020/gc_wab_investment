'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import FashionHeroSection from "@/components/fashion/FashionHero";
import ProductGrid from '@/components/fashion/ProductClothGrid';
import CartSidebar from '@/components/fashion/CartSidebar';
import FiltersSection from '@/components/fashion/FiltersSection';
import News from "@/components/News";
import FashionContactUi from '@/components/fashion/ContactCard';

export default function ShopPageUi() {
    // 1. Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState<string | null>(null);

    // 2. Real-time Products State
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 3. Fetch from Firebase
    useEffect(() => {
        // We order by updatedAt so edited/new items jump to the top for customers
        const q = query(collection(db, 'fashion_products'), orderBy('updatedAt', 'desc'));

        const unsub = onSnapshot(q, (snapshot) => {
            const fetchedProducts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(fetchedProducts);
            setLoading(false);
        }, (error) => {
            console.error("Firebase Read Error:", error);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <>
            <main className="min-h-screen">
                <FashionHeroSection />
                
                <div className=" mx-auto">
                    {/* Filters Section */}
                    <FiltersSection 
                        onSearch={setSearchTerm} 
                        onCategoryChange={setCategory} 
                        onPriceChange={setPriceRange} 
                    />

                    <div id='shophere' className="scroll-mt-20" />

                    {/* Product Grid with Loading State */}
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest italic">Loading Collection...</p>
                        </div>
                    ) : (
                        <ProductGrid 
                            products={products} 
                            searchTerm={searchTerm} 
                            category={category} 
                            priceRangeLabel={priceRange} 
                        />
                    )}
                </div>
            </main>
             
            <CartSidebar />
            <News />
            <FashionContactUi />
        </>
    );
}