'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function CareersPage() {
  const roles = [
    { title: 'Baby Care Product Specialist', dept: 'Merchandising & Quality', loc: 'Mumbai, India (Hybrid)' },
    { title: 'E-Commerce Growth Marketer', dept: 'Marketing & Community', loc: 'Remote / Bengaluru' },
    { title: 'Customer Delight Champion', dept: 'Parent Support', loc: 'Mumbai, India' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="careers">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Grow with KIDOBOX</span>
        </nav>

        <section className="prose" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
            <span className="mini-eyebrow">JOIN OUR FAMILY</span>
            <h1>Grow with KIDOBOX</h1>
            <p>Help us build the most thoughtful, loving e-commerce brand for modern parents.</p>
          </div>

          <p>
            We are a mission-driven team of designers, engineers, and parents reimagining how families
            discover, choose, and trust baby essentials.
          </p>

          <section style={{ marginTop: '35px' }}>
            <h2>Open Opportunities</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
              {roles.map((r, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #edf0f4',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 5px', fontSize: '16px' }}>{r.title}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#637389' }}>
                      {r.dept} · {r.loc}
                    </p>
                  </div>
                  <a
                    href={`mailto:careers@kidobox.com?subject=Application for ${encodeURIComponent(r.title)}`}
                    className="button pink"
                    style={{ fontSize: '11px', padding: '8px 16px' }}
                  >
                    Apply Now →
                  </a>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
