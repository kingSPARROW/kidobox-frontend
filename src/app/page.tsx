'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';

export default function KidoboxHomePage() {
  const { categories, products, ages, articles, brands, isLoading, isError, refetch, content, banners, offers } = useStorefront();
  const { addItem, setIsOpen } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToastLink, setShowToastLink] = useState(false);
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
            products={products.filter(p => p.featured)}
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
              <h2>{newborn?.title}</h2>
              <p>{newborn?.description}</p>
              <Link className="button pink glow-on-hover" href={safeLink(newborn?.link)}>
                {newborn?.cta} →
              </Link>
            </div>
            <div className="newborn-benefits">
              <span className="benefit-item">
                <Feather size={20} className="benefit-svg" />
                <small>Ultra Soft</small>
              </span>
              <span className="benefit-item">
                <Sparkles size={20} className="benefit-svg" />
                <small>Hypoallergenic</small>
              </span>
              <span className="benefit-item">
                <Leaf size={20} className="benefit-svg" />
                <small>100% Organic</small>
              </span>
              <span className="benefit-item">
                <ShieldCheck size={20} className="benefit-svg" />
                <small>Certified Safe</small>
              </span>
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

          {/* ── 8. Special Offers Slider ────────────────────────────── */}
          <section id="offers">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><Tag size={20} /></span> Special Offers
                </h2>
                <p>Limited-time baby bundles and smart parenting savings</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link className="view-link" href="/offers">
                  View All Offers →
                </Link>
                <div className="slider-nav-arrows">
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(offersSliderRef, 'left')}
                    aria-label="Scroll offers left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(offersSliderRef, 'right')}
                    aria-label="Scroll offers right"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
            <div className="offer-slider-track" ref={offersSliderRef}>
              {offers.map((offer, i) => (
                <article className={`offer offer-slider-card ${['pink-bg', 'blue-bg', 'yellow-bg'][i % 3]}`} key={offer.code}>
                  <h3>{offer.code}: {offer.type === 'percentage' ? `${offer.value}% OFF` : offer.type === 'free_shipping' ? 'Free shipping' : `${money(offer.value)} OFF`}</h3>
                  <p>{offer.title}{offer.min_cart_amount > 0 ? ` · Orders over ${money(offer.min_cart_amount)}` : ''}{offer.max_discount_amount ? ` · Up to ${money(offer.max_discount_amount)}` : ''}</p>
                  <Link className="button pink glow-on-hover" href="/offers">Shop Now →</Link>
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
              {(content.benefits || []).map((benefit, i) => <div className="benefit" key={i}><span className="benefit-icon-badge">{[<Leaf key="leaf" size={22} color="#10b981" />, <Heart key="heart" size={22} color="#ff268b" />, <Compass key="compass" size={22} color="#00adeb" />, <Gift key="gift" size={22} color="#f59e0b" />, <ShieldCheck key="shield" size={22} color="#0284c7" />, <Truck key="truck" size={22} color="#8b5cf6" />][i % 6]}</span><p>{benefit.title}<small>{benefit.subtitle}</small></p></div>)}
            </div>
          </section>

          {/* ── 10. Trending Baby Brands ──────────────────────────────── */}
          <section id="brands">
            <div className="section-title">
              <div>
                <h2>
                  <span className="section-icon-wrap"><TrendingUp size={20} /></span> Trending Brands
                </h2>
                <p>World-class labels trusted by pediatricians &amp; mothers</p>
              </div>
              <Link className="view-link" href="/brands">
                All Brands →
              </Link>
            </div>
            <div className="brands" id="brands-list">
              {brands.map((brand, i) => <Link className={['pampers', 'huggies', 'johnsons', 'meemee', 'avent', 'chicco', 'babyhug', 'fisher'][i % 8]} href={`/shop?brand=${encodeURIComponent(brand)}`} key={brand}>{brand}</Link>)}
            </div>
          </section>

          {/* ── 11. Parenting Tips & Guides Slider ────────────────────── */}
          <section id="guides">
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
                    aria-label="Scroll guides left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="slider-nav-btn"
                    onClick={() => scrollTrack(guidesSliderRef, 'right')}
                    aria-label="Scroll guides right"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
            <div className="blog-slider-track" id="blog-grid" ref={guidesSliderRef}>
              {articles.map((a) => (
                <Link className="blog-card blog-slider-card" href={`/guides/${a.slug}`} key={a.slug}>
                  <div className="blog-photo">
                    <LazyImage
                      src={mediaUrl(a.image)}
                      alt={a.title}
                      width={1000}
                      height={650}
                    />
                    <span>{a.category}</span>
                  </div>
                  <div className="blog-body">
                    <h3>{a.title}</h3>
                    <p>◷ {a.minutes} min read &nbsp; · &nbsp; KIDOBOX Journal</p>
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

          {/* ── 14. App Download Banner ──────────────────────────────── */}
          {content.app?.title && <section className="app-banner">
            <span className="app-star float-anim"><Sparkles size={34} color="#ffbc00" /></span>
            <div className="phone-mockup mascot-float">
              <div className="phone-camera"></div>
              <img src="/logo.png" alt="KIDOBOX mobile app" style={{ maxHeight: '35px', width: 'auto', margin: '0 auto' }} />
              <span>
                Little needs.
                <br />
                <b>Big smiles.</b>
              </span>
              <span className="phone-heart">♡</span>
            </div>
            <div>
              <h2>{content.app?.title}</h2>
              <p>{content.app?.description}</p>
              <div className="app-buttons">
                <Link className="glow-on-hover" href={safeLink(content.app?.ios_link)} aria-label="Download for iOS">
                  <small>Download on the</small>
                  Apple Store
                </Link>
                <Link className="glow-on-hover" href={safeLink(content.app?.android_link)} aria-label="Download for Android">
                  <small>GET IT ON</small>
                  Google Play
                </Link>
              </div>
            </div>
            <span className="app-rainbow float-anim">🌈</span>
          </section>}
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
