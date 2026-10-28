'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { categories, products, ages, money, Product } from '@/lib/kidobox-data';
import { LazyImage } from '@/components/lazy-image';

interface CatalogViewProps {
  initialCategory?: string;
  initialAge?: string;
  initialMode?: 'all' | 'new' | 'bestsellers';
  title?: string;
  description?: string;
  heroImage?: string;
  heroColor?: string;
  breadcrumbTitle?: string;
}

export function CatalogView({
  initialCategory = 'all',
  initialAge,
  initialMode = 'all',
  title = 'Shop All Products',
  description = 'Thoughtfully chosen baby essentials for life’s sweetest little moments.',
  heroImage = 'clothing',
  heroColor = 'pink-bg',
  breadcrumbTitle,
}: CatalogViewProps) {
  const searchParams = useSearchParams();
  const searchQ = (searchParams.get('q') || '').trim();
  const searchBrand = searchParams.get('brand') || '';

  const { addItem, setIsOpen } = useCart();
  const [selectedSort, setSelectedSort] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');
  const [saleOnly, setSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleWishlist = (id: number, name: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('kidobox-wishlist', JSON.stringify(next));
        window.dispatchEvent(new Event('wishlist-updated'));
      } catch (e) {}
      triggerToast(prev.includes(id) ? `${name} removed from wishlist` : `${name} added to wishlist ♡`);
      return next;
    });
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

  const filteredList = useMemo(() => {
    let list = products.filter((p) => {
      if (initialCategory !== 'all' && p.category !== initialCategory) return false;
      if (initialAge && p.age !== initialAge && p.age !== 'all') return false;
      if (initialMode === 'new' && !p.isNew) return false;
      if (initialMode === 'bestsellers' && p.tag !== 'Bestseller') return false;
      if (searchBrand && p.brand.toLowerCase() !== searchBrand.toLowerCase()) return false;
      if (searchQ) {
        const query = searchQ.toLowerCase();
        const catName = categories.find((c) => c.slug === p.category)?.name || '';
        const match =
          p.name.toLowerCase().includes(query) ||
          p.detail.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          catName.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });

    if (priceFilter !== 'all') {
      const max = Number(priceFilter);
      list = list.filter((p) => p.price < max);
    }

    if (saleOnly) {
      list = list.filter((p) => p.price < p.old);
    }

    if (selectedSort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (selectedSort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (selectedSort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (selectedSort === 'new') list.sort((a, b) => Number(b.isNew) - Number(a.isNew));

    return list;
  }, [initialCategory, initialAge, initialMode, searchBrand, searchQ, priceFilter, saleOnly, selectedSort]);

  const pageSize = 9;
  const totalPages = Math.ceil(filteredList.length / pageSize);
  const pagedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const displayTitle = searchQ
    ? `A Little Search: “${searchQ}”`
    : searchBrand
    ? `${searchBrand} Collection`
    : title;

  const displayDesc = searchQ
    ? `Discovering little treasures matching “${searchQ}”.`
    : searchBrand
    ? `Explore little favorites from our ${searchBrand} collection.`
    : description;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/shop">Shop</Link>
          {breadcrumbTitle && (
            <>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{breadcrumbTitle}</span>
            </>
          )}
        </nav>

        {/* Collection Hero */}
        <section className={`collection-hero ${heroColor}`}>
          <div>
            <span className="mini-eyebrow">A LITTLE LOVE, EVERY DAY</span>
            <h1>{displayTitle}</h1>
            <p>{displayDesc}</p>
            <span className="tiny-note">Thoughtfully chosen · Made for everyday moments</span>
          </div>
          <img
            src={`/assets/hd/${heroImage}.webp`}
            alt={displayTitle}
            width={1000}
            height={750}
            fetchPriority="high"
          />
          <div className="collection-decoration">★</div>
        </section>

        {/* Shop Layout: Sidebar + Catalog */}
        <div className="shop-layout">
          <aside className={`shop-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
            <h3>Shop by Category</h3>
            <Link href="/shop" className={initialCategory === 'all' && !initialAge ? 'current' : ''}>
              All Little Essentials <span>{products.length}</span>
            </Link>
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className={initialCategory === c.slug ? 'current' : ''}
                >
                  {c.name}
                  <span>{count}</span>
                </Link>
              );
            })}

            <div className="sidebar-divider" />

            <h3>Shop by Age</h3>
            {ages.map((a) => (
              <Link key={a.slug} href={`/age-${a.slug}`} className={initialAge === a.age ? 'current' : ''}>
                {a.title}
                <span>→</span>
              </Link>
            ))}

            <div className="sidebar-note">
              <span>💗</span>
              <h3>A little help?</h3>
              <p>We’re here for your little questions.</p>
              <Link href="/faq">Visit our help center →</Link>
            </div>
          </aside>

          <section className="catalog">
            <div className="catalog-toolbar">
              <p id="result-count">
                {filteredList.length} little treasure{filteredList.length !== 1 ? 's' : ''}
                {searchQ ? ` found` : ''}
              </p>
              <div>
                <button
                  className="mobile-filters"
                  id="toggle-filters"
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                >
                  ☷ Filters
                </button>
                <label className="sort-label" htmlFor="sort">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="new">Newest First</option>
                </select>
              </div>
            </div>

            <div className="catalog-filters">
              <label>
                Price{' '}
                <select
                  id="price-filter"
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Prices</option>
                  <option value="500">Under ₹500</option>
                  <option value="1000">Under ₹1,000</option>
                  <option value="2000">Under ₹2,000</option>
                </select>
              </label>

              <label>
                <input
                  type="checkbox"
                  id="sale-only"
                  checked={saleOnly}
                  onChange={(e) => {
                    setSaleOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                />{' '}
                On Sale
              </label>

              <button
                id="clear-filters"
                onClick={() => {
                  setPriceFilter('all');
                  setSaleOnly(false);
                  setSelectedSort('featured');
                  setCurrentPage(1);
                }}
              >
                Clear filters
              </button>
            </div>

            {filteredList.length === 0 ? (
              <div className="no-products">
                <h2>No little treasures here just yet.</h2>
                <p>Try clearing filters or search term to discover more favorites.</p>
                <Link className="button pink" href="/shop">
                  Explore All Products →
                </Link>
              </div>
            ) : (
              <div className="product-grid" id="catalog-grid">
                {pagedList.map((p) => {
                  const isSaved = wishlist.includes(p.id);
                  const catObj = categories.find((c) => c.slug === p.category);
                  const hasDiscount = p.old > p.price;
                  const discountPercent = hasDiscount
                    ? Math.round(((p.old - p.price) / p.old) * 100)
                    : 0;

                  return (
                    <article className="product-card" key={p.id}>
                      <div className="product-image-wrap">
                        <Link href={`/products/${p.slug}`} aria-label={`View ${p.name}`}>
                          <LazyImage
                            className="product-photo"
                            src={`/assets/hd/${p.image}.webp`}
                            width={800}
                            height={800}
                            alt={p.name}
                            aspectRatio="1"
                          />
                        </Link>
                        {hasDiscount && (
                          <span className="product-tag discount-tag">SAVE {discountPercent}%</span>
                        )}
                        {p.isNew && !hasDiscount && (
                          <span className="product-tag new-tag">NEW</span>
                        )}
                        <button
                          className={`wish ${isSaved ? 'saved heart-bounce' : ''}`}
                          onClick={() => toggleWishlist(p.id, p.name)}
                          aria-label={`Save ${p.name} to wishlist`}
                          aria-pressed={isSaved}
                        >
                          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'}>
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
                          <span className="stars">★★★★★</span> &nbsp;{p.rating}{' '}
                          <span>({p.reviews})</span>
                        </div>
                        <div className="product-bottom">
                          <div>
                            <span className="price">{money(p.price)}</span>
                            {hasDiscount && <span className="old-price">{money(p.old)}</span>}
                          </div>
                          <button
                            className="add-cart glow-btn"
                            onClick={() => handleAddToCart(p)}
                            aria-label={`Add ${p.name} to cart`}
                          >
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

            {totalPages > 1 && (
              <div className="pagination" id="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={i + 1 === currentPage ? 'active' : ''}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    aria-label={`Page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="collection-bottom">
          <span>🌼</span>
          <h2>Little things. A whole lot of love.</h2>
          <p>Explore more thoughtful essentials for your growing family.</p>
          <Link className="button pink" href="/categories">
            Explore All Categories <span>→</span>
          </Link>
        </section>
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
