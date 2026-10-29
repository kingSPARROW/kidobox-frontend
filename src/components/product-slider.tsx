'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Product, money } from '@/lib/kidobox-data';
import { mediaUrl } from '@/lib/storefront';
import { LazyImage } from '@/components/lazy-image';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  emoji?: string;
  viewAllLink?: string;
  viewAllText?: string;
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string, name: string) => void;
  onAddToCart: (p: Product) => void;
}

export function ProductSlider({
  title,
  subtitle,
  icon,
  emoji,
  viewAllLink = '/shop',
  viewAllText = 'View All',
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
}: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="product-slider-section">
      <div className="section-title">
        <div>
          <h2>
            {icon ? (
              <span className="section-icon-wrap">{icon}</span>
            ) : emoji ? (
              <span className="section-icon-wrap">{emoji}</span>
            ) : null}
            {title}
          </h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {viewAllLink && (
            <Link className="view-link" href={viewAllLink}>
              {viewAllText} →
            </Link>
          )}
          <div className="slider-nav-arrows">
            <button
              type="button"
              className="slider-nav-btn"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              type="button"
              className="slider-nav-btn"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="product-slider-track" ref={scrollContainerRef}>
        {products.map((p) => {
          const isSaved = wishlist.includes(p.id);
          const hasDiscount = p.old > p.price;
          const discountPercent = hasDiscount
            ? Math.round(((p.old - p.price) / p.old) * 100)
            : 0;

          return (
            <article className="product-card product-slider-card" key={p.id}>
              <div className="product-image-wrap">
                <button
                  type="button"
                  className={`wish ${isSaved ? 'saved heart-bounce' : ''}`}
                  aria-label={isSaved ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                  aria-pressed={isSaved}
                  onClick={() => onToggleWishlist(p.id, p.name)}
                >
                  <svg className="icon" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                {hasDiscount && (
                  <span className="product-tag discount-tag">
                    {discountPercent}% OFF
                  </span>
                )}
                {p.isNew && !hasDiscount && (
                  <span className="product-tag new-tag">NEW</span>
                )}

                <Link href={`/products/${p.slug}`} tabIndex={-1}>
                  <LazyImage
                    src={mediaUrl(p.image)}
                    alt={p.name}
                    aspectRatio="1"
                    className="product-photo"
                  />
                </Link>
              </div>

              <div className="product-card-info">
                <span className="product-category">{p.category}</span>
                <h3>
                  <Link href={`/products/${p.slug}`}>{p.name}</Link>
                </h3>
                <p className="detail">{p.detail}</p>
                <div className="rating">
                  <span className="stars">{'★'.repeat(Math.round(p.rating))}</span>
                  <span> ({p.reviews})</span>
                </div>
                <div className="product-bottom">
                  <div>
                    <span className="price">{money(p.price)}</span>
                    {hasDiscount && <span className="old-price">{money(p.old)}</span>}
                  </div>
                  <button
                    type="button"
                    className="add-cart glow-btn"
                    disabled={!p.inStock} onClick={() => onAddToCart(p)}
                    aria-label={`Add ${p.name} to bag`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>{p.inStock ? 'Add' : 'Sold out'}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
