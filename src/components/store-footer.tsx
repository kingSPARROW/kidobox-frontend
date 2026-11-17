'use client';

import { useNavigation, useStorefront, mediaUrl, safeLink } from '@/lib/storefront';
import React from 'react';
import Link from 'next/link';
import { SocialIcon } from '@/components/social-icon';
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
    <footer className="store-footer">
      <div className="container footer-grid">
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
              <SocialIcon platform="facebook" width={15} height={17} style={{ display: 'block', margin: 'auto' }} />
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
              <SocialIcon platform="instagram" width={16} height={16} style={{ display: 'block', margin: 'auto' }} />
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
              <SocialIcon platform="pinterest" width={14} height={17} style={{ display: 'block', margin: 'auto' }} />
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

      <div className="container footer-bottom">
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
