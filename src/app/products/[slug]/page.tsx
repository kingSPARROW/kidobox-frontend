'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { money, Product } from '@/lib/kidobox-data';
import { useStorefront, mediaUrl, cartItem } from '@/lib/storefront';
import { ImageMagnifier } from '@/components/image-magnifier';
import { Truck, RotateCcw, Heart, Sparkles, MessageSquareHeart } from 'lucide-react';

export default function ProductDetailPage() {
  const { products, categories, isLoading, isError, refetch, content, testimonials, store } = useStorefront();
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const { addItem, setIsOpen } = useCart();
  const baseProduct = products.find(p => p.slug === slug);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const selectedVariant = baseProduct?.variants?.find(v => v.id === selectedVariantId) || baseProduct?.variants?.find(v => v.id === baseProduct.variantId);
  const product = baseProduct && selectedVariant ? { ...baseProduct, price: selectedVariant.price, old: selectedVariant.compare_at_price || 0, inStock: selectedVariant.inventory_quantity > 0 } : baseProduct;
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        <div className="container py-24 text-center">{isLoading ? "Loading product…" : isError ? "Unable to load product." : "Product not found."}{isError && <button onClick={() => refetch()}>Retry</button>}</div>
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
    const item = cartItem(product, selectedVariant?.id);
    if (!item || quantity > (selectedVariant?.inventory_quantity || 0)) return;
    addItem(item, quantity);
    setToastMessage(`${product.name} added with love ♡`);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const handleBuyNow = () => {
    const item = cartItem(product, selectedVariant?.id);
    if (!item || quantity > (selectedVariant?.inventory_quantity || 0)) return;
    addItem(item, quantity);
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
              <Link href={`/collections/${categoryObj.slug}`}>{categoryObj.name}</Link>
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
              src={mediaUrl(product.images?.[activeImage] || product.image)}
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
              {(product.images?.length ? product.images : [product.image]).map((src, i) => <button className={activeImage === i ? 'active' : ''} onClick={() => setActiveImage(i)} aria-label={`Product image ${i + 1}`} key={src}><img src={mediaUrl(src)} alt={`${product.name} view ${i + 1}`} width={100} height={100} /></button>)}
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
              <span className="stars">{product.rating > 0 ? "★★★★★" : ""}</span> {product.rating > 0 ? product.rating : "Not yet rated"}{' '}
              <span>({product.reviews} reviews)</span>
            </a>

            <div className="detail-price">
              <strong>{money(product.price)}</strong>
              {product.old > product.price && <s>{money(product.old)}</s>}
              {discountPercent > 0 && <span>{discountPercent}% OFF</span>}
            </div>
            <small className="tax-note">Inclusive of all taxes · Little Needs. Big Smiles.</small>

            <div>
              {Array.from(new Set((product.variants || []).flatMap(v => Object.keys(v.options_map || {})))).map(option => (
                <fieldset key={option}><legend>{option}</legend><div className="choice-row">
                  {Array.from(new Set((product.variants || []).map(v => v.options_map?.[option]).filter(Boolean))).map(value => {
                    const match = product.variants?.find(v => v.options_map?.[option] === value && Object.entries(selectedVariant?.options_map || {}).every(([key, selected]) => key === option || v.options_map?.[key] === selected)) || product.variants?.find(v => v.options_map?.[option] === value);
                    return <label key={value}><input type="radio" name={option} checked={selectedVariant?.options_map?.[option] === value} disabled={!match} onChange={() => { if (match) { setSelectedVariantId(match.id); setQuantity(1); } }} /><span>{value}</span></label>;
                  })}
                </div></fieldset>
              ))}
              {!(product.variants || []).some(v => Object.keys(v.options_map || {}).length) && <fieldset><legend>Choose your variant <button type="button" className="text-link" onClick={() => setSizeGuideOpen(true)}>Size &amp; details guide</button></legend><div className="choice-row">{product.variants?.map(v => <label key={v.id}><input type="radio" name="variant" checked={selectedVariant?.id === v.id} onChange={() => { setSelectedVariantId(v.id); setQuantity(1); }} /><span>{v.title}</span></label>)}</div></fieldset>}

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
                    max={selectedVariant?.inventory_quantity || 1}
                    value={quantity}
                    readOnly
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant?.inventory_quantity || 1, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button className="button pink" type="button" disabled={!product.inStock || quantity > (selectedVariant?.inventory_quantity || 0)} onClick={handleAddToCart}>
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 7h14l2 14H3ZM8 8V6a4 4 0 0 1 8 0v2" />
                  </svg>{' '}
                  {product.inStock ? 'Add to Cart' : 'Sold out'}
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

              <button className="buy-now" type="button" disabled={!product.inStock || quantity > (selectedVariant?.inventory_quantity || 0)} onClick={handleBuyNow}>
                Buy Now →
              </button>
            </div>

            <div className="product-promises">
              <span>
                <Truck size={18} style={{ color: 'var(--pink)', marginBottom: 4 }} />
                <b>Free delivery</b>
                <small>On orders above ₹{store?.settings?.free_shipping_threshold ?? 0}</small>
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
                  <dd>{product.id}</dd>
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
              <p>Stories from our customers</p>
            </div>
            <Link className="view-link" href="/reviews">
              All Reviews →
            </Link>
          </div>
          <div className="review-grid">
            {testimonials.map(t => <article className="review" key={t.id}><img src={mediaUrl(t.avatar_url)} width={96} height={96} alt={t.author_name} /><div><h3>{t.author_name}</h3><div className="stars">{'★'.repeat(t.rating)}</div><p>{t.content}</p></div><span>♥</span></article>)}
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
                        src={mediaUrl(rel.image)}
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
                      <span className="stars">{"★".repeat(Math.round(rel.rating))}</span> &nbsp;{rel.rating} ({rel.reviews})
                    </div>
                    <div className="product-bottom">
                      <div>
                        <span className="price">{money(rel.price)}</span>
                        <span className="old-price">{money(rel.old)}</span>
                      </div>
                      <button
                        className="add-cart" disabled={!rel.inStock}
                        onClick={() => {
                          addItem({
                            product_id: String(rel.id),
                            variant_id: rel.variantId || '',
                            title: rel.name,
                            price: rel.price,
                            image_url: mediaUrl(rel.image),
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
                        <span>{rel.inStock ? 'Add to Cart' : 'Sold out'}</span>
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
              src={mediaUrl(product.images?.[activeImage] || product.image)}
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
