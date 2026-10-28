'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="terms">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Terms &amp; Conditions</span>
        </nav>

        <article className="prose" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
            <span className="mini-eyebrow">OUR COMMITMENT</span>
            <h1>Terms &amp; Conditions</h1>
            <p className="policy-date">Effective Date: January 2026</p>
          </div>

          <p>
            Welcome to <b>KIDOBOX</b> (“Little Needs. Big Smiles.”). By using our storefront, placing
            orders, or viewing our guides, you agree to the following terms and guidelines.
          </p>

          <section>
            <h2>1. Product Safety &amp; Age Guidance</h2>
            <p>
              All products listed on KIDOBOX include age recommendations and care labels. We advise
              parents and guardians to always supervise young children during playtime, mealtimes, and
              bath sessions.
            </p>
          </section>

          <section>
            <h2>2. Pricing &amp; GST Compliance</h2>
            <p>
              All listed product prices are inclusive of applicable Indian Goods and Services Tax (GST).
              Detailed tax invoices containing GST breakdown (CGST/SGST or IGST) are provided with every
              order.
            </p>
          </section>

          <section>
            <h2>3. Orders &amp; Fulfillment</h2>
            <p>
              We reserve the right to cancel orders due to stock discrepancy or courier serviceability.
              In such rare events, 100% of any collected amount is immediately refunded to the original
              source of payment.
            </p>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>
              The KIDOBOX mascot logo, baby design assets, styling, and parenting guides are protected
              under copyright laws.
            </p>
          </section>
        </article>
      </main>

      <StoreFooter />
    </div>
  );
}
