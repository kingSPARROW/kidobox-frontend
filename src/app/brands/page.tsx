'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { brands, products } from '@/lib/kidobox-data';

export default function BrandsDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="brands">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Big Names for Little Needs</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">LITTLE NEEDS. BIG SMILES.</span>
          <h1>🛍️ Big Names for Little Needs</h1>
          <p>Explore the trusted baby care brands featured in our collection.</p>
        </div>

        <div className="brand-directory">
          {brands.map((brandName, idx) => {
            const count = products.filter(
              (p) => p.brand.toLowerCase() === brandName.toLowerCase()
            ).length;
            return (
              <Link
                className="brand-card"
                href={`/shop?brand=${encodeURIComponent(brandName)}`}
                key={brandName}
              >
                <span className={`brand-logo brand-${idx}`}>{brandName}</span>
                <p>{count || 1} little favorites</p>
                <span>Explore Brand →</span>
              </Link>
            );
          })}
        </div>

        <p className="editorial-note">
          Brand names identify curated baby collections. All product selections are certified skin-friendly and baby-safe.
        </p>
      </main>

      <StoreFooter />
    </div>
  );
}
