'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useStorefront, mediaUrl } from '@/lib/storefront';
import { SeoHead } from '@/components/seo-head';

export default function GuidesPage() {
  const { articles, pageSeo, globalSeo } = useStorefront();
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter to published articles
  const publishedArticles = articles.filter(
    (a) => a.status === 'published' || a.is_published !== false
  );

  const filteredArticles = publishedArticles.filter(
    (a) => selectedFilter === 'all' || a.category === selectedFilter
  );

  const featured = publishedArticles[0];
  const pageConfig = pageSeo?.['/guides'] || {};

  const seoTitle = pageConfig.title || 'Parenting Tips, Guides & Milestones | KIDOBOX Journal';
  const seoDescription = pageConfig.meta_description || 'Read gentle, pediatrician-backed advice on newborn sleep routines, baby-led weaning, play milestones, and baby care.';
  const headingH1 = pageConfig.heading_h1 || 'Parenting Tips & Guides';
  const canonicalUrl = pageConfig.canonical_url || 'https://kidobox.store/guides';
  const metaRobots = pageConfig.meta_robots || 'index, follow';

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="guides">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        metaRobots={metaRobots}
        ogImage={featured?.image ? mediaUrl(featured.image) : '/assets/hd/hero.webp'}
        ogType="website"
        schemaMarkup={
          pageConfig.schema_markup || {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": seoTitle,
            "description": seoDescription,
            "url": canonicalUrl,
            "publisher": {
              "@type": "Organization",
              "name": "KIDOBOX",
              "logo": {
                "@type": "ImageObject",
                "url": "https://kidobox.store/logo.png"
              }
            }
          }
        }
      />

      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{headingH1}</span>
        </nav>

        {/* Featured Journal Article */}
        {featured && (
          <section className="journal-feature">
            <img src={mediaUrl(featured.image)} alt={featured.image_alt || featured.title} />
            <div>
              <span className="mini-eyebrow">{featured.category}</span>
              <h2>{featured.heading_h1 || featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link className="button pink" href={`/guides/${featured.slug}`}>
                Read Article ({featured.minutes || 5} min) →
              </Link>
            </div>
          </section>
        )}

        {/* Category Filter Tabs */}
        <div className="journal-tabs">
          {[
            ['all', 'All Articles'],
            ['Milestones', 'Milestones'],
            ['Sleep & Comfort', 'Sleep & Comfort'],
            ['Gentle Care', 'Gentle Care'],
            ['Baby Nutrition', 'Baby Nutrition'],
            ['Nursery Prep', 'Nursery Prep'],
            ['Play & Learning', 'Play & Learning'],
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
                  src={mediaUrl(a.image)}
                  alt={a.image_alt || a.title}
                  width={1000}
                  height={650}
                  loading="lazy"
                />
                <span>{a.category}</span>
              </div>
              <div className="blog-body">
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '10px', color: 'var(--muted)' }}>
                  <span>◷ {a.minutes} min read</span>
                  <span style={{ color: 'var(--pink)', fontWeight: 800 }}>Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
