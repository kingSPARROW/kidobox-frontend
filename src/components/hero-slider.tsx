'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStorefront, mediaUrl, safeLink } from '@/lib/storefront';

export function HeroSlider() {
  const { banners } = useStorefront();
  const heroBanners = banners.filter((b) => b.position === 'hero');

  const slides =
    heroBanners.length > 0
      ? heroBanners.map((b) => ({
          id: b.id,
          image: mediaUrl(b.desktop_image_url),
          mobileImage: mediaUrl(b.mobile_image_url || b.desktop_image_url),
          alt: b.title || 'KIDOBOX Promotion',
          link: safeLink(b.cta_link),
        }))
      : [
          {
            id: 'default',
            image: mediaUrl('/assets/hd/hero.webp'),
            mobileImage: mediaUrl('/assets/hd/hero.webp'),
            alt: 'KIDOBOX Promotion',
            link: '/shop',
          },
        ];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused || slides.length < 2) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, current, slides.length]);

  const activeSlide = slides[current % slides.length];
  if (!activeSlide) return null;

  return (
    <section
      className="hero hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Carousel"
    >
      <div className="container hero-slider-container">
        <div className="hero-slide-wrapper">
          <Link
            href={activeSlide.link || '/shop'}
            className="hero-banner-link"
            aria-label={activeSlide.alt}
          >
            <picture>
              <source media="(max-width: 640px)" srcSet={activeSlide.mobileImage} />
              <img
                key={activeSlide.id}
                className="hero-banner-image"
                src={activeSlide.image}
                alt={activeSlide.alt}
                loading="eager"
              />
            </picture>
          </Link>

          {/* Carousel Arrow Controls */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="slider-arrow slider-arrow-prev"
                onClick={(e) => {
                  e.preventDefault();
                  prevSlide();
                }}
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                type="button"
                className="slider-arrow slider-arrow-next"
                onClick={(e) => {
                  e.preventDefault();
                  nextSlide();
                }}
                aria-label="Next slide"
              >
                ›
              </button>

              {/* Carousel Dots */}
              <div className="slider-dots" role="tablist" aria-label="Slider Pagination">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={idx === current}
                    aria-label={`Slide ${idx + 1}`}
                    className={`slider-dot ${idx === current ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrent(idx);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
