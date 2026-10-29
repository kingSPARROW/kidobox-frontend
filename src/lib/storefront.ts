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
  tags?: string[]; images?: (string | { url?: string; src?: string })[];
  collection_ids?: string[]; variants: PublicVariant[];
}
export interface Banner {
  id: string; title: string; title_tag?: string; subtitle?: string; desktop_image_url: string;
  mobile_image_url?: string; cta_text?: string; cta_link?: string;
  secondary_cta_text?: string; secondary_cta_link?: string; position: string;
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
  collections: { id: string; _id?: string; slug: string; title: string; image_url?: string; description?: string }[];
  banners: Banner[]; content: HomepageContent;
  testimonials: { id: string; author_name: string; location: string; avatar_url: string; rating: number; content: string; is_verified: boolean; product_title?: string }[];
  offers: { code: string; title: string; type: string; value: number; min_cart_amount: number; max_discount_amount?: number; expires_at?: string }[];
  store: { name: string; branding?: { logo_url?: string }; settings?: { free_shipping_threshold?: number } };
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
  const images = (raw.images || []).map(i => mediaUrl(typeof i === 'string' ? i : i.url || i.src));
  const sizes = variants.map(v => v.title);
  return {
    id: raw.id, slug: raw.slug, name: raw.title, detail: (raw.description || '').replace(/<[^>]*>/g, ''),
    price: Number(first?.price || 0), old: Number(first?.compare_at_price || 0), category: categorySlugs[0] || '', categorySlugs,
    image: images[0] || mediaUrl(first?.image_url), images, rating: 0, reviews: 0, brand: raw.vendor || '',
    age: tags.find(t => t.startsWith('age:'))?.slice(4) || 'all', sizes, colors: [],
    tag: hasTag('bestseller') ? 'Bestseller' : hasTag('featured') ? 'Featured' : '',
    featured: hasTag('featured'), isNew: hasTag('new-arrival'), features: tags.filter(t => t.startsWith('feature:')).map(t => t.slice(8)),
    variants, variantId: first?.id || '', inStock: !!first && first.inventory_quantity > 0,
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
  const categories: Category[] = useMemo(() => (data?.collections || []).map(c => ({ id: c.id || c._id, slug: c.slug,
    name: c.title, short: c.title, image: mediaUrl(c.image_url), description: c.description || '', icon: 'heart', color: 'pink-bg' })), [data]);
  const products = useMemo(() => (data?.products || []).map(p => {
    const mapped = mapProduct(p, categories);
    const reviews = (data?.testimonials || []).filter(t => t.product_title === p.title);
    return { ...mapped, reviews: reviews.length, rating: reviews.length ? Math.round(reviews.reduce((sum, t) => sum + t.rating, 0) / reviews.length * 10) / 10 : 0 };
  }), [data, categories]);
  return { ...query, products, categories, brands: [...new Set(products.map(p => p.brand).filter(Boolean))],
    ages: data?.content?.ages || [], articles: data?.content?.articles || [], content: data?.content || {},
    banners: data?.banners || [], offers: data?.offers || [], testimonials: data?.testimonials || [], store: data?.store };
}

interface Navigation {
  main_menu: { label: string; url: string }[];
  footer: { about_text?: string; copyright_text?: string; social_links?: { platform: string; url: string }[]; columns?: { title: string; links: { label: string; url: string }[] }[] };
}
export function useNavigation() {
  return useQuery({ queryKey: ['storefront', 'navigation'], queryFn: async () => await fetchApi('/storefront/navigation', { cache: 'no-store' }) as unknown as Navigation, staleTime: 0, refetchOnWindowFocus: true, refetchInterval: 15000 });
}
