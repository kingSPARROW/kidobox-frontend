'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { MessageSquareHeart } from 'lucide-react';

export default function ReviewsPage() {
  const reviews = [
    { name: 'Ayesha Khan', img: 'avatar1', comment: 'Amazing quality products and such lovely details. My little one loves the soft bunny!' },
    { name: 'Rahul Mehta', img: 'avatar2', comment: 'A thoughtful collection of everyday essentials. The feeding set is a favorite in our home.' },
    { name: 'Neha Sharma', img: 'avatar3', comment: 'Beautiful little things for our family. I love the soft colors and playful collection.' },
    { name: 'Pooja Iyer', img: 'avatar1', comment: 'The organic romper is buttery soft. Washed it multiple times and it stays good as new.' },
    { name: 'Vikram Joshi', img: 'avatar2', comment: 'Delivered in 2 days in Mumbai. The packaging was lovely and diaper wipes are super gentle.' },
    { name: 'Simran Kaur', img: 'avatar3', comment: 'KIDOBOX made my newborn checklist so much less overwhelming. Truly parent-approved!' },
  ];

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
            4.8<span>/5</span>
          </strong>
          <div>
            <div className="stars">★★★★★</div>
            <p>Based on 500+ verified parent reviews</p>
          </div>
          <span className="rating-heart">♥</span>
        </div>

        <div className="review-grid all-reviews">
          {reviews.map((r, i) => (
            <article className="review" key={i}>
              <img src={`/assets/hd/${r.img}.webp`} width={96} height={96} alt={r.name} />
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
