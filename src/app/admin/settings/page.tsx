'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Receipt,
  MapPin,
  Users,
  ShieldCheck,
  Globe,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    'store_details' | 'payments' | 'shipping' | 'taxes' | 'locations' | 'staff' | 'policies' | 'seo'
  >('store_details');

  const [form, setForm] = useState({
    name: 'KIDOBOX',
    custom_domain: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    tax_mode: 'inclusive',
    default_gst_rate: 12,
    gstin: '27AABCK1234F1Z9',
    allow_cod: true,
    cod_fee: 50,
    free_shipping_threshold: 999,
    address: '42 Little Cuddles Avenue, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400050',
    support_email: 'care@kidobox.com',
    phone: '+91 98765 43210',
    seo_title: 'KIDOBOX | Gentle & Safe Baby & Toddler Essentials',
    seo_description: 'Pure organic cotton outfits, hypoallergenic baby care, food-grade feeding, and sensory toys crafted for little milestones.',
    seo_social_image: '/assets/hd/hero.webp',
    seo_google_verification: 'google-site-verification=kidobox_verified',
    seo_allow_indexing: true,
    seo_canonical_url: 'https://kidobox.com',
  });

  const { data: storeData, isLoading } = useQuery({
    queryKey: ['adminStoreSettings'],
    queryFn: () => fetchApi('/store'),
  });

  useEffect(() => {
    if (storeData?.store) {
      const s = storeData.store;
      setForm({
        name: s.name || '',
        custom_domain: s.custom_domain || '',
        currency: s.currency || 'INR',
        timezone: s.timezone || 'Asia/Kolkata',
        tax_mode: s.settings?.tax_mode || 'inclusive',
        default_gst_rate: s.settings?.default_gst_rate ?? 18,
        gstin: s.settings?.gstin || '27AABCA1234F1Z9',
        allow_cod: s.settings?.allow_cod ?? true,
        cod_fee: s.settings?.cod_fee ?? 50,
        free_shipping_threshold: s.settings?.free_shipping_threshold ?? 999,
        address: s.contact?.address || '',
        city: s.contact?.city || '',
        state: s.contact?.state || '',
        postal_code: s.contact?.postal_code || '',
        support_email: s.contact?.support_email || '',
        phone: s.contact?.phone || '',
        seo_title: s.seo?.title_tag || 'KIDOBOX | Gentle & Safe Baby & Toddler Essentials',
        seo_description: s.seo?.meta_description || 'Pure organic cotton outfits, hypoallergenic baby care, food-grade feeding, and sensory toys crafted for little milestones.',
        seo_social_image: s.seo?.social_image_url || '/assets/hd/hero.webp',
        seo_google_verification: s.seo?.google_verification || 'google-site-verification=kidobox_verified',
        seo_allow_indexing: s.seo?.allow_indexing ?? true,
        seo_canonical_url: s.seo?.canonical_url || 'https://kidobox.com',
      });
    }
  }, [storeData]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      return fetchApi('/store', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStoreSettings'] });
      alert('Store settings saved successfully!');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      name: form.name,
      custom_domain: form.custom_domain,
      currency: form.currency,
      timezone: form.timezone,
      settings: {
        tax_mode: form.tax_mode,
        default_gst_rate: Number(form.default_gst_rate),
        gstin: form.gstin,
        allow_cod: Boolean(form.allow_cod),
        cod_fee: Number(form.cod_fee),
        free_shipping_threshold: Number(form.free_shipping_threshold),
      },
      contact: {
        address: form.address,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        support_email: form.support_email,
        phone: form.phone,
      },
      seo: {
        title_tag: form.seo_title,
        meta_description: form.seo_description,
        social_image_url: form.seo_social_image,
        google_verification: form.seo_google_verification,
        allow_indexing: Boolean(form.seo_allow_indexing),
        canonical_url: form.seo_canonical_url,
      },
    });
  };

  const tabs = [
    { key: 'store_details', label: 'Store details', icon: Store },
    { key: 'seo', label: 'Search engine optimization (SEO)', icon: Globe },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'shipping', label: 'Shipping and delivery', icon: Truck },
    { key: 'taxes', label: 'Taxes and duties', icon: Receipt },
    { key: 'locations', label: 'Locations', icon: MapPin },
    { key: 'staff', label: 'Users and permissions', icon: Users },
    { key: 'policies', label: 'Policies', icon: FileText },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Settings</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Configure store profile, GSTIN taxes, payment methods, and shipping preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 self-start disabled:opacity-50"
        >
          {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save settings
        </button>
      </div>

      {/* Two Column Layout: Left Nav List + Right Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Subnav (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-xl border border-[#e1e3e5] p-2 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-0.5 h-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                  isActive
                    ? 'bg-[#f1f2f4] text-[#1a1a1a] font-bold'
                    : 'text-[#616161] hover:bg-[#f6f6f7] hover:text-[#1a1a1a]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1a1a1a]' : 'text-[#8c9196]'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Store details */}
            {activeTab === 'store_details' && (
              <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                  Store Profile & Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Store name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Account email</label>
                    <input
                      type="email"
                      required
                      value={form.support_email}
                      onChange={(e) => setForm({ ...form, support_email: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Store phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Store currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                    >
                      <option value="INR">Indian Rupee (INR ₹)</option>
                      <option value="USD">US Dollar (USD $)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block font-semibold text-[#1a1a1a] mb-1">Time zone</label>
                  <input
                    type="text"
                    disabled
                    value="Asia/Kolkata (IST +05:30)"
                    className="w-full px-3 py-1.5 bg-[#f6f6f7] border border-[#c9cccf] rounded-lg text-[#616161]"
                  />
                </div>
              </div>
            )}

            {/* SEO & Search Engine Optimization */}
            {activeTab === 'seo' && (
              <div className="space-y-5">
                {/* Search Engine Listing Preview */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-2">
                    <h3 className="text-sm font-bold text-[#1a1a1a]">Search engine listing preview</h3>
                    <span className="text-[10px] text-[#008060] font-semibold bg-[#e3f1df] px-2 py-0.5 rounded-full">
                      Google Rich Snippets Ready
                    </span>
                  </div>

                  <div className="p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-sans">
                    <div className="text-[12px] text-[#202124] flex items-center gap-1.5 mb-1">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#ff268b] to-[#0284c7] text-white flex items-center justify-center text-[9px] font-bold">
                        K
                      </div>
                      <span className="text-[#4d5156] font-medium">{form.seo_canonical_url || 'https://kidobox.com'}</span>
                      <span className="text-[#70757a]">›</span>
                      <span className="text-[#70757a]">store</span>
                    </div>
                    <div className="text-[18px] text-[#1a0dab] hover:underline font-medium leading-tight cursor-pointer">
                      {form.seo_title || 'KIDOBOX | Gentle & Safe Baby Essentials'}
                    </div>
                    <div className="text-[13px] text-[#4d5156] leading-relaxed mt-1">
                      {form.seo_description || 'Discover pure organic cotton outfits, toxin-free care, sensory toys, and baby essentials designed for everyday cuddles.'}
                    </div>
                  </div>
                </div>

                {/* Meta Configuration */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                    Homepage Title & Meta Description
                  </h3>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-[#1a1a1a]">Homepage title tag</label>
                      <span className={`text-[11px] ${form.seo_title.length > 70 ? 'text-amber-600 font-bold' : 'text-[#616161]'}`}>
                        {form.seo_title.length} / 70 characters
                      </span>
                    </div>
                    <input
                      type="text"
                      value={form.seo_title}
                      onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                      placeholder="e.g. KIDOBOX | Gentle & Safe Baby & Toddler Essentials"
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                    <p className="text-[11px] text-[#616161] mt-1">
                      Shopify recommendation: Keep under 70 characters so search engines do not truncate it.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-[#1a1a1a]">Homepage meta description</label>
                      <span className={`text-[11px] ${form.seo_description.length > 320 ? 'text-amber-600 font-bold' : 'text-[#616161]'}`}>
                        {form.seo_description.length} / 320 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={form.seo_description}
                      onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                      placeholder="Enter a compelling summary of your store for Google search results..."
                      className="w-full p-2.5 bg-white border border-[#c9cccf] rounded-lg text-xs focus:outline-none focus:border-[#008060]"
                    />
                    <p className="text-[11px] text-[#616161] mt-1">
                      Shopify recommendation: Keep between 150 and 320 characters for optimal search snippets.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Social sharing image (OpenGraph / Twitter card)</label>
                    <input
                      type="url"
                      value={form.seo_social_image}
                      onChange={(e) => setForm({ ...form, seo_social_image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                    {form.seo_social_image && (
                      <div className="mt-2 w-48 h-28 rounded-lg overflow-hidden border border-[#e1e3e5] bg-slate-100">
                        <img
                          src={form.seo_social_image}
                          alt="Social preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Engine Verification & Crawling */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                    Search Engine Crawling & Verification
                  </h3>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allow_indexing"
                      checked={form.seo_allow_indexing}
                      onChange={(e) => setForm({ ...form, seo_allow_indexing: e.target.checked })}
                      className="rounded border-[#c9cccf] text-[#1a1a1a] focus:ring-[#008060]"
                    />
                    <label htmlFor="allow_indexing" className="font-semibold text-[#1a1a1a]">
                      Allow search engines to index this store (robots.txt: Allow /)
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Google Search Console verification meta tag</label>
                    <input
                      type="text"
                      value={form.seo_google_verification}
                      onChange={(e) => setForm({ ...form, seo_google_verification: e.target.value })}
                      placeholder="e.g. google-site-verification=abc123xyz789"
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Canonical store domain</label>
                    <input
                      type="url"
                      value={form.seo_canonical_url}
                      onChange={(e) => setForm({ ...form, seo_canonical_url: e.target.value })}
                      placeholder="https://kidobox.com"
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div className="p-3 bg-[#f6f6f7] rounded-lg flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#1a1a1a]">Dynamic XML Sitemap & Robots.txt</div>
                      <div className="text-[#616161]">Automatically synced with products, collections, and catalog pages.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/sitemap.xml"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-white border border-[#c9cccf] rounded font-semibold text-[#1a1a1a] hover:bg-[#ebebeb] transition"
                      >
                        View Sitemap.xml
                      </a>
                      <a
                        href="/robots.txt"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-white border border-[#c9cccf] rounded font-semibold text-[#1a1a1a] hover:bg-[#ebebeb] transition"
                      >
                        View Robots.txt
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Payments */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                  Payment Providers
                </h3>

                <div className="p-4 bg-[#f9fdfb] border border-[#aee9d1] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#0d5921]">Razorpay Payment Gateway</div>
                    <p className="text-[11px] text-[#616161]">Accept UPI, Cards, Net Banking, and Wallets</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#008060] bg-[#e3f1df] px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="p-4 bg-[#f6f6f7] border border-[#e1e3e5] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1a1a1a]">Cash on Delivery (COD)</div>
                    <p className="text-[11px] text-[#616161]">Collect payment upon parcel delivery via courier</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.allow_cod}
                      onChange={(e) => setForm({ ...form, allow_cod: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#008060]"></div>
                  </label>
                </div>

                {form.allow_cod && (
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">COD Handling Fee (INR)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.cod_fee}
                      onChange={(e) => setForm({ ...form, cod_fee: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. Shipping & Delivery */}
            {activeTab === 'shipping' && (
              <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                  Shipping & Delivery
                </h3>

                <div className="p-4 bg-[#f9fdfb] border border-[#aee9d1] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#0d5921]">Shiprocket Logistics Aggregator</div>
                    <p className="text-[11px] text-[#616161]">Automated AWB generation, label printing, and tracking</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#008060] bg-[#e3f1df] px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-[#1a1a1a] mb-1">
                    Free shipping threshold (INR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.free_shipping_threshold}
                    onChange={(e) => setForm({ ...form, free_shipping_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                  />
                  <p className="text-[11px] text-[#616161] mt-1">
                    Orders above this subtotal qualify for complimentary surface shipping.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Taxes and Duties */}
            {activeTab === 'taxes' && (
              <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                  Taxes and Duties (Indian GST)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">GST Identification Number (GSTIN)</label>
                    <input
                      type="text"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Tax Calculation Mode</label>
                    <select
                      value={form.tax_mode}
                      onChange={(e) => setForm({ ...form, tax_mode: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                    >
                      <option value="inclusive">All prices include GST (Inclusive)</option>
                      <option value="exclusive">Calculate GST at checkout (Exclusive)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-[#f6f6f7] rounded-lg text-[#616161] text-[11px] leading-relaxed">
                  KIDOBOX automatically divides intra-state Maharashtra transactions into CGST 50% + SGST 50%, and inter-state transactions into 100% IGST in compliance with Indian GST regulations.
                </div>
              </div>
            )}

            {/* 5. Locations */}
            {activeTab === 'locations' && (
              <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                  Fulfillment Warehouse Location
                </h3>

                <div>
                  <label className="block font-semibold text-[#1a1a1a] mb-1">Address Line</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={form.postal_code}
                      onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. Staff & Permissions */}
            {activeTab === 'staff' && (
              <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                  Store Staff & Permissions
                </h3>

                <div className="p-3 bg-[#f6f6f7] rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1a1a1a]">admin@kidobox.com</div>
                    <div className="text-[11px] text-[#616161]">Store Owner • Full Permissions</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#008060] bg-[#e3f1df] px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            )}

            {/* 7. Policies */}
            {activeTab === 'policies' && (
              <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e1e3e5] pb-2">
                  Legal Policies
                </h3>

                <div>
                  <label className="block font-semibold text-[#1a1a1a] mb-1">Refund & Returns Policy</label>
                  <textarea
                    rows={3}
                    defaultValue="We offer a 30-day return policy for unused artisanal furniture items with original packaging."
                    className="w-full p-2.5 bg-white border border-[#c9cccf] rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1a1a1a] mb-1">Privacy Policy</label>
                  <textarea
                    rows={3}
                    defaultValue="Customer details are encrypted and processed exclusively for payment settlement and delivery tracking."
                    className="w-full p-2.5 bg-white border border-[#c9cccf] rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
