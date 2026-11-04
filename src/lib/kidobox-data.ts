export interface Category {
  id?: string;
  slug: string;
  name: string;
  short: string;
  icon: string;
  image: string;
  image_alt?: string;
  color: string;
  description: string;
  heading_h1?: string;
  heading_h2?: string;
  heading_h3?: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
    meta_robots?: string;
    schema_markup?: string;
  };
}

export interface Product {
  id: string;
  categorySlugs?: string[];
  images?: string[];
  imageAlts?: string[];
  variants?: import('./storefront').PublicVariant[];
  variantId?: string;
  inStock?: boolean;
  featured?: boolean;
  slug: string;
  name: string;
  detail: string;
  price: number;
  old: number;
  category: string;
  image: string;
  imageAlt?: string;
  rating: number;
  reviews: number;
  brand: string;
  age: string;
  sizes: string[];
  colors: string[];
  tag: string;
  isNew: boolean;
  features: string[];
  heading_h1?: string;
  heading_h2?: string;
  heading_h3?: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup?: string;
  focus_keyword?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
    meta_robots?: string;
    schema_markup?: string;
    focus_keyword?: string;
  };
}

export interface AgeGroup {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  age: string;
  color: string;
  description: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  image: string;
  image_alt?: string;
  minutes: number;
  excerpt: string;
  sections: [string, string][];
  status?: 'published' | 'draft';
  is_published?: boolean;
  author?: string;
  published_at?: string;
  heading_h1?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup?: string;
}

export const money = (n: number | string) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const image = (name: string) => {
  if (!name) return '/assets/hd/hero.webp';
  if (name.startsWith('/') || name.startsWith('http')) return name;
  return `/assets/hd/${name}.webp`;
};
