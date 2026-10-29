'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareHeart } from 'lucide-react';

import { useStorefront, mediaUrl } from '@/lib/storefront';

export function ReviewsSlider() {
  const { testimonials } = useStorefront();
  const reviewsData = testimonials.map(t => ({ id: t.id, name: t.author_name, role: t.location, avatar: mediaUrl(t.avatar_url), rating: t.rating, comment: t.content, verified: t.is_verified, date: t.is_verified ? 'Verified Buyer' : '' }));
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  useEffect(() => {
    if (reviewsData.length < 2) return;
    const timer = setInterval(nextReview, 6000);
    return () => clearInterval(timer);
  }, [reviewsData.length]);

  return (
    <section className="reviews-section">
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
            onClick={prevReview}
            aria-label="Previous review"
          >
            ‹
          </button>
          <button
            type="button"
            className="slider-nav-btn"
            onClick={nextReview}
            aria-label="Next review"
          >
            ›
          </button>
        </div>
      </div>

      <div className="reviews-carousel-track">
        {reviewsData.map((item, idx) => {
          const isActive = idx === currentIndex % reviewsData.length;
          return (
            <div
              key={item.id}
              className={`review-card-slide ${isActive ? 'active' : ''}`}
              style={{
                display: isActive ? 'flex' : 'none',
              }}
            >
              <div className="review-quote-mark">“</div>
              <div className="review-avatar-wrap">
                <img src={item.avatar} alt={item.name} className="review-avatar-img" />
                {item.verified && <span className="review-verified-badge" title="Verified Customer">
                  ✓
                </span>}
              </div>
              <div className="review-content-wrap">
                <div className="review-stars-row">
                  <span className="stars">{'★'.repeat(item.rating)}</span>
                  <span className="review-date">{item.date}</span>
                </div>
                <p className="review-text">"{item.comment}"</p>
                <div className="review-author-row">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Carousel Indicators */}
      <div className="slider-dots" style={{ justifyContent: 'center', marginTop: '16px' }}>
        {reviewsData.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
