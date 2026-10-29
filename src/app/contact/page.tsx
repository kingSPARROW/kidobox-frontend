'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { Mail, PhoneCall, MapPin, Navigation, ExternalLink, Clock, Compass } from 'lucide-react';

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
              <a href="tel:+917428866689" aria-label="Call Parent Helpline">
                <div className="benefit-svg" style={{ margin: '0 0 12px 0' }}>
                  <PhoneCall size={24} />
                </div>
                <h3>Parent Helpline</h3>
                <p style={{ fontWeight: 800, fontSize: '13px', color: 'var(--navy)' }}>+91 7428866689</p>
                <small style={{ color: '#7c8d9f', fontSize: '11px', display: 'block', marginTop: '4px' }}>Mon–Sat, 10am–7pm IST</small>
              </a>
              <a href="mailto:hello@kidobox.com" aria-label="Email Customer Support">
                <div className="benefit-svg" style={{ margin: '0 0 12px 0' }}>
                  <Mail size={24} />
                </div>
                <h3>Email Support</h3>
                <p style={{ fontWeight: 800, fontSize: '13px', color: 'var(--navy)' }}>hello@kidobox.com</p>
                <small style={{ color: '#7c8d9f', fontSize: '11px', display: 'block', marginTop: '4px' }}>Replies within 12 hours</small>
              </a>
            </div>

            {/* Office & Store Location Card */}
            <div
              className="contact-address-card"
              style={{
                marginTop: '22px',
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #fff7fb 0%, #f0f9ff 100%)',
                border: '1px solid #ffdbe8',
                boxShadow: '0 4px 18px rgba(255, 38, 139, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'var(--theme-gradient, linear-gradient(135deg, #ff268b, #ff5b99))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(255, 38, 139, 0.25)',
                  }}
                >
                  <MapPin size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '1.5px', color: 'var(--pink)', textTransform: 'uppercase' }}>
                    HEADQUARTERS &amp; STORE LOCATION
                  </span>
                  <h3 style={{ fontSize: '20px', margin: '4px 0 10px', color: 'var(--navy)', fontFamily: 'var(--font-fredoka)' }}>
                    KIDOBOX Experience Studio &amp; Office
                  </h3>
                  <p style={{ margin: '0 0 12px', fontSize: '14px', lineHeight: 1.6, color: '#2b3f56', fontWeight: 600 }}>
                    RPS Tower, 12th Avenue, Tower 5, 2nd Floor, Office No. 218, Faridabad, Haryana – 121003
                  </p>
                  
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: 'rgba(255, 255, 255, 0.85)',
                      borderRadius: '8px',
                      border: '1px solid #e1eaf2',
                      fontSize: '12px',
                      color: '#2a557a',
                      fontWeight: 700,
                      marginBottom: '16px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>🚇</span>
                    <span><strong>Nearest Metro Station:</strong> Sarai Metro Station, Exit: Towards Delhi</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a
                      href="https://maps.app.goo.gl/zQsJQegCpJ6DmouS9?g_st=iw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button pink"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(255, 38, 139, 0.2)',
                      }}
                    >
                      <Navigation size={14} />
                      <span>Open in Google Maps</span>
                      <ExternalLink size={12} />
                    </a>

                    <a
                      href="tel:+917428866689"
                      className="button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        fontSize: '12px',
                        fontWeight: 800,
                        background: '#ffffff',
                        border: '1px solid #dbe5ee',
                        color: 'var(--navy)',
                        textDecoration: 'none',
                      }}
                    >
                      <PhoneCall size={14} color="var(--pink)" />
                      <span>Call +91 7428866689</span>
                    </a>
                  </div>
                </div>
              </div>
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
