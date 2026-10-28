'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { articles } from '@/lib/kidobox-data';
import { Heart } from 'lucide-react';

export default function GuideArticlePage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const article = articles.find((a) => a.slug === slug) || articles[0];

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="article">
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
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="article-byline">
              <span>◷ {article.minutes} min read</span>
              <span>·</span>
              <span>KIDOBOX Parenting Journal</span>
            </div>
          </header>

          <img
            className="article-cover"
            src={`/assets/hd/${article.image}.webp`}
            alt={article.title}
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
