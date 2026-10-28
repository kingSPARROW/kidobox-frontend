'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function PrivacyPolicyPage() {
  const [clearedMsg, setClearedMsg] = useState<string | null>(null);

  const handleClear = (all = false) => {
    localStorage.removeItem('kidobox-wishlist');
    localStorage.removeItem('kidobox-coupon');
    if (all) {
      localStorage.removeItem('kidobox-orders');
      localStorage.removeItem('kidobox-profile');
      localStorage.removeItem('kidobox-address');
      localStorage.removeItem('kidobox-last-order');
      setClearedMsg('All local KIDOBOX data has been cleared from this browser.');
    } else {
      setClearedMsg('Your wishlist and coupon preferences have been cleared.');
    }
    setTimeout(() => setClearedMsg(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="privacy">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Privacy Policy</span>
        </nav>

        <article className="prose" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
            <span className="mini-eyebrow">SAFE &amp; TRANSPARENT</span>
            <h1>Privacy Policy</h1>
            <p className="policy-date">Last updated: January 2026</p>
          </div>

          <p>
            At <b>KIDOBOX</b>, we understand that nothing is more sacred than the safety of your family.
            We treat your personal details with the utmost care and respect.
          </p>

          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you browse our storefront, add items to your bag, or complete a checkout, we collect
              the details necessary to fulfill your order: your name, shipping address, contact phone
              number, and email address.
            </p>
          </section>

          <section>
            <h2>2. Payment Information</h2>
            <p>
              All online card and UPI transactions are processed through RBI-authorized payment
              gateways (Razorpay / Cashfree) with 256-bit SSL bank-grade encryption. KIDOBOX does not
              store credit card or CVV details on our servers.
            </p>
          </section>

          <section>
            <h2>3. Local Storage &amp; Privacy Controls</h2>
            <p>
              Your shopping bag, wishlist, and recent demo order references are saved locally on your
              device using browser local storage for convenience. You can reset them anytime:
            </p>
            <div className="privacy-controls">
              <button
                type="button"
                className="button pink"
                onClick={() => handleClear(false)}
              >
                Clear Saved Wishlist
              </button>
              <button
                type="button"
                className="button"
                style={{ background: '#f0f4f8', color: '#122e50' }}
                onClick={() => handleClear(true)}
              >
                Clear All Local Stored Data
              </button>
            </div>
            {clearedMsg && <p className="form-feedback">{clearedMsg}</p>}
          </section>

          <section>
            <h2>4. Contact Us</h2>
            <p>
              If you have any questions regarding your data privacy, write to our Data Protection
              Officer at <a href="mailto:privacy@kidobox.com">privacy@kidobox.com</a>.
            </p>
          </section>
        </article>
      </main>

      <StoreFooter />
    </div>
  );
}
