'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi } from './api';

export interface StoreAdminUser {
  id: string;
  name: string;
  email: string;
}

export interface Store {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  currency: string;
  branding?: any;
  settings?: any;
  contact?: any;
}

interface AuthContextType {
  user: StoreAdminUser | null;
  store: Store | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoreAdminUser | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      let storedToken = localStorage.getItem('homzy_merchant_token');
      if (!storedToken) {
        // Auto-authenticate as Store Owner for seamless single-store administration
        try {
          const loginRes = await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'merchant@homzy.com', password: 'password123' }),
          });
          if (loginRes.success && loginRes.token) {
            storedToken = String(loginRes.token);
            localStorage.setItem('homzy_merchant_token', storedToken);
          }
        } catch (err) {}
      }

      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      setToken(storedToken);

      const res = await fetchApi('/auth/me');
      if (res.success) {
        setUser(res.merchant);
        if (res.active_store) {
          setStore(res.active_store);
        }
      }
    } catch (e) {
      console.warn('Auth issue:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.token) {
      localStorage.setItem('homzy_merchant_token', res.token);
      if (res.store) {
        setStore(res.store);
      }
      setToken(res.token);
      setUser(res.merchant);
      return true;
    }
    return false;
  };

  const logout = () => {
    fetchApi('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('homzy_merchant_token');
    setUser(null);
    setStore(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        store,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
