'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCustomerAuth } from './customer-auth-context';

export interface CartItem {
  variant_id: string;
  product_id: string;
  title: string;
  variant_title?: string;
  sku?: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('WELCOME10');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('homzy_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('homzy_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items, isLoaded]);

  const {
    isCustomerLoggedIn,
    openAuthModal,
    pendingCartItem,
    clearPendingCartItem,
  } = useCustomerAuth();

  // Auto-add pending item after successful customer authentication
  useEffect(() => {
    if (isCustomerLoggedIn && pendingCartItem) {
      const { item, quantity } = pendingCartItem;
      setItems((prev) => {
        const existing = prev.find((i) => i.variant_id === item.variant_id);
        if (existing) {
          return prev.map((i) =>
            i.variant_id === item.variant_id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
      clearPendingCartItem();
      setIsOpen(true);
    }
  }, [isCustomerLoggedIn, pendingCartItem]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    // COMPULSORY USER LOGIN CHECK
    if (!isCustomerLoggedIn) {
      openAuthModal({
        reason: 'cart',
        pendingItem: { item, quantity },
      });
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.variant_id === item.variant_id);
      if (existing) {
        return prev.map((i) =>
          i.variant_id === item.variant_id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variant_id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variant_id === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isOpen,
        setIsOpen,
        discountCode,
        setDiscountCode,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
