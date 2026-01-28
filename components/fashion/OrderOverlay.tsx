// components/fashion/OrderOverlay.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'sonner';
import type { Product } from '@/components/fashion/Products';
import { useCart } from '@/components/fashion/CartContext';

interface OrderOverlayProps {
  product: Product;
  onClose: () => void;
  initialColorIndex?: number;
}

export default function OrderOverlay({ product, onClose, initialColorIndex = 0 }: OrderOverlayProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex);
  const { addToCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      color: product.colors[selectedColorIndex].name,
      image: product.colors[selectedColorIndex].imageUrl 
    });

    toast.success(`${product.name} added to cart!`);
    onClose();
  };

  const totalAmount = product.price * quantity;

  // Formatting Helper for Naira
  const formatNaira = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-2">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-3xl md:rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-50 sticky top-0 bg-white z-10">
          <h2 className="text-sm font-black text-emerald-700 uppercase tracking-tighter">Add to Bag</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 transition-all">
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-4">
          {/* Mini Product Summary - Qty moved here and made dynamic */}
          <div className="flex gap-3 p-2 bg-emerald-50 rounded-xl mb-3">
            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-emerald-100">
              <img 
                src={product.colors[selectedColorIndex].imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-opacity duration-300" 
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">{product.name}</h3>
              <p className="font-black text-emerald-700 text-sm">₦{formatNaira(product.price)}</p>
              {/* DYNAMIC QTY: Subtracts current selection from stock */}
              <p className="text-[9px] font-semibold text-gray-400 font-bold uppercase tracking-tighter mt-0.5">
                Stock Qty: {Math.max(0, product.stock - quantity)}
              </p>
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-[9px] font-black uppercase text-emerald-700 mb-2 tracking-widest">Color: {product.colors[selectedColorIndex].name}</h4>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColorIndex(index)}
                  className={`p-0.5 rounded-full border transition-all ${
                    selectedColorIndex === index ? 'border-emerald-600' : 'border-transparent'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-black/5" style={{ backgroundColor: color.code }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-[9px] font-black uppercase text-emerald-700 mb-2 tracking-widest">Size</h4>
            <div className="grid grid-cols-5 gap-1.5">
              {product.sizes.map((sizeObj, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(sizeObj.size)}
                  className={`py-1.5 rounded-md text-[10px] font-black border transition-all ${
                    selectedSize === sizeObj.size
                      ? 'border-emerald-600 bg-emerald-700 text-white'
                      : 'border-emerald-100 bg-emerald-50 text-gray-600'
                  } ${!sizeObj.inStock ? 'opacity-20 cursor-not-allowed' : ''}`}
                  disabled={!sizeObj.inStock}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50 gap-4">
            <div className="flex items-center bg-emerald-50 rounded-lg p-0.5 border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className={`w-7 h-7 flex items-center justify-center transition-colors ${quantity > 1 ? 'text-gray-500' : 'text-gray-200'}`}
              >
                <FaMinus size={8} />
              </button>
              <span className="w-6 text-center font-bold text-xs">{quantity}</span>
              <button 
                onClick={() => {
                  if (quantity < product.stock) setQuantity(quantity + 1);
                  else toast.error("Maximum stock reached");
                }} 
                className="w-7 h-7 flex items-center justify-center text-gray-500"
              >
                <FaPlus size={8} />
              </button>
            </div>
            
            <div className="text-right">
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Total</p>
               <p className="text-lg font-black text-gray-900 leading-none">₦{formatNaira(totalAmount)}</p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-4 bg-emerald-700 text-white py-3 rounded-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            <FaShoppingCart size={12} />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}