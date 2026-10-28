'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { User } from 'lucide-react';

export default function AddressesPage() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidobox-address');
      if (raw) {
        const a = JSON.parse(raw);
        if (a.street) setStreet(a.street);
        if (a.city) setCity(a.city);
        if (a.pin) setPin(a.pin);
        if (a.state) setState(a.state);
      }
    } catch (e) {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('kidobox-address', JSON.stringify({ street, city, pin, state }));
      setFeedback('Your address has been saved on this device. ♡');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback('Failed to save address.');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('kidobox-address');
    setStreet('');
    setCity('');
    setPin('');
    setState('Maharashtra');
    setFeedback('Saved address removed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="addresses">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/account">Account</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Address Book</span>
        </nav>

        <div className="help-layout">
          <aside className="help-nav">
            <div className="account-avatar">
              <User size={26} />
            </div>
            <h3>Family Account</h3>
            <Link href="/account">Family Profile <span>→</span></Link>
            <Link href="/orders">Order History <span>→</span></Link>
            <Link href="/addresses" className="current">Address Book <span>→</span></Link>
            <Link href="/wishlist">Saved Wishlist <span>→</span></Link>
            <Link href="/faq">Help &amp; FAQs <span>→</span></Link>
          </aside>

          <section className="help-content">
            <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
              <span className="mini-eyebrow">SAVED DESTINATIONS</span>
              <h1>Address Book</h1>
              <p>Keep your delivery address saved for quick, seamless checkouts.</p>
            </div>

            <form className="embedded-form" onSubmit={handleSave}>
              <label>
                Street address / Apartment
                <input
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House no, Street name, Landmark"
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

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="button pink">
                  Save Address ♡
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="button"
                  style={{ background: '#f0f4f8', color: '#637389' }}
                >
                  Clear Address
                </button>
              </div>

              {feedback && <p className="form-feedback">{feedback}</p>}
            </form>
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
