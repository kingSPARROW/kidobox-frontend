'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { Mail, PhoneCall, MapPin, Navigation, ExternalLink } from 'lucide-react';

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

        <section className="store-page-hero contact-page-hero">
          <div className="store-page-hero-copy">
            <h1>Contact Our Care Team</h1>
            <p>We’re here to help with sizing advice, delivery updates, and product questions.</p>
            <a className="button pink" href="mailto:hello@kidobox.com">Email Us <Mail size={16} aria-hidden="true" /></a>
          </div>
          <img src="/assets/hd/contact-desk.webp" alt="" width="1400" height="700" />
        </section>

        <div className="contact-page-grid">
          <aside className="contact-details" aria-label="Contact details">
            <section>
              <PhoneCall size={22} aria-hidden="true" />
              <h2>Call us</h2>
              <a href="tel:+917428866689">+91 7428866689</a>
              <p>Mon–Sat, 10am–7pm IST</p>
            </section>
            <section>
              <Mail size={22} aria-hidden="true" />
              <h2>Email support</h2>
              <a href="mailto:hello@kidobox.com">hello@kidobox.com</a>
            </section>
            <section>
              <MapPin size={22} aria-hidden="true" />
              <h2>Visit our office</h2>
              <p>RPS Tower, 12th Avenue, Tower 5, 2nd Floor, Office No. 218, Faridabad, Haryana – 121003</p>
              <p>Nearest metro: Sarai Metro Station, exit towards Delhi.</p>
              <a className="text-link" href="https://maps.app.goo.gl/zQsJQegCpJ6DmouS9?g_st=iw" target="_blank" rel="noopener noreferrer">
                <Navigation size={15} aria-hidden="true" /> Get directions <ExternalLink size={13} aria-hidden="true" />
              </a>
            </section>
          </aside>

          <form className="embedded-form contact-form" onSubmit={handleSubmit}>
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
                This form is a preview. For help, email hello@kidobox.com.
              </p>
            )}
          </form>
        </div>

        <nav className="contact-help-links" aria-label="Customer care">
          <Link href="/faq">FAQs &amp; Help</Link>
          <Link href="/shipping">Shipping &amp; Delivery</Link>
          <Link href="/returns">Returns &amp; Refunds</Link>
          <Link href="/tracking">Track Order</Link>
        </nav>
      </main>

      <StoreFooter />
    </div>
  );
}
