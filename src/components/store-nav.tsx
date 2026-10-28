'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useGenderTheme } from '@/lib/theme-context';

export function StoreNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, setIsOpen } = useCart();
  const { gender, setGender, openThemeModal } = useGenderTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateWishCount = () => {
      try {
        const raw = localStorage.getItem('kidobox-wishlist');
        const list = raw ? JSON.parse(raw) : [];
        setWishlistCount(Array.isArray(list) ? list.length : 0);
      } catch (e) {
        setWishlistCount(0);
      }
    };

    updateWishCount();
    window.addEventListener('storage', updateWishCount);
    window.addEventListener('wishlist-updated', updateWishCount);
    return () => {
      window.removeEventListener('storage', updateWishCount);
      window.removeEventListener('wishlist-updated', updateWishCount);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Top Announcement Bar */}
      <div className="topbar">
        <div className="container topbar-flex">
          <div className="topbar-items">
            <span>🚚 &nbsp;Free shipping over ₹999</span>
            <span>⟳ &nbsp;7-day easy returns</span>
            <span>🛡 &nbsp;100% Original Products</span>
            <span>💗 &nbsp;Little Needs. Big Smiles.</span>
          </div>

          <div className="topbar-theme-selector">
            <button
              type="button"
              onClick={() => setGender(gender === 'boy' ? 'girl' : 'boy')}
              className="topbar-theme-toggle"
              aria-label={`Current theme: ${gender === 'boy' ? 'Boy (Blue)' : 'Girl (Pink)'}. Click to toggle.`}
            >
              {gender === 'boy' ? (
                <span className="theme-pill boy-pill">
                  👦 <strong>Boy Mode (Blue)</strong> <small>⇄</small>
                </span>
              ) : (
                <span className="theme-pill girl-pill">
                  👧 <strong>Girl Mode (Pink)</strong> <small>⇄</small>
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={openThemeModal}
              className="topbar-theme-pick"
              aria-label="Open Theme Picker"
            >
              ⚙ Change
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header>
        <div className="container header-main">
          <Link className="logo" href="/" aria-label="KIDOBOX home">
            <img
              src="/logo.png"
              width="158"
              height="68"
              className="mascot-float"
              style={{ maxHeight: '68px', width: 'auto', objectFit: 'contain', transition: 'transform 0.3s ease' }}
              alt="KIDOBOX — Little needs, big smiles"
            />
          </Link>

          <form className="search" onSubmit={handleSearchSubmit} role="search">
            <input
              id="search"
              name="q"
              type="search"
              placeholder="Search diapers, toys, feeding, clothing & more..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button aria-label="Search" type="submit" className="glow-btn">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
            </button>
          </form>

          <div className="header-actions">
            <Link href="/account" aria-label="Your account">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="7" r="3.5" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2Z" />
              </svg>
              <span>Account</span>
            </Link>

            <Link href="/wishlist" aria-label="Your wishlist">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              <span>Wishlist</span>
              {wishlistCount > 0 && <b id="wish-count" className="heart-bounce">{wishlistCount}</b>}
            </Link>

            <button type="button" onClick={() => setIsOpen(true)} aria-label="Your cart">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 3h3l3 13h11l3-9H6" />
                <circle cx="9" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
              </svg>
              <span>Cart</span>
              <b id="cart-count" className={itemCount > 0 ? 'heart-bounce' : ''}>{itemCount}</b>
            </button>
          </div>
        </div>

        {/* Navigation Categories Strip */}
        <div className="nav-bar-wrapper">
          <nav className="container nav" aria-label="Shop navigation">
            <Link href="/" className={pathname === '/' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>

            <Link href="/clothing" className={pathname === '/clothing' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
              <span>Clothing</span>
            </Link>

            <Link href="/diapering" className={pathname === '/diapering' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                <path d="M12 12v9" />
                <path d="M3 12c2.5-4 6.5-6 9-6s6.5 2 9 6" />
              </svg>
              <span>Diapering</span>
            </Link>

            <Link href="/feeding" className={pathname === '/feeding' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2h4v3h-4z" />
                <path d="M8 5h8v4l2 3v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9l2-3z" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
              <span>Feeding</span>
            </Link>

            <Link href="/bath-care" className={pathname === '/bath-care' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z" />
                <path d="M6 12V7a3 3 0 0 1 6 0v1" />
                <path d="m5 20-1 2m15-2 1 2" />
              </svg>
              <span>Bath &amp; Care</span>
            </Link>

            <Link href="/toys" className={pathname === '/toys' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="5" r="2.5" />
                <circle cx="17" cy="5" r="2.5" />
                <circle cx="12" cy="13" r="7" />
                <circle cx="9.5" cy="11.5" r=".7" fill="currentColor" />
                <circle cx="14.5" cy="11.5" r=".7" fill="currentColor" />
                <path d="M10 15a2 2 0 0 0 4 0" />
              </svg>
              <span>Toys</span>
            </Link>

            <Link href="/mom-baby" className={pathname === '/mom-baby' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M12 13a2.5 2.5 0 0 0 2.5-2.5c0-1.5-1.5-2-2.5-1-1-1-2.5-.5-2.5 1A2.5 2.5 0 0 0 12 13Z" />
              </svg>
              <span>Mom &amp; Baby</span>
            </Link>

            <Link href="/nursery" className={pathname === '/nursery' ? 'selected' : ''}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z" />
              </svg>
              <span>Nursery</span>
            </Link>

            <Link href="/offers" className={`nav-offers ${pathname === '/offers' ? 'selected' : ''}`}>
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Offers</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
