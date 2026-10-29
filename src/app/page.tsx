'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { money, Product } from '@/lib/kidobox-data';
import { useStorefront, mediaUrl, cartItem, safeLink } from '@/lib/storefront';
import { HeroSlider } from '@/components/hero-slider';
import { ProductSlider } from '@/components/product-slider';
import { ReviewsSlider } from '@/components/reviews-slider';
import { LazyImage } from '@/components/lazy-image';
import {
  Sparkles,
  Heart,
  Baby,
  Tag,
  Award,
  TrendingUp,
  BookOpen,
  Camera,
  Feather,
  Leaf,
  ShieldCheck,
  Compass,
  Gift,
  Truck,
  Star,
  Flame,
  Clock,
  ArrowRight,
  Mail,
  CheckCircle2,
  Copy,
} from 'lucide-react';

export default function KidoboxHomePage() {
  const { categories, products, ages, articles, brands, isLoading, isError, refetch, content, banners, offers } = useStorefront();
  const { addItem, setIsOpen } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToastLink, setShowToastLink] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const categoryStripRef = useRef<HTMLDivElement>(null);
  const bestsellersSliderRef = useRef<HTMLDivElement>(null);
  const ageSliderRef = useRef<HTMLDivElement>(null);
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

  return (
    <div data-page="home" className="min-h-screen flex flex-col bg-white">
      <StoreNav />

      <main id="main-content" className="flex-1">
        {/* ── 1. Interactive Hero Slider with Autoplay & Badges ──────── */}
        <HeroSlider />
        {isLoading && <p className="container" role="status">Loading store…</p>}
        {isError && <p className="container" role="alert">Unable to load the store. <button onClick={() => refetch()}>Retry</button></p>}
        {!isLoading && !isError && products.length === 0 && <p className="container">No products are available yet.</p>}

        <div className="container main-content">
          {/* ── 2. Shop by Category with Quick-Glide Arrows ────────────── */}
          <section id="categories" className="category-strip-wrap">
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

            <div className="category-slider-track" id="category-grid" ref={categoryStripRef}>
              {categories.map((c) => (
                <Link className="category category-card-compact" href={`/collections/${c.slug}`} key={c.slug}>
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

          {/* ── 5. Tabbed Bestsellers Catalog ─────────────────────────── */}
          <section id="bestsellers" style={{ marginTop: '45px' }}>
            <div className="section-title product-heading">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Heart size={20} fill="currentColor" /></span> Most-Loved Bestsellers
                </h2>
                <p>Pediatrician-recommended, parent-approved everyday staples</p>
              </div>
              <div className="bestsellers-toolbar">
                <div className="filter-tabs" aria-label="Product categories">
                  {[['all', 'All Favorites'], ...categories.map(c => [c.slug, c.name])].map(([tabKey, label]) => (
                    <button
                      key={tabKey}
                      onClick={() => setActiveTab(tabKey)}
                      className={activeTab === tabKey ? 'active' : ''}
                      aria-pressed={activeTab === tabKey}
                    >
                      {label}
                    </button>
                  ))}
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
            </div>

            <div
              className="product-slider-track bestsellers-slider-track"
              id="bestsellers-slider-track"
              ref={bestsellersSliderRef}
            >
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
                          SAVE {discountPercent}%
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
                      <div className="rating">
                        <span className="stars" aria-label={`${p.rating} stars`}>
                          {"★".repeat(Math.round(p.rating))}
                        </span>{' '}
                        &nbsp;{p.rating} <span>({p.reviews})</span>
                      </div>
                      <div className="product-bottom">
                        <div>
                          <span className="price">{money(p.price)}</span>
                          {hasDiscount && <span className="old-price">{money(p.old)}</span>}
                        </div>
                        <button
                          className="add-cart glow-btn"
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

          {/* ── 6. Newborn Essentials Full-Width Banner ───────────────── */}
          {newborn?.title && <section className="newborn-banner">
            <div className="newborn-banner-media">
              <LazyImage
                src={mediaUrl(newborn?.image)}
                alt="A peacefully sleeping newborn"
                priority
              />
            </div>
            <div className="newborn-banner-content">
              <span className="newborn-eyebrow">
                <Sparkles size={13} color="#ffbc00" />
                <span>0 – 6 MONTHS ESSENTIALS</span>
              </span>
              <h2>{newborn?.title}</h2>
              <p>{newborn?.description}</p>
              <Link className="button pink glow-on-hover newborn-cta" href={safeLink(newborn?.link)}>
                <span>{newborn?.cta}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="newborn-benefits-card">
              <div className="newborn-benefits-top">
                <span className="benefits-seal">★ CERTIFIED CARE ★</span>
              </div>
              <div className="newborn-benefits-grid">
                <div className="newborn-benefit-item benefit-soft">
                  <div className="benefit-icon-box">
                    <Feather size={20} strokeWidth={2.2} />
                  </div>
                  <div className="benefit-text">
                    <strong>Ultra Soft</strong>
                    <small>Cloud-touch</small>
                  </div>
                </div>

                <div className="newborn-benefit-item benefit-hypo">
                  <div className="benefit-icon-box">
                    <Sparkles size={20} strokeWidth={2.2} />
                  </div>
                  <div className="benefit-text">
                    <strong>Hypoallergenic</strong>
                    <small>Derm tested</small>
                  </div>
                </div>

                <div className="newborn-benefit-item benefit-organic">
                  <div className="benefit-icon-box">
                    <Leaf size={20} strokeWidth={2.2} />
                  </div>
                  <div className="benefit-text">
                    <strong>100% Organic</strong>
                    <small>Zero toxins</small>
                  </div>
                </div>

                <div className="newborn-benefit-item benefit-safe">
                  <div className="benefit-icon-box">
                    <ShieldCheck size={20} strokeWidth={2.2} />
                  </div>
                  <div className="benefit-text">
                    <strong>Certified Safe</strong>
                    <small>Pediatrician OK</small>
                  </div>
                </div>
              </div>
            </div>
          </section>}

          {/* ── 7. Shop by Age Slider ───────────────────────────────── */}
          <section id="ages">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Baby size={20} /></span> Shop by Age
                </h2>
                <p>Find the perfect gear and toys crafted for every stage</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link className="view-link" href="/ages">
                  View All Stages →
                </Link>
                <div className="slider-nav-arrows">
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(ageSliderRef, 'left')}
                    aria-label="Scroll ages left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(ageSliderRef, 'right')}
                    aria-label="Scroll ages right"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
            <div className="age-slider-track" id="age-grid" ref={ageSliderRef}>
              {ages.map((a) => (
                <article className={`age-card age-slider-card ${a.color}`} key={a.slug}>
                  <h3>{a.title}</h3>
                  <p>{a.subtitle}</p>
                  <LazyImage
                    src={mediaUrl(a.image)}
                    alt={a.subtitle}
                    width={800}
                    height={800}
                    style={{ position: 'absolute', right: 0, bottom: 0, height: '100%', width: '70%', objectFit: 'cover' }}
                  />
                  <Link
                    className={`button ${a.color.includes('mint') ? 'mint' : a.color.includes('blue') ? 'blue' : 'pink'} glow-on-hover`}
                    href={`/shop?age=${encodeURIComponent(a.age)}`}
                  >
                    Shop Now <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>



          {/* ── 9. Why Choose KIDOBOX (Full-Width Pill Grid) ─────────── */}
          <section className="why">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Award size={20} /></span> Why Choose KIDOBOX?
                </h2>
                <p>Because your little one deserves absolute care and safety</p>
              </div>
              <span className="why-star float-anim"><Star size={28} fill="#ffbc00" color="#ffbc00" /></span>
            </div>
            <div className="benefit-grid" id="benefit-grid">
              {(content.benefits || []).map((benefit, i) => <div className="benefit" key={i}><span className="benefit-icon-badge">{[<Leaf key="leaf" size={22} color="#10b981" />, <Heart key="heart" size={22} color="#BC0202" />, <Compass key="compass" size={22} color="#00adeb" />, <Gift key="gift" size={22} color="#f59e0b" />, <ShieldCheck key="shield" size={22} color="#0284c7" />, <Truck key="truck" size={22} color="#8b5cf6" />][i % 6]}</span><p>{benefit.title}<small>{benefit.subtitle}</small></p></div>)}
            </div>
          </section>


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
          <section className="family-club-banner" aria-label="Kidobox Family Club">
            <span className="family-club-decor-star float-anim">✨</span>
            <div className="family-club-content">
              <span className="family-club-badge">
                <Sparkles size={14} color="#ffbc00" />
                <span>KIDOBOX LITTLE FAMILY CLUB</span>
              </span>
              <h2>Join Our Family &amp; Get ₹500 Off</h2>
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
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      aria-label="Email address for family club"
                    />
                  </div>
                  <button type="submit" className="family-club-btn glow-btn">
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
                <span><Gift size={16} color="#BC0202" /> Secret Birthday Perks</span>
              </div>
            </div>

            <div className="family-club-ticket-wrap">
              <div className="family-ticket-card">
                <div className="ticket-top">
                  <span className="ticket-tag">WELCOME VOUCHER</span>
                  <span className="ticket-stars">★ ★ ★ ★ ★</span>
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

      {/* Floating Back to Top Button */}
      <button
        className="back-top glow-btn"
        id="back-top"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>

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
              color: '#ffa8cb',
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
