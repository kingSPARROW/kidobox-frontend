'use client';

import { useStorefront, useNavigation, mediaUrl, safeLink } from '@/lib/storefront';
import { Category, Product } from '@/lib/kidobox-data';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function StoreNav() {
  const { categories, products, content, store } = useStorefront();
  const { data: navigation } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, setIsOpen } = useCart();
  const { gender, setGender } = useGenderTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
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
    setIsDropdownOpen(false);
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const handleSelectCategory = (slug: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    router.push(`/collections/${slug}`);
  };

  const handleSelectProduct = (slug: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    router.push(`/products/${slug}`);
  };

  const handleQuickPillClick = (term: string) => {
    setIsDropdownOpen(false);
    setSearchQuery(term);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  // Horizontal category navigation scrolling
  const navRef = useRef<HTMLElement>(null);
  const [canScrollNavLeft, setCanScrollNavLeft] = useState(false);
  const [canScrollNavRight, setCanScrollNavRight] = useState(false);
  const isDraggingNavRef = useRef(false);
  const startXNavRef = useRef(0);
  const scrollLeftNavRef = useRef(0);
  const hasDraggedNavRef = useRef(false);

  const checkNavScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollNavLeft(scrollLeft > 4);
    setCanScrollNavRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    checkNavScroll();

    const handleNavWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkNavScroll();
      }
    };

    el.addEventListener('wheel', handleNavWheel, { passive: false });
    el.addEventListener('scroll', checkNavScroll, { passive: true });
    window.addEventListener('resize', checkNavScroll);

    const t = setTimeout(checkNavScroll, 150);

    return () => {
      clearTimeout(t);
      el.removeEventListener('wheel', handleNavWheel);
      el.removeEventListener('scroll', checkNavScroll);
      window.removeEventListener('resize', checkNavScroll);
    };
  }, [categories, navigation, checkNavScroll]);

  const scrollNav = (direction: 'left' | 'right') => {
    const el = navRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.6, 260);
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleNavMouseDown = (e: React.MouseEvent) => {
    const el = navRef.current;
    if (!el) return;
    isDraggingNavRef.current = true;
    hasDraggedNavRef.current = false;
    startXNavRef.current = e.pageX - el.offsetLeft;
    scrollLeftNavRef.current = el.scrollLeft;
  };

  const handleNavMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingNavRef.current) return;
    const el = navRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXNavRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasDraggedNavRef.current = true;
    }
    el.scrollLeft = scrollLeftNavRef.current - walk;
    checkNavScroll();
  };

  const handleNavMouseUp = () => {
    isDraggingNavRef.current = false;
  };

  const handleNavLinkClick = (e: React.MouseEvent) => {
    if (hasDraggedNavRef.current) {
      e.preventDefault();
      e.stopPropagation();
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
            <span className="topbar-item">
              <Truck size={14} className="topbar-icon" />
              <span>Free shipping over ₹{store?.settings?.free_shipping_threshold ?? 0}</span>
            </span>
            <span className="topbar-item">
              <RotateCcw size={14} className="topbar-icon" />
              <span>7-day easy returns</span>
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
      <header>
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

          {/* Global Search Bar with Live Category & Product Autocomplete */}
          <div className="search-wrap" ref={searchContainerRef}>
            <form className="search" onSubmit={handleSearchSubmit} role="search">
              <input
                id="search"
                name="q"
                type="search"
                placeholder="Search diapers, toys, feeding, clothing & more..."
                aria-label="Search categories and products"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
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
            {isDropdownOpen && (
              <div className="search-dropdown-menu" role="listbox">
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
                          {matchingProducts.map((p: Product) => {
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

                    <div className="search-section-header" style={{ marginTop: 12 }}>
                      <TrendingUp size={13} color="#ffbc00" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="search-quick-pills">
                      {[
                        'Silicone Feeding Set',
                        'Bamboo Muslin Swaddles',
                        'Cloud Soft Baby Diapers',
                        'Wooden Stacking Toys',
                        'Maternity Dress',
                        'Nursery Bedding',
                      ].map((term) => (
                        <button
                          key={term}
                          type="button"
                          className="search-pill-btn"
                          onClick={() => handleQuickPillClick(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions" style={{ marginLeft: 'auto' }}>
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
          <div className={`nav-scroll-container container ${canScrollNavLeft ? 'has-left' : ''} ${canScrollNavRight ? 'has-right' : ''}`}>
            {canScrollNavLeft && (
              <button
                type="button"
                className="nav-scroll-btn nav-scroll-left"
                onClick={() => scrollNav('left')}
                aria-label="Scroll categories left"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            <nav
              ref={navRef}
              className="nav"
              aria-label="Shop navigation"
              onMouseDown={handleNavMouseDown}
              onMouseMove={handleNavMouseMove}
              onMouseUp={handleNavMouseUp}
              onMouseLeave={handleNavMouseUp}
            >
              {(navigation?.main_menu?.length ? navigation.main_menu : [{ label: 'Home', url: '/' }, ...categories.map(c => ({ label: c.name, url: `/collections/${c.slug}` })), { label: 'Offers', url: '/offers' }]).map((item, i) => (
                <Link
                  key={`${item.url}-${i}`}
                  href={safeLink(item.url)}
                  onClick={handleNavLinkClick}
                  className={pathname === item.url ? 'selected' : ''}
                >
                  {[<svg key="0" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>,
                  <svg key="1" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                  </svg>,
                  <svg key="2" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                    <path d="M12 12v9" />
                    <path d="M3 12c2.5-4 6.5-6 9-6s6.5 2 9 6" />
                  </svg>,
                  <svg key="3" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2h4v3h-4z" />
                    <path d="M8 5h8v4l2 3v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9l2-3z" />
                    <line x1="10" y1="14" x2="14" y2="14" />
                  </svg>,
                  <svg key="4" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z" />
                    <path d="M6 12V7a3 3 0 0 1 6 0v1" />
                    <path d="m5 20-1 2m15-2 1 2" />
                  </svg>,
                  <svg key="5" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7" cy="5" r="2.5" />
                    <circle cx="17" cy="5" r="2.5" />
                    <circle cx="12" cy="13" r="7" />
                    <circle cx="9.5" cy="11.5" r=".7" fill="currentColor" />
                    <circle cx="14.5" cy="11.5" r=".7" fill="currentColor" />
                    <path d="M10 15a2 2 0 0 0 4 0" />
                  </svg>,
                  <svg key="6" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    <path d="M12 13a2.5 2.5 0 0 0 2.5-2.5c0-1.5-1.5-2-2.5-1-1-1-2.5-.5-2.5 1A2.5 2.5 0 0 0 12 13Z" />
                  </svg>,
                  <svg key="7" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z" />
                  </svg>,
                  <svg key="8" className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>][i % 9]}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {canScrollNavRight && (
              <button
                type="button"
                className="nav-scroll-btn nav-scroll-right"
                onClick={() => scrollNav('right')}
                aria-label="Scroll categories right"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
