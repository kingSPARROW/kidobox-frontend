'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function MobileAppPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="app">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">KIDOBOX on the Go</span>
        </nav>

        <div className="app-coming-soon">
          <div className="phone-mockup">
            <div className="phone-camera" />
            <img src="/logo.png" alt="KIDOBOX App" style={{ maxHeight: '35px', width: 'auto', margin: '0 auto' }} />
            <span>
              Little needs.
              <br />
              <b>Big smiles.</b>
            </span>
            <span className="phone-heart">♡</span>
          </div>

          <div>
            <span className="mini-eyebrow">COMING SOON TO YOUR PHONE</span>
            <h2>Shop Anytime, Anywhere</h2>
            <p>
              The KIDOBOX app brings daily baby care deals, instant stock restock alerts, one-tap
              reordering for wipes and diapers, and order tracking right to your pocket.
            </p>

            <div className="app-buttons" style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="button" style={{ background: '#080d14', color: '#fff' }}>
                <small style={{ display: 'block', fontSize: '8px' }}>GET IT ON</small> Google Play
              </button>
              <button type="button" className="button" style={{ background: '#080d14', color: '#fff' }}>
                <small style={{ display: 'block', fontSize: '8px' }}>Download on the</small> App Store
              </button>
            </div>

            <Link className="text-link" href="/shop">
              ← Continue shopping on the web
            </Link>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
