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
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoreAdminUser | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const storedToken =
        localStorage.getItem('kidobox_merchant_token') ||
        localStorage.getItem('homzy_merchant_token');

      if (!storedToken) {
        setUser(null);
        setStore(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      const res = await fetchApi('/auth/me');
      if (res?.success && res?.merchant) {
        setUser(res.merchant);
        if (res.active_store) {
          setStore(res.active_store);
        }
      } else {
        // Token invalid or expired - require fresh password authentication
        localStorage.removeItem('kidobox_merchant_token');
        localStorage.removeItem('homzy_merchant_token');
        setUser(null);
        setStore(null);
        setToken(null);
      }
    } catch (e) {
      console.warn('Auth issue:', e);
      localStorage.removeItem('kidobox_merchant_token');
      localStorage.removeItem('homzy_merchant_token');
      setUser(null);
      setStore(null);
      setToken(null);
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

    if (res?.success && res?.token) {
      localStorage.setItem('kidobox_merchant_token', res.token);
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

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetchApi('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (res?.success) {
        return { success: true, message: res.message || 'Password updated successfully.' };
      }
      return {
        success: false,
        message: res?.message || res?.errors?.current_password?.[0] || 'Failed to update password.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to update password.',
      };
    }
  };

  const logout = () => {
    fetchApi('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('kidobox_merchant_token');
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
        changePassword,
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
