'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useStorefront, mediaUrl } from '@/lib/storefront';
import { ArrowRight } from 'lucide-react';
import { LazyImage } from '@/components/lazy-image';

export default function CategoriesDirectoryPage() {
  const { categories, isLoading, isError, refetch } = useStorefront();
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="categories">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Shop by Category</span>
        </nav>

        <section className="store-page-hero category-page-hero" aria-labelledby="categories-title">
          <div className="store-page-hero-copy">
            <h1 id="categories-title">Shop by Category</h1>
            <p>Explore baby essentials for bath time, bedtime, and the moments in between.</p>
          </div>
          <img src="/assets/hd/categories-banner.webp" alt="" width="1600" height="800" />
        </section>

        {isLoading && <p role="status">Loading categories…</p>}
        {isError && !categories.length && (
          <p role="alert">Categories couldn’t load. <button type="button" className="text-link" onClick={() => refetch()}>Try again</button></p>
        )}
        {!isLoading && !isError && !categories.length && <p>No categories are available right now.</p>}
        <div className="category-collection-grid">
          {categories.map((c) => (
            <Link className="category-collection-card" href={`/collections/${c.slug}`} key={c.slug}>
              <LazyImage
                src={mediaUrl(c.image)}
                alt=""
                width={480}
                height={400}
                aspectRatio="6 / 5"
              />
              <div>
                <h2>{c.name}</h2>
                <ArrowRight size={18} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
