// context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  color: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Use a boolean to track if we have loaded the initial data
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gc_wab_cart'); // Use consistent key
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoaded(true); // Mark as loaded so we don't overwrite with empty array
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gc_wab_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => 
          item.productId === newItem.productId && 
          item.size === newItem.size && 
          item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
        return updatedItems;
      } else {
        return [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const removeItem = (productId: number, size: string, color: string) => {
    setItems(currentItems => 
      currentItems.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, size, color);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('gc_wab_cart'); // Force clear the specific key
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      totalAmount,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}