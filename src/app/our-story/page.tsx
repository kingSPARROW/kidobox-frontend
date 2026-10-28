'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function OurStoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="story">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Our Little Story</span>
        </nav>

        <section className="story-banner">
          <img src="/assets/hd/newborn.webp" alt="Peaceful newborn" />
          <div>
            <span className="mini-eyebrow">BORN OUT OF LOVE</span>
            <h2>Created for the tiny beginnings that change our world forever.</h2>
          </div>
        </section>

        <div className="story-prose">
          <p>
            When we first became parents, we noticed how overwhelming shopping for a baby can be. Countless
            options, conflicting advice, and nursery products made with harsh synthetic dyes or complicated
            gadgets.
          </p>
          <p>
            We founded <b>KIDOBOX</b> with a single guiding promise: <i>Less noise, more comfort.</i>
          </p>
          <h2>Safe materials, gentle colors, honest care</h2>
          <p>
            From organic breathable cotton bodysuits to hypoallergenic wipes and food-grade silicone
            feeding sets, everything on KIDOBOX is something we trust and cherish for our own little ones.
          </p>
          <div style={{ textAlign: 'center', marginTop: '35px' }}>
            <Link className="button pink" href="/shop">
              Shop Little Essentials →
            </Link>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
