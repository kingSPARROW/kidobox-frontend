'use client';

import { useNavigation, useStorefront, mediaUrl, safeLink } from '@/lib/storefront';
import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function StoreFooter() {
  const { data: navigation } = useNavigation();
  const { store } = useStorefront();
  const footer = navigation?.footer;
  return (
    <footer className="container">
      <div className="footer-grid">
        <div className="footer-about">
          <Link href="/">
            <img
              src={store?.branding?.logo_url ? mediaUrl(store.branding.logo_url) : "/logo.png"}
              width="140"
              height="auto"
              style={{ maxHeight: '60px', width: 'auto', margin: '0 auto', objectFit: 'contain' }}
              alt="KIDOBOX"
            />
          </Link>
          <p>{footer?.about_text}</p>
          <div className="socials">
            <Link
              href={safeLink(footer?.social_links?.find(s => s.platform.toLowerCase() === 'facebook')?.url)}
              className="social-fb"
              aria-label="Follow KIDOBOX on Facebook"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
            <Link
              href={safeLink(footer?.social_links?.find(s => s.platform.toLowerCase() === 'instagram')?.url)}
              className="social-ig"
              aria-label="Follow KIDOBOX on Instagram"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link
              href={safeLink(footer?.social_links?.find(s => s.platform.toLowerCase() === 'youtube')?.url)}
              className="social-yt"
              aria-label="Subscribe to KIDOBOX on YouTube"
              title="YouTube"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
            <Link
              href="/community"
              className="social-pin"
              aria-label="KIDOBOX on Pinterest"
              title="Pinterest"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.218-.173.265-.4.159-1.499-.696-2.435-2.88-2.435-4.634 0-3.773 2.74-7.238 7.902-7.238 4.149 0 7.371 2.956 7.371 6.906 0 4.122-2.599 7.44-6.207 7.44-1.212 0-2.352-.63-2.744-1.377l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </Link>
          </div>
        </div>

        {(footer?.columns || []).map((column, i) => <div key={i}><h4>{column.title}</h4>{column.links.map((link, j) => <Link href={safeLink(link.url)} key={j}>{link.label}</Link>)}</div>)}

        <div className="payments">
          <h4>Secure Payments</h4>
          <div className="payments-row">
            {/* Real VISA Icon */}
            <div className="payment-chip visa-chip" title="Visa">
              <svg viewBox="0 0 52 18" width="40" height="14" aria-label="Visa">
                <path fill="#1a1f71" d="M19.5 0.5l-3.2 15h-2.6l3.2-15h2.6zm14.3 9.8l1.4-3.8c-.1 0 .6-.8 1-1.3l.6 2.9.8 2.2h-3.8zm4.7-9.8h-2.1c-.6 0-1.1.2-1.3.8l-4.7 11.2h2.8l.6-1.5h3.4l.3 1.5h2.4l-1.4-12zm-10.8 7.9c0-3.2-4.4-3.4-4.4-4.9 0-.5.5-.9 1.5-.9 1 0 2.2.4 2.8.7l.5-2.3c-.7-.3-1.8-.6-3-.6-3.1 0-5.2 1.6-5.2 4 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2.7-.5-3.3-1l-.5 2.4c.8.4 2.3.7 3.6.7 3.3 0 5.7-1.7 5.7-4.2zM11.6.5l-3 8.3-.3-1.6c-.5-1.8-2.2-3.8-4-4.8l2.6 10.1h2.8l4.2-12h-2.3z" />
                <path fill="#f7b600" d="M6.3 2.4c-1.8 0-3.5 1.4-4.3 2.5l-.2-.1C2.5 3.3 4.1.7 6.4.5l-.1 1.9z" />
              </svg>
            </div>

            {/* Real Mastercard Icon */}
            <div className="payment-chip mastercard-chip" title="Mastercard">
              <svg viewBox="0 0 34 22" width="30" height="19" aria-label="Mastercard">
                <circle cx="12" cy="11" r="9" fill="#eb001b" />
                <circle cx="22" cy="11" r="9" fill="#f79e1b" />
                <path d="M17 4.5a8.97 8.97 0 0 1 3.5 6.5c0 2.6-1.2 4.9-3.5 6.5a8.97 8.97 0 0 1-3.5-6.5c0-2.6 1.2-4.9 3.5-6.5z" fill="#ff5f00" />
              </svg>
            </div>

            {/* Real UPI Icon */}
            <div className="payment-chip upi-chip" title="UPI - Unified Payments Interface">
              <svg viewBox="0 0 46 16" width="38" height="13" aria-label="UPI">
                <path d="M2 13.5L8.5 13.5L12 3.5L5.5 3.5L2 13.5Z" fill="#0f7c3e" />
                <path d="M8.5 13.5L15 13.5L18.5 3.5L12 3.5L8.5 13.5Z" fill="#ea5924" />
                <text x="21" y="12.5" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="10.5" fill="#122e50" letterSpacing="0.5">UPI</text>
              </svg>
            </div>

            {/* Real Paytm Icon */}
            <div className="payment-chip paytm-chip" title="Paytm">
              <svg viewBox="0 0 46 16" width="38" height="13" aria-label="Paytm">
                <text x="1" y="12" fontFamily="'Nunito', Arial, sans-serif" fontWeight="900" fontSize="11" fill="#002970">Pay</text>
                <text x="21" y="12" fontFamily="'Nunito', Arial, sans-serif" fontWeight="900" fontSize="11" fill="#00b9f5">tm</text>
              </svg>
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
        {footer?.copyright_text}{' '}
        <Heart size={13} fill="currentColor" style={{ display: 'inline', color: 'var(--pink)', verticalAlign: 'middle', marginLeft: 2 }} />
      </div>
    </footer>
  );
}
