'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareHeart } from 'lucide-react';

interface ReviewItem {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

const reviewsData: ReviewItem[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Mom of 4-month-old Aarav • Mumbai',
    avatar: '/assets/hd/bath.webp',
    rating: 5,
    comment:
      'The organic cotton onesies are unbelievably soft! After dozens of machine washes, they retain their shape, softness, and vibrant pastel colors. Zero rashes, happy baby!',
    verified: true,
    date: 'Verified Buyer • 2 days ago',
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    role: 'Mom of 14-month-old Myra • Bengaluru',
    avatar: '/assets/hd/feeding.webp',
    rating: 5,
    comment:
      'The silicone suction bowl actually stays stuck to her high chair tray! Cleanups take 10 seconds and the soft silicone spoon is perfect for self-feeding practice.',
    verified: true,
    date: 'Verified Buyer • 4 days ago',
  },
  {
    id: 3,
    name: 'Rohit Khanna',
    role: 'Dad of 8-month-old Vihaan • Delhi NCR',
    avatar: '/assets/hd/toys.webp',
    rating: 5,
    comment:
      'The wooden stacking rings and sensory teething toys are top notch. No chemical smell, rounded edges everywhere, and lightning fast 2-day delivery!',
    verified: true,
    date: 'Verified Buyer • 1 week ago',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    role: 'Mom of 2-month-old twins • Ahmedabad',
    avatar: '/assets/hd/hero.webp',
    rating: 5,
    comment:
      'KIDOBOX has been our lifesaver for newborn essentials. The bamboo swaddles and gentle bath wash keep both babies calm and smiling all day long.',
    verified: true,
    date: 'Verified Buyer • 2 weeks ago',
  },
];

export function ReviewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  useEffect(() => {
    const timer = setInterval(nextReview, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="reviews-section">
      <div className="section-title">
        <div>
          <h2>
            <span className="section-icon-wrap"><MessageSquareHeart size={20} /></span> Loved by Parents Everywhere
          </h2>
          <p>Real stories and smiles from over 20,000+ happy families across India.</p>
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
          const isActive = idx === currentIndex;
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
                <span className="review-verified-badge" title="Verified Customer">
                  ✓
                </span>
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
