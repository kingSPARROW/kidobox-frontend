'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, fetchApi } from './api';
import type { Product, Category, AgeGroup, Article } from './kidobox-data';

export interface PublicVariant {
  id: string; title: string; price: number; compare_at_price?: number;
  inventory_quantity: number; options_map?: Record<string, string>; image_url?: string;
}
export interface PublicProduct {
  id: string; title: string; slug: string; description?: string; vendor?: string;
  tags?: string[]; images?: (string | { url?: string; src?: string; alt?: string })[];
  collection_ids?: string[]; variants: PublicVariant[];
  heading_h1?: string; heading_h2?: string; heading_h3?: string;
  canonical_url?: string; meta_robots?: string; schema_markup?: string; focus_keyword?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
    meta_robots?: string;
    schema_markup?: string;
    focus_keyword?: string;
  };
}
export interface Banner {
  id: string; title: string; title_tag?: string; subtitle?: string; desktop_image_url: string;
  mobile_image_url?: string; cta_text?: string; cta_link?: string;
  secondary_cta_text?: string; secondary_cta_link?: string; position: string;
  alt_text?: string;
}
export interface HomepageContent {
  ages?: AgeGroup[]; articles?: Article[];
  instagram?: { image: string; title: string; link: string }[];
  benefits?: { title: string; subtitle: string }[];
  hero_promises?: { title: string; subtitle: string }[];
  newborn?: Record<string, string>; app?: Record<string, string>; copy?: Record<string, string>;
}
interface Payload {
  products: PublicProduct[];
  collections: {
    id: string; _id?: string; slug: string; title: string; image_url?: string; image_alt?: string;
    description?: string; heading_h1?: string; heading_h2?: string; heading_h3?: string;
    canonical_url?: string; meta_robots?: string; schema_markup?: string; seo?: any;
  }[];
  banners: Banner[]; content: HomepageContent;
  testimonials: { id: string; author_name: string; location: string; avatar_url: string; rating: number; content: string; is_verified: boolean; product_title?: string }[];
  offers: { code: string; title: string; type: string; value: number; min_cart_amount: number; max_discount_amount?: number; expires_at?: string }[];
  store: {
    name: string;
    branding?: { logo_url?: string; favicon_url?: string; primary_color?: string };
    settings?: { free_shipping_threshold?: number; allow_cod?: boolean };
    seo?: {
      title_tag?: string;
      title_template?: string;
      meta_description?: string;
      social_image_url?: string;
      google_verification?: string;
      allow_indexing?: boolean;
      canonical_url?: string;
      meta_robots?: string;
      schema_markup?: string;
    };
    page_seo?: Record<string, any>;
  };
}
export const safeLink = (value?: string) => value && (/^\/(?!\/)/.test(value) || /^https?:\/\//i.test(value)) ? value : '/shop';
export function mediaUrl(value?: string) {
  if (!value) return '/file.svg';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/storage/') || value.startsWith('/products/') || value.startsWith('/banners/')) {
    return new URL(value, API_BASE_URL).href;
  }
  if (value.startsWith('/')) return value;
  return `/assets/hd/${value}.webp`;
}
export function mapProduct(raw: PublicProduct, categories: Category[]): Product {
  const variants = raw.variants || [];
  const first = variants.find(v => v.inventory_quantity > 0) || variants[0];
  const tags = raw.tags || [];
  const hasTag = (tag: string) => tags.some(t => t.toLowerCase() === tag);
  const categorySlugs = categories.filter(c => raw.collection_ids?.includes(c.id || '')).map(c => c.slug);
  
  const rawImages = raw.images || [];
  const images = rawImages.map(i => {
    if (typeof i === 'string') return mediaUrl(i);
    return mediaUrl(i.url || i.src);
  });
  const imageAlts = rawImages.map(i => (typeof i === 'object' && i.alt ? i.alt : raw.title));
  const sizes = variants.map(v => v.title);

  const seoTitle = raw.seo?.title || raw.title;
  const seoDescription = raw.seo?.description || (raw.description || '').replace(/<[^>]*>/g, '').slice(0, 160);
  const canonicalUrl = raw.canonical_url || raw.seo?.canonical_url;
  const metaRobots = raw.meta_robots || raw.seo?.meta_robots || 'index, follow';
  const schemaMarkup = raw.schema_markup || raw.seo?.schema_markup;

  return {
    id: raw.id, slug: raw.slug, name: raw.title, detail: (raw.description || '').replace(/<[^>]*>/g, ''),
    price: Number(first?.price || 0), old: Number(first?.compare_at_price || 0), category: categorySlugs[0] || '', categorySlugs,
    image: images[0] || mediaUrl(first?.image_url), images, imageAlts, imageAlt: imageAlts[0] || raw.title,
    rating: 0, reviews: 0, brand: raw.vendor || '',
    age: tags.find(t => t.startsWith('age:'))?.slice(4) || 'all', sizes, colors: [],
    tag: hasTag('bestseller') ? 'Bestseller' : hasTag('featured') ? 'Featured' : '',
    featured: hasTag('featured'), isNew: hasTag('new-arrival'), features: tags.filter(t => t.startsWith('feature:')).map(t => t.slice(8)),
    variants, variantId: first?.id || '', inStock: !!first && first.inventory_quantity > 0,
    heading_h1: raw.heading_h1 || raw.title,
    heading_h2: raw.heading_h2,
    heading_h3: raw.heading_h3,
    canonical_url: canonicalUrl,
    meta_robots: metaRobots,
    schema_markup: schemaMarkup,
    focus_keyword: raw.focus_keyword || raw.seo?.focus_keyword,
    seo: {
      title: seoTitle,
      description: seoDescription,
      canonical_url: canonicalUrl,
      meta_robots: metaRobots,
      schema_markup: schemaMarkup,
      focus_keyword: raw.focus_keyword || raw.seo?.focus_keyword,
    },
  };
}
export function cartItem(product: Product, variantId = product.variantId) {
  const variant = product.variants?.find(v => v.id === variantId);
  if (!variant || variant.inventory_quantity < 1) return null;
  return { product_id: String(product.id), variant_id: variant.id, title: product.name,
    variant_title: variant.title, price: variant.price, image_url: mediaUrl(variant.image_url || product.image) };
}
export function useStorefront() {
  const query = useQuery({ queryKey: ['storefront'], queryFn: async () => await fetchApi('/storefront/data', { cache: 'no-store' }) as unknown as Payload,
    staleTime: 0, refetchOnWindowFocus: true, refetchOnMount: true, refetchInterval: 15000 });
  const data = query.data;
  const categories: Category[] = useMemo(() => (data?.collections || []).map(c => ({
    id: c.id || c._id,
    slug: c.slug,
    name: c.title,
    short: c.title,
    image: mediaUrl(c.image_url),
    image_alt: c.image_alt || c.title,
    description: c.description || '',
    icon: 'heart',
    color: 'pink-bg',
    heading_h1: c.heading_h1,
    heading_h2: c.heading_h2,
    heading_h3: c.heading_h3,
    canonical_url: c.canonical_url,
    meta_robots: c.meta_robots,
    schema_markup: c.schema_markup,
    seo: c.seo || {
      title: c.title,
      description: c.description || '',
      canonical_url: c.canonical_url,
      meta_robots: c.meta_robots,
      schema_markup: c.schema_markup,
    },
  })), [data]);
  const products = useMemo(() => (data?.products || []).map(p => {
    const mapped = mapProduct(p, categories);
    const reviews = (data?.testimonials || []).filter(t => t.product_title === p.title);
    return { ...mapped, reviews: reviews.length, rating: reviews.length ? Math.round(reviews.reduce((sum, t) => sum + t.rating, 0) / reviews.length * 10) / 10 : 0 };
  }), [data, categories]);
  return { ...query, products, categories, brands: [...new Set(products.map(p => p.brand).filter(Boolean))],
    ages: data?.content?.ages || [], articles: data?.content?.articles || [], content: data?.content || {},
    banners: data?.banners || [], offers: data?.offers || [], testimonials: data?.testimonials || [],
    store: data?.store, globalSeo: data?.store?.seo, pageSeo: data?.store?.page_seo || {} };
}

interface Navigation {
  main_menu: { label: string; url: string }[];
  footer: { about_text?: string; copyright_text?: string; social_links?: { platform: string; url: string }[]; columns?: { title: string; links: { label: string; url: string }[] }[] };
}
export function useNavigation() {
  return useQuery({ queryKey: ['storefront', 'navigation'], queryFn: async () => await fetchApi('/storefront/navigation', { cache: 'no-store' }) as unknown as Navigation, staleTime: 0, refetchOnWindowFocus: true, refetchInterval: 15000 });
}
