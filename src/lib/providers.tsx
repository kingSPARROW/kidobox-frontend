'use client';

import React, { useState } from 'react';
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
