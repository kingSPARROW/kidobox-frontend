'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { Mail, PhoneCall } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('orders');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="contact">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Contact Us</span>
        </nav>

        <div className="help-layout">
          <aside className="help-nav">
            <h3>Customer Care</h3>
            <Link href="/faq">FAQs &amp; Help <span>→</span></Link>
            <Link href="/shipping">Shipping &amp; Delivery <span>→</span></Link>
            <Link href="/returns">Returns &amp; Refunds <span>→</span></Link>
            <Link href="/tracking">Track Order <span>→</span></Link>
            <Link href="/contact" className="current">Contact Us <span>→</span></Link>
          </aside>

          <section className="help-content prose">
            <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
              <span className="mini-eyebrow">SAY HELLO</span>
              <h1>Contact Our Care Team</h1>
              <p>We’re here to help with sizing advice, delivery updates, and product questions.</p>
            </div>

            <div className="contact-options">
              <a href="mailto:hello@kidobox.com">
                <div className="benefit-svg" style={{ margin: '0 0 12px 0' }}>
                  <Mail size={24} />
                </div>
                <h3>Email Support</h3>
                <p>hello@kidobox.com (Replies within 12 hours)</p>
              </a>
              <a href="tel:+919876543210">
                <div className="benefit-svg" style={{ margin: '0 0 12px 0' }}>
                  <PhoneCall size={24} />
                </div>
                <h3>Parent Helpline</h3>
                <p>+91 (022) 4890-KIDO (Mon–Sat, 10am–7pm)</p>
              </a>
            </div>

            <form className="embedded-form" onSubmit={handleSubmit} style={{ marginTop: '35px' }}>
              <h2>Send us a quick note</h2>
              <label>
                Your name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Mehta"
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                />
              </label>

              <label>
                Topic
                <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option value="orders">Order tracking or status inquiry</option>
                  <option value="sizing">Product sizing and fit recommendation</option>
                  <option value="returns">Return or refund request</option>
                  <option value="feedback">Product suggestion or praise ♡</option>
                </select>
              </label>

              <label>
                Message
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what’s on your mind..."
                />
              </label>

              <button type="submit" className="button pink" style={{ marginTop: '15px' }}>
                Send Message →
              </button>

              {submitted && (
                <p className="form-feedback">
                  Thank you! Your message has been received with love. We will write back shortly. ♡
                </p>
              )}
            </form>
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
