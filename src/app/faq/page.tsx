'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What products does KIDOBOX offer?',
      a: 'KIDOBOX specializes in thoughtfully chosen essentials for babies and toddlers (0 to 2+ years): organic clothing, gentle wipes and diapers, food-grade silicone feeding accessories, splash-safe bath sets, plush toys, and nursery furniture.',
    },
    {
      q: 'Are KIDOBOX fabrics safe for sensitive baby skin?',
      a: 'Yes! All our clothing, blankets, and rompers are crafted with breathable, certified organic cotton, dyed with non-toxic colors, and feature flat seams and nickel-free snaps.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders are dispatched within 24 hours from our Mumbai fulfillment center. Metro delivery usually arrives in 2–3 business days, while other locations take 3–5 business days.',
    },
    {
      q: 'Is there a free shipping minimum?',
      a: 'Yes, we offer completely Free Express Shipping on all orders above ₹999 across India. For orders below ₹999, a nominal flat fee of ₹79 applies.',
    },
    {
      q: 'What is your return and refund policy?',
      a: 'We offer a stress-free 7-day return policy on unused and unwashed items with tags attached. You can request a return directly online.',
    },
    {
      q: 'Can I track my order?',
      a: 'Absolutely! Enter your KDB reference number on our Track Order page to follow your package from dispatch to doorstep delivery.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="faq">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">A Little Help Center</span>
        </nav>

        <div className="help-layout">
          <aside className="help-nav">
            <h3>Customer Care</h3>
            <Link href="/faq" className="current">
              FAQs &amp; Help <span>→</span>
            </Link>
            <Link href="/shipping">
              Shipping &amp; Delivery <span>→</span>
            </Link>
            <Link href="/returns">
              Returns &amp; Refunds <span>→</span>
            </Link>
            <Link href="/tracking">
              Track Order <span>→</span>
            </Link>
            <Link href="/contact">
              Contact Us <span>→</span>
            </Link>
          </aside>

          <section className="help-content prose">
            <div className="page-intro" style={{ textAlign: 'left', padding: '0 0 25px' }}>
              <span className="mini-eyebrow">HERE TO HELP</span>
              <h1>A Little Help Center</h1>
              <p>Everything you need to know about shopping, shipping, and caring for your baby essentials.</p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, i) => (
                <details key={i} open={i === 0}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>

            <div className="help-callout">
              <span className="mini-eyebrow">STILL HAVE QUESTIONS?</span>
              <h2>We’re always here for you and your little one</h2>
              <p>Our friendly parent support team is just an email or message away.</p>
              <Link className="button pink" href="/contact">
                Get in Touch →
              </Link>
            </div>
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
