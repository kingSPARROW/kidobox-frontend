'use client';

import { useStorefront, useNavigation, mediaUrl, safeLink } from '@/lib/storefront';
import { Category, Product, money } from '@/lib/kidobox-data';
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
  ChevronDown,
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
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const megaTrigger = useRef<HTMLAnchorElement>(null);
  const megaPanel = useRef<HTMLDivElement>(null);
  const featuredProducts = openCategory
    ? products.filter(product => product.category === openCategory.slug || product.categorySlugs?.includes(openCategory.slug)).slice(0, 4)
    : [];

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
        <div
          className="nav-bar-wrapper"
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse' && !megaPanel.current?.contains(document.activeElement)) setOpenCategory(null);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpenCategory(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && openCategory) {
              megaTrigger.current?.focus();
              setOpenCategory(null);
            }
          }}
        >
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
              {(navigation?.main_menu?.length ? navigation.main_menu : [{ label: 'Home', url: '/' }, ...categories.map(c => ({ label: c.name, url: `/collections/${c.slug}` })), { label: 'Offers', url: '/offers' }]).map((item, i) => {
                const href = safeLink(item.url);
                const slug = href.replace(/\/$/, '').replace(/^\/(?:collections\/)?/, '');
                const category = categories.find(entry => entry.slug === slug);
                const expanded = !!category && openCategory?.slug === category.slug;

                return (
                  <Link
                    key={`${item.url}-${i}`}
                    href={href}
                    onClick={event => {
                      handleNavLinkClick(event);
                      setOpenCategory(null);
                    }}
                    onPointerEnter={event => {
                      if (event.pointerType !== 'mouse' || event.buttons !== 0) return;
                      megaTrigger.current = event.currentTarget;
                      setOpenCategory(category ?? null);
                    }}
                    onFocus={event => {
                      if (!event.currentTarget.matches(':focus-visible')) return;
                      megaTrigger.current = event.currentTarget;
                      setOpenCategory(category ?? null);
                    }}
                    onKeyDown={event => {
                      if (event.key === 'ArrowDown' && expanded) {
                        event.preventDefault();
                        megaPanel.current?.querySelector('a')?.focus();
                      }
                    }}
                    className={pathname === href ? 'selected' : ''}
                    aria-current={pathname === href ? 'page' : undefined}
                    aria-expanded={category ? expanded : undefined}
                    aria-controls={expanded ? 'category-mega-menu' : undefined}
                  >
                    <span>{item.label}</span>
                    {category && <ChevronDown className="nav-category-chevron" size={14} aria-hidden="true" />}
                  </Link>
                );
              })}
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
          {openCategory && (
            <div className="nav-mega-panel container" id="category-mega-menu" ref={megaPanel} key={openCategory.slug}>
              <div className="nav-mega-intro">
                <span>SHOP THE COLLECTION</span>
                <h2>{openCategory.name}</h2>
                {openCategory.description && <p>{openCategory.description}</p>}
                <Link href={`/collections/${openCategory.slug}`} onClick={() => setOpenCategory(null)}>
                  View collection <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              {featuredProducts.length > 0 ? (
                <ul className="nav-mega-products">
                  {featuredProducts.map(product => (
                    <li key={product.id}>
                      <Link href={`/products/${product.slug}`} onClick={() => setOpenCategory(null)}>
                        <img src={product.image} alt="" width={160} height={120} />
                        <strong>{product.name}</strong>
                        <span>{money(product.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="nav-mega-empty">No products in this collection yet.</p>}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
