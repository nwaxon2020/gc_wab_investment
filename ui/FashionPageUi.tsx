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
import ProductDetailOverlay from '@/components/fashion/ProductDetailOverlay';
import OrderOverlay from '@/components/fashion/OrderOverlay'; // IMPORT OrderOverlay
import { toast } from 'sonner';

export default function ShopPageUi() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState<string | null>(null);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOrderOverlay, setShowOrderOverlay] = useState(false); // NEW STATE

    const handleHeroProductClick = (productId: string) => {
        const fullProduct = products.find(p => p.id === productId);
        if (fullProduct) {
            setSelectedProduct(fullProduct);
            setShowOverlay(true);
        } else {
            toast.error("Product details not found");
        }
    };

    useEffect(() => {
        const q = query(collection(db, 'fashion_products'), orderBy('updatedAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const fetchedProducts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(fetchedProducts);
            setLoading(false);
        }, (error) => {
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <>
            <main className="min-h-screen">
                <FashionHeroSection onProductClick={handleHeroProductClick} />
                <div className=" mx-auto">
                    <FiltersSection 
                        onSearch={setSearchTerm} 
                        onCategoryChange={setCategory} 
                        onPriceChange={setPriceRange} 
                    />
                    <div id='shophere' className="scroll-mt-20" />
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

            {showOverlay && selectedProduct && (
                <ProductDetailOverlay 
                    product={selectedProduct} 
                    onClose={() => {
                        setShowOverlay(false);
                        setSelectedProduct(null);
                    }} 
                    onAddToCart={() => {
                        setShowOverlay(false); // Close details
                        setShowOrderOverlay(true); // Open order
                    }} 
                />
            )}

            {/* NEW: Global Order Overlay for Hero Route */}
            {showOrderOverlay && selectedProduct && (
                <OrderOverlay 
                    product={selectedProduct} 
                    onClose={() => setShowOrderOverlay(false)} 
                />
            )}
             
            <CartSidebar />
            <News />
            <FashionContactUi />
        </>
    );
}