'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Trash2,
  Plus,
  Star,
  Copy,
  ExternalLink,
  Check,
  CheckCircle2,
  Loader2,
  HelpCircle,
  Tag,
  DollarSign,
  Layers,
  Globe,
  Eye,
  AlertCircle,
  X,
  Boxes,
  FileText,
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Truck,
} from 'lucide-react';

export interface ProductVariantData {
  id?: string;
  _id?: string;
  title: string;
  sku: string;
  barcode?: string;
  price: number;
  compare_at_price?: number | null;
  cost_per_item?: number | null;
  inventory_quantity: number;
  weight?: number;
  weight_unit?: string;
  options_map?: Record<string, string>;
  image_url?: string;
}

export interface ProductFormData {
  id?: string;
  _id?: string;
  title: string;
  heading_h1?: string;
  heading_h2?: string;
  heading_h3?: string;
  description: string;
  vendor: string;
  product_type: string;
  status: 'active' | 'draft' | 'archived';
  images: string[];
  image_alts?: Record<number, string>;
  price: number;
  compare_at_price?: number | null;
  cost_per_item?: number | null;
  charge_tax: boolean;
  tax_rate: number;
  track_quantity: boolean;
  continue_selling_out_of_stock: boolean;
  sku: string;
  barcode: string;
  inventory_quantity: number;
  is_physical_product: boolean;
  weight: number;
  weight_unit: 'kg' | 'g';
  hsn_code: string;
  has_variants: boolean;
  options: { name: string; values: string[] }[];
  variants: ProductVariantData[];
  tags: string[];
  collection_ids: string[];
  seo_title: string;
  seo_description: string;
  slug: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup?: string;
  focus_keyword?: string;
}

interface ShopifyProductFormProps {
  initialData?: Partial<ProductFormData>;
  isEdit?: boolean;
  productId?: string;
}

