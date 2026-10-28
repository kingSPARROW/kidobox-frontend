'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { articles } from '@/lib/kidobox-data';

export default function GuidesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredArticles = articles.filter(
    (a) => selectedFilter === 'all' || a.category === selectedFilter
  );

  const featured = articles[0];

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="guides">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Parenting Tips &amp; Guides</span>
        </nav>

        {/* Featured Journal Article */}
        {featured && (
          <section className="journal-feature">
            <img src={`/assets/hd/${featured.image}.webp`} alt={featured.title} />
            <div>
              <span className="mini-eyebrow">{featured.category}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link className="button pink" href={`/guides/${featured.slug}`}>
                Read Article (5 min) →
              </Link>
            </div>
          </section>
        )}

        {/* Category Filter Tabs */}
        <div className="journal-tabs">
          {[
            ['all', 'All Articles'],
            ['NEWBORN CARE', 'Newborn Care'],
            ['FEEDING', 'Feeding'],
            ['PLAY & DEVELOPMENT', 'Play & Development'],
            ['NURSERY', 'Nursery'],
            ['EVERYDAY PARENTING', 'Everyday Parenting'],
            ['GIFTING', 'Gifting Guide'],
          ].map(([filterKey, label]) => (
            <button
              key={filterKey}
              className={selectedFilter === filterKey ? 'active' : ''}
              onClick={() => setSelectedFilter(filterKey)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="blog-grid journal-grid">
          {filteredArticles.map((a) => (
            <Link className="blog-card" href={`/guides/${a.slug}`} key={a.slug}>
              <div className="blog-photo">
                <img
                  src={`/assets/hd/${a.image}.webp`}
                  alt={a.title}
                  width={1000}
                  height={650}
                  loading="lazy"
                />
                <span>{a.category}</span>
              </div>
              <div className="blog-body">
                <h3>{a.title}</h3>
                <p>◷ {a.minutes} min read &nbsp; · &nbsp; KIDOBOX Journal</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
