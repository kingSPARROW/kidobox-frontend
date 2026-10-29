'use client';

import { useStorefront, mediaUrl } from '@/lib/storefront';
import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { MessageSquareHeart } from 'lucide-react';

export default function ReviewsPage() {
  const { testimonials } = useStorefront();
  const reviews = testimonials.map(t => ({ name: t.author_name, img: t.avatar_url, comment: t.content, rating: t.rating }));
  const average = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '—';

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="reviews">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Little Love Notes</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">PARENT APPROVED</span>
          <h1>
            <span className="section-icon-wrap"><MessageSquareHeart size={26} /></span> Little Love Notes
          </h1>
          <p>Read what parents across India say about KIDOBOX baby essentials.</p>
        </div>

        <div className="rating-overview">
          <strong>
            {average}<span>/5</span>
          </strong>
          <div>
            <div className="stars">★★★★★</div>
            <p>Based on {reviews.length} customer reviews</p>
          </div>
          <span className="rating-heart">♥</span>
        </div>

        <div className="review-grid all-reviews">
          {reviews.map((r, i) => (
            <article className="review" key={i}>
              <img src={mediaUrl(r.img)} width={96} height={96} alt={r.name} />
              <div>
                <h3>{r.name}</h3>
                <div className="stars">★★★★★</div>
                <p>{r.comment}</p>
              </div>
              <span>♥</span>
            </article>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