export default function ShopifyProductForm({
  initialData,
  isEdit = false,
  productId,
}: ShopifyProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  // Extract images and image alts
  const rawImgs = initialData?.images || [];
  const initialImgUrls = rawImgs.map((i: any) => typeof i === 'string' ? i : (i.url || i.src || ''));
  const initialAlts: Record<number, string> = {};
  rawImgs.forEach((i: any, idx: number) => {
    if (typeof i === 'object' && i.alt) initialAlts[idx] = i.alt;
  });

  const [form, setForm] = useState<ProductFormData>({
    title: initialData?.title || '',
    heading_h1: initialData?.heading_h1 || initialData?.title || '',
    heading_h2: initialData?.heading_h2 || '',
    heading_h3: initialData?.heading_h3 || '',
    description: initialData?.description || '',
    vendor: initialData?.vendor || '',
    product_type: initialData?.product_type || '',
    status: initialData?.status || 'active',
    images: initialImgUrls.length > 0 ? initialImgUrls : [],
    image_alts: initialAlts,
    price: initialData?.price ?? (initialData?.variants?.[0]?.price ?? 0),
    compare_at_price: initialData?.compare_at_price ?? (initialData?.variants?.[0]?.compare_at_price ?? null),
    cost_per_item: initialData?.cost_per_item ?? (initialData?.variants?.[0]?.cost_per_item ?? null),
    charge_tax: true,
    tax_rate: initialData?.tax_rate ?? 18,
    track_quantity: true,
    continue_selling_out_of_stock: false,
    sku: initialData?.sku ?? (initialData?.variants?.[0]?.sku ?? ''),
    barcode: initialData?.barcode ?? (initialData?.variants?.[0]?.barcode ?? ''),
    inventory_quantity: initialData?.inventory_quantity ?? (initialData?.variants?.[0]?.inventory_quantity ?? 0),
    is_physical_product: true,
    weight: 1.5,
    weight_unit: 'kg',
    hsn_code: initialData?.hsn_code || '9403',
    has_variants: initialData?.has_variants ?? ((initialData?.variants?.length ?? 0) > 1),
    options: initialData?.options || [],
    variants: initialData?.variants || [],
    tags: initialData?.tags || [],
    collection_ids: initialData?.collection_ids || [],
    seo_title: initialData?.seo_title || initialData?.title || '',
    seo_description: initialData?.seo_description || '',
    slug: initialData?.slug || '',
    canonical_url: initialData?.canonical_url || '',
    meta_robots: initialData?.meta_robots || 'index, follow',
    schema_markup: initialData?.schema_markup || '',
    focus_keyword: initialData?.focus_keyword || '',
  });

  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [schemaError, setSchemaError] = useState<string | null>(null);

  // UI state
  const [newTagInput, setNewTagInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formTab, setFormTab] = useState<'details' | 'pricing' | 'variants' | 'seo' | 'all'>('details');

  // Available collections for single store
  const { data: collectionData } = useQuery({ queryKey: ['adminCollections'], queryFn: () => fetchApi('/collections') });
  const availableCollections = (collectionData?.data || []).map((c: { id?: string; _id?: string; title: string }) => ({ id: c.id || c._id || '', name: c.title }));

  // Live Profit & Margin Calculations
  const profit = Math.max(0, form.price - (form.cost_per_item || 0));
  const margin = form.price > 0 && form.cost_per_item
    ? (((form.price - form.cost_per_item) / form.price) * 100).toFixed(1)
    : '0.0';

  // Auto-generate slug from title if empty
  useEffect(() => {
    if (!form.slug && form.title) {
      setForm((prev) => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  }, [form.title]);

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    const token = localStorage.getItem('homzy_token');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Instant local preview
      const localUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, images: [...prev.images, localUrl] }));

      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('http://127.0.0.1:8000/api/v1/products/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          // Replace temporary blob URL with actual uploaded URL
          setForm((prev) => ({
            ...prev,
            images: prev.images.map((img) => (img === localUrl ? data.url : img)),
          }));
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }
    setIsUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setForm((prev) => {
      const target = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return { ...prev, images: [target, ...rest] };
    });
  };

  // Tag Manager
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = newTagInput.trim().replace(/^,+|,+$/g, '');
      if (val && !form.tags.includes(val)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  // Collection Selector
  const handleToggleCollection = (colId: string) => {
    setForm((prev) => {
      const exists = prev.collection_ids.includes(colId);
      return {
        ...prev,
        collection_ids: exists
          ? prev.collection_ids.filter((id) => id !== colId)
          : [...prev.collection_ids, colId],
      };
    });
  };

  // Regenerate Variants Matrix when options change
  const handleGenerateVariantCombinations = () => {
    if (!form.options || form.options.length === 0) return;

    // Cartessian product of option values
    const combinations: string[][] = form.options.reduce(
      (acc, option) => {
        const values = option.values.filter(Boolean);
        if (values.length === 0) return acc;
        return acc.flatMap((prevComb) => values.map((val) => [...prevComb, val]));
      },
      [[]] as string[][]
    );

    const newVariants: ProductVariantData[] = combinations.map((comb) => {
      const title = comb.join(' / ');
      const skuSuffix = comb.map((v) => v.slice(0, 3).toUpperCase()).join('-');
      return {
        title,
        sku: `${form.sku || 'HOM'}-${skuSuffix}`,
        price: form.price,
        compare_at_price: form.compare_at_price,
        inventory_quantity: 0,
        cost_per_item: form.cost_per_item,
        weight: form.weight,
        weight_unit: form.weight_unit,
        ...(form.variants.find(v => v.title === title) || {}),
        options_map: Object.fromEntries(form.options.map((option, index) => [option.name, comb[index]])),
      };
    });

    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Format images with ALT text for Google Images & Accessibility
      const formattedImages = form.images.map((url, idx) => ({
        url,
        alt: (form.image_alts && form.image_alts[idx]) ? form.image_alts[idx] : (form.title || 'Product Image'),
      }));

      const payload = {
        title: form.title,
        heading_h1: form.heading_h1 || form.title,
        heading_h2: form.heading_h2 || '',
        heading_h3: form.heading_h3 || '',
        description: form.description,
        vendor: form.vendor,
        product_type: form.product_type,
        status: form.status,
        images: formattedImages,
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        cost_per_item: form.cost_per_item ? Number(form.cost_per_item) : null,
        tax_rate: Number(form.tax_rate),
        sku: form.sku,
        barcode: form.barcode,
        inventory_quantity: Number(form.inventory_quantity),
        hsn_code: form.hsn_code,
        has_variants: form.has_variants,
        options: form.has_variants ? form.options : [],
        variants: form.has_variants ? form.variants : [
          {
            id: initialData?.variants?.[0]?.id || initialData?.variants?.[0]?._id,
            title: 'Default Title',
            sku: form.sku,
            barcode: form.barcode,
            price: Number(form.price),
            compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
            cost_per_item: form.cost_per_item ? Number(form.cost_per_item) : null,
            inventory_quantity: Number(form.inventory_quantity),
            weight: Number(form.weight),
            weight_unit: form.weight_unit,
            image_url: form.images[0] || null,
          }
        ],
        tags: form.tags,
        collection_ids: form.collection_ids,
        seo_title: form.seo_title || form.title,
        seo_description: form.seo_description || form.description,
        slug: form.slug,
        canonical_url: form.canonical_url || '',
        meta_robots: form.meta_robots || 'index, follow',
        schema_markup: form.schema_markup || '',
        focus_keyword: form.focus_keyword || '',
        seo: {
          title: form.seo_title || form.title,
          description: form.seo_description || form.description,
          canonical_url: form.canonical_url || '',
          meta_robots: form.meta_robots || 'index, follow',
          schema_markup: form.schema_markup || '',
          focus_keyword: form.focus_keyword || '',
        },
      };

      if (isEdit && productId) {
        return fetchApi(`/products/${productId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }

      return fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (!isEdit) {
        router.push('/admin/products');
      }
    },
  });

  return (
    <div className="space-y-6 pb-20">
      {/* 1. COMPACT TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 bg-white/95 backdrop-blur-sm py-2.5 px-4 rounded-xl z-30 border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/products"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex-shrink-0"
            title="Back to products list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate"
                style={{
                  transform: 'none',
                  maxWidth: '550px',
                  fontFamily: 'inherit',
                  fontSize: '18px',
                  lineHeight: '1.25',
                }}
              >
                {isEdit ? form.title || 'Edit Product' : 'Add Product'}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                  form.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : form.status === 'draft'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {form.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Kidobox Product Catalog</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isEdit && form.slug && (
            <a
              href={`/products/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>View on store</span>
            </a>
          )}
          <Link
            href="/admin/products"
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition"
          >
            Discard
          </Link>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !form.title.trim()}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer admin-btn-dark"
            style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#ffffff', stroke: '#ffffff' }} />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
            <span style={{ color: '#ffffff' }}>{saveSuccess ? 'Saved' : isEdit ? 'Save changes' : 'Save product'}</span>
          </button>
        </div>
      </div>

      {/* QUICK SECTION TABS: Avoid endless scrolling */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { key: 'details', label: '1. Title, Description & Media' },
          { key: 'pricing', label: '2. Pricing, Inventory & Shipping' },
          { key: 'variants', label: '3. Variants & Options' },
          { key: 'seo', label: '4. On-Page SEO & Schema' },
          { key: 'all', label: 'View All' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFormTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              formTab === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. 2-COLUMN SHOPIFY GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {(formTab === 'details' || formTab === 'all') && (<>
          {/* A. Title & Description */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1a1a] mb-1">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Minimalist Teakwood Armchair"
                className="w-full px-3 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#1a1a1a]">Description</label>
                {/* Rich text formatting tools */}
                <div className="flex items-center gap-1 bg-[#f6f6f7] p-0.5 rounded border border-[#e1e3e5]">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, description: prev.description + ' **bold text**' }))}
                    className="p-1 text-[#616161] hover:text-[#1a1a1a] rounded"
                    title="Bold"
                  >
                    <Bold className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, description: prev.description + ' *italic text*' }))}
                    className="p-1 text-[#616161] hover:text-[#1a1a1a] rounded"
                    title="Italic"
                  >
                    <Italic className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, description: prev.description + '\n- Bullet point\n- Bullet point' }))}
                    className="p-1 text-[#616161] hover:text-[#1a1a1a] rounded"
                    title="Bullet List"
                  >
                    <List className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, description: prev.description + '\n1. First step\n2. Second step' }))}
                    className="p-1 text-[#616161] hover:text-[#1a1a1a] rounded"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Crafted with rust-resistant powder-coated wrought iron, these sturdy dual-height stands offer exceptional balance for ceramic, terracotta, or metal pots..."
                className="w-full p-3 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] leading-relaxed transition"
              />
            </div>
          </div>

          {/* B. Media Gallery (Shopify Multi-Media Manager) */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-2">
              <div>
                <h3 className="text-xs font-bold text-[#1a1a1a]">Media</h3>
                <p className="text-[11px] text-[#616161]">
                  Upload high-resolution photography. The first image serves as the featured storefront thumbnail.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#616161] bg-[#f1f2f4] px-2 py-0.5 rounded">
                {form.images.length} file(s)
              </span>
            </div>

            {/* Media Upload & URL Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* File Upload Zone */}
              <div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#c9cccf] hover:border-[#1a1a1a] rounded-xl p-4 text-center cursor-pointer transition bg-[#fafafa] hover:bg-white"
                >
                  {isUploadingImage ? (
                    <div className="py-2 flex flex-col items-center gap-1">
                      <Loader2 className="w-5 h-5 animate-spin text-[#008060]" />
                      <span className="text-[11px] font-medium text-[#616161]">Uploading media...</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-8 h-8 rounded-full bg-[#f1f2f4] text-[#1a1a1a] flex items-center justify-center mx-auto">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-semibold text-[#1a1a1a]">
                        Add images from computer
                      </div>
                      <p className="text-[10px] text-[#616161]">JPG, PNG, WebP up to 8MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Paste URL */}
              <div className="border border-[#e1e3e5] rounded-xl p-4 bg-[#fafafa] flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#1a1a1a] mb-1">Add media from URL</div>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput.trim()}
                  className="mt-2 w-full py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg transition disabled:opacity-50"
                >
                  Add image URL
                </button>
              </div>
            </div>

            {/* Media Thumbnails Grid with Image ALT Text */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {form.images.map((imgUrl, index) => {
                  const currentAlt = (form.image_alts && form.image_alts[index]) || '';
                  return (
                    <div
                      key={index}
                      className="border border-[#e1e3e5] rounded-xl p-2 bg-[#fafafa] flex flex-col justify-between space-y-2"
                    >
                      <div className="relative group rounded-lg overflow-hidden border border-[#e1e3e5] bg-[#f6f6f7] aspect-square">
                        <img src={imgUrl} alt={currentAlt || `Product ${index + 1}`} className="w-full h-full object-cover" />

                        {/* Primary Badge */}
                        {index === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            ★ Primary
                          </span>
                        )}

                        {/* Overlay controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(index)}
                              title="Make primary"
                              className="p-1.5 bg-white text-[#1a1a1a] rounded-lg hover:bg-emerald-50 transition"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            title="Delete image"
                            className="p-1.5 bg-white text-[#d72c0d] rounded-lg hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image ALT Text Input (On-page SEO) */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#616161] mb-1 font-semibold">
                          <span>ALT Text (Image SEO)</span>
                          {currentAlt ? (
                            <span className="text-emerald-700">✓ Set</span>
                          ) : (
                            <span className="text-amber-700">Empty</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={currentAlt}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm((prev) => ({
                              ...prev,
                              image_alts: { ...(prev.image_alts || {}), [index]: val },
                            }));
                          }}
                          placeholder={form.title ? `${form.title} photo ${index + 1}` : 'Descriptive ALT text...'}
                          className="w-full px-2 py-1 text-[11px] bg-white border border-[#c9cccf] rounded focus:outline-none focus:border-[#008060]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          </>)}

          {(formTab === 'pricing' || formTab === 'all') && (<>
          {/* C. Pricing & Shopify Margin Calculator */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4">
            <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">Pricing</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Price (₹ INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161] font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg font-bold focus:outline-none focus:border-[#008060]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Compare-at price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161] font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.compare_at_price ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        compare_at_price: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="Strikethrough original price"
                    className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1a1a1a]">Cost per item (₹)</label>
                  <span className="text-[10px] text-[#616161]">Confidential</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161] font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.cost_per_item ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cost_per_item: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="Manufacturing cost"
                    className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                  />
                </div>
              </div>
            </div>

            {/* Shopify Live Profit and Margin Widget */}
            <div className="bg-[#f6f6f7] rounded-xl p-3 border border-[#e1e3e5] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#616161]">Profit per unit:</span>
                <div className="font-bold text-[#1a1a1a] text-sm">
                  ₹{profit.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-[11px] text-[#616161]">Margin:</span>
                <div className="font-bold text-[#008060] text-sm">
                  {margin}%
                </div>
              </div>
            </div>

            {/* Taxes */}
            <div className="pt-2 border-t border-[#e1e3e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1a1a1a]">
                <input
                  type="checkbox"
                  checked={form.charge_tax}
                  onChange={(e) => setForm({ ...form, charge_tax: e.target.checked })}
                  className="rounded border-[#c9cccf] text-[#008060] focus:ring-[#008060]"
                />
                <span className="font-semibold">Charge tax on this product (GST)</span>
              </label>

              {form.charge_tax && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#616161]">Tax Rate:</span>
                  <select
                    value={form.tax_rate}
                    onChange={(e) => setForm({ ...form, tax_rate: parseFloat(e.target.value) })}
                    className="px-2 py-1 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none"
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% (Handicrafts/Fabrics)</option>
                    <option value="12">12% (Apparel/Accessories)</option>
                    <option value="18">18% (Standard GST Homeware)</option>
                    <option value="28">28% (Luxury goods)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* D. Inventory */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4">
            <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">Inventory</h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1a1a1a]">
                <input
                  type="checkbox"
                  checked={form.track_quantity}
                  onChange={(e) => setForm({ ...form, track_quantity: e.target.checked })}
                  className="rounded border-[#c9cccf] text-[#008060]"
                />
                <span className="font-semibold">Track quantity</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1a1a1a]">
                <input
                  type="checkbox"
                  checked={form.continue_selling_out_of_stock}
                  onChange={(e) => setForm({ ...form, continue_selling_out_of_stock: e.target.checked })}
                  className="rounded border-[#c9cccf] text-[#008060]"
                />
                <span>Continue selling when out of stock (Backorders)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="HOM-SKU-101"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Barcode (ISBN, UPC, GTIN)</label>
                <input
                  type="text"
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  placeholder="8901234567890"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Available Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={form.inventory_quantity}
                  onChange={(e) => setForm({ ...form, inventory_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg font-bold focus:outline-none focus:border-[#008060]"
                />
              </div>
            </div>
          </div>

          {/* E. Shipping (Shiprocket Integrated) */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-2">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-[#1a1a1a]">Shipping & Logistics</h3>
              </div>
              <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2 py-0.5 rounded border border-blue-200">
                Shiprocket Automated
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1a1a1a]">
              <input
                type="checkbox"
                checked={form.is_physical_product}
                onChange={(e) => setForm({ ...form, is_physical_product: e.target.checked })}
                className="rounded border-[#c9cccf] text-[#008060]"
              />
              <span className="font-semibold">This is a physical product (Requires shipment)</span>
            </label>

            {form.is_physical_product && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Package Weight</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0.1 })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                    <select
                      value={form.weight_unit}
                      onChange={(e) => setForm({ ...form, weight_unit: e.target.value as 'kg' | 'g' })}
                      className="px-2.5 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-[#616161] mt-1">Used to compute live Shiprocket rates at checkout.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                    HSN Code (Harmonized System)
                  </label>
                  <input
                    type="text"
                    value={form.hsn_code}
                    onChange={(e) => setForm({ ...form, hsn_code: e.target.value })}
                    placeholder="9403 (Furniture) or 6302 (Linen)"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                  />
                  <p className="text-[10px] text-[#616161] mt-1">Required for automated Shiprocket invoice generation.</p>
                </div>
              </div>
            )}
          </div>

          </>)}

          {(formTab === 'variants' || formTab === 'all') && (<>
          {/* F. Variants & Options (Shopify Variant Matrix) */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-2">
              <h3 className="text-xs font-bold text-[#1a1a1a]">Variants</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1a1a1a]">
                <input
                  type="checkbox"
                  checked={form.has_variants}
                  onChange={(e) => setForm({ ...form, has_variants: e.target.checked })}
                  className="rounded border-[#c9cccf] text-[#008060]"
                />
                <span className="font-semibold">This product has options, like size or color</span>
              </label>
            </div>

            {form.has_variants && (
              <div className="space-y-4">
                {/* Options List */}
                {form.options.map((opt, optIndex) => (
                  <div key={optIndex} className="p-3 bg-[#f6f6f7] rounded-xl border border-[#e1e3e5] space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => {
                          const updated = [...form.options];
                          updated[optIndex].name = e.target.value;
                          setForm({ ...form, options: updated });
                        }}
                        placeholder="Option name (e.g. Size, Color, Material)"
                        className="font-bold text-xs bg-white border border-[#c9cccf] px-2.5 py-1 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.options.filter((_, idx) => idx !== optIndex);
                          setForm({ ...form, options: updated });
                        }}
                        className="text-xs text-[#d72c0d] hover:underline"
                      >
                        Remove option
                      </button>
                    </div>

                    {/* Option Values Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {opt.values.map((val, valIndex) => (
                        <span
                          key={valIndex}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#c9cccf] rounded-lg text-xs font-medium text-[#1a1a1a]"
                        >
                          {val}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...form.options];
                              updated[optIndex].values = updated[optIndex].values.filter((_, vIdx) => vIdx !== valIndex);
                              setForm({ ...form, options: updated });
                            }}
                            className="text-[#8c9196] hover:text-[#1a1a1a]"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Add value input */}
                      <input
                        type="text"
                        placeholder="Add value (press Enter)..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !opt.values.includes(val)) {
                              const updated = [...form.options];
                              updated[optIndex].values.push(val);
                              setForm({ ...form, options: updated });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="px-2.5 py-1 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        options: [...prev.options, { name: 'Color', values: ['Walnut', 'Natural Oak'] }],
                      }));
                    }}
                    className="text-xs text-[#008060] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add another option
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateVariantCombinations}
                    className="ml-auto px-3 py-1 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    Update variant matrix
                  </button>
                </div>

                {/* Shopify Variant Matrix Table */}
                <div className="border border-[#e1e3e5] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161]">
                      <tr>
                        <th className="py-2 px-3">Variant</th>
                        <th className="py-2 px-3">Price (₹)</th>
                        <th className="py-2 px-3">SKU</th>
                        <th className="py-2 px-3">Quantity</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e1e3e5]">
                      {form.variants.map((v, vIndex) => (
                        <tr key={vIndex} className="hover:bg-[#fafafa]">
                          <td className="py-2 px-3 font-semibold text-[#1a1a1a]">
                            {v.title}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={v.price}
                              onChange={(e) => {
                                const updated = [...form.variants];
                                updated[vIndex].price = parseFloat(e.target.value) || 0;
                                setForm({ ...form, variants: updated });
                              }}
                              className="w-24 px-2 py-1 text-xs bg-white border border-[#c9cccf] rounded font-bold"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => {
                                const updated = [...form.variants];
                                updated[vIndex].sku = e.target.value;
                                setForm({ ...form, variants: updated });
                              }}
                              className="w-32 px-2 py-1 text-xs bg-white border border-[#c9cccf] rounded font-mono"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={v.inventory_quantity}
                              onChange={(e) => {
                                const updated = [...form.variants];
                                updated[vIndex].inventory_quantity = parseInt(e.target.value) || 0;
                                setForm({ ...form, variants: updated });
                              }}
                              className="w-20 px-2 py-1 text-xs bg-white border border-[#c9cccf] rounded"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = form.variants.filter((_, idx) => idx !== vIndex);
                                setForm({ ...form, variants: updated });
                              }}
                              className="text-[#d72c0d] hover:underline"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          </>)}

          {(formTab === 'seo' || formTab === 'all') && (<>
          {/* G. Complete On-Page SEO & Headings Suite */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-2">
              <div>
                <h3 className="text-xs font-bold text-[#1a1a1a]">Search Engine Optimization (SEO) & Headings</h3>
                <p className="text-[11px] text-[#616161]">Manage titles, meta descriptions, on-page headings (H1, H2, H3), slugs, robots, canonical tags, and schema.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f6f6f7] p-0.5 rounded-lg border border-[#e1e3e5]">
                <button
                  type="button"
                  onClick={() => setSerpDevice('desktop')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded ${serpDevice === 'desktop' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#616161]'}`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice('mobile')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded ${serpDevice === 'mobile' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#616161]'}`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Google SERP Preview Box */}
            <div className={`p-4 bg-[#f8f9fa] border border-[#e1e3e5] rounded-xl space-y-1.5 font-sans ${serpDevice === 'mobile' ? 'max-w-sm mx-auto shadow-sm' : ''}`}>
              <div className="text-[11px] text-[#202124] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#ff268b] text-white flex items-center justify-center text-[9px] font-bold">
                  K
                </span>
                <div className="leading-tight">
                  <div className="text-[10px] text-[#202124] font-medium">kidobox.store</div>
                  <div className="text-[9px] text-[#5f6368]">https://kidobox.store &gt; products &gt; {form.slug || 'product-slug'}</div>
                </div>
              </div>
              <h4 className="text-[#1a0dab] hover:underline cursor-pointer text-sm font-medium leading-snug line-clamp-1">
                {form.seo_title || form.title || 'Product Title'} | KIDOBOX
              </h4>
              <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                {form.seo_description ||
                  (form.description ? form.description.replace(/<[^>]*>/g, '').slice(0, 160) : '') ||
                  'Shop thoughtfully chosen baby & toddler essentials. 100% skin-safe organic materials with express Shiprocket delivery and COD.'}
              </p>
            </div>

            {/* 1. SEO Title & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1a1a1a]">SEO Title Tag</label>
                  <span className={`text-[10px] font-mono ${(form.seo_title || form.title).length > 60 ? 'text-amber-700 font-bold' : 'text-[#616161]'}`}>
                    {(form.seo_title || form.title).length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  placeholder={form.title || 'Product Page Title (Recommended: 50-60 characters)'}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1a1a1a]">Focus Keyword (Optional)</label>
                  {form.focus_keyword && (
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {(form.title.toLowerCase().includes(form.focus_keyword.toLowerCase()) ? '✓ in title' : '✗ not in title')}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={form.focus_keyword || ''}
                  onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })}
                  placeholder="e.g. organic baby romper"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#1a1a1a]">Meta Description</label>
                <span className={`text-[10px] font-mono ${(form.seo_description || '').length > 160 ? 'text-amber-700 font-bold' : 'text-[#616161]'}`}>
                  {(form.seo_description || '').length} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={form.seo_description}
                onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                placeholder="High-converting search snippet. Include benefits, baby safety credentials, and a call-to-action."
                className="w-full p-2.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
              />
            </div>

            {/* 2. URL Slug with Auto-Generator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#1a1a1a]">URL Handle / Slug</label>
                <button
                  type="button"
                  onClick={() => {
                    const cleanSlug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setForm({ ...form, slug: cleanSlug });
                  }}
                  className="text-[11px] text-[#008060] hover:underline font-semibold"
                >
                  Regenerate from Title
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1.5 bg-[#f6f6f7] border border-r-0 border-[#c9cccf] rounded-l-lg text-xs text-[#616161]">
                  https://kidobox.store/products/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-r-lg font-mono focus:outline-none focus:border-[#008060]"
                />
              </div>
            </div>

            {/* 3. On-Page Headings (H1, H2, H3) */}
            <div className="border border-[#e1e3e5] rounded-xl p-4 bg-[#fcfcfd] space-y-3">
              <div className="text-xs font-bold text-[#1a1a1a] flex items-center justify-between">
                <span>On-Page Semantic Headings</span>
                <span className="text-[10px] text-[#616161] font-normal">H1 for main title, H2 for subheading, H3 for detail highlights</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">
                    <span className="bg-pink-100 text-pink-800 text-[9px] font-bold px-1.5 py-0.5 rounded mr-1">H1</span>
                    Main Page Heading
                  </label>
                  <input
                    type="text"
                    value={form.heading_h1 || ''}
                    onChange={(e) => setForm({ ...form, heading_h1: e.target.value })}
                    placeholder={form.title || 'Defaults to product title'}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">
                    <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded mr-1">H2</span>
                    Subheading / Tagline
                  </label>
                  <input
                    type="text"
                    value={form.heading_h2 || ''}
                    onChange={(e) => setForm({ ...form, heading_h2: e.target.value })}
                    placeholder="e.g. Cloud-Soft Comfort For Sweet Milestones"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded mr-1">H3</span>
                    Highlights Heading
                  </label>
                  <input
                    type="text"
                    value={form.heading_h3 || ''}
                    onChange={(e) => setForm({ ...form, heading_h3: e.target.value })}
                    placeholder="e.g. Pediatrician Tested & Certified Safe"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Canonical URL & Meta Robots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Canonical Tag URL</label>
                <input
                  type="url"
                  value={form.canonical_url || ''}
                  onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                  placeholder={`https://kidobox.store/products/${form.slug || 'product-slug'}`}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#008060]"
                />
                <span className="text-[10px] text-[#616161] block mt-0.5">Leave blank to default to this product's canonical URL.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Meta Robots Directives</label>
                <select
                  value={form.meta_robots || 'index, follow'}
                  onChange={(e) => setForm({ ...form, meta_robots: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg font-semibold focus:outline-none focus:border-[#008060]"
                >
                  <option value="index, follow">index, follow (Standard - indexed by Google)</option>
                  <option value="noindex, follow">noindex, follow (Hide from search, follow links)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Complete search blackout)</option>
                  <option value="index, nofollow">index, nofollow (Index page, ignore links)</option>
                </select>
                <span className="text-[10px] text-[#616161] block mt-0.5">Controls Googlebot indexing directives for this specific product.</span>
              </div>
            </div>

            {/* 5. Schema Markup (JSON-LD) */}
            <div className="space-y-2 pt-2 border-t border-[#e1e3e5]">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-[#1a1a1a]">Schema Markup (Structured Data JSON-LD)</label>
                  <span className="text-[10px] text-[#616161] block">Custom or auto-generated schema.org/Product JSON-LD.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const generated = {
                      "@context": "https://schema.org/",
                      "@type": "Product",
                      "name": form.title,
                      "image": form.images[0] || "https://kidobox.store/logo.png",
                      "description": form.seo_description || (form.description ? form.description.replace(/<[^>]*>/g, '').slice(0, 160) : ''),
                      "sku": form.sku || "KDB-" + Math.floor(1000 + Math.random() * 9000),
                      "brand": {
                        "@type": "Brand",
                        "name": form.vendor || "KIDOBOX"
                      },
                      "offers": {
                        "@type": "Offer",
                        "url": `https://kidobox.store/products/${form.slug}`,
                        "priceCurrency": "INR",
                        "price": Number(form.price),
                        "priceValidUntil": "2027-12-31",
                        "availability": form.inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        "itemCondition": "https://schema.org/NewCondition"
                      }
                    };
                    setForm({ ...form, schema_markup: JSON.stringify(generated, null, 2) });
                    setSchemaError(null);
                  }}
                  className="px-2.5 py-1 bg-white border border-[#c9cccf] hover:bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-lg shadow-sm transition"
                >
                  ⚡ Auto-Generate Product Schema
                </button>
              </div>

              <textarea
                rows={5}
                value={form.schema_markup || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, schema_markup: val });
                  if (!val.trim()) {
                    setSchemaError(null);
                  } else {
                    try {
                      JSON.parse(val);
                      setSchemaError(null);
                    } catch (err: any) {
                      setSchemaError(err.message);
                    }
                  }
                }}
                placeholder='{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "..."
}'
                className="w-full p-2.5 text-xs bg-[#f8f9fa] border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#008060]"
              />

              {schemaError ? (
                <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  JSON Syntax Error: {schemaError}
                </div>
              ) : form.schema_markup ? (
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Valid JSON-LD Schema (will be injected into &lt;head&gt;)
                </div>
              ) : null}
            </div>
          </div>
          </>)}
        </div>

        {/* RIGHT COLUMN: Sidebar Organization (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Status Card */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-3">
            <h3 className="text-xs font-bold text-[#1a1a1a]">Status</h3>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg font-semibold focus:outline-none focus:border-[#008060]"
            >
              <option value="active">Active (Visible on online store)</option>
              <option value="draft">Draft (Hidden from customers)</option>
              <option value="archived">Archived</option>
            </select>

            <div className="pt-2 border-t border-[#e1e3e5]">
              <span className="text-[11px] font-semibold text-[#616161] block mb-1">
                Publishing channels
              </span>
              <div className="flex items-center justify-between text-xs text-[#1a1a1a]">
                <span>Online Store</span>
                <span className="text-[#008060] font-bold">● Published</span>
              </div>
            </div>
          </div>

          {/* 2. Product Organization Card */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4">
            <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
              Product organization
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Product category</label>
              <input
                type="text"
                value={form.product_type}
                onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                placeholder="e.g. Furniture, Lighting, Home Decor"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Vendor / Brand</label>
              <input
                type="text"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                placeholder="e.g. HOMZY Botanicals"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
              />
            </div>

            {/* Collections Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Collections</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {availableCollections.map((col: { id: string; name: string }) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#f6f6f7] cursor-pointer text-xs text-[#1a1a1a]"
                  >
                    <input
                      type="checkbox"
                      checked={form.collection_ids.includes(col.id)}
                      onChange={() => handleToggleCollection(col.id)}
                      className="rounded border-[#c9cccf] text-[#008060]"
                    />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Chip Manager */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Tags</label>
              <div className="flex flex-wrap gap-1 mb-2">
<p className="text-xs text-gray-500">Homepage tags: featured, bestseller, new-arrival. Use age:0-6 for age filtering and feature:Your text for product highlights.</p>
                {form.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f1f2f4] text-[#1a1a1a] text-[11px] font-medium rounded-md"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-[#616161] hover:text-[#1a1a1a]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press Enter..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
              />
              <p className="text-[10px] text-[#616161] mt-1">Separate with comma or Enter key.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
