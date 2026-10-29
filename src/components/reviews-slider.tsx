'use client';

import React, { useRef } from 'react';
import { MessageSquareHeart } from 'lucide-react';
import { useStorefront, mediaUrl } from '@/lib/storefront';

export function ReviewsSlider() {
  const { testimonials } = useStorefront();
  const trackRef = useRef<HTMLDivElement>(null);

  const fallbackTestimonials = [
    {
      id: 'fb-1',
      author_name: 'Priya Sharma',
      location: 'Mom of 4-month-old Aarav • Mumbai',
      avatar_url: '/assets/hd/bath.webp',
      rating: 5,
      content: 'The organic cotton onesies are unbelievably soft! After dozens of machine washes, they retain their shape, softness, and vibrant pastel colors. Zero rashes, happy baby!',
      is_verified: true,
    },
    {
      id: 'fb-2',
      author_name: 'Ananya Deshmukh',
      location: 'Mom of 14-month-old Myra • Bengaluru',
      avatar_url: '/assets/hd/feeding.webp',
      rating: 5,
      content: 'The silicone suction bowl actually stays stuck to her high chair tray! Cleanups take 10 seconds and the soft silicone spoon is perfect for self-feeding practice.',
      is_verified: true,
    },
    {
      id: 'fb-3',
      author_name: 'Rohit Khanna',
      location: 'Dad of 8-month-old Vihaan • Delhi NCR',
      avatar_url: '/assets/hd/toys.webp',
      rating: 5,
      content: 'The wooden stacking rings and sensory teething toys are top notch. No chemical smell, rounded edges everywhere, and lightning fast 2-day delivery!',
      is_verified: true,
    },
    {
      id: 'fb-4',
      author_name: 'Sneha Patel',
      location: 'Mom of 2-month-old twins • Ahmedabad',
      avatar_url: '/assets/hd/hero.webp',
      rating: 5,
      content: 'KIDOBOX has been our lifesaver for newborn essentials. The bamboo swaddles and gentle bath wash keep both babies calm and smiling all day long.',
      is_verified: true,
    },
  ];

  const sourceData = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const reviewsData = sourceData.map((t) => ({
    id: t.id,
    name: t.author_name || (t as any).name || 'Verified Parent',
    role: t.location || (t as any).role || 'Parent',
    avatar: mediaUrl(t.avatar_url),
    rating: t.rating || 5,
    comment: t.content,
    verified: t.is_verified ?? (t as any).verified ?? true,
  }));

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="reviews-section" aria-label="Customer Reviews">
      <div className="section-title">
        <div>
          <h2>
            <span className="section-icon-wrap"><MessageSquareHeart size={20} /></span> Loved by Parents Everywhere
          </h2>
          <p>Stories and smiles from our customers.</p>
        </div>
        <div className="slider-nav-arrows">
          <button
            type="button"
            className="slider-nav-btn"
            onClick={() => scroll('left')}
            aria-label="Previous review"
          >
            ‹
          </button>
          <button
            type="button"
            className="slider-nav-btn"
            onClick={() => scroll('right')}
            aria-label="Next review"
          >
            ›
          </button>
        </div>
      </div>

      <div className="reviews-carousel-track" ref={trackRef}>
        {reviewsData.map((item) => (
          <article key={item.id} className="review-card-slide">
            <div className="review-quote-mark">“</div>
            <div className="review-card-header">
              <div className="review-avatar-wrap">
                <img src={item.avatar} alt={item.name} className="review-avatar-img" />
                {item.verified && (
                  <span className="review-verified-badge" title="Verified Customer">
                    ✓
                  </span>
                )}
              </div>
              <div className="review-header-info">
                <div className="review-stars-row">
                  <span className="stars">{'★'.repeat(item.rating)}</span>
                  <span className="review-verified-label">Verified</span>
                </div>
                <strong className="review-author-name">{item.name}</strong>
                <span className="review-author-role">{item.role}</span>
              </div>
            </div>
            <p className="review-text">&ldquo;{item.comment}&rdquo;</p>
          </article>
        ))}
      </div>
    </section>
  );
}

