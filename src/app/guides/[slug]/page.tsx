'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useStorefront, mediaUrl } from '@/lib/storefront';
import { SeoHead } from '@/components/seo-head';
import { Heart } from 'lucide-react';

export default function GuideArticlePage() {
  const { articles, isLoading, isError } = useStorefront();
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StoreNav />
        <main className="container inner-main flex-1 py-16 text-center">
          {isLoading ? (
            <p>Loading article…</p>
          ) : isError ? (
            <p>Unable to load article.</p>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-2">Article Not Found</h2>
              <p className="text-sm text-gray-500 mb-4">The requested parenting guide may have been updated or moved.</p>
              <Link href="/guides" className="button pink">
                Browse All Guides
              </Link>
            </div>
          )}
        </main>
        <StoreFooter />
      </div>
    );
  }

  const seoTitle = article.seo_title || article.title;
  const seoDescription = article.seo_description || article.excerpt;
  const canonicalUrl = article.canonical_url || `https://kidobox.store/guides/${article.slug}`;
  const metaRobots = article.meta_robots || (article.status === 'draft' ? 'noindex, nofollow' : 'index, follow');
  const mainH1 = article.heading_h1 || article.title;
  const authorName = article.author || 'KIDOBOX Parenting Journal';
  const publishedDate = article.published_at || '2026-01-01';

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": mainH1,
    "description": seoDescription,
    "image": article.image ? mediaUrl(article.image) : "https://kidobox.store/logo.png",
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "KIDOBOX",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kidobox.store/logo.png"
      }
    },
    "datePublished": publishedDate,
    "url": canonicalUrl
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="article">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        metaRobots={metaRobots}
        ogImage={article.image ? mediaUrl(article.image) : '/logo.png'}
        ogType="article"
        schemaMarkup={article.schema_markup || defaultSchema}
      />

      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/guides">Guides</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{article.title}</span>
        </nav>

        <article className="journal-article">
          <header className="article-heading">
            <span className="mini-eyebrow">{article.category}</span>
            <h1>{mainH1}</h1>
            <p>{article.excerpt}</p>
            <div className="article-byline">
              <span>◷ {article.minutes} min read</span>
              <span>·</span>
              <span>By {authorName}</span>
              {article.published_at && (
                <>
                  <span>·</span>
                  <span>{article.published_at}</span>
                </>
              )}
            </div>
          </header>

          <img
            className="article-cover"
            src={mediaUrl(article.image)}
            alt={article.image_alt || article.title}
            width={1200}
            height={600}
          />

          <div className="article-body">
            {article.sections.map(([heading, content], i) => (
              <section key={i}>
                <span className="article-number">0{i + 1}</span>
                <h2>{heading}</h2>
                <p>{content}</p>
              </section>
            ))}

            <div className="article-callout">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <Heart size={36} fill="currentColor" style={{ color: 'var(--pink)' }} />
              </div>
              <h3>Little Needs. Big Smiles.</h3>
              <p>Discover everyday essentials designed around real family life.</p>
              <Link className="button pink" href="/shop" style={{ marginTop: '18px' }}>
                Explore Baby Essentials →
              </Link>
            </div>
          </div>
        </article>
      </main>

      <StoreFooter />
    </div>
  );
}
