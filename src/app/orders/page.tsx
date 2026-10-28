'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { money } from '@/lib/kidobox-data';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidobox-orders');
      if (raw) setOrders(JSON.parse(raw));
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="orders">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/account">Account</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Order History</span>
        </nav>

        <div className="help-layout">
          <aside className="help-nav">
            <div className="account-avatar">🧸</div>
            <h3>Family Account</h3>
            <Link href="/account">Family Profile <span>→</span></Link>
            <Link href="/orders" className="current">Order History <span>→</span></Link>
            <Link href="/addresses">Address Book <span>→</span></Link>
            <Link href="/wishlist">Saved Wishlist <span>→</span></Link>
            <Link href="/faq">Help &amp; FAQs <span>→</span></Link>
          </aside>

          <section className="help-content">
            <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
              <span className="mini-eyebrow">YOUR LITTLE PURCHASES</span>
              <h1>Order History</h1>
              <p>Review orders placed and track deliveries.</p>
            </div>

            {orders.length === 0 ? (
              <div className="page-empty">
                <span>🎁</span>
                <h2>Your story is just beginning</h2>
                <p>Your orders will appear here once you try our store.</p>
                <Link className="button pink" href="/shop">
                  Explore Little Essentials →
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <article className="order-history-card" key={o.id}>
                  <div className="order-history-top">
                    <div>
                      <b>{o.id}</b>
                      <p>{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <span className="order-status">{o.status || 'Order confirmed'}</span>
                  </div>

                  <div className="order-history-body">
                    <div className="summary-products">
                      {(o.items || []).map((it: any) => (
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

                    <div className="order-history-footer">
                      <span>Total {money(o.totals?.total || 0)}</span>
                      <Link className="text-link" href={`/tracking?order=${encodeURIComponent(o.id)}`}>
                        View Tracking →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
