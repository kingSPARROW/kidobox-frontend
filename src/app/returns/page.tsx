'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function ReturnsPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [reason, setReason] = useState('size');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('Your return request has been recorded. Our team will arrange a doorstep pickup.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="returns">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Returns &amp; Refunds</span>
        </nav>

        <div className="help-layout">
          <aside className="help-nav">
            <h3>Customer Care</h3>
            <Link href="/faq">FAQs &amp; Help <span>→</span></Link>
            <Link href="/shipping">Shipping &amp; Delivery <span>→</span></Link>
            <Link href="/returns" className="current">Returns &amp; Refunds <span>→</span></Link>
            <Link href="/tracking">Track Order <span>→</span></Link>
            <Link href="/contact">Contact Us <span>→</span></Link>
          </aside>

          <section className="help-content prose">
            <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
              <span className="mini-eyebrow">HASSLE-FREE PROMISE</span>
              <h1>Returns &amp; Refunds</h1>
              <p>Because finding the right fit for your little one should be stress-free.</p>
            </div>

            <div className="info-highlight" style={{ background: '#fff0f6' }}>
              <span style={{ color: '#ff268b' }}>↻</span>
              <div>
                <h3>7-Day Easy Return Guarantee</h3>
                <p>Return any unused item with original tags attached within 7 days of delivery.</p>
              </div>
            </div>

            <section>
              <h2>How to Request a Return</h2>
              <form className="embedded-form" onSubmit={handleSubmit}>
                <label>
                  Order reference number
                  <input
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. KDB-123456789"
                  />
                </label>
                <label>
                  Reason for return
                  <select value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option value="size">Size didn’t fit comfortably</option>
                    <option value="preference">Preferred a different color / style</option>
                    <option value="damaged">Damaged or defective item received</option>
                    <option value="other">Other reason</option>
                  </select>
                </label>
                <button type="submit" className="button pink" style={{ marginTop: '15px' }}>
                  Submit Return Request →
                </button>
                {feedback && <p className="form-feedback">{feedback}</p>}
              </form>
            </section>
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
