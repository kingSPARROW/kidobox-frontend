'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth-context';
import { CustomerAuthProvider } from './customer-auth-context';
import { CartProvider } from './cart-context';
import { CustomerAuthModal } from '@/components/customer-auth-modal';
import { ThemeProvider } from './theme-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
      },
    },
  }));

  useEffect(() => {
    const refresh = () => queryClient.invalidateQueries({ queryKey: ['storefront'] });
    window.addEventListener('storefront-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('storefront-updated', refresh); window.removeEventListener('storage', refresh); };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CustomerAuthProvider>
            <CartProvider>
              {children}
              <CustomerAuthModal />
            </CartProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
