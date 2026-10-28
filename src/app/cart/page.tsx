'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { money } from '@/lib/kidobox-data';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, discountCode, setDiscountCode } = useCart();
  const [couponInput, setCouponInput] = useState(discountCode || '');
  const [couponApplied, setCouponApplied] = useState(discountCode === 'LITTLE10' || discountCode === 'FREESHIP');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const discount = couponApplied && discountCode === 'LITTLE10' ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal - discount >= 999 || (couponApplied && discountCode === 'FREESHIP') ? 0 : 79;
  const total = subtotal - discount + delivery;
  const freeShippingProgress = Math.min(100, ((subtotal - discount) / 999) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'LITTLE10' || code === 'FREESHIP') {
      setDiscountCode(code);
      setCouponApplied(true);
      setToastMessage('A little saving, applied with love ♡');
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      setToastMessage('Try LITTLE10 or FREESHIP for a little demo saving.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscountCode('');
    setCouponInput('');
    setToastMessage('Your offer has been removed.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="cart">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Your Shopping Bag</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">A LITTLE BAG OF JOY</span>
          <h1>
            <span className="section-icon-wrap"><ShoppingBag size={26} /></span> Your Shopping Bag
          </h1>
          <p>Thoughtful essentials ready for life’s sweetest little moments.</p>
        </div>

        {items.length === 0 ? (
          <div className="page-empty">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <ShoppingBag size={48} style={{ color: 'var(--pink)' }} />
            </div>
            <h2>Your bag is waiting for a little love</h2>
            <p>Find a thoughtful little favorite for your favorite little person.</p>
            <Link className="button pink" href="/shop">
              Explore Little Essentials →
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div>
              <div className="cart-items">
                {items.map((item) => (
                  <article className="cart-page-row" key={item.variant_id}>
                    <Link href={`/products/${item.product_id}`}>
                      <img
                        src={item.image_url || '/assets/hd/clothing.webp'}
                        width={220}
                        height={220}
                        alt={item.title}
                      />
                    </Link>
                    <div className="cart-item-details">
                      <h3>
                        <Link href={`/products/${item.product_id}`}>{item.title}</Link>
                      </h3>
                      {item.variant_title && <p>{item.variant_title}</p>}
                      <p>{money(item.price)} each</p>
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input value={item.quantity} readOnly aria-label="Quantity" />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <strong className="cart-line-total">{money(item.price * item.quantity)}</strong>
                    <button
                      className="cart-remove"
                      onClick={() => removeItem(item.variant_id)}
                      aria-label={`Remove ${item.title}`}
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
              <Link className="text-link cart-continue" href="/shop">
                ← Keep Exploring
              </Link>
            </div>

            <aside className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-line">
                <span>Subtotal</span>
                <b>{money(subtotal)}</b>
              </div>

              {discount > 0 && (
                <div className="summary-line discount">
                  <span>Little savings (10%)</span>
                  <b>−{money(discount)}</b>
                </div>
              )}

              <div className="summary-line">
                <span>Delivery</span>
                <b>{delivery === 0 ? 'FREE' : money(delivery)}</b>
              </div>

              <div className="shipping-progress">
                {delivery === 0 ? (
                  <span>A little yay! Your order has free delivery.</span>
                ) : (
                  <span>
                    A little closer to free delivery! Add {money(Math.max(0, 999 - (subtotal - discount)))} more.
                  </span>
                )}
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>

              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <input
                  aria-label="Offer code"
                  placeholder="A little offer code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  maxLength={25}
                />
                <button type="submit">Apply</button>
              </form>
              <p className="coupon-hint">
                Try <b>LITTLE10</b> for 10% off essentials.
                {couponApplied && (
                  <button type="button" className="text-link" onClick={handleRemoveCoupon} style={{ marginLeft: '6px' }}>
                    Remove {discountCode}
                  </button>
                )}
              </p>

              <div className="summary-line total">
                <span>Total</span>
                <b>{money(total)}</b>
              </div>

              <Link className="button pink full-width" href="/checkout">
                Continue to Checkout →
              </Link>

              <p className="demo-disclaimer">
                Prices and delivery calculations are illustrative. Free delivery on orders over ₹999.
              </p>
            </aside>
          </div>
        )}
      </main>

      <StoreFooter />

      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status">
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
