// components/CartSidebar.tsx
'use client';

import { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useCart } from '@/components/fashion/CartContext';
import Link from 'next/link';

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false); 
  const { items, updateQuantity, removeItem, clearCart, totalAmount, itemCount } = useCart();

  const handleClearCart = () => {
    clearCart();
    // FIXED: Key now matches the one in CartContext.tsx
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gc_wab_cart');
    }
    setShowClearConfirm(false);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-4 z-40 bg-emerald-800 text-white p-4 rounded-full shadow-xl hover:bg-emerald-600 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <div className="relative">
          <FaShoppingCart size={24} />
          {itemCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-800 text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-sm">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      {/* Cart Sidebar Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        <div className={`absolute inset-y-0 right-0 w-full md:w-[350px] bg-[#1a1a1a] shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-fashion-pink" />
              <h2 className="text-lg font-bold text-white tracking-tight">Your Cart</h2>
              <span className="bg-red-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-white">
                <FaShoppingCart size={40} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Empty Bag</p>
              </div>
            ) : (
              items.map((item, index) => {
                const itemKey = item.productId ? `${item.productId}-${item.size}-${item.color}` : `item-${index}`;
                return (
                  <div key={itemKey} className="flex gap-3 p-3 bg-emerald-900/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="w-16 h-20 bg-black rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-200 text-xs truncate pr-2">{item.name}</h4>
                          <button onClick={() => removeItem(item.productId, item.size, item.color)} className="text-gray-500 hover:text-red-400">
                            <FaTrash size={10} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-medium">{item.color} | {item.size}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm" style={{ color: 'goldenrod' }}>${item.price.toFixed(2)}</span>
                        <div className="flex items-center bg-black/30 rounded-lg border border-white/5">
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"><FaMinus size={7} /></button>
                          <span className="px-2 text-[10px] font-bold text-gray-300">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"><FaPlus size={7} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-[#1a1a1a] border-t border-white/5 shrink-0">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total</span>
                <span className="text-xl font-black text-white">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-emerald-700 md:bg-gray-800 text-white text-center py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest md:hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                >
                  Proceed to Checkout
                </Link>
                <button 
                  onClick={() => setShowClearConfirm(true)} 
                  className="font-semibold md:font-black w-full text-[9px] font-bold text-gray-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showClearConfirm && (
        <div className="mx-auto fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowClearConfirm(false)} />
          <div className="relative bg-[#242424] border border-white/10 w-full max-w-[320px] rounded-3xl p-8 shadow-2xl transform transition-all scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Empty Your Bag?</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-8">
                This will permanently remove all items from your selection.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={() => setShowClearConfirm(false)} className="py-3 px-4 rounded-xl bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button onClick={handleClearCart} className="py-3 px-4 rounded-xl bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 transition-colors shadow-lg">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}