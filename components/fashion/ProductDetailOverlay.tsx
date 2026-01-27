// components/fashion/ProductDetailOverlay.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaStar, FaHeart, FaShoppingCart, FaTruck, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { Product } from '@/components/fashion/Products';

interface ProductDetailOverlayProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

export default function ProductDetailOverlay({ product, onClose, onAddToCart }: ProductDetailOverlayProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Image Navigation for Arrows and Swipe
  const nextImage = () => setSelectedImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.targetTouches[0].clientX;
    if (touchStart - touchEnd > 70) { nextImage(); setTouchStart(null); }
    if (touchStart - touchEnd < -70) { prevImage(); setTouchStart(null); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white w-full h-full md:h-auto md:max-h-[95vh] md:max-w-5xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] bg-white/90 hover:bg-emerald-50 text-emerald-900 p-3 rounded-full shadow-lg transition-all"
        >
          <FaTimes size={20} />
        </button>

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col shrink-0">
          <div 
            className="relative h-[45vh] md:h-[500px] overflow-hidden cursor-zoom-in group"
            onClick={() => setIsLightboxOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            
            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex absolute inset-0 items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-2 bg-white/80 rounded-full hover:bg-white text-emerald-900 shadow-md"><FaChevronLeft /></button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-2 bg-white/80 rounded-full hover:bg-white text-emerald-900 shadow-md"><FaChevronRight /></button>
            </div>

            <button className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
              <FaHeart size={20} />
            </button>
          </div>

          {/* Thumbnails - ADDED BACK AS REQUESTED */}
          <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar bg-white">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === index ? 'border-emerald-600 scale-95' : 'border-transparent opacity-70'
                }`}
              >
                <img src={image} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col h-full bg-white relative">
          <div className="mb-auto pb-32 md:pb-0">
            {/* Header */}
            <div className="mb-4">
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">{product.category}</p>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className='flex justify-center items-center gap-12'>

                    <div className="flex items-center text-yellow-500"><FaStar />
                        <span className="ml-1 text-sm font-bold text-gray-700">{product.rating}</span>
                    </div>
                    <div className="hidden md:block mr-5 "><span className="text-3xl font-black text-emerald-900">${product.price.toFixed(2)}</span></div>

                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-md">In Stock</span>
              </div>
            </div>

            <div className="md:hidden mb-6"><span className="text-2xl font-black text-emerald-900">${product.price.toFixed(2)}</span></div>

            {/* Colors */}
            <div className="mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mb-3">Color: {product.colors[selectedColorIndex].name}</h4>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button key={index} onClick={() => setSelectedColorIndex(index)} className={`p-1 rounded-full border-2 transition-all ${selectedColorIndex === index ? 'border-emerald-600' : 'border-transparent'}`}>
                    <div className="w-5 h-5 md:w-8 md:h-8 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: color.code }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes - COMPACT DESIGN */}
            <div className="mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mb-3">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sizeObj, index) => (
                  <button
                    key={index}
                    disabled={!sizeObj.inStock}
                    className={`min-w-[42px] px-2 py-2 rounded-lg text-xs font-bold border transition-all ${
                      !sizeObj.inStock ? 'bg-gray-50 text-gray-300' : 'border-gray-200 hover:border-emerald-600 hover:text-emerald-600 text-gray-700'
                    }`}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mb-2">Description</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100 mb-10 md:mb-0">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase"><FaTruck className="text-emerald-600" /> Fast Delivery</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase"><FaShieldAlt className="text-emerald-600" /> Secure Payment</div>
            </div>
          </div>

          {/* Mobile Add Cart Button*/}
          <div className="fixed bottom-0 left-0 right-0  p-4 pb-1.5  z-50">
            <button
              onClick={onAddToCart}
              className="md:hidden w-full bg-emerald-700 text-white py-4 rounded-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 font-bold uppercase text-xs tracking-widest active:scale-95"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>

          {/* Desktop Add Cart Button */}
          <div className="hidden md:block pt-2">
            <button
              onClick={onAddToCart}
              className="w-full bg-emerald-700 text-white py-4 rounded-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 font-bold uppercase text-xs tracking-widest active:scale-95"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Gallery Overlay */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors z-[110]"><FaTimes size={32} /></button>
          <button onClick={prevImage} className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors"><FaChevronLeft size={48} /></button>
          <img src={product.images[selectedImage]} alt="Fullscreen" className="max-w-full max-h-screen object-contain" />
          <button onClick={nextImage} className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors"><FaChevronRight size={48} /></button>
          <div className="absolute bottom-10 text-white/60 font-bold tracking-widest text-sm uppercase">{selectedImage + 1} / {product.images.length}</div>
        </div>
      )}
    </div>
  );
}