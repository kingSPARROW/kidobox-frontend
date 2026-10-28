'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { categories } from '@/lib/kidobox-data';
import { Sparkles } from 'lucide-react';

export default function CategoriesDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="categories">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Shop by Category</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">LITTLE NEEDS. BIG SMILES.</span>
          <h1>
            <span className="section-icon-wrap"><Sparkles size={26} /></span> A Little Something for Every Moment
          </h1>
          <p>Find just what your little one needs, from sleepy mornings to playful afternoons.</p>
        </div>

        <div className="category-directory">
          {categories.map((c) => (
            <Link className={`directory-card ${c.color}`} href={`/${c.slug}`} key={c.slug}>
              <img
                src={`/assets/hd/${c.image}.webp`}
                alt={c.name}
                width={800}
                height={800}
                loading="lazy"
              />
              <div>
                <h2>{c.name}</h2>
                <p>{c.description}</p>
                <span>Explore Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
