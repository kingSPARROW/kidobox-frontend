'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { money } from '@/lib/kidobox-data';
import { Truck, Heart } from 'lucide-react';

function TrackingInner() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const [orderQuery, setOrderQuery] = useState(initialOrder);
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const lookupOrder = (id: string) => {
    if (!id.trim()) return;
    try {
      const raw = localStorage.getItem('kidobox-orders');
      const orders = raw ? JSON.parse(raw) : [];
      const match = orders.find(
        (o: any) => o.id?.toLowerCase() === id.trim().toLowerCase()
      );
      setSearchedOrder(match || null);
    } catch (e) {
      setSearchedOrder(null);
    }
    setHasSearched(true);
  };

  useEffect(() => {
    if (initialOrder) {
      lookupOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(orderQuery);
  };

  return (
    <div className="help-content">
      <div className="track-illustration" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Truck size={68} style={{ color: 'var(--blue)' }} />
        <Heart size={26} fill="currentColor" style={{ color: 'var(--pink)' }} />
      </div>

      <div className="page-intro" style={{ padding: '0 0 25px' }}>
        <span className="mini-eyebrow">WHERE IS YOUR LITTLE PACKAGE?</span>
        <h1>Track Your Order</h1>
        <p>Enter your KIDOBOX order reference number to view progress.</p>
      </div>

      <form className="embedded-form" onSubmit={handleSearch} style={{ maxWidth: '550px', margin: '0 auto 30px' }}>
        <label>
          Order reference number
          <input
            required
            placeholder="e.g. KDB-123456789"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
          />
        </label>
        <button type="submit" className="button pink full-width" style={{ marginTop: '10px' }}>
          Find Little Order →
        </button>
      </form>

      {hasSearched && (
        <div style={{ maxWidth: '550px', margin: '0 auto' }}>
          {searchedOrder ? (
            <div className="tracking-card">
              <span className="badge-demo">ORDER TRACKING</span>
              <h3>{searchedOrder.id}</h3>
              <p>
                Status: <b>{searchedOrder.status || 'Order confirmed'}</b> ·{' '}
                {money(searchedOrder.totals?.total || 0)}
              </p>
              <ol className="tracking-steps">
                <li>
                  Order placed &amp; confirmed
                  <small>Your little essentials order was successfully received.</small>
                </li>
                <li>
                  Packed with gentle care
                  <small>Our dispatch team is preparing your package for transit.</small>
                </li>
                <li>
                  Out for doorstep delivery
                  <small>Delivered safely to your address with verified OTP.</small>
                </li>
              </ol>
            </div>
          ) : (
            <div className="tracking-card" style={{ borderColor: '#ffd6e6', background: '#fff5f9' }}>
              <h3 style={{ color: '#BC0202' }}>We couldn’t find that order reference</h3>
              <p>
                Please double check the order number or visit{' '}
                <Link className="text-link" href="/account">
                  Your Account
                </Link>{' '}
                to view saved orders.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="tracking">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Track Your Order</span>
        </nav>

        <Suspense fallback={<div className="container py-20 text-center font-bold">Loading tracker...</div>}>
          <TrackingInner />
        </Suspense>
      </main>

      <StoreFooter />
    </div>
  );
}
