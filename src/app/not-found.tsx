'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="404">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1 flex items-center justify-center py-20">
        <div className="page-empty" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Sparkles size={52} style={{ color: 'var(--pink)' }} />
          </div>
          <h2>A Little Lost?</h2>
          <p>
            The little page you are looking for might have moved or taken an afternoon nap. Let’s get
            you back to our cozy favorites.
          </p>
          <Link className="button pink" href="/">
            Back to Home Page →
          </Link>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
