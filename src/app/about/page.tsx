'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { Leaf, Heart, ShieldCheck } from 'lucide-react';

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

        <section className="store-page-hero about-page-hero">
          <div className="store-page-hero-copy">
            <span className="mini-eyebrow">ABOUT KIDOBOX</span>
            <h1>Little Needs. Big Smiles.</h1>
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
          <img src="/assets/hd/about-family.webp" alt="A parent and toddler choosing soft towels together" width="1400" height="700" />
        </section>

        <section className="about-values" aria-label="Our values">
          <article>
            <div className="benefit-svg">
              <Leaf size={24} />
            </div>
            <h2>Thoughtfully Chosen</h2>
            <p>Every single item is vetted for baby skin friendliness, safety, and durability.</p>
          </article>
          <article>
            <div className="benefit-svg">
              <Heart size={24} fill="currentColor" />
            </div>
            <h2>Comfort First</h2>
            <p>Ultra-soft fabrics, smooth snap buttons, and ergonomic shapes made for little wriggles.</p>
          </article>
          <article>
            <div className="benefit-svg">
              <ShieldCheck size={24} />
            </div>
            <h2>Parent Inspired</h2>
            <p>Designed around real family routines to make parenting a little calmer and simpler.</p>
          </article>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
