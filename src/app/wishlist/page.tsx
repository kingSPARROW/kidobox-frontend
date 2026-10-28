'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { products, categories, money, Product } from '@/lib/kidobox-data';

export default function WishlistPage() {
  const { addItem, setIsOpen } = useCart();
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidobox-wishlist');
      if (raw) setWishlist(JSON.parse(raw));
    } catch (e) {}
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const removeFromWishlist = (id: number, name: string) => {
    const next = wishlist.filter((x) => x !== id);
    setWishlist(next);
    localStorage.setItem('kidobox-wishlist', JSON.stringify(next));
    window.dispatchEvent(new Event('wishlist-updated'));
    triggerToast(`${name} removed from wishlist`);
  };

  const handleAddToCart = (p: Product) => {
    addItem({
      product_id: String(p.id),
      variant_id: `${p.id}-${p.sizes[0] || 'default'}`,
      title: p.name,
      variant_title: p.sizes[0] || undefined,
      price: p.price,
      image_url: `/assets/hd/${p.image}.webp`,
    });
    triggerToast(`${p.name} added with love ♡`);
  };

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="wishlist">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Your Wishlist</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">SAVED WITH LOVE</span>
          <h1>💕 Your Little Wishlist</h1>
          <p>The favorites you’ve gathered for your growing little family.</p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="page-empty">
            <span>♡</span>
            <h2>Your next little favorite is out there</h2>
            <p>Tap the heart on any product to save it here for later.</p>
            <Link className="button pink" href="/shop">
              Explore Little Essentials →
            </Link>
          </div>
        ) : (
          <div className="product-grid" id="wishlist-grid">
            {savedProducts.map((p) => {
              const catObj = categories.find((c) => c.slug === p.category);
              return (
                <article className="product-card" key={p.id}>
                  <div className="product-image-wrap">
                    <Link href={`/products/${p.slug}`}>
                      <img
                        className="product-photo"
                        src={`/assets/hd/${p.image}.webp`}
                        width={800}
                        height={800}
                        alt={p.name}
                      />
                    </Link>
                    <span className={`product-tag ${p.isNew ? 'new-tag' : ''}`}>{p.tag}</span>
                    <button
                      className="wish saved"
                      onClick={() => removeFromWishlist(p.id, p.name)}
                      aria-label={`Remove ${p.name} from wishlist`}
                    >
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                      </svg>
                    </button>
                  </div>
                  <div className="product-card-info">
                    <Link href={`/${p.category}`} className="product-category">
                      {catObj?.short || p.category}
                    </Link>
                    <h3>
                      <Link href={`/products/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <p className="detail">{p.detail}</p>
                    <div className="rating">
                      <span className="stars">★★★★★</span> &nbsp;{p.rating} ({p.reviews})
                    </div>
                    <div className="product-bottom">
                      <div>
                        <span className="price">{money(p.price)}</span>
                        <span className="old-price">{money(p.old)}</span>
                      </div>
                      <button className="add-cart" onClick={() => handleAddToCart(p)}>
                        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M2 3h3l3 13h11l3-9H6" />
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                        </svg>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <StoreFooter />

      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status">
        <span>{toastMessage}</span>
        <button
          onClick={() => setIsOpen(true)}
          style={{ color: '#ffbbd9', textDecoration: 'underline', marginLeft: '10px', background: 'none', border: 0, font: 'inherit', cursor: 'pointer' }}
        >
          View Bag →
        </button>
      </div>
    </div>
  );
}
