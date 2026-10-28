'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { products, categories, money, Product } from '@/lib/kidobox-data';
import { ImageMagnifier } from '@/components/image-magnifier';
import { Truck, RotateCcw, Heart, Sparkles, MessageSquareHeart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const { addItem, setIsOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'full' | 'detail'>('full');
  const [zoomOpen, setZoomOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const found = products.find((p) => p.slug === slug) || products[0];
    setProduct(found);
    if (found) {
      setSelectedSize(found.sizes[0] || 'Standard');
      setSelectedColor(found.colors[0] || '');
      document.title = `${found.name} | KIDOBOX`;
    }
  }, [slug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidobox-wishlist');
      if (raw) setWishlist(JSON.parse(raw));
    } catch (e) {}
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StoreNav />
        <div className="container py-24 text-center">Loading product...</div>
        <StoreFooter />
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const categoryObj = categories.find((c) => c.slug === product.category);
  const discountPercent =
    product.old > product.price
      ? Math.round(((product.old - product.price) / product.old) * 100)
      : 0;

  const toggleWishlist = () => {
    setWishlist((prev) => {
      const next = prev.includes(product.id)
        ? prev.filter((x) => x !== product.id)
        : [...prev, product.id];
      try {
        localStorage.setItem('kidobox-wishlist', JSON.stringify(next));
        window.dispatchEvent(new Event('wishlist-updated'));
      } catch (e) {}
      setToastMessage(
        prev.includes(product.id)
          ? `${product.name} removed from wishlist`
          : `${product.name} saved with love ♡`
      );
      setTimeout(() => setToastMessage(null), 3000);
      return next;
    });
  };

  const handleAddToCart = () => {
    addItem(
      {
        product_id: String(product.id),
        variant_id: `${product.id}-${selectedSize}-${selectedColor}`,
        title: product.name,
        variant_title: [selectedSize, selectedColor].filter(Boolean).join(' · '),
        price: product.price,
        image_url: `/assets/hd/${product.image}.webp`,
      },
      quantity
    );
    setToastMessage(`${product.name} added with love ♡`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBuyNow = () => {
    addItem(
      {
        product_id: String(product.id),
        variant_id: `${product.id}-${selectedSize}-${selectedColor}`,
        title: product.name,
        variant_title: [selectedSize, selectedColor].filter(Boolean).join(' · '),
        price: product.price,
        image_url: `/assets/hd/${product.image}.webp`,
      },
      quantity
    );
    router.push('/checkout');
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.tag === 'Bestseller'))
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="product">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/shop">Shop</Link>
          {categoryObj && (
            <>
              <span aria-hidden="true">›</span>
              <Link href={`/${categoryObj.slug}`}>{categoryObj.name}</Link>
            </>
          )}
          <span aria-hidden="true">›</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        {/* Product Detail Layout */}
        <div className="product-detail">
          {/* Gallery with Amazon-style Magnifier */}
          <div className="product-gallery">
            <ImageMagnifier
              src={`/assets/hd/${product.image}.webp`}
              alt={product.name}
              tag={product.tag}
              isNew={product.isNew}
              zoomLevel={2.8}
              onEnlargeClick={() => setZoomOpen(true)}
            />
            <div className="gallery-caption">
              <span>🔍 Hover over image to zoom</span> · <span>Click ⊕ to expand</span>
            </div>
            <div className="gallery-thumbs">
              <button
                className={viewMode === 'full' ? 'active' : ''}
                onClick={() => setViewMode('full')}
                aria-label="Full product view"
              >
                <img
                  src={`/assets/hd/${product.image}.webp`}
                  alt="Full view"
                  width={100}
                  height={100}
                />
              </button>
              <button
                className={viewMode === 'detail' ? 'active' : ''}
                onClick={() => setViewMode('detail')}
                aria-label="Product detail view"
              >
                <img
                  src={`/assets/hd/${product.image}.webp`}
                  alt="Detail view"
                  width={100}
                  height={100}
                />
              </button>
              <span>
                ♡<small>Chosen with love</small>
              </span>
            </div>
          </div>

          {/* Description & Purchase Controls */}
          <div className="product-description">
            <Link className="mini-eyebrow" href={`/${product.category}`}>
              {categoryObj?.name || product.category}
            </Link>
            <h1>{product.name}</h1>
            <p className="product-subtitle">{product.detail}</p>

            <a className="detail-rating" href="#product-reviews">
              <span className="stars">★★★★★</span> {product.rating}{' '}
              <span>({product.reviews} sample reviews)</span>
            </a>

            <div className="detail-price">
              <strong>{money(product.price)}</strong>
              {product.old > product.price && <s>{money(product.old)}</s>}
              {discountPercent > 0 && <span>{discountPercent}% OFF</span>}
            </div>
            <small className="tax-note">Inclusive of all taxes · Little Needs. Big Smiles.</small>

            <div>
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <fieldset>
                  <legend>
                    Choose your size{' '}
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => setSizeGuideOpen(true)}
                    >
                      Size &amp; details guide
                    </button>
                  </legend>
                  <div className="choice-row">
                    {product.sizes.map((s) => (
                      <label key={s}>
                        <input
                          type="radio"
                          name="size"
                          value={s}
                          checked={selectedSize === s}
                          onChange={() => setSelectedSize(s)}
                        />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <fieldset>
                  <legend>
                    Color <span>{selectedColor}</span>
                  </legend>
                  <div className="choice-row color-choices">
                    {product.colors.map((c, idx) => {
                      const colors = ['#edbfc6', '#e9dfcb', '#c0dbe9', '#dff7ee'];
                      return (
                        <label key={c}>
                          <input
                            type="radio"
                            name="color"
                            value={c}
                            checked={selectedColor === c}
                            onChange={() => setSelectedColor(c)}
                          />
                          <span>
                            <i style={{ '--swatch': colors[idx % colors.length] } as any} />
                            {c}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* Stepper + Add to Cart + Wishlist */}
              <div className="purchase-row">
                <div className="quantity-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    max="20"
                    value={quantity}
                    readOnly
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button className="button pink" type="button" onClick={handleAddToCart}>
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 7h14l2 14H3ZM8 8V6a4 4 0 0 1 8 0v2" />
                  </svg>{' '}
                  Add to Cart
                </button>

                <button
                  type="button"
                  className={`detail-wish wish ${isSaved ? 'saved' : ''}`}
                  onClick={toggleWishlist}
                  aria-label={`Save ${product.name} to wishlist`}
                  aria-pressed={isSaved}
                >
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                </button>
              </div>

              <button className="buy-now" type="button" onClick={handleBuyNow}>
                Buy Now →
              </button>
            </div>

            <div className="product-promises">
              <span>
                <Truck size={18} style={{ color: 'var(--pink)', marginBottom: 4 }} />
                <b>Free delivery</b>
                <small>On orders above ₹999</small>
              </span>
              <span>
                <RotateCcw size={18} style={{ color: 'var(--pink)', marginBottom: 4 }} />
                <b>Easy returns</b>
                <small>Within 7 days</small>
              </span>
              <span>
                <Heart size={18} style={{ color: 'var(--pink)', marginBottom: 4 }} />
                <b>Thoughtfully chosen</b>
                <small>For your little one</small>
              </span>
            </div>

            <p className="demo-disclaimer">
              A lovingly built baby essentials store. Thoughtfully curated with skin-friendly materials.
            </p>
          </div>
        </div>

        {/* Features & Details Tabs */}
        <div className="product-details-tabs">
          <section>
            <h2>Made for the little moments</h2>
            <p>
              {product.detail}. Part of our {categoryObj?.name.toLowerCase() || 'baby care'}{' '}
              collection, this everyday favorite brings a little more joy to your family’s routine.
            </p>
            <ul className="feature-list">
              {product.features.map((f, i) => (
                <li key={i}>
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 12 4 4L20 5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <details open>
              <summary>Product details</summary>
              <dl>
                <div>
                  <dt>Collection</dt>
                  <dd>{categoryObj?.name || product.category}</dd>
                </div>
                <div>
                  <dt>Brand</dt>
                  <dd>{product.brand}</dd>
                </div>
                <div>
                  <dt>Age suitability</dt>
                  <dd>{product.age === 'all' ? 'All ages' : `${product.age} months`}</dd>
                </div>
                <div>
                  <dt>Product code</dt>
                  <dd>KDB-00{product.id}</dd>
                </div>
              </dl>
            </details>

            <details>
              <summary>Care &amp; everyday use</summary>
              <p>
                Follow the care and age guidance included with the product packaging. Store in a cool,
                dry place. Check the product before each use and keep packaging materials away from
                infants.
              </p>
            </details>

            <details>
              <summary>Delivery &amp; returns</summary>
              <p>
                View our <Link href="/shipping">shipping policy</Link> and{' '}
                <Link href="/returns">returns guide</Link>. We offer free shipping on orders over ₹999 and
                hassle-free 7-day returns.
              </p>
            </details>
          </section>
        </div>

        {/* Product Reviews */}
        <section className="page-section" id="product-reviews">
          <div className="section-title">
            <div>
              <h2>
                <span className="section-icon-wrap"><MessageSquareHeart size={20} /></span> Little love notes
              </h2>
              <p>Sample stories from verified parents</p>
            </div>
            <Link className="view-link" href="/reviews">
              All Reviews →
            </Link>
          </div>
          <div className="review-grid">
            <article className="review">
              <img src="/assets/hd/avatar1.webp" width={96} height={96} alt="Ayesha Khan" />
              <div>
                <h3>Ayesha Khan</h3>
                <div className="stars">★★★★★</div>
                <p>Amazing quality products and such lovely details. My little one loves it!</p>
              </div>
              <span>♥</span>
            </article>
            <article className="review">
              <img src="/assets/hd/avatar2.webp" width={96} height={96} alt="Rahul Mehta" />
              <div>
                <h3>Rahul Mehta</h3>
                <div className="stars">★★★★★</div>
                <p>A thoughtful collection of everyday essentials. Highly recommended to new parents.</p>
              </div>
              <span>♥</span>
            </article>
            <article className="review">
              <img src="/assets/hd/avatar3.webp" width={96} height={96} alt="Neha Sharma" />
              <div>
                <h3>Neha Sharma</h3>
                <div className="stars">★★★★★</div>
                <p>Beautiful little things for our family. I love the gentle fabrics and fast delivery.</p>
              </div>
              <span>♥</span>
            </article>
          </div>
        </section>

        {/* You Might Also Love */}
        <section className="page-section">
          <div className="section-title">
            <div>
              <h2>
                <span className="section-icon-wrap"><Heart size={20} fill="currentColor" /></span> You Might Also Love
              </h2>
              <p>A few more little favorites</p>
            </div>
            <Link className="view-link" href="/shop">
              View All →
            </Link>
          </div>
          <div className="product-grid">
            {relatedProducts.map((rel) => {
              const relSaved = wishlist.includes(rel.id);
              return (
                <article className="product-card" key={rel.id}>
                  <div className="product-image-wrap">
                    <Link href={`/products/${rel.slug}`}>
                      <img
                        className="product-photo"
                        src={`/assets/hd/${rel.image}.webp`}
                        width={800}
                        height={800}
                        alt={rel.name}
                      />
                    </Link>
                    <span className={`product-tag ${rel.isNew ? 'new-tag' : ''}`}>{rel.tag}</span>
                    <button
                      className={`wish ${relSaved ? 'saved' : ''}`}
                      onClick={() => {
                        setWishlist((prev) => {
                          const n = prev.includes(rel.id)
                            ? prev.filter((x) => x !== rel.id)
                            : [...prev, rel.id];
                          localStorage.setItem('kidobox-wishlist', JSON.stringify(n));
                          window.dispatchEvent(new Event('wishlist-updated'));
                          return n;
                        });
                      }}
                      aria-label={`Save ${rel.name} to wishlist`}
                    >
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                      </svg>
                    </button>
                  </div>
                  <div className="product-card-info">
                    <Link href={`/${rel.category}`} className="product-category">
                      {rel.category}
                    </Link>
                    <h3>
                      <Link href={`/products/${rel.slug}`}>{rel.name}</Link>
                    </h3>
                    <p className="detail">{rel.detail}</p>
                    <div className="rating">
                      <span className="stars">★★★★★</span> &nbsp;{rel.rating} ({rel.reviews})
                    </div>
                    <div className="product-bottom">
                      <div>
                        <span className="price">{money(rel.price)}</span>
                        <span className="old-price">{money(rel.old)}</span>
                      </div>
                      <button
                        className="add-cart"
                        onClick={() => {
                          addItem({
                            product_id: String(rel.id),
                            variant_id: `${rel.id}-${rel.sizes[0] || 'default'}`,
                            title: rel.name,
                            price: rel.price,
                            image_url: `/assets/hd/${rel.image}.webp`,
                          });
                          setToastMessage(`${rel.name} added with love ♡`);
                          setTimeout(() => setToastMessage(null), 3500);
                        }}
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
        </section>
      </main>

      <StoreFooter />

      {/* Zoom Dialog Modal */}
      {zoomOpen && (
        <div
          className="overlay"
          onClick={() => setZoomOpen(false)}
          style={{ display: 'grid', placeItems: 'center' }}
        >
          <div
            className="zoom-dialog bg-white rounded-2xl relative p-4 max-w-xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close absolute right-4 top-4 text-2xl font-bold"
              onClick={() => setZoomOpen(false)}
            >
              ×
            </button>
            <img
              src={`/assets/hd/${product.image}.webp`}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          className="overlay"
          onClick={() => setSizeGuideOpen(false)}
          style={{ display: 'grid', placeItems: 'center' }}
        >
          <div
            className="bg-white rounded-2xl relative p-8 max-w-lg mx-4 text-[#122e50]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close absolute right-4 top-4 text-2xl font-bold"
              onClick={() => setSizeGuideOpen(false)}
            >
              ×
            </button>
            <h2 className="font-['Fredoka',sans-serif] text-2xl font-semibold mb-3">
              A little size &amp; details guide
            </h2>
            <p className="font-bold mb-2">{product.name}</p>
            <p className="text-xs text-[#637389] leading-relaxed mb-4">
              Available options: {product.sizes.join(', ')}.
            </p>
            <p className="text-xs text-[#637389] leading-relaxed mb-4">
              {product.category === 'clothing'
                ? 'Baby sizes are approximate age ranges. The right fit depends on your little one’s measurements and individual growth. We recommend choosing a comfortable fit with room to move.'
                : 'Check the available options and product specifications before choosing. Refer to the packaging age guidance for best use.'}
            </p>
            <button
              className="button pink w-full text-xs font-bold py-2.5 rounded-full"
              onClick={() => setSizeGuideOpen(false)}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
