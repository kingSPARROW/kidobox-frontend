'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function AccountPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [child, setChild] = useState('');
  const [stage, setStage] = useState('newborn');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidobox-profile');
      if (raw) {
        const p = JSON.parse(raw);
        if (p.name) setName(p.name);
        if (p.email) setEmail(p.email);
        if (p.child) setChild(p.child);
        if (p.stage) setStage(p.stage);
      }
    } catch (e) {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        'kidobox-profile',
        JSON.stringify({ name, email, child, stage })
      );
      setFeedback('Your little family profile is saved on this device. ♡');
      setTimeout(() => setFeedback(null), 3500);
    } catch (e) {
      setFeedback('Browser storage is unavailable.');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('kidobox-profile');
    setName('');
    setEmail('');
    setChild('');
    setStage('newborn');
    setFeedback('Your saved profile has been cleared.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="account">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Your Family Profile</span>
        </nav>

        <div className="help-layout">
          <aside className="help-nav">
            <div className="account-avatar">🧸</div>
            <h3>Family Account</h3>
            <Link href="/account" className="current">
              Family Profile <span>→</span>
            </Link>
            <Link href="/orders">
              Order History <span>→</span>
            </Link>
            <Link href="/addresses">
              Address Book <span>→</span>
            </Link>
            <Link href="/wishlist">
              Saved Wishlist <span>→</span>
            </Link>
            <Link href="/faq">
              Help &amp; FAQs <span>→</span>
            </Link>
          </aside>

          <section className="help-content">
            <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
              <span className="mini-eyebrow">YOUR LITTLE CIRCLE</span>
              <h1>Your Family Profile</h1>
              <p>Keep your contact details and little one’s stage updated for tailored favorites.</p>
            </div>

            <form className="embedded-form" onSubmit={handleSave}>
              <label>
                Your full name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                />
              </label>

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
                Little one’s name <span className="optional">(optional)</span>
                <input
                  value={child}
                  onChange={(e) => setChild(e.target.value)}
                  placeholder="e.g. Kabir"
                />
              </label>

              <label>
                Current little stage
                <select value={stage} onChange={(e) => setStage(e.target.value)}>
                  <option value="expecting">Expecting / Welcoming Soon</option>
                  <option value="newborn">0–6 Months (Newborn Care)</option>
                  <option value="baby">6–12 Months (Growth &amp; Exploration)</option>
                  <option value="toddler">1–2 Years (Active Toddlers)</option>
                  <option value="kids">2+ Years (Little Explorers)</option>
                </select>
              </label>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="button pink">
                  Save Profile ♡
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="button"
                  style={{ background: '#f0f4f8', color: '#637389' }}
                >
                  Clear Details
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
