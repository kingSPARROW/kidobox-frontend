'use client';

import { useEffect } from 'react';

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  metaRobots?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  schemaMarkup?: string | object;
  siteName?: string;
}

export function SeoHead({
  title,
  description,
  canonicalUrl,
  metaRobots = 'index, follow',
  ogImage = '/logo.png',
  ogType = 'website',
  schemaMarkup,
  siteName = 'KIDOBOX',
}: SeoHeadProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Title
    if (title) {
      document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;
    }

    // 2. Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, contentValue?: string) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // 3. Meta Description & Robots
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    if (metaRobots) {
      setMetaTag('name', 'robots', metaRobots);
      setMetaTag('name', 'googlebot', metaRobots);
    }

    // 4. OpenGraph & Twitter
    if (title) {
      setMetaTag('property', 'og:title', title);
      setMetaTag('name', 'twitter:title', title);
    }
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', siteName);
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
      setMetaTag('property', 'og:image', fullImageUrl);
      setMetaTag('name', 'twitter:image', fullImageUrl);
      setMetaTag('name', 'twitter:card', 'summary_large_image');
    }

    // 5. Canonical Link
    const targetCanonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : '');
    if (targetCanonical) {
      let linkEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'canonical');
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute('href', targetCanonical);
      setMetaTag('property', 'og:url', targetCanonical);
    }

    // 6. Schema Markup (JSON-LD)
    if (schemaMarkup) {
      const scriptId = 'kidobox-schema-jsonld';
      let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      try {
        const jsonContent = typeof schemaMarkup === 'string' ? schemaMarkup : JSON.stringify(schemaMarkup, null, 2);
        // Only inject if valid JSON
        JSON.parse(jsonContent);
        scriptEl.textContent = jsonContent;
      } catch (err) {
        console.warn('Invalid JSON-LD schema markup provided:', err);
      }
    }
  }, [title, description, canonicalUrl, metaRobots, ogImage, ogType, schemaMarkup, siteName]);

  return null;
}

