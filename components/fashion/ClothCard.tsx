'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { db } from '@/lib/firebaseConfig';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { toast } from 'sonner';
import OrderOverlay from '@/components/fashion/OrderOverlay';
import ProductDetailOverlay from '@/components/fashion/ProductDetailOverlay';
import { useCart } from '@/components/fashion/CartContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  likes: number;
  stock: number;
  category: string;
  description?: string;
  tags?: string[];
  sizes: { size: string; inStock: boolean }[];
  colors: { name: string; code: string; imageUrl: string }[];
  reviews?: any[];
}

export default function ClothCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const [showOrderOverlay, setShowOrderOverlay] = useState(false);
  const [showDetailOverlay, setShowDetailOverlay] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(product.likes || 0);
  
  const getBaseReviews = () => Array.isArray(product.reviews) ? product.reviews.length : 0;
  const [reviewCount, setReviewCount] = useState(getBaseReviews());

  const syncData = useCallback(() => {
    const likedProducts = JSON.parse(localStorage.getItem('gc_fashion_likes') || '{}');
    setIsLiked(!!likedProducts[product.id]);
    const allStoredReviews = JSON.parse(localStorage.getItem('gc_product_reviews') || '{}');
    const storedReviews = allStoredReviews[product.id] || [];
    setReviewCount(getBaseReviews() + storedReviews.length);
  }, [product.id, product.reviews]);

  useEffect(() => {
    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, [syncData]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.id) return;
    const productRef = doc(db, 'fashion_products', product.id);
    const likedProducts = JSON.parse(localStorage.getItem('gc_fashion_likes') || '{}');
    try {
      if (isLiked) {
        delete likedProducts[product.id];
        await updateDoc(productRef, { likes: increment(-1) });
        setLikeCount((prev: number) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        likedProducts[product.id] = true;
        await updateDoc(productRef, { likes: increment(1) });
        setLikeCount((prev: number) => prev + 1);
        setIsLiked(true);
      }
      localStorage.setItem('gc_fashion_likes', JSON.stringify(likedProducts));
      window.dispatchEvent(new Event('storage'));
    } catch (err) { toast.error("Sync Error"); }
  };

  return (
    <>
      <div 
        className="group bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-4">
           <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-sm">
            {product.colors.map((color, index) => (
              <button key={index} onClick={(e) => { e.stopPropagation(); setSelectedColorIndex(index); }} className={`w-3 h-3 rounded-full border border-white ${selectedColorIndex === index ? 'scale-125 ring-1 ring-emerald-500' : ''}`} style={{ backgroundColor: color.code }} />
            ))}
          </div>
        </div>
        <button onClick={toggleLike} className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-sm active:scale-90 transition-transform">
          <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-300'} size={12} />
        </button>
        <div className="relative h-42 md:h-65 overflow-hidden cursor-pointer" onClick={() => setShowDetailOverlay(true)}>
          <img src={product.colors[selectedColorIndex].imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className={`hidden md:flex flex-col gap-2 absolute inset-0 bg-emerald-900/20 items-center justify-center transition-opacity duration-300 ${hover ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Available Sizes</p>
            <div className="flex flex-wrap justify-center gap-2 px-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
              {product.sizes.filter(s => s.inStock).slice(0, 4).map((sizeObj, index) => (
                <span key={index} className="px-3 py-1.5 bg-white text-emerald-900 rounded-lg text-xs font-bold shadow-lg">{sizeObj.size}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="relative py-2 px-1.5 md:p-3 space-y-2">
            <div className="flex flex-col justify-between items-start">
                <div>
                  <h3 className="text-[11px] md:text-xs font-black text-gray-900 tracking-tight uppercase group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                  <div className="flex gap-3 my-1">
                      <div className="flex items-center gap-1.5">
                        <FaHeart className="text-red-400" size={12} />
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">{likeCount.toLocaleString()} Likes</span>
                      </div>
                      <span onClick={() => setShowDetailOverlay(true)} className="text-[10px] font-bold text-pink-500 uppercase tracking-tighter cursor-pointer underline">Review: {reviewCount}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-700">₦{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between">
                <button onClick={(e) => { e.stopPropagation(); setShowOrderOverlay(true); }} className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-md">
                  <FaShoppingCart size={14} /> Add to Bag
                </button>
                <button onClick={() => setShowDetailOverlay(true)} className="absolute -top-8 right-2 md:static ml-2 text-pink-500 md:text-gray-400 p-1.5 md:py-2 md:px-4 md:rounded-xl md:border border-gray-100 uppercase text-[10px] font-bold">view</button>
            </div>
        </div>
      </div>

      {showOrderOverlay && <OrderOverlay product={product} onClose={() => setShowOrderOverlay(false)} initialColorIndex={selectedColorIndex} />}
      {showDetailOverlay && (
        <ProductDetailOverlay 
            product={product} 
            onClose={() => setShowDetailOverlay(false)} 
            onAddToCart={() => {
                setShowDetailOverlay(false); // Close details
                setShowOrderOverlay(true); // Open order
            }} 
        />
      )}
    </>
  );
}