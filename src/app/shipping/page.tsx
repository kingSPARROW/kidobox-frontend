'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="shipping">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Shipping &amp; Delivery</span>
        </nav>

        <div className="help-layout">
          <aside className="help-nav">
            <h3>Customer Care</h3>
            <Link href="/faq">FAQs &amp; Help <span>→</span></Link>
            <Link href="/shipping" className="current">Shipping &amp; Delivery <span>→</span></Link>
            <Link href="/returns">Returns &amp; Refunds <span>→</span></Link>
            <Link href="/tracking">Track Order <span>→</span></Link>
            <Link href="/contact">Contact Us <span>→</span></Link>
          </aside>

          <section className="help-content prose">
            <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
              <span className="mini-eyebrow">FAST &amp; GENTLE TRANSIT</span>
              <h1>Shipping &amp; Delivery</h1>
              <p>How we safely pack and deliver your little essentials across India.</p>
            </div>

            <div className="info-highlight">
              <span>🚚</span>
              <div>
                <h3>Free Express Delivery above ₹999</h3>
                <p>Orders are dispatched with verified contactless courier partners within 24 hours.</p>
              </div>
            </div>

            <section>
              <h2>Shipping Timelines</h2>
              <p>
                <b>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</b> Delivered
                in 2–3 business days.
                <br />
                <b>Rest of India:</b> Delivered in 3–5 business days.
              </p>
            </section>

            <section>
              <h2>Order Dispatch &amp; Tracking</h2>
              <p>
                Once your order is picked and packed in our dust-free facility, you will receive an SMS and
                email notification containing your live AWB tracking number.
              </p>
            </section>

            <section>
              <h2>Packaging Care</h2>
              <p>
                All baby clothing and sensitive feeding accessories are heat-sealed in tamper-proof,
                recyclable packaging to guarantee utmost hygiene.
              </p>
            </section>
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
