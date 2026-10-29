'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Leaf, Heart, ShieldCheck, Feather, CheckCircle2, Tag, Utensils, Sparkles, Award, Sun } from 'lucide-react';

import { useStorefront, mediaUrl, safeLink } from '@/lib/storefront';

export function HeroSlider() {
  const { banners, content } = useStorefront();
  const slides = banners.filter(b => b.position === 'hero').map(b => ({
    id: b.id, eyebrow: b.title_tag, title: b.title, highlight: '', description: b.subtitle,
    ctaText: b.cta_text, ctaLink: safeLink(b.cta_link), secondaryText: b.secondary_cta_text,
    secondaryLink: safeLink(b.secondary_cta_link), image: mediaUrl(b.desktop_image_url), mobileImage: mediaUrl(b.mobile_image_url || b.desktop_image_url), alt: b.title,
    bgGradient: 'linear-gradient(135deg, #fff2f6 0%, #ffe9f2 50%, #fff7fa 100%)', themeColor: 'var(--pink)',
    decorationIcon: <Sun size={38} color="#ffbc00" />,
    promises: (content.hero_promises || []).map(p => ({ ...p, icon: <ShieldCheck size={18} /> }))
  }));
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
    timerRef.current = setInterval(nextSlide, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, current, slides.length]);

  const activeSlide = slides[current % slides.length];
  if (!activeSlide) return null;

  return (
    <section
      className="hero hero-slider"
      style={{ background: activeSlide.bgGradient, transition: 'background 0.6s ease' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Carousel"
    >
      <div className="container hero-inner hero-slider-inner">
        {/* Slide Content */}
        <div className="hero-copy hero-slide-copy" key={activeSlide.id}>
          <span className="eyebrow" style={{ display: 'inline-block', color: activeSlide.themeColor }}>
            {activeSlide.eyebrow}
          </span>
          <h1>
            {activeSlide.title}
            <br />
            <strong style={{ color: activeSlide.themeColor }}>{activeSlide.highlight}</strong>
            {activeSlide.decorationIcon && (
              <span className="sun float-anim" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: 8 }}>
                {activeSlide.decorationIcon}
              </span>
            )}
          </h1>
          <p>{activeSlide.description}</p>

          <div className="hero-cta-group">
            <Link className="button pink glow-on-hover" href={activeSlide.ctaLink} style={{ background: activeSlide.themeColor }}>
              {activeSlide.ctaText} <span>→</span>
            </Link>
            {activeSlide.secondaryText && activeSlide.secondaryLink && (
              <Link className="button secondary-btn" href={activeSlide.secondaryLink}>
                {activeSlide.secondaryText}
              </Link>
            )}
          </div>
        </div>

        {/* Baby / Product Visual */}
        <div className="hero-image-stage">
          <picture><source media="(max-width: 640px)" srcSet={activeSlide.mobileImage} /><img
            key={`img-${activeSlide.id}`}
            className="hero-baby hero-slide-img"
            src={activeSlide.image}
            alt={activeSlide.alt}
          /></picture>
        </div>

        {/* Trust Badges */}
        <div className="hero-promise">
          {activeSlide.promises.map((p, idx) => (
            <div key={idx} className="promise-badge">
              <span>{p.icon}</span>
              <p>
                <b>{p.title}</b>
                <small>{p.subtitle}</small>
              </p>
            </div>
          ))}
        </div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          className="slider-arrow slider-arrow-prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          className="slider-arrow slider-arrow-next"
          onClick={nextSlide}
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
              style={{
                backgroundColor: idx === current ? activeSlide.themeColor : 'rgba(18, 46, 80, 0.2)',
              }}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
