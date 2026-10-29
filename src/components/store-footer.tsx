'use client';

import { useNavigation, useStorefront, mediaUrl, safeLink } from '@/lib/storefront';
import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const DEFAULT_FOOTER_COLUMNS = [
  {
    title: 'Shop Essentials',
    links: [
      { label: 'Baby Clothing', url: '/clothing' },
      { label: 'Diapering & Care', url: '/diapering' },
      { label: 'Feeding & Nursing', url: '/feeding' },
      { label: 'Bath & Gentle Care', url: '/bath-care' },
      { label: 'Toys & Playtime', url: '/toys' },
      { label: 'Nursery & Bedding', url: '/nursery' },
    ],
  },
  {
    title: 'Shop by Age',
    links: [
      { label: 'Newborn (0-6M)', url: '/age-newborn' },
      { label: 'Baby (6-12M)', url: '/age-baby' },
      { label: 'Toddler (1-2Y)', url: '/age-toddler' },
      { label: 'Kids (2-4Y)', url: '/age-kids' },
      { label: 'All Age Stages', url: '/ages' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Track Your Order', url: '/tracking' },
      { label: 'Shipping & Delivery', url: '/shipping' },
      { label: '7-Day Easy Returns', url: '/returns' },
      { label: 'Help & FAQs', url: '/faq' },
      { label: 'Contact Us', url: '/contact' },
    ],
  },
  {
    title: 'About KIDOBOX',
    links: [
      { label: 'Our Philosophy', url: '/our-story' },
      { label: 'Parenting Guides', url: '/guides' },
      { label: 'Family Community', url: '/community' },
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'Terms of Service', url: '/terms' },
    ],
  },
];

export function StoreFooter() {
  const { data: navigation } = useNavigation();
  const { store } = useStorefront();
  const footer = navigation?.footer;

  const aboutText =
    footer?.about_text ||
    "Thoughtfully chosen baby and toddler essentials for life's sweetest little moments. Soft organic cotton, gentle skin care, and pediatrician-approved toys.";

  const copyrightText =
    footer?.copyright_text ||
    `© ${new Date().getFullYear()} KIDOBOX Baby Essentials Pvt Ltd. All rights reserved. Crafted with`;

  const columns =
    footer?.columns && footer.columns.length > 0
      ? footer.columns
      : DEFAULT_FOOTER_COLUMNS;

  return (
    <footer className="container">
      <div className="footer-grid">
        <div className="footer-about">
          <Link href="/">
            <img
              src={store?.branding?.logo_url ? mediaUrl(store.branding.logo_url) : "/logo.png"}
              width="140"
              height="auto"
              style={{ maxHeight: '55px', width: 'auto', objectFit: 'contain' }}
              alt="KIDOBOX"
            />
          </Link>
          <p>{aboutText}</p>
          <div className="socials">
            <Link
              href={safeLink(footer?.social_links?.find((s) => s.platform.toLowerCase() === 'facebook')?.url) || 'https://facebook.com'}
              className="social-fb"
              aria-label="Follow KIDOBOX on Facebook"
              title="Facebook"
            ><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg></Link>
            <Link
              href={safeLink(footer?.social_links?.find((s) => s.platform.toLowerCase() === 'instagram')?.url) || 'https://instagram.com'}
              className="social-ig"
              aria-label="Follow KIDOBOX on Instagram"
              title="Instagram"
            ><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></Link>
            <Link
              href={safeLink(footer?.social_links?.find((s) => s.platform.toLowerCase() === 'youtube')?.url) || 'https://youtube.com'}
              className="social-yt"
              aria-label="Subscribe to KIDOBOX on YouTube"
              title="YouTube"
            ><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></Link>
            <Link
              href="/community"
              className="social-pin"
              aria-label="KIDOBOX on Pinterest"
              title="Pinterest"
            ><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.63-.13-1.6.03-2.29l1.1-4.66s-.28-.56-.28-1.39c0-1.3.76-2.28 1.7-2.28.8 0 1.19.6 1.19 1.33 0 .81-.51 2.01-.78 3.13-.22.94.47 1.7 1.4 1.7 1.68 0 2.97-1.77 2.97-4.33 0-2.26-1.63-3.84-3.95-3.84-2.69 0-4.27 2.02-4.27 4.1 0 .81.31 1.68.7 2.16.08.1.09.18.07.28l-.26 1.07c-.04.17-.14.21-.32.13-1.18-.55-1.92-2.27-1.92-3.66 0-2.98 2.16-5.71 6.24-5.71 3.27 0 5.82 2.33 5.82 5.45 0 3.25-2.05 5.87-4.9 5.87-.96 0-1.85-.5-2.16-1.09l-.59 2.25c-.21.82-.78 1.85-1.16 2.47A12 12 0 1 0 12 0z" /></svg></Link>
          </div>
        </div>

        {columns.map((column, i) => (
          <div key={i}>
            <h4>{column.title}</h4>
            {column.links.map((link, j) => (
              <Link href={safeLink(link.url)} key={j}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="payments">
          <h4>Secure Payments</h4>
          <div className="payments-row">
            {/* Visa */}
            <div className="payment-chip" title="Visa">
              <img
                src="/assets/footer/visa.png"
                alt="Visa"
                style={{ height: '17px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Mastercard */}
            <div className="payment-chip" title="Mastercard">
              <img
                src="/assets/footer/master-card.svg"
                alt="Mastercard"
                style={{ height: '19px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* UPI */}
            <div className="payment-chip" title="UPI - Unified Payments Interface">
              <img
                src="/assets/footer/upi.png"
                alt="UPI"
                style={{ height: '17px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>
          <p>
            ♡ Thoughtfully chosen essentials
            <br />
            ♧ Made for your everyday moments
          </p>
          <Link className="demo-label" href="/faq">
            Storefront demo · No real payments
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        {copyrightText}{' '}
        <Heart
          size={13}
          fill="currentColor"
          style={{ display: 'inline', color: 'var(--pink)', verticalAlign: 'middle', marginLeft: 2 }}
        />
      </div>
    </footer>
  );
}
