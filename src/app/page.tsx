'use client';

import { ProductQuickView } from '@/components/product-quick-view';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { money, Product, stagePhotography, type Category } from '@/lib/kidobox-data';
import { useStorefront, mediaUrl, cartItem, safeLink } from '@/lib/storefront';
import { HeroSlider } from '@/components/hero-slider';
import { ProductSlider } from '@/components/product-slider';
import { ReviewsSlider } from '@/components/reviews-slider';
import { LazyImage } from '@/components/lazy-image';
import { BrandLoadingScreen } from '@/components/brand-loading-screen';
import { SeoHead } from '@/components/seo-head';
import {
  Sparkles,
  Heart,
  Baby,
  Tag,
  Award,
  TrendingUp,
  BookOpen,
  Camera,
  Leaf,
  ShieldCheck,
  Compass,
  Gift,
  Truck,
  Flame,
  Clock,
  ArrowRight,
  Mail,
  CheckCircle2,
  Copy,
} from 'lucide-react';

const benefitIcons = [Leaf, Heart, Compass, Gift, ShieldCheck, Truck];

export default function KidoboxHomePage() {
  const [categoryPreview, setCategoryPreview] = useState<{ category: Category; center: number } | null>(null);
  const categoryPreviewRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const preview = categoryPreviewRef.current;
    const section = preview?.parentElement;
    if (!preview || !section) return;

    const updatePlacement = () => {
      const bounds = section.getBoundingClientRect();
      const spaceBelow = window.innerHeight - bounds.bottom;
      preview.dataset.placement =
        spaceBelow < preview.offsetHeight + 14 && bounds.top > spaceBelow ? 'above' : 'below';
    };

    updatePlacement();
    window.addEventListener('scroll', updatePlacement, { passive: true });
    window.addEventListener('resize', updatePlacement);
    return () => {
      window.removeEventListener('scroll', updatePlacement);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [categoryPreview]);

  function showCategoryPreview(category: Category, link: HTMLAnchorElement) {
    const section = link.closest('section');
    if (!section) return;
    const bounds = link.getBoundingClientRect();
    setCategoryPreview({ category, center: bounds.left + bounds.width / 2 - section.getBoundingClientRect().left });
  }
  const { categories, products, ages, articles, brands, isLoading, isError, refetch, content, banners, offers, globalSeo, pageSeo } = useStorefront();
  const { addItem, setIsOpen } = useCart();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToastLink, setShowToastLink] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const categoryStripRef = useRef<HTMLDivElement>(null);
  const bestsellersSliderRef = useRef<HTMLDivElement>(null);
  const offersSliderRef = useRef<HTMLDivElement>(null);
  const guidesSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidobox-wishlist');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setWishlist(parsed);
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 0);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const triggerToast = (msg: string, hasLink = true) => {
    setToastMessage(msg);
    setShowToastLink(hasLink);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('kidobox-wishlist', JSON.stringify(next));
        window.dispatchEvent(new Event('wishlist-updated'));
      } catch (e) { }
      triggerToast(
        prev.includes(id) ? `${name} removed from wishlist` : `${name} added to wishlist ♡`,
        false
      );
      return next;
    });
  };

  const handleAddToCart = (p: Product) => {
    if (!p.inStock || !p.variantId) return;
    const item = cartItem(p);
    if (!item) return;
    addItem(item);
    triggerToast(`${p.name} added with love ♡`, true);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    triggerToast('Welcome to the KIDOBOX family! Code KIDO500 copied ♡', false);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('KIDO500').catch(() => {});
    }
  };

  const scrollTrack = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: 'left' | 'right',
    multiplier = 0.75
  ) => {
    if (!ref.current) return;
    const scrollAmount = Math.max(260, ref.current.clientWidth * multiplier);
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const newbornBanner = banners.find(b => b.position === 'footer_banner');
  const newborn = newbornBanner ? { title: newbornBanner.title, description: newbornBanner.subtitle, image: newbornBanner.desktop_image_url, link: newbornBanner.cta_link, cta: newbornBanner.cta_text } : content.newborn;

  const filteredProducts = products.filter(
    (p) => p.tag === 'Bestseller' && (activeTab === 'all' || p.categorySlugs?.includes(activeTab))
  );

  // Trending Nursery & Toddler Favorites
  const nurseryToddlerFavorites = useMemo(() => {
    const catalogMatches = products.filter((p) => {
      const slugs = p.categorySlugs || [];
      return (
        slugs.includes('nursery') ||
        slugs.includes('age-toddler') ||
        slugs.includes('toys') ||
        slugs.includes('feeding') ||
        p.category === 'nursery' ||
        p.category === 'toys' ||
        p.category === 'feeding' ||
        p.age === '1-2Y' ||
        p.age === 'toddler'
      );
    });

    const curatedNurseryToddler: Product[] = [
      {
        id: 'nursery-crib-convertible',
        slug: 'convertible-wooden-crib-toddler-bed',
        name: 'Solid Beechwood Convertible Crib & Toddler Bed',
        detail: 'Sustainable solid wood crib with 3 adjustable heights that effortlessly transitions into a safe toddler daybed.',
        price: 8999,
        old: 11999,
        category: 'nursery',
        categorySlugs: ['nursery', 'age-toddler'],
        image: '/assets/hd/nursery.webp',
        images: ['/assets/hd/nursery.webp'],
        rating: 4.9,
        reviews: 42,
        brand: 'KIDOBOX Home',
        age: '0-4Y',
        sizes: ['Standard'],
        colors: ['Natural Oak', 'Warm White'],
        tag: 'Bestseller',
        isNew: true,
        features: ['Solid Beechwood', 'Non-Toxic Finish', 'Convertible 3-in-1'],
        inStock: true,
        variantId: 'nursery-crib-v1',
        variants: [
          {
            id: 'nursery-crib-v1',
            title: 'Natural Oak',
            price: 8999,
            compare_at_price: 11999,
            inventory_quantity: 25,
          },
        ],
      },
      {
        id: 'nursery-rocker-bouncer',
        slug: 'ergonomic-infant-toddler-bouncer',
        name: 'Ergonomic Natural Bouncer & Toddler Rocker',
        detail: 'Self-rocking soothing bouncer with 3 ergonomic recline levels and breathable organic cotton mesh cover.',
        price: 3499,
        old: 4499,
        category: 'nursery',
        categorySlugs: ['nursery', 'age-toddler'],
        image: '/assets/hd/nursery2.webp',
        images: ['/assets/hd/nursery2.webp'],
        rating: 4.8,
        reviews: 58,
        brand: 'Chicco',
        age: '0-2Y',
        sizes: ['Standard'],
        colors: ['Cloud Grey', 'Soft Pink'],
        tag: 'Parent Favorite',
        isNew: false,
        features: ['Natural Motion', 'OEKO-TEX Certified', 'Flat Fold'],
        inStock: true,
        variantId: 'nursery-rocker-v1',
        variants: [
          {
            id: 'nursery-rocker-v1',
            title: 'Cloud Grey',
            price: 3499,
            compare_at_price: 4499,
            inventory_quantity: 30,
          },
        ],
      },
      {
        id: 'toddler-sensory-activity-cube',
        slug: 'montessori-wooden-activity-learning-cube',
        name: 'Montessori 5-in-1 Wooden Activity Learning Cube',
        detail: 'Interactive multi-sided sensory play center featuring bead maze, shape sorter, gear spinners, and sliding animal track.',
        price: 1299,
        old: 1799,
        category: 'toys',
        categorySlugs: ['toys', 'age-toddler'],
        image: '/assets/hd/toddler.webp',
        images: ['/assets/hd/toddler.webp'],
        rating: 4.9,
        reviews: 76,
        brand: 'Fisher-Price',
        age: '1-3Y',
        sizes: ['One Size'],
        colors: ['Pastel Multi'],
        tag: 'Trending',
        isNew: true,
        features: ['Montessori Play', 'Smooth Rounded Edges', 'Non-Toxic Colors'],
        inStock: true,
        variantId: 'toddler-cube-v1',
        variants: [
          {
            id: 'toddler-cube-v1',
            title: 'Pastel Multi',
            price: 1299,
            compare_at_price: 1799,
            inventory_quantity: 40,
          },
        ],
      },
      {
        id: 'toddler-anti-slip-training-cup',
        slug: 'silicone-weighted-straw-sippy-cup',
        name: 'Anti-Spill Weighted Straw Toddler Training Cup',
        detail: 'Durable 360-degree weighted silicone straw that lets toddlers sip from any angle without spills or leaks.',
        price: 499,
        old: 699,
        category: 'feeding',
        categorySlugs: ['feeding', 'age-toddler'],
        image: '/assets/hd/feeding2.webp',
        images: ['/assets/hd/feeding2.webp'],
        rating: 4.7,
        reviews: 31,
        brand: 'KIDOBOX',
        age: '6M-3Y',
        sizes: ['250ml'],
        colors: ['Mint Green', 'Powder Pink'],
        tag: 'Bestseller',
        isNew: false,
        features: ['Leak-Proof Valve', 'BPA & Phthalate Free', 'Easy Grip Handles'],
        inStock: true,
        variantId: 'toddler-cup-v1',
        variants: [
          {
            id: 'toddler-cup-v1',
            title: 'Mint Green',
            price: 499,
            compare_at_price: 699,
            inventory_quantity: 60,
          },
        ],
      },
    ];

    const catalogSlugs = new Set(catalogMatches.map((p) => p.slug));
    const uniqueCurated = curatedNurseryToddler.filter((c) => !catalogSlugs.has(c.slug));

    // Combine: specific nursery/toddler products first, then curated, then other catalog products
    const allMatches = [...catalogMatches, ...uniqueCurated];
    const otherCatalog = products.filter((p) => !catalogSlugs.has(p.slug));

    return [...allMatches, ...otherCatalog];
  }, [products]);

  if (isLoading && products.length === 0) {
    return <BrandLoadingScreen fullScreen={true} />;
  }

  return (
    <div data-page="home" className="min-h-screen flex flex-col bg-white">
      <StoreNav />

      <main id="main-content" className="flex-1">
        {/* ── 1. Interactive Hero Slider with Autoplay & Badges ──────── */}
        <HeroSlider />
        {isError && (
          <p className="container" role="alert">
            Unable to load the store.{' '}
            <button onClick={() => refetch()} className="underline font-bold text-[#802f4a]">
              Retry
            </button>
          </p>
        )}
        {!isLoading && !isError && products.length === 0 && (
          <p className="container text-center py-12 text-[#616161]">No products are available yet.</p>
        )}

        <div className="container main-content">
          {/* ── 2. Shop by Category with Quick-Glide Arrows ────────────── */}
          <section
            id="categories"
            className="category-strip-wrap category-preview-section"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setCategoryPreview(null);
            }}
          >
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Sparkles size={20} /></span> Shop by Category
                </h2>
                <p>Explore safe, gentle essentials tailored for little milestones</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link className="view-link" href="/categories">
                  View All Categories <span>→</span>
                </Link>
                <div className="slider-nav-arrows">
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(categoryStripRef, 'left', 0.5)}
                    aria-label="Scroll categories left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(categoryStripRef, 'right', 0.5)}
                    aria-label="Scroll categories right"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div className="category-slider-track" id="category-grid" ref={categoryStripRef} onScroll={() => setCategoryPreview(null)}>
              {categories.map((c) => (
                <Link
                  className="category category-card-compact"
                  href={`/collections/${c.slug}`}
                  key={c.slug}
                  aria-describedby={categoryPreview?.category.slug === c.slug ? 'category-preview-description' : undefined}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') showCategoryPreview(c, event.currentTarget);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === 'mouse' && !event.currentTarget.matches(':focus-visible')) setCategoryPreview(null);
                  }}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(':focus-visible')) showCategoryPreview(c, event.currentTarget);
                  }}
                  onBlur={() => setCategoryPreview(null)}
                >
                  <LazyImage
                    src={mediaUrl(c.image)}
                    alt={c.name}
                    width={115}
                    height={106}
                    aspectRatio="1.08"
                    priority
                    style={{ borderRadius: '35%', marginBottom: '9px' }}
                  />
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
            {categoryPreview && (
              <div
                className="category-preview"
                ref={categoryPreviewRef}
                key={categoryPreview.category.slug}
                style={{ '--category-preview-center': `${categoryPreview.center}px` } as React.CSSProperties}
              >
                <LazyImage src={mediaUrl(categoryPreview.category.image)} alt="" width={340} height={180} priority />
                <div className="category-preview-copy">
                  <h3>{categoryPreview.category.name}</h3>
                  <p id="category-preview-description">
                    {categoryPreview.category.description || `Explore the ${categoryPreview.category.name} collection.`}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* ── 3. Featured Promo Banners (Full-Width Responsive) ────────── */}
          <section className="promos" aria-label="Featured collections">
            {banners.filter(b => b.position === 'promotional_strip').map((b, i) => (
              <article className={`promo ${['pink-bg', 'blue-bg', 'yellow-bg'][i % 3]}`} key={b.id}>
                <div><h3>{b.title}</h3><p>{b.subtitle}</p><Link className="button pink glow-on-hover" href={safeLink(b.cta_link)}>{b.cta_text} →</Link></div>
                <picture><source media="(max-width: 640px)" srcSet={mediaUrl(b.mobile_image_url || b.desktop_image_url)} /><img src={mediaUrl(b.desktop_image_url)} alt={b.title} className="promo-bg-img" style={{ position: 'absolute', right: 0, bottom: 0, width: '59%', height: '100%', objectFit: 'cover' }} /></picture>
              </article>
            ))}
          </section>

          {/* ── 4. Interactive Horizontal Product Slider: Trending Now ──── */}
          <ProductSlider
            title="Trending Nursery & Toddler Favorites"
            subtitle="Most added to parent wishlists this week"
            icon={<Flame size={20} />}
            viewAllLink="/bestsellers"
            viewAllText="Explore All Trending"
            products={nurseryToddlerFavorites}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
          />

          {/* ── 5. Newborn Essentials Full-Width Banner ───────────────── */}
          {newborn?.title && (
            <section className="newborn-editorial" aria-labelledby="newborn-heading">
              <div className="newborn-editorial-copy">
                <span className="newborn-editorial-kicker">THE FIRST SIX MONTHS</span>
                <h2 id="newborn-heading">{newborn.title}</h2>
                <p>{newborn.description}</p>
                <Link className="newborn-editorial-link" href={safeLink(newborn.link)}>
                  {newborn.cta || 'Shop Newborn Essentials'}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <LazyImage
                src={newborn.image && !['newborn', '/assets/hd/newborn.webp'].includes(newborn.image)
                  ? mediaUrl(newborn.image)
                  : '/assets/hd/newborn-editorial.webp'}
                alt={newbornBanner?.alt_text || ''}
                width={1440}
                height={810}
              />
            </section>
          )}

          {/* ── 6. Tabbed Bestsellers Catalog ─────────────────────────── */}
          <section id="bestsellers" className="home-bestsellers">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Heart size={20} fill="currentColor" /></span> Most-Loved Bestsellers
                </h2>
                <p>Explore favorite finds for playtime, mealtime, and everything in between.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link className="view-link" href="/bestsellers">
                  View All Bestsellers →
                </Link>
                <div className="slider-nav-arrows">
                    <button
                      type="button"
                      className="slider-nav-btn"
                      onClick={() => scrollTrack(bestsellersSliderRef, 'left')}
                      aria-label="Scroll bestsellers left"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="slider-nav-btn"
                      onClick={() => scrollTrack(bestsellersSliderRef, 'right')}
                      aria-label="Scroll bestsellers right"
                    >
                      ›
                    </button>
                  </div>
              </div>
            </div>

            {/* Category Filter Tabs on dedicated clean row */}
            <div className="bestsellers-filter-strip" >
              <div className="filter-tabs" aria-label="Product categories">
                  {[['all', 'All Favorites'], ...categories.map(c => [c.slug, c.name])].map(([tabKey, label]) => (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => {
                        setActiveTab(tabKey);
                        bestsellersSliderRef.current?.scrollTo({ left: 0, behavior: 'instant' });
                      }}
                      className={activeTab === tabKey ? 'active' : ''}
                      aria-pressed={activeTab === tabKey}
                    >
                      {label}
                    </button>
                  ))}
                </div>
            </div>

            <div
              className="product-slider-track bestsellers-slider-track"
              id="bestsellers-slider-track"
              ref={bestsellersSliderRef}
            >
              {!filteredProducts.length && <p className="bestsellers-empty">No bestsellers in this category yet.</p>}
              {filteredProducts.map((p) => {
                const isSaved = wishlist.includes(p.id);
                const categoryObj = categories.find((c) => c.slug === p.category);
                const hasDiscount = p.old > p.price;
                const discountPercent = hasDiscount
                  ? Math.round(((p.old - p.price) / p.old) * 100)
                  : 0;

                return (
                  <article className="product-card product-slider-card" key={p.id}>
                    <div className="product-image-wrap">
                      <ProductQuickView product={p} />
                      <Link href={`/products/${p.slug}`} aria-label={`View ${p.name}`}>
                        <LazyImage
                          className="product-photo"
                          src={mediaUrl(p.image)}
                          width={600}
                          height={600}
                          alt={p.name}
                          aspectRatio="1"
                        />
                      </Link>

                      {hasDiscount && (
                        <span className="product-tag discount-tag">
                          −{discountPercent}%
                        </span>
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
                      <Link href={`/collections/${p.category}`} className="product-category">
                        {categoryObj?.short || p.category}
                      </Link>
                      <h3>
                        <Link href={`/products/${p.slug}`}>{p.name}</Link>
                      </h3>
                      <p className="detail">{p.detail}</p>
                      {p.reviews > 0 && <div className="rating">
                        <span className="stars" aria-label={`${p.rating} stars`}>
                          {"★".repeat(Math.round(p.rating))}
                        </span>{' '}
                        &nbsp;{p.rating} <span>({p.reviews})</span>
                      </div>}
                      <div className="product-bottom">
                        <div>
                          <span className="price">{money(p.price)}</span>
                          {hasDiscount && <span className="old-price">{money(p.old)}</span>}
                        </div>
                        <button
                          className="add-cart"
                          type="button"
                          disabled={!p.inStock} onClick={() => handleAddToCart(p)}
                          aria-label={`Add ${p.name} to cart`}
                        >
                          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M2 3h3l3 13h11l3-9H6" />
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                          </svg>
                          <span>{p.inStock ? 'Add to Cart' : 'Sold out'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── 7. Shop by Age Slider ───────────────────────────────── */}
          <section id="ages">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Baby size={20} /></span> Shop by Age
                </h2>
                <p>Find the perfect gear and toys crafted for every stage</p>
              </div>
              <Link className="view-link" href="/ages">
                View All Stages <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="home-stage-grid" id="age-grid">
              {ages.map((a) => (
                <Link className="home-stage-tile" href={`/shop?age=${encodeURIComponent(a.age)}`} key={a.slug}>
                  <LazyImage
                    src={stagePhotography[a.slug] || mediaUrl(a.image)}
                    alt=""
                    width={768}
                    height={512}
                  />
                  <div className="home-stage-copy">
                    <div>
                      <p>{a.title}</p>
                      <h3>{a.subtitle}</h3>
                    </div>
                    <span className="home-stage-arrow"><ArrowRight size={18} aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>



          {!!content.benefits?.length && (
            <section className="home-benefits" aria-labelledby="home-benefits-heading">
              <div className="home-benefits-intro">
                <span className="home-benefits-kicker"><Award size={16} aria-hidden="true" /> THE KIDOBOX PROMISE</span>
                <h2 id="home-benefits-heading">Why Choose KIDOBOX?</h2>
                <p>Thoughtfully chosen essentials for everyday moments with your little one.</p>
              </div>
              <ul className="home-benefits-list">
                {content.benefits.map((benefit, index) => {
                  const Icon = benefitIcons[index % benefitIcons.length];
                  return (
                    <li key={index}>
                      <span className="home-benefit-icon"><Icon size={22} aria-hidden="true" /></span>
                      <div>
                        <strong>{benefit.title}</strong>
                        <span>{benefit.subtitle}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* ── 11. Parenting Tips & Guides Slider (Single Row) ───────── */}
          <section id="guides" className="guides-section">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><BookOpen size={20} /></span> Parenting Tips &amp; Guides
                </h2>
                <p>Helpful advice and milestones for a happier parenting journey</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link className="view-link" href="/guides">
                  View All Articles →
                </Link>
                <div className="slider-nav-arrows">
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(guidesSliderRef, 'left')}
                    aria-label="Previous guides"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(guidesSliderRef, 'right')}
                    aria-label="Next guides"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div className="guides-slider-track" ref={guidesSliderRef} id="blog-grid">
              {articles.map((a) => (
                <Link className="guide-card" href={`/guides/${a.slug}`} key={a.slug}>
                  <div className="guide-card-photo">
                    <LazyImage
                      src={mediaUrl(a.image)}
                      alt={a.title}
                      width={800}
                      height={500}
                    />
                    <span className="guide-category-chip">{a.category}</span>
                  </div>
                  <div className="guide-card-body">
                    <h3>{a.title}</h3>
                    {a.excerpt && <p className="guide-excerpt">{a.excerpt}</p>}
                    <div className="guide-card-footer">
                      <span className="guide-read-time">
                        <Clock size={13} /> {a.minutes} min read
                      </span>
                      <span className="guide-read-cta">
                        Read Guide <ArrowRight size={13} className="guide-arrow" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 12. Interactive Reviews & Testimonials Slider ─────────── */}
          <ReviewsSlider />

          {/* ── 13. Follow Us on Instagram (Full Width 6-Grid) ────────── */}
          <section id="instagram">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Camera size={20} /></span> Follow Us on Instagram
                </h2>
                <p>Get inspired by real moments and happy giggles from our KIDOBOX family</p>
              </div>
              <Link className="instagram-handle glow-on-hover" href={safeLink(content.copy?.instagram_link)}>
                ◎ &nbsp;{content.copy?.instagram_handle}
              </Link>
            </div>
            <div className="instagram-grid" id="instagram-grid">
              {(content.instagram || []).map((post, i) => (
                <Link href={safeLink(post.link)} aria-label={post.title} key={i}>
                  <LazyImage
                    src={mediaUrl(post.image)}
                    width={600}
                    height={600}
                    alt={post.title}
                    aspectRatio="1.14"
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* ── 14. VIP Family Club & Welcome Voucher ───────────────── */}
          <section className="family-club-banner family-club-feature" aria-labelledby="family-club-heading">
            <div className="family-club-content">
              <span className="family-club-badge">
                <Sparkles size={14} aria-hidden="true" />
                <span>KIDOBOX LITTLE FAMILY CLUB</span>
              </span>
              <h2 id="family-club-heading">Join our family. Get ₹500 off.</h2>
              <p>
                Subscribe for gentle milestone tips, early access to organic drops,
                and an instant ₹500 welcome voucher for your next order.
              </p>

              {!newsletterSubmitted ? (
                <form onSubmit={handleNewsletterSubmit} className="family-club-form">
                  <div className="family-input-wrap">
                    <Mail size={18} className="family-input-icon" />
                    <input
                      type="email"
                      autoComplete="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      aria-label="Email address for family club"
                    />
                  </div>
                  <button type="submit" className="family-club-btn">
                    <span>Claim ₹500 Off</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <div className="family-club-success">
                  <CheckCircle2 size={22} color="#059669" />
                  <div className="family-success-text">
                    <strong>You&apos;re in the club! Use code at checkout:</strong>
                    <button
                      type="button"
                      className="voucher-pill"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText('KIDO500').catch(() => {});
                        }
                        triggerToast('Voucher code KIDO500 copied! ♡', false);
                      }}
                      title="Click to copy code"
                    >
                      <code>KIDO500</code>
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              )}

              <div className="family-club-perks">
                <span><ShieldCheck size={16} color="#10b981" /> 100% Certified Baby-Safe</span>
                <span><Truck size={16} color="#00adeb" /> Free Express Delivery</span>
                <span><Gift size={16} color="#802f4a" /> Secret Birthday Perks</span>
              </div>
            </div>

            <div className="family-club-ticket-wrap">
              <div className="family-ticket-card">
                <div className="ticket-top">
                  <span className="ticket-tag">WELCOME VOUCHER</span>
                  <Gift size={22} aria-hidden="true" />
                </div>
                <div className="ticket-body">
                  <span className="ticket-amount">₹500</span>
                  <span className="ticket-off">FLAT OFF</span>
                </div>
                <p className="ticket-sub">Valid on all baby clothes, nursery &amp; care</p>
                <div className="ticket-cut">
                  <span className="cut-circle cut-left"></span>
                  <div className="cut-line"></div>
                  <span className="cut-circle cut-right"></span>
                </div>
                <div className="ticket-footer">
                  <div className="ticket-code-box">
                    <small>COUPON CODE</small>
                    <b>KIDO500</b>
                  </div>
                  <button
                    type="button"
                    className="ticket-copy-btn"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText('KIDO500').catch(() => {});
                      }
                      triggerToast('Code KIDO500 copied! Apply at checkout ♡', false);
                    }}
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showBackToTop && (
        <button
          type="button"
          className="back-top glow-btn"
          id="back-top"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          })}
        >
          <Baby size={22} aria-hidden="true" />
        </button>
      )}

      {/* Interactive Toast Notification */}
      <aside
        className={`toast ${toastMessage ? 'show' : ''}`}
        id="toast"
        role="status"
        aria-live="polite"
      >
        <span>{toastMessage}</span>
        {showToastLink && (
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsOpen(true);
            }}
            style={{
              marginLeft: '12px',
              color: '#d7a7b7',
              textDecoration: 'underline',
              fontWeight: 800,
            }}
          >
            View Bag →
          </button>
        )}
      </aside>

      <StoreFooter />
    </div>
  );
}
