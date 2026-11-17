'use client';

import { useStorefront, mediaUrl } from '@/lib/storefront';
import { Category, money } from '@/lib/kidobox-data';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useGenderTheme } from '@/lib/theme-context';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Baby,
  ArrowLeftRight,
  Search,
  X,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

const primaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export function StoreNav() {
  const { categories, products, content, store } = useStorefront();
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, setIsOpen } = useCart();
  const { gender, setGender } = useGenderTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();

    function handleClickOutside(event: PointerEvent) {
      if (event.target instanceof Node &&
          !searchContainerRef.current?.contains(event.target) &&
          !searchButtonRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        setIsSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchingCategories = useMemo(() => {
    if (!trimmedQuery) return [];
    return categories
      .filter(
        (c) =>
          c.name.toLowerCase().includes(trimmedQuery) ||
          c.slug.toLowerCase().includes(trimmedQuery) ||
          c.description.toLowerCase().includes(trimmedQuery)
      )
      .slice(0, 4);
  }, [categories, trimmedQuery]);

  const matchingProducts = useMemo(() => {
    if (!trimmedQuery) return [];
    return products
      .filter((p) => {
        const catNames = categories
          .filter((c) => p.categorySlugs?.includes(c.slug) || c.slug === p.category)
          .map((c) => c.name.toLowerCase());
        return (
          p.name.toLowerCase().includes(trimmedQuery) ||
          p.detail.toLowerCase().includes(trimmedQuery) ||
          p.brand.toLowerCase().includes(trimmedQuery) ||
          p.category?.toLowerCase().includes(trimmedQuery) ||
          p.categorySlugs?.some((s) => s.toLowerCase().includes(trimmedQuery)) ||
          catNames.some((n) => n.includes(trimmedQuery)) ||
          p.tag?.toLowerCase().includes(trimmedQuery) ||
          p.features?.some((f) => f.toLowerCase().includes(trimmedQuery))
        );
      })
      .slice(0, 5);
  }, [products, categories, trimmedQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const handleSelectCategory = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/collections/${slug}`);
  };

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/products/${slug}`);
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
            <span className="topbar-item">
              <Truck size={14} className="topbar-icon" />
              <span>Free shipping over ₹{store?.settings?.free_shipping_threshold ?? 0}</span>
            </span>
            <span className="topbar-item">
              <RotateCcw size={14} className="topbar-icon" />
              <span>7 Days Exchange</span>
            </span>
            <span className="topbar-item">
              <ShieldCheck size={14} className="topbar-icon" />
              <span>100% Original Products</span>
            </span>
            {Boolean(content.copy?.announcement) && (
              <span className="topbar-item">
                <Heart size={14} className="topbar-icon" />
                <span>{content.copy?.announcement}</span>
              </span>
            )}
          </div>

          <div className="topbar-theme-selector">
            <button
              type="button"
              onClick={() => setGender(gender === 'boy' ? 'girl' : 'boy')}
              className="topbar-theme-toggle"
              aria-label={`Current theme: ${gender === 'boy' ? 'Boy (Blue)' : 'Girl (Red)'}. Click to switch theme.`}
            >
              {gender === 'boy' ? (
                <span className="theme-pill boy-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Baby size={15} />
                  <strong>Boy Mode (Blue)</strong>
                  <ArrowLeftRight size={12} style={{ opacity: 0.8 }} />
                </span>
              ) : (
                <span className="theme-pill girl-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Baby size={15} />
                  <strong>Girl Mode (Red)</strong>
                  <ArrowLeftRight size={12} style={{ opacity: 0.8 }} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="store-header">
        <div className="container header-main">
          <Link className="logo" href="/" aria-label="KIDOBOX home">
            <img
              src={store?.branding?.logo_url ? mediaUrl(store.branding.logo_url) : "/logo.png"}
              width="158"
              height="68"
              className="mascot-float"
              style={{ maxHeight: '68px', width: 'auto', objectFit: 'contain', transition: 'transform 0.3s ease' }}
              alt="KIDOBOX — Little needs, big smiles"
            />
          </Link>

          <nav className="store-primary-nav" aria-label="Main navigation">
            {primaryLinks.map(({ label, href }) => (
              <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
                {label}
              </Link>
            ))}
          </nav>

          {isSearchOpen && (
            <div className="search-wrap store-search-panel" id="store-search-panel" ref={searchContainerRef}>
              <form className="search" onSubmit={handleSearchSubmit} role="search">
                <input
                  id="search"
                  ref={searchInputRef}
                  name="q"
                  type="search"
                  placeholder="Search products and categories…"
                  aria-label="Search categories and products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                    }}
                    aria-label="Clear search query"
                  >
                    <X size={16} />
                  </button>
                )}
                <button aria-label="Search" type="submit" className="glow-btn">
                  <Search size={18} />
                </button>
              </form>

              {/* Live Autocomplete Dropdown */}
              <div className="search-dropdown-menu">
                  {trimmedQuery.length > 0 ? (
                    <>
                      {/* Matching Categories */}
                      {matchingCategories.length > 0 && (
                        <div className="search-dropdown-section">
                          <div className="search-section-header">
                            <Sparkles size={13} color="var(--pink)" />
                            <span>Matching Categories ({matchingCategories.length})</span>
                          </div>
                          <div className="search-categories-grid">
                            {matchingCategories.map((cat: Category) => (
                              <button
                                key={cat.slug}
                                type="button"
                                className="search-category-card"
                                onClick={() => handleSelectCategory(cat.slug)}
                              >
                                <img
                                  src={mediaUrl(cat.image)}
                                  alt={cat.name}
                                  className="search-category-img"
                                />
                                <div className="search-category-info">
                                  <strong>{cat.name}</strong>
                                  <span>Shop Category →</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Products */}
                      {matchingProducts.length > 0 && (
                        <div className="search-dropdown-section">
                          <div className="search-section-header">
                            <ShoppingBag size={13} color="#00adeb" />
                            <span>Matching Products ({matchingProducts.length})</span>
                          </div>
                          <div className="search-products-list">
                            {matchingProducts.map((p) => {
                              const hasDiscount = p.old > p.price;
                              const discountPercent = hasDiscount
                                ? Math.round(((p.old - p.price) / p.old) * 100)
                                : 0;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  className="search-product-item"
                                  onClick={() => handleSelectProduct(p.slug)}
                                >
                                  <img
                                    src={mediaUrl(p.image)}
                                    alt={p.name}
                                    className="search-product-thumb"
                                  />
                                  <div className="search-product-details">
                                    <span className="search-product-title">{p.name}</span>
                                    <div className="search-product-meta">
                                      <span className="search-product-price">₹{p.price}</span>
                                      {hasDiscount && (
                                        <span className="search-product-discount">
                                          {discountPercent}% OFF
                                        </span>
                                      )}
                                      <span className="search-product-cat">
                                        in {p.category || 'baby care'}
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight size={14} className="search-arrow-icon" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* No matches */}
                      {matchingCategories.length === 0 && matchingProducts.length === 0 && (
                        <div className="search-empty-state">
                          <p>No direct matches found for &ldquo;{searchQuery}&rdquo;</p>
                          <span className="search-section-header" style={{ justifyContent: 'center' }}>
                            Explore popular collections:
                          </span>
                          <div className="search-quick-pills" style={{ justifyContent: 'center' }}>
                            {categories.slice(0, 6).map((c: Category) => (
                              <button
                                key={c.slug}
                                type="button"
                                className="search-pill-btn"
                                onClick={() => handleSelectCategory(c.slug)}
                              >
                                {c.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer View All */}
                      <div className="search-dropdown-footer">
                        <button
                          type="button"
                          className="search-view-all-btn"
                          onClick={handleSearchSubmit}
                        >
                          <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Initial State when focused */
                    <div className="search-initial-state">
                      <div className="search-section-header">
                        <Sparkles size={13} color="var(--pink)" />
                        <span>Popular Categories</span>
                      </div>
                      <div className="search-quick-pills">
                        {categories.map((c: Category) => (
                          <button
                            key={c.slug}
                            type="button"
                            className="search-pill-btn"
                            onClick={() => handleSelectCategory(c.slug)}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>

                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="header-actions" style={{ marginLeft: 'auto' }}>
            <Link href="/account" aria-label="Your account">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="7" r="3.5" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2Z" />
              </svg>
              <span>Account</span>
            </Link>

            <button
              type="button"
              ref={searchButtonRef}
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={isSearchOpen}
              aria-controls={isSearchOpen ? 'store-search-panel' : undefined}
              onClick={() => setIsSearchOpen((open) => !open)}
            >
              {isSearchOpen ? <X className="icon" aria-hidden="true" /> : <Search className="icon" aria-hidden="true" />}
              <span>Search</span>
            </button>

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

      </header>
    </>
  );
}
