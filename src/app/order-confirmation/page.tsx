'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { money } from '@/lib/kidobox-data';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || '';
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidobox-orders');
      if (raw) {
        const orders = JSON.parse(raw);
        const match = orders.find((o: any) => o.id === orderId) || orders[0];
        setOrder(match);
      }
    } catch (e) {}
  }, [orderId]);

  if (!order) {
    return (
      <div className="page-empty">
        <span>🎁</span>
        <h2>Your next little adventure is waiting</h2>
        <p>Place a demo order to see your confirmation details here.</p>
        <Link className="button pink" href="/shop">
          Explore Little Essentials →
        </Link>
      </div>
    );
  }

  const itemCount = (order.items || []).reduce((n: number, x: any) => n + x.quantity, 0);

  return (
    <div className="confirmation-card">
      <div className="confirmation-icon">🎉</div>
      <span className="badge-demo">DEMONSTRATION ORDER</span>
      <h2>Thank you{order.firstName ? `, ${order.firstName}` : ''}!</h2>
      <p>
        Your little treasures have been saved in this browser.
        <br />
        No payment was collected and no real shipment will be created.
      </p>

      <div className="order-reference">{order.id}</div>

      <p>
        {itemCount} little treasures · <b>{money(order.totals?.total || 0)}</b>
      </p>

      <div className="summary-products" style={{ maxWidth: '480px', margin: '25px auto', textAlign: 'left' }}>
        {(order.items || []).map((it: any) => (
          <div className="summary-product" key={it.variant_id}>
            <img
              src={it.image_url || '/assets/hd/clothing.webp'}
              alt={it.title}
              width={55}
              height={55}
            />
            <div>
              <h3>{it.title}</h3>
              <p>
                {it.variant_title ? `${it.variant_title} · ` : ''}Qty {it.quantity}
              </p>
            </div>
            <b>{money(it.price * it.quantity)}</b>
          </div>
        ))}
      </div>

      <div className="confirmation-links">
        <Link className="button pink" href={`/tracking?order=${encodeURIComponent(order.id)}`}>
          Track Demo Order →
        </Link>
        <Link className="button blue" href="/shop">
          Keep Exploring →
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="confirmation">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">A Little Thank You</span>
        </nav>

        <Suspense fallback={<div className="container py-20 text-center font-bold">Loading confirmation...</div>}>
          <ConfirmationContent />
        </Suspense>
      </main>

      <StoreFooter />
    </div>
  );
}
