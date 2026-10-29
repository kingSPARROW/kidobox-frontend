'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useStorefront, mediaUrl } from '@/lib/storefront';
import { Baby } from 'lucide-react';

export default function AgesDirectoryPage() {
  const { ages, content } = useStorefront();
  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="ages">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Shop by Age</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">EVERY LITTLE STAGE</span>
          <h1>
            <span className="section-icon-wrap"><Baby size={26} /></span> Thoughtful Favorites for Every Chapter
          </h1>
          <p>Find the right essentials for your little one’s age and development.</p>
        </div>

        <div className="category-directory age-directory">
          {ages.map((a) => (
            <Link className={`directory-card ${a.color}`} href={`/shop?age=${encodeURIComponent(a.age)}`} key={a.slug}>
              <img
                src={mediaUrl(a.image)}
                alt={a.title}
                width={800}
                height={800}
                loading="lazy"
              />
              <div>
                <h2>{a.title}</h2>
                <p>{a.description}</p>
                <span>Shop for {a.title} →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
