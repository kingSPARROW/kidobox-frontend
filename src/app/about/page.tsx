'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="about">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">About KIDOBOX</span>
        </nav>

        <section className="story-feature">
          <div>
            <span className="mini-eyebrow">OUR PHILOSOPHY</span>
            <h2>Little Needs. Big Smiles.</h2>
            <p>
              At KIDOBOX, we believe the sweetest moments of parenthood happen in the ordinary
              everyday routines—a morning stretch, a messy mealtime discovery, an afternoon bath, and a
              peaceful lullaby.
            </p>
            <p>
              We hand-select baby essentials made with gentle, certified skin-safe materials so you can
              spend less time worrying about what to buy and more time enjoying those tiny smiles.
            </p>
            <Link className="button pink" href="/shop">
              Explore Our Collection →
            </Link>
          </div>
          <img src="/assets/hd/hero.webp" alt="Happy baby and teddy bear" />
        </section>

        <section className="values-grid">
          <article>
            <span>🌿</span>
            <h2>Thoughtfully Chosen</h2>
            <p>Every single item is vetted for baby skin friendliness, safety, and durability.</p>
          </article>
          <article>
            <span>💗</span>
            <h2>Comfort First</h2>
            <p>Ultra-soft fabrics, smooth snap buttons, and ergonomic shapes made for little wriggles.</p>
          </article>
          <article>
            <span>🛡️</span>
            <h2>Parent Inspired</h2>
            <p>Designed around real family routines to make parenting a little calmer and simpler.</p>
          </article>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
