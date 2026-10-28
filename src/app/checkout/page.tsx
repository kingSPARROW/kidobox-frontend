'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { money } from '@/lib/kidobox-data';
import confetti from 'canvas-confetti';
import { ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, subtotal, discountCode } = useCart();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discount = discountCode === 'LITTLE10' ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal - discount >= 999 || discountCode === 'FREESHIP' ? 0 : 79;
  const total = subtotal - discount + delivery;

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('kidobox-profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.name) {
          const parts = p.name.split(' ');
          setFirstName(parts[0] || '');
          setLastName(parts.slice(1).join(' ') || '');
        }
        if (p.email) setEmail(p.email);
      }
      const savedAddr = localStorage.getItem('kidobox-address');
      if (savedAddr) {
        const a = JSON.parse(savedAddr);
        if (a.street) setStreet(a.street);
        if (a.city) setCity(a.city);
        if (a.pin) setPin(a.pin);
        if (a.state) setState(a.state);
      }
    } catch (e) {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || isSubmitting) return;

    setIsSubmitting(true);
    let orderId = 'KDB-' + Math.floor(100000000 + Math.random() * 900000000);

    // 1. Attempt to sync with Laravel / MongoDB Backend
    try {
      const apiPayload = {
        customer: {
          first_name: firstName || 'Parent',
          last_name: lastName || 'Customer',
          email: email || 'parent@example.com',
          phone: phone || '9876543210',
        },
        shipping_address: {
          address1: street || '123 Little Lane',
          city: city || 'Mumbai',
          state: state || 'Maharashtra',
          postal_code: pin || '400001',
        },
        payment_method: paymentMethod === 'cod' ? 'cod' : paymentMethod === 'upi' ? 'upi' : 'demo',
        items: items.map((item) => ({
          variant_id: item.variant_id,
          product_id: item.product_id,
          title: item.title,
          variant_title: item.variant_title || 'Standard',
          sku: item.sku || 'KDB-ITEM',
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
        })),
        discount_code: discountCode || null,
        notes: 'Placed via KIDOBOX Storefront Demo Checkout',
      };

      const res = await fetchApi('/checkout/order', {
        method: 'POST',
        body: JSON.stringify(apiPayload),
      });

      if (res && res.order && (res.order.order_number || res.order._id)) {
        orderId = String(res.order.order_number || res.order._id);
      }
    } catch (apiErr) {
      console.warn('Backend order sync notice (using local storage fallback):', apiErr);
    }

    const orderData = {
      id: orderId,
      date: new Date().toISOString(),
      firstName: firstName || 'Parent',
      lastName,
      email,
      phone,
      address: `${street}, ${city}, ${state} - ${pin}`,
      items: [...items],
      totals: {
        subtotal,
        discount,
        delivery,
        total,
      },
      status: 'Demo order recorded',
    };

    try {
      const raw = localStorage.getItem('kidobox-orders');
      const orders = raw ? JSON.parse(raw) : [];
      orders.unshift(orderData);
      localStorage.setItem('kidobox-orders', JSON.stringify(orders.slice(0, 30)));
      localStorage.setItem('kidobox-last-order', orderId);

      // Save address for future visits
      localStorage.setItem(
        'kidobox-address',
        JSON.stringify({ street, city, pin, state })
      );
    } catch (e) {}

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    clearCart();
    setIsSubmitting(false);
    router.push(`/order-confirmation?order=${encodeURIComponent(orderId)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="checkout">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/cart">Cart</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Demo Checkout</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">SAFE &amp; GENTLE</span>
          <h1>
            <span className="section-icon-wrap"><ShieldCheck size={26} /></span> Demo Checkout
          </h1>
          <p>Complete your demonstration order with zero real payments required.</p>
        </div>

        {items.length === 0 ? (
          <div className="page-empty">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <ShoppingBag size={48} style={{ color: 'var(--pink)' }} />
            </div>
            <h2>Your little bag is empty</h2>
            <p>Add a little favorite before exploring the checkout.</p>
            <Link className="button pink" href="/shop">
              Explore Little Essentials →
            </Link>
          </div>
        ) : (
          <div className="checkout-layout">
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="step-heading">
                <span>1</span>
                <h2>Contact Information</h2>
              </div>
              <div className="form-row">
                <label>
                  First name
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Priya"
                  />
                </label>
                <label>
                  Last name
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Email address
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya@example.com"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                  />
                </label>
              </div>

              <div className="step-heading">
                <span>2</span>
                <h2>Delivery Address</h2>
              </div>
              <label>
                Street address / Apartment
                <input
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House / Flat no, Street name, Landmark"
                />
              </label>
              <div className="form-row">
                <label>
                  City
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                  />
                </label>
                <label>
                  PIN Code
                  <input
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="e.g. 400001"
                  />
                </label>
              </div>
              <label>
                State
                <select value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Other">Other State</option>
                </select>
              </label>

              <div className="step-heading">
                <span>3</span>
                <h2>Delivery Method</h2>
              </div>
              <div className="radio-card">
                <input type="radio" checked readOnly />
                <div>
                  <strong>Standard Express Delivery</strong>
                  <small>Delivered gently to your doorstep in 2–4 business days.</small>
                </div>
                <span>{delivery === 0 ? 'FREE' : money(delivery)}</span>
              </div>

              <div className="step-heading">
                <span>4</span>
                <h2>Payment Option</h2>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                <label
                  className={`radio-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div>
                    <strong>UPI / QR / Instant Pay</strong>
                    <small>Google Pay, PhonePe, Paytm or any UPI App</small>
                  </div>
                  <span>⚡</span>
                </label>
                <label
                  className={`radio-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard, RuPay &amp; NetBanking</small>
                  </div>
                  <span>💳</span>
                </label>
                <label
                  className={`radio-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <small>Pay in cash upon doorstep delivery</small>
                  </div>
                  <span>💵</span>
                </label>
              </div>

              <button
                type="submit"
                className="button pink full-width"
                disabled={isSubmitting}
                style={{ marginTop: '28px', fontSize: '14px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>Place Demo Order ({money(total)}) →</span>
                )}
              </button>

              <p className="demo-disclaimer" style={{ marginTop: '15px' }}>
                Demonstration order. No real payment is charged and no physical shipment is booked.
              </p>
            </form>

            {/* Sidebar Summary */}
            <aside className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-products">
                {items.map((it) => (
                  <div className="summary-product" key={it.variant_id}>
                    <img
                      src={it.image_url || '/assets/hd/clothing.webp'}
                      alt={it.title}
                      width={55}
                      height={55}
                    />
                    <div>
                      <h3>{it.title}</h3>
                      <p>
                        {it.variant_title ? `${it.variant_title} · ` : ''}Qty {it.quantity}
                      </p>
                    </div>
                    <b>{money(it.price * it.quantity)}</b>
                  </div>
                ))}
              </div>

              <div className="summary-line">
                <span>Subtotal</span>
                <b>{money(subtotal)}</b>
              </div>
              {discount > 0 && (
                <div className="summary-line discount">
                  <span>Little savings</span>
                  <b>−{money(discount)}</b>
                </div>
              )}
              <div className="summary-line">
                <span>Delivery</span>
                <b>{delivery === 0 ? 'FREE' : money(delivery)}</b>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <b>{money(total)}</b>
              </div>
            </aside>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
