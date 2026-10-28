'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Leaf, Heart, ShieldCheck, Feather, CheckCircle2, Tag, Utensils, Sparkles, Award, Sun } from 'lucide-react';

interface Slide {
  id: number;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  image: string;
  alt: string;
  bgGradient: string;
  themeColor: string;
  decorationIcon?: React.ReactNode;
  promises: { icon: React.ReactNode; title: string; subtitle: string }[];
}

const slides: Slide[] = [
  {
    id: 1,
    eyebrow: 'A LITTLE LOVE, EVERY DAY',
    title: 'Little Needs.',
    highlight: 'Big Smiles.',
    decorationIcon: <Sun size={38} color="#ffbc00" />,
    description: 'Everything your little one needs to grow, play, and shine with safe, gentle care.',
    ctaText: 'Shop Essentials',
    ctaLink: '/shop',
    secondaryText: 'Newborn Care',
    secondaryLink: '/age-newborn',
    image: '/assets/hd/hero.webp',
    alt: 'Happy baby in soft pink hood with teddy bear',
    bgGradient: 'linear-gradient(135deg, #fff2f6 0%, #ffe9f2 50%, #fff7fa 100%)',
    themeColor: 'var(--pink)',
    promises: [
      { icon: <Leaf size={18} style={{ color: '#16a34a' }} />, title: 'Safe & Gentle', subtitle: 'Tested for delicate skin' },
      { icon: <Heart size={18} style={{ color: '#ff268b' }} fill="currentColor" />, title: 'Parent-Approved', subtitle: 'Loved by 20,000+ parents' },
      { icon: <ShieldCheck size={18} style={{ color: '#0284c7' }} />, title: 'Certified Safe', subtitle: 'Zero toxins & BPA free' },
    ],
  },
  {
    id: 2,
    eyebrow: '100% GOTS ORGANIC COTTON',
    title: 'Pure Cloud Softness,',
    highlight: 'Happy Baby.',
    decorationIcon: <Sparkles size={38} color="#20a886" />,
    description: 'Ultra-breathable onesies, rompers, and sleepsuits crafted for dreamy comfort and easy diaper changes.',
    ctaText: 'Shop Clothing',
    ctaLink: '/clothing',
    secondaryText: 'View Bestsellers',
    secondaryLink: '/bestsellers',
    image: '/assets/hd/clothing.webp',
    alt: 'Organic cotton baby clothing essentials',
    bgGradient: 'linear-gradient(135deg, #eef9f6 0%, #e1f5ef 50%, #f4fbf9 100%)',
    themeColor: '#20a886',
    promises: [
      { icon: <Feather size={18} style={{ color: '#20a886' }} />, title: 'Feather-Soft', subtitle: '100% combed cotton' },
      { icon: <CheckCircle2 size={18} style={{ color: '#059669' }} />, title: 'Nickel-Free Snaps', subtitle: 'Quick 2-way zippers' },
      { icon: <Tag size={18} style={{ color: '#0d9488' }} />, title: 'Tagless Design', subtitle: 'Zero scratchiness' },
    ],
  },
  {
    id: 3,
    eyebrow: 'DEVELOPMENTAL & BPA-FREE',
    title: 'Nourish & Play,',
    highlight: 'Every Single Day.',
    decorationIcon: <Sparkles size={38} color="#0284c7" />,
    description: 'Food-grade silicone tableware and Montessori toys engineered to stimulate learning and motor milestones.',
    ctaText: 'Shop Feeding & Toys',
    ctaLink: '/feeding',
    secondaryText: 'Bath & Care',
    secondaryLink: '/bath-care',
    image: '/assets/hd/feeding.webp',
    alt: 'Silicone suction bowls and toddler feeding sets',
    bgGradient: 'linear-gradient(135deg, #eff9ff 0%, #e2f4ff 50%, #f7fcff 100%)',
    themeColor: 'var(--blue)',
    promises: [
      { icon: <Utensils size={18} style={{ color: '#0284c7' }} />, title: 'Suction Base Tech', subtitle: 'Zero mealtime spills' },
      { icon: <Sparkles size={18} style={{ color: '#38bdf8' }} />, title: 'Dishwasher Safe', subtitle: 'Withstands -40°C to 220°C' },
      { icon: <Award size={18} style={{ color: '#0369a1' }} />, title: 'Baby-Led Weaning', subtitle: 'Pediatrician recommended' },
    ],
  },
];

export function HeroSlider() {
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
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, current]);

  const activeSlide = slides[current];

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
          <img
            key={`img-${activeSlide.id}`}
            className="hero-baby hero-slide-img"
            src={activeSlide.image}
            alt={activeSlide.alt}
          />
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
