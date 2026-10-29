'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const hasMultiple = slides.length > 1;

  const [current, setCurrent] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartXRef = useRef(0);
  const hasTouchMovedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (!hasMultiple || isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
    setPrevIndex(current);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [hasMultiple, isAnimating, current, slides.length]);

  const prevSlide = useCallback(() => {
    if (!hasMultiple || isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
    setPrevIndex(current);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [hasMultiple, isAnimating, current, slides.length]);

  const goToSlide = (idx: number) => {
    if (!hasMultiple || idx === current || isAnimating) return;
    setIsAnimating(true);
    setDirection(idx > current ? 'next' : 'prev');
    setPrevIndex(current);
    setCurrent(idx);
  };

  // Reset animation lock after slide transition finishes
  useEffect(() => {
    if (!isAnimating) return;
    const t = setTimeout(() => {
      setIsAnimating(false);
      setPrevIndex(null);
    }, 700);
    return () => clearTimeout(t);
  }, [isAnimating]);

  // Autoplay every 5.5s, paused on hover
  useEffect(() => {
    if (isPaused || !hasMultiple || isAnimating) return;
    timerRef.current = setInterval(nextSlide, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, hasMultiple, isAnimating, nextSlide]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultiple || isAnimating) return;
    setIsPaused(true);
    hasTouchMovedRef.current = false;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 10) {
      hasTouchMovedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (!hasTouchMovedRef.current || isAnimating) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 50) {
      prevSlide();
    } else if (diff < -50) {
      nextSlide();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasTouchMovedRef.current || isAnimating) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      className="hero hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Carousel"
    >
      <div className="hero-slider-container">
        <div
          className="hero-slide-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, i) => {
            const isActive = i === current;
            const isPrev = i === prevIndex;

            // Only render the active slide and the currently transitioning slide
            if (!isActive && !isPrev) return null;

            let animationClass = 'slide-active';
            if (isAnimating) {
              if (isActive) {
                animationClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
              } else if (isPrev) {
                animationClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
              }
            }

            return (
              <div
                key={slide.id || i}
                className={`hero-slide-item ${animationClass}`}
                aria-hidden={!isActive}
              >
                <Link
                  href={slide.link || '/shop'}
                  className="hero-banner-link"
                  aria-label={slide.alt}
                  onClick={handleLinkClick}
                >
                  <picture>
                    <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                    <img
                      className="hero-banner-image"
                      src={slide.image}
                      alt={slide.alt}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>
                </Link>
              </div>
            );
          })}

          {/* Carousel Arrow Controls */}
          {hasMultiple && (
            <>
              <button
                type="button"
                className="slider-arrow slider-arrow-prev"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevSlide();
                }}
                disabled={isAnimating}
                aria-label="Previous banner"
              >
                ‹
              </button>
              <button
                type="button"
                className="slider-arrow slider-arrow-next"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextSlide();
                }}
                disabled={isAnimating}
                aria-label="Next banner"
              >
                ›
              </button>

              {/* Animated Pagination Dots */}
              <div className="hero-slider-dots" role="tablist" aria-label="Slides">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    className={`hero-dot ${i === current ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToSlide(i);
                    }}
                    aria-selected={i === current}
                    aria-label={`Go to slide ${i + 1}`}
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
