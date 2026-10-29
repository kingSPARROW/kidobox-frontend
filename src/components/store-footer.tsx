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
          <div className="socials" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href={safeLink(footer?.social_links?.find((s) => s.platform.toLowerCase() === 'facebook')?.url) || 'https://facebook.com'}
              className="social-fb"
              aria-label="Follow KIDOBOX on Facebook"
              title="Facebook"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                minHeight: '36px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                margin: 0,
                lineHeight: 0,
                color: '#ffffff',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 320 512" width="15" height="17" fill="currentColor" aria-hidden="true" style={{ display: 'block', margin: 'auto' }}>
                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
              </svg>
            </Link>
            <Link
              href={safeLink(footer?.social_links?.find((s) => s.platform.toLowerCase() === 'instagram')?.url) || 'https://instagram.com'}
              className="social-ig"
              aria-label="Follow KIDOBOX on Instagram"
              title="Instagram"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                minHeight: '36px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                margin: 0,
                lineHeight: 0,
                color: '#ffffff',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor" aria-hidden="true" style={{ display: 'block', margin: 'auto' }}>
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </Link>
            <Link
              href={safeLink(footer?.social_links?.find((s) => s.platform.toLowerCase() === 'youtube')?.url) || 'https://youtube.com'}
              className="social-yt"
              aria-label="Subscribe to KIDOBOX on YouTube"
              title="YouTube"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                minHeight: '36px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                margin: 0,
                lineHeight: 0,
                color: '#ffffff',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 576 512" width="17" height="15" fill="currentColor" aria-hidden="true" style={{ display: 'block', margin: 'auto' }}>
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </svg>
            </Link>
            <Link
              href="/community"
              className="social-pin"
              aria-label="KIDOBOX on Pinterest"
              title="Pinterest"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                minHeight: '36px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                margin: 0,
                lineHeight: 0,
                color: '#ffffff',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 384 512" width="14" height="17" fill="currentColor" aria-hidden="true" style={{ display: 'block', margin: 'auto' }}>
                <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
              </svg>
            </Link>
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
