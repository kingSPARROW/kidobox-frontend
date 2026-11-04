'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import {
  Globe,
  Search,
  Sparkles,
  Save,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Monitor,
  Loader2,
  FileText,
  Heading,
  Check,
  Copy,
  ChevronDown,
} from 'lucide-react';

interface GlobalSeoForm {
  title: string;
  title_template: string;
  description: string;
  keywords: string;
  social_image: string;
  google_site_verification: string;
  canonical_url: string;
  meta_robots: string;
  schema_markup: string;
}

interface PageSeoItem {
  slug: string;
  label: string;
  seo_title: string;
  seo_description: string;
  heading_h1?: string;
  heading_h2?: string;
  heading_h3?: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup?: string;
}

export default function AdminSeoHubPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'global' | 'pages'>('global');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('/');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Global SEO Form state
  const [globalSeo, setGlobalSeo] = useState<GlobalSeoForm>({
    title: 'Kidobox • Little Needs. Big Smiles.',
    title_template: '%s | Kidobox Baby Store',
    description: 'Discover premium organic baby essentials, safe teething toys, and thoughtfully designed milestone gifts.',
    keywords: 'baby store, organic baby clothes, teething toys, kidobox, newborn gifts',
    social_image: '/assets/hd/hero.webp',
    google_site_verification: '',
    canonical_url: 'https://kidobox.com',
    meta_robots: 'index, follow',
    schema_markup: '',
  });

  const [pages, setPages] = useState<PageSeoItem[]>([]);

  // Fetch SEO Data from API
  const { data: seoData, isLoading } = useQuery({
    queryKey: ['adminSeo'],
    queryFn: async () => {
      const res = await fetchApi('/seo');
      return res?.data;
    },
  });

  useEffect(() => {
    if (seoData) {
      if (seoData.global_seo) {
        setGlobalSeo({
          title: seoData.global_seo.title || '',
          title_template: seoData.global_seo.title_template || '%s | Kidobox Baby Store',
          description: seoData.global_seo.description || '',
          keywords: Array.isArray(seoData.global_seo.keywords)
            ? seoData.global_seo.keywords.join(', ')
            : seoData.global_seo.keywords || '',
          social_image: seoData.global_seo.social_image || '',
          google_site_verification: seoData.global_seo.google_site_verification || '',
          canonical_url: seoData.global_seo.canonical_url || 'https://kidobox.com',
          meta_robots: seoData.global_seo.meta_robots || 'index, follow',
          schema_markup: seoData.global_seo.schema_markup || '',
        });
      }

      if (Array.isArray(seoData.pages)) {
        setPages(seoData.pages);
      }
    }
  }, [seoData]);

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const pageSeoObject: Record<string, any> = {};
      pages.forEach((p) => {
        pageSeoObject[p.slug] = {
          seo_title: p.seo_title,
          seo_description: p.seo_description,
          heading_h1: p.heading_h1,
          heading_h2: p.heading_h2,
          heading_h3: p.heading_h3,
          canonical_url: p.canonical_url,
          meta_robots: p.meta_robots,
          schema_markup: p.schema_markup,
        };
      });

      const payload = {
        global_seo: {
          ...globalSeo,
          keywords: globalSeo.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        },
        page_seo: pageSeoObject,
      };

      return fetchApi('/seo', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSeo'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontData'] });
      setSaveSuccessMessage('SEO settings saved successfully!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    },
  });

  const selectedPage = pages.find((p) => p.slug === selectedPageSlug) || pages[0];

  const updateSelectedPage = (fields: Partial<PageSeoItem>) => {
    setPages((prev) =>
      prev.map((p) => (p.slug === selectedPageSlug ? { ...p, ...fields } : p))
    );
  };

  const handleGenerateOrgSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BabyStore',
      name: 'Kidobox',
      url: globalSeo.canonical_url || 'https://kidobox.com',
      logo: `${globalSeo.canonical_url || 'https://kidobox.com'}/assets/hd/logo.png`,
      description: globalSeo.description,
      sameAs: [
        'https://instagram.com/kidobox',
        'https://facebook.com/kidobox',
      ],
    };
    setGlobalSeo((prev) => ({
      ...prev,
      schema_markup: JSON.stringify(schema, null, 2),
    }));
  };

  const handleGeneratePageSchema = (p: PageSeoItem) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: p.seo_title || p.label,
      description: p.seo_description,
      url: `${globalSeo.canonical_url || 'https://kidobox.com'}${p.slug}`,
      inLanguage: 'en-US',
    };
    updateSelectedPage({
      schema_markup: JSON.stringify(schema, null, 2),
    });
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            SEO &amp; Meta Tags
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage search titles, descriptions, page headings, and how Kidobox appears on Google.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccessMessage && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveSuccessMessage}
            </span>
          )}

          <button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* 2. Simple Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'global'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          1. Storewide SEO Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'pages'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          2. Page Headings &amp; Overrides ({pages.length || 13} Pages)
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading SEO settings...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: STOREWIDE SEO */}
          {activeTab === 'global' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Simple Form */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 text-xs">
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Search Listing Defaults
                  </h2>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-800">Homepage Search Title</label>
                      <span className="text-[10px] text-slate-400">{globalSeo.title.length}/60 chars</span>
                    </div>
                    <input
                      type="text"
                      value={globalSeo.title}
                      onChange={(e) => setGlobalSeo({ ...globalSeo, title: e.target.value })}
                      placeholder="Kidobox • Little Needs. Big Smiles."
                      className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-800">Storefront Title Template</label>
                      <span className="text-[10px] text-slate-400">%s = Dynamic Page/Product Name</span>
                    </div>
                    <input
                      type="text"
                      value={globalSeo.title_template}
                      onChange={(e) => setGlobalSeo({ ...globalSeo, title_template: e.target.value })}
                      placeholder="%s | Kidobox Baby Store"
                      className="w-full px-3 py-2 font-mono bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-800">Homepage Search Description</label>
                      <span className="text-[10px] text-slate-400">{globalSeo.description.length}/160 chars</span>
                    </div>
                    <textarea
                      rows={3}
                      value={globalSeo.description}
                      onChange={(e) => setGlobalSeo({ ...globalSeo, description: e.target.value })}
                      placeholder="Discover premium organic baby essentials, safe teething toys, and thoughtfully designed milestone gifts."
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Keywords (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={globalSeo.keywords}
                      onChange={(e) => setGlobalSeo({ ...globalSeo, keywords: e.target.value })}
                      placeholder="organic baby clothing, teething toys, kidobox"
                      className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                    />
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 text-xs">
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Indexing &amp; Verification
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Google Search Indexing
                      </label>
                      <select
                        value={globalSeo.meta_robots}
                        onChange={(e) => setGlobalSeo({ ...globalSeo, meta_robots: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      >
                        <option value="index, follow">Index, Follow (Recommended)</option>
                        <option value="noindex, follow">Noindex (Hide from Google)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Canonical Base URL
                      </label>
                      <input
                        type="url"
                        value={globalSeo.canonical_url}
                        onChange={(e) => setGlobalSeo({ ...globalSeo, canonical_url: e.target.value })}
                        placeholder="https://kidobox.com"
                        className="w-full px-3 py-2 font-mono bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Google Verification Code
                      </label>
                      <input
                        type="text"
                        value={globalSeo.google_site_verification}
                        onChange={(e) =>
                          setGlobalSeo({ ...globalSeo, google_site_verification: e.target.value })
                        }
                        placeholder="google-site-verification token"
                        className="w-full px-3 py-2 font-mono bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Social Share Image URL
                      </label>
                      <input
                        type="text"
                        value={globalSeo.social_image}
                        onChange={(e) => setGlobalSeo({ ...globalSeo, social_image: e.target.value })}
                        placeholder="/assets/hd/hero.webp"
                        className="w-full px-3 py-2 font-mono bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Store Schema Structured Data</div>
                      <div className="text-[11px] text-slate-400">Google Rich Snippets markup</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateOrgSchema}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Auto-Generate Schema
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Col: Clean SERP Preview */}
              <div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3 sticky top-20">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-blue-600" />
                      Google SERP Preview
                    </span>

                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1 rounded-md text-xs transition ${
                          previewDevice === 'desktop' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1 rounded-md text-xs transition ${
                          previewDevice === 'mobile' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="text-[11px] text-slate-500 font-sans truncate flex items-center gap-1">
                      <span className="font-medium text-slate-800">kidobox.com</span>
                      <span className="text-slate-400">&rsaquo;</span>
                    </div>

                    <h3 className="text-sm font-semibold text-blue-700 leading-snug">
                      {globalSeo.title || 'Kidobox Baby Store'}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {globalSeo.description ||
                        'Discover thoughtful organic essentials, soothing teether toys, and gentle newborn treasures.'}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Canonical tag active
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> OpenGraph &amp; Twitter tags active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAGE-BY-PAGE HEADINGS & SEO */}
          {activeTab === 'pages' && (
            <div className="space-y-5">
              {/* Clean Horizontal Page Selector Pills */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs font-bold text-slate-700 mb-2 px-1">
                  Select Page to Edit:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pages.map((p) => {
                    const isSelected = p.slug === selectedPageSlug;
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => setSelectedPageSlug(p.slug)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Page Editor */}
              {selectedPage && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        {selectedPage.label}
                      </h2>
                      <p className="text-[11px] text-slate-400">URL: {selectedPage.slug}</p>
                    </div>

                    <Link
                      href={selectedPage.slug}
                      target="_blank"
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition inline-flex items-center gap-1.5"
                    >
                      <span>View Live Page</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </div>

                  {/* Semantic Headings */}
                  <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Heading className="w-4 h-4 text-emerald-700" />
                      <span>Page Headings (H1 &amp; H2)</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Main Page Heading &lt;H1&gt; (Headline seen by visitors and search engines)
                      </label>
                      <input
                        type="text"
                        value={selectedPage.heading_h1 || ''}
                        onChange={(e) => updateSelectedPage({ heading_h1: e.target.value })}
                        placeholder={selectedPage.label}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Section Subheading &lt;H2&gt; (Optional secondary subtitle)
                      </label>
                      <input
                        type="text"
                        value={selectedPage.heading_h2 || ''}
                        onChange={(e) => updateSelectedPage({ heading_h2: e.target.value })}
                        placeholder="e.g. Pure comfort crafted with hypoallergenic organic care"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>
                  </div>

                  {/* Search Title & Description */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-800">
                          Search Engine Title Override
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {(selectedPage.seo_title || '').length}/60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={selectedPage.seo_title || ''}
                        onChange={(e) => updateSelectedPage({ seo_title: e.target.value })}
                        placeholder={`${selectedPage.label} • Kidobox`}
                        className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-800">
                          Search Meta Description Override
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {(selectedPage.seo_description || '').length}/160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={selectedPage.seo_description || ''}
                        onChange={(e) => updateSelectedPage({ seo_description: e.target.value })}
                        placeholder={`Explore ${selectedPage.label.toLowerCase()} thoughtfully designed for your baby's comfort.`}
                        className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>
                  </div>

                  {/* Canonical & Robots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Canonical URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={selectedPage.canonical_url || ''}
                        onChange={(e) => updateSelectedPage({ canonical_url: e.target.value })}
                        placeholder={`${globalSeo.canonical_url}${selectedPage.slug}`}
                        className="w-full px-3 py-2 font-mono bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Page Indexing
                      </label>
                      <select
                        value={selectedPage.meta_robots || 'index, follow'}
                        onChange={(e) => updateSelectedPage({ meta_robots: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition"
                      >
                        <option value="index, follow">Index on Google (Standard)</option>
                        <option value="noindex, follow">Do Not Index (Hidden from search)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">Page Schema Markup</div>
                      <div className="text-[11px] text-slate-400">WebPage structured data for this URL</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGeneratePageSchema(selectedPage)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Auto-Generate Page Schema
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Technical Links Card (Simple & Helpful) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">XML Sitemap &amp; Robots.txt</div>
                <div className="text-[11px] text-slate-400">Automatically updated with all products and pages</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition inline-flex items-center gap-1"
              >
                <span>/sitemap.xml</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/robots.txt"
                target="_blank"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition inline-flex items-center gap-1"
              >
                <span>/robots.txt</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
