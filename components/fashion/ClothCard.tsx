// components/fashion/ProductCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaShoppingCart, FaEye, FaHeart } from 'react-icons/fa';
import { toast } from 'sonner';
import type { Product } from '@/components/fashion/Products';
import OrderOverlay from '@/components/fashion/OrderOverlay';
import ProductDetailOverlay from '@/components/fashion/ProductDetailOverlay';
import { useCart } from '@/components/fashion/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [showOrderOverlay, setShowOrderOverlay] = useState(false);
  const [showDetailOverlay, setShowDetailOverlay] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.reviews || 0); // Using reviews as base likes
  
  const { addToCart } = useCart();

  // LocalStorage Like Logic
  useEffect(() => {
    const likedProducts = JSON.parse(localStorage.getItem('gc_wab_likes') || '{}');
    if (likedProducts[product.id]) {
      setIsLiked(true);
    }
  }, [product.id]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const likedProducts = JSON.parse(localStorage.getItem('gc_wab_likes') || '{}');
    
    if (isLiked) {
      delete likedProducts[product.id];
      setLikeCount(prev => prev - 1);
    } else {
      likedProducts[product.id] = true;
      setLikeCount(prev => prev + 1);
    }
    
    localStorage.setItem('gc_wab_likes', JSON.stringify(likedProducts));
    setIsLiked(!isLiked);
  };

  const handleQuickAdd = (size: string) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      quantity: 1,
      color: product.colors[selectedColorIndex].name,
      image: product.images[0]
    });
    toast.success(`${product.name} added to cart!`);
  };

  const displayedImage = hover && product.images[1] ? product.images[1] : product.images[0];

  return (
    <>
      <div 
        className="group bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
           <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-sm">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColorIndex(index)}
                className={`w-3 h-3 rounded-full border border-white transition-transform ${selectedColorIndex === index ? 'scale-125 ring-1 ring-emerald-500' : 'hover:scale-110'}`}
                style={{ backgroundColor: color.code }}
              />
            ))}
          </div>
        </div>

        {/* Like Button */}
        <button 
          onClick={toggleLike}
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-sm transition-all active:scale-90"
        >
          <FaHeart className={`transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-300'}`} size={18} />
        </button>

        {/* Image Area */}
        <div className="relative h-42 md:h-80 overflow-hidden cursor-pointer" onClick={() => setShowDetailOverlay(true)}>
          <img
            src={displayedImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Quick Size Picker Overlay (Shows on Hover) */}
          <div className={`absolute inset-0 bg-emerald-900/10 flex items-center justify-center transition-opacity duration-300 ${hover ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
              {product.sizes.slice(0, 3).map((sizeObj, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); handleQuickAdd(sizeObj.size); }}
                  disabled={!sizeObj.inStock}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
                    sizeObj.inStock ? 'bg-white text-emerald-900 hover:bg-emerald-600 hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative py-2 px-1.5 md:p-3 space-y-2">
            <div className="flex flex-col justify-between items-start">
                <div>
                <h3 className="text-[11px] md:text-xs font-black text-gray-900 tracking-tight uppercase group-hover:text-emerald-700 transition-colors">
                    {product.name}
                </h3>
                {/* Like Counter Replacement for Stars */}
                <div className="flex items-center gap-1.5 my-1">
                    <FaHeart className="text-red-400" size={12} />
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                    {likeCount.toLocaleString()} Likes
                    </span>
                </div>
                </div>
                <span className="text-sm font-black text-emerald-700">${product.price}</span>
            </div>

            <div className="flex items-center justify-between">
                {/* Emerald Add to Cart - Now Slim & Always Visible */}
                <button
                onClick={(e) => { e.stopPropagation(); setShowOrderOverlay(true); }}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-md shadow-emerald-900/10"
                >
                <FaShoppingCart size={14} />
                Add to Cart
                </button>
                
                <button
                onClick={() => setShowDetailOverlay(true)}
                className="absolute top-8 right-2 md:static ml-2 bg-gray-50 text-gray-400 p-1.5 md:p-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-100"
                >
                <FaEye size={16} />
                </button>
            </div>
        </div>
      </div>

      {showOrderOverlay && (
        <OrderOverlay
          product={product}
          onClose={() => setShowOrderOverlay(false)}
          initialColorIndex={selectedColorIndex}
        />
      )}

      {showDetailOverlay && (
        <ProductDetailOverlay
          product={product}
          onClose={() => setShowDetailOverlay(false)}
          onAddToCart={() => setShowOrderOverlay(true)}
        />
      )}
    </>
  );
}