'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi } from './api';

export interface CustomerProfile {
  _id?: string;
  id?: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  total_orders?: number;
  total_spent?: number;
}

export interface PendingCartAction {
  item: {
    variant_id: string;
    product_id: string;
    title: string;
    variant_title?: string;
    sku?: string;
    price: number;
    image_url?: string;
  };
  quantity: number;
}

interface CustomerAuthContextType {
  customer: CustomerProfile | null;
  token: string | null;
  isLoading: boolean;
  isCustomerLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalReason: 'cart' | 'checkout' | 'general';
  pendingCartItem: PendingCartAction | null;
  openAuthModal: (options?: { reason?: 'cart' | 'checkout' | 'general'; pendingItem?: PendingCartAction }) => void;
  closeAuthModal: () => void;
  clearPendingCartItem: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<'cart' | 'checkout' | 'general'>('general');
  const [pendingCartItem, setPendingCartItem] = useState<PendingCartAction | null>(null);

  // Check stored customer token on mount
  useEffect(() => {
    const initCustomer = async () => {
      try {
        const savedToken = localStorage.getItem('homzy_customer_token');
        const savedProfile = localStorage.getItem('homzy_customer_profile');

        if (savedToken && savedProfile) {
          setToken(savedToken);
          setCustomer(JSON.parse(savedProfile));
        }
      } catch (err) {
        console.warn('Customer session parse error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initCustomer();
  }, []);

  const openAuthModal = (options?: {
    reason?: 'cart' | 'checkout' | 'general';
    pendingItem?: PendingCartAction;
  }) => {
    setAuthModalReason(options?.reason || 'general');
    if (options?.pendingItem) {
      setPendingCartItem(options.pendingItem);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const clearPendingCartItem = () => {
    setPendingCartItem(null);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetchApi('/storefront/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.token && res.customer) {
        setToken(res.token);
        setCustomer(res.customer);
        localStorage.setItem('homzy_customer_token', res.token);
        localStorage.setItem('homzy_customer_profile', JSON.stringify(res.customer));
        return { success: true };
      }
      return { success: false, message: res.message || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed. Please check credentials.' };
    }
  };

  const register = async (data: {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    try {
      const res = await fetchApi('/storefront/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success && res.token && res.customer) {
        setToken(res.token);
        setCustomer(res.customer);
        localStorage.setItem('homzy_customer_token', res.token);
        localStorage.setItem('homzy_customer_profile', JSON.stringify(res.customer));
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('homzy_customer_token');
    localStorage.removeItem('homzy_customer_profile');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        isLoading,
        isCustomerLoggedIn: !!customer,
        isAuthModalOpen,
        authModalReason,
        pendingCartItem,
        openAuthModal,
        closeAuthModal,
        clearPendingCartItem,
        login,
        register,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
