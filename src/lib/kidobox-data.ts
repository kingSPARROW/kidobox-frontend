export interface Category {
  id?: string;
  slug: string;
  name: string;
  short: string;
  icon: string;
  image: string;
  color: string;
  description: string;
}

export interface Product {
  id: string;
  categorySlugs?: string[];
  images?: string[];
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
  rating: number;
  reviews: number;
  brand: string;
  age: string;
  sizes: string[];
  colors: string[];
  tag: string;
  isNew: boolean;
  features: string[];
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
  minutes: number;
  excerpt: string;
  sections: [string, string][];
}

export const money = (n: number | string) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const image = (name: string) => {
  if (!name) return '/assets/hd/hero.webp';
  if (name.startsWith('/') || name.startsWith('http')) return name;
  return `/assets/hd/${name}.webp`;
};
