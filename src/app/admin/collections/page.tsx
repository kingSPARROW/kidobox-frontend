'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  FolderTree,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';

interface CollectionItem {
  id?: string;
  _id?: string;
  title: string;
  slug?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
  heading_h1?: string;
  heading_h2?: string;
  heading_h3?: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup?: string;
  sort_order?: string;
  type?: string;
  is_published?: boolean;
  product_count?: number;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
    meta_robots?: string;
    schema_markup?: string;
  };
}

export default function AdminCollectionsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'content' | 'seo'>('content');
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const defaultForm: CollectionItem = {
    title: '',
    slug: '',
    description: '',
    image_url: '',
    image_alt: '',
    heading_h1: '',
    heading_h2: '',
    heading_h3: '',
    canonical_url: '',
    meta_robots: 'index, follow',
    schema_markup: '',
    sort_order: 'best-selling',
    type: 'manual',
    is_published: true,
    seo: {
      title: '',
      description: '',
      canonical_url: '',
      meta_robots: 'index, follow',
      schema_markup: '',
    },
  };

  const [form, setForm] = useState<CollectionItem>(defaultForm);

  const { data: collectionsData, isLoading } = useQuery({
    queryKey: ['adminCollections'],
    queryFn: () => fetchApi('/collections'),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: CollectionItem) => {
      const cleanPayload = {
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        image_url: payload.image_url,
        image_alt: payload.image_alt || payload.title,
        heading_h1: payload.heading_h1 || payload.title,
        heading_h2: payload.heading_h2 || '',
        heading_h3: payload.heading_h3 || '',
        canonical_url: payload.canonical_url || '',
        meta_robots: payload.meta_robots || 'index, follow',
        schema_markup: payload.schema_markup || '',
        sort_order: payload.sort_order || 'best-selling',
        type: payload.type || 'manual',
        is_published: payload.is_published ?? true,
        seo: {
          title: payload.seo?.title || payload.title,
          description: payload.seo?.description || payload.description || '',
          canonical_url: payload.canonical_url || '',
          meta_robots: payload.meta_robots || 'index, follow',
          schema_markup: payload.schema_markup || '',
        },
      };

      return fetchApi(editingId ? `/collections/${editingId}` : '/collections', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(cleanPayload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCollections'] });
      setIsModalOpen(false);
      setEditingId(null);
      setForm(defaultForm);
    },
  });

  const collections: CollectionItem[] = collectionsData?.data || [];
  const filtered = collections.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalTab('content');
    setSchemaError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CollectionItem) => {
    const id = c.id || c._id || null;
    setEditingId(id);
    setForm({
      title: c.title || '',
      slug: c.slug || '',
      description: c.description || '',
      image_url: c.image_url || '',
      image_alt: c.image_alt || '',
      heading_h1: c.heading_h1 || c.title || '',
      heading_h2: c.heading_h2 || '',
      heading_h3: c.heading_h3 || '',
      canonical_url: c.canonical_url || c.seo?.canonical_url || '',
      meta_robots: c.meta_robots || c.seo?.meta_robots || 'index, follow',
      schema_markup: c.schema_markup || c.seo?.schema_markup || '',
      sort_order: c.sort_order || 'best-selling',
      type: c.type || 'manual',
      is_published: c.is_published ?? true,
      seo: {
        title: c.seo?.title || c.title || '',
        description: c.seo?.description || c.description || '',
        canonical_url: c.canonical_url || c.seo?.canonical_url || '',
        meta_robots: c.meta_robots || c.seo?.meta_robots || 'index, follow',
        schema_markup: c.schema_markup || c.seo?.schema_markup || '',
      },
    });
    setModalTab('content');
    setSchemaError(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Collections &amp; Categories</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Group products into categories with custom URLs, headings (H1, H2, H3), image ALT text, and SEO schema.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          Create collection
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-[0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Search */}
        <div className="p-3 border-b border-[#e1e3e5] flex items-center justify-between bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter collections by title or slug..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f6f6f7] border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] focus:bg-white transition"
            />
          </div>
          <span className="text-[11px] text-[#8c9196]">
            {filtered.length} collection(s)
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
              <tr>
                <th className="py-2.5 px-4 w-12"></th>
                <th className="py-2.5 px-4">Title &amp; URL Slug</th>
                <th className="py-2.5 px-4">SEO Title &amp; Status</th>
                <th className="py-2.5 px-4">Image ALT</th>
                <th className="py-2.5 px-4">Products</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8c9196]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
                    Loading collections...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8c9196]">
                    <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No collections found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-[#fcfcfd] transition group">
                    <td className="py-2.5 px-4">
                      {c.image_url ? (
                        <img
                          src={c.image_url}
                          alt={c.image_alt || c.title}
                          className="w-8 h-8 rounded-lg object-cover border border-[#e1e3e5]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#f1f2f4] flex items-center justify-center text-[#8c9196]">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[#1a1a1a]">{c.title}</div>
                      <div className="text-[10px] text-[#616161] font-mono">/collections/{c.slug}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="text-[11px] text-[#1a1a1a] line-clamp-1">{c.seo?.title || c.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${c.is_published ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <span className="text-[10px] text-[#616161]">{c.is_published ? 'Published' : 'Draft'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      {c.image_alt ? (
                        <span className="text-[11px] text-[#1a1a1a] line-clamp-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                          {c.image_alt}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Empty
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-[#616161]">
                      {c.product_count ?? 0} products
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        title="Edit collection & SEO"
                        className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete collection "${c.title}"?`)) {
                            await fetchApi(`/collections/${c._id || c.id}`, { method: 'DELETE' });
                            queryClient.invalidateQueries({ queryKey: ['adminCollections'] });
                          }
                        }}
                        title="Delete collection"
                        className="p-1.5 text-[#8c9196] hover:text-[#d72c0d] hover:bg-[#fff4f2] rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal with SEO Tabs */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-2xl max-w-2xl w-full p-6 animate-in fade-in space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">
                  {editingId ? `Edit Collection: ${form.title}` : 'Create New Collection'}
                </h3>
                <p className="text-[11px] text-[#616161]">Configure catalog grouping and complete on-page SEO.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#e1e3e5] gap-4">
              <button
                type="button"
                onClick={() => setModalTab('content')}
                className={`pb-2 text-xs font-semibold border-b-2 transition ${
                  modalTab === 'content'
                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                    : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
                }`}
              >
                Category Content &amp; Media
              </button>
              <button
                type="button"
                onClick={() => setModalTab('seo')}
                className={`pb-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                  modalTab === 'seo'
                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                    : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                On-Page SEO &amp; Headings
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate(form);
              }}
              className="space-y-4 text-xs"
            >
              {modalTab === 'content' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Category Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Baby Clothing"
                      value={form.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          title: val,
                          heading_h1: prev.heading_h1 || val,
                          slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Category Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Write a clear category description highlighting product safety, age suitability, and benefits."
                      className="w-full p-2.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Image URL</label>
                      <input
                        type="text"
                        value={form.image_url}
                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        placeholder="e.g. /assets/hd/clothing.webp"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Image ALT Text (Image SEO)</label>
                      <input
                        type="text"
                        value={form.image_alt || ''}
                        onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
                        placeholder="e.g. Organic cotton baby clothing collection banner"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                      <span className="text-[10px] text-[#616161] block mt-0.5">Descriptive alt text for Google Images ranking.</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.is_published}
                        onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                        className="rounded border-[#c9cccf] text-[#1a1a1a] focus:ring-0"
                      />
                      <span className="font-medium text-[#1a1a1a]">Published and accessible on storefront</span>
                    </label>
                  </div>
                </div>
              )}

              {modalTab === 'seo' && (
                <div className="space-y-4">
                  {/* Google Snippet Preview */}
                  <div className="p-3.5 bg-[#f8f9fa] border border-[#e1e3e5] rounded-xl space-y-1 font-sans">
                    <div className="text-[10px] text-[#202124] flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#ff268b] text-white flex items-center justify-center text-[8px] font-bold">
                        K
                      </span>
                      <span>kidobox.store &gt; collections &gt; {form.slug || 'category-slug'}</span>
                    </div>
                    <h4 className="text-[#1a0dab] hover:underline cursor-pointer text-xs font-medium leading-snug line-clamp-1">
                      {form.seo?.title || form.title || 'Category Title'} | KIDOBOX
                    </h4>
                    <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                      {form.seo?.description ||
                        form.description ||
                        'Shop our pediatrician-approved baby & toddler collection. Buy online with fast delivery across India.'}
                    </p>
                  </div>

                  {/* URL Slug */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-[#1a1a1a]">URL Handle / Slug</label>
                      <button
                        type="button"
                        onClick={() => {
                          const clean = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          setForm({ ...form, slug: clean });
                        }}
                        className="text-[11px] text-[#008060] hover:underline font-semibold"
                      >
                        Regenerate from Title
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2.5 py-1.5 bg-[#f6f6f7] border border-r-0 border-[#c9cccf] rounded-l-lg text-[11px] text-[#616161]">
                        https://kidobox.store/collections/
                      </span>
                      <input
                        type="text"
                        value={form.slug || ''}
                        onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#c9cccf] rounded-r-lg font-mono focus:outline-none focus:border-[#008060]"
                      />
                    </div>
                  </div>

                  {/* SEO Title & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#1a1a1a]">SEO Title Tag</label>
                        <span className="text-[10px] text-[#616161]">
                          {(form.seo?.title || form.title || '').length} / 60
                        </span>
                      </div>
                      <input
                        type="text"
                        value={form.seo?.title || ''}
                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, title: e.target.value } })}
                        placeholder={form.title || 'Category Page Title'}
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#1a1a1a]">Meta Description</label>
                        <span className="text-[10px] text-[#616161]">
                          {(form.seo?.description || form.description || '').length} / 160
                        </span>
                      </div>
                      <input
                        type="text"
                        value={form.seo?.description || ''}
                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })}
                        placeholder="Search result snippet summary"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                    </div>
                  </div>

                  {/* On-Page Semantic Headings */}
                  <div className="border border-[#e1e3e5] rounded-xl p-3.5 bg-[#fcfcfd] space-y-2.5">
                    <div className="text-xs font-bold text-[#1a1a1a]">Semantic Page Headings</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">
                          <span className="bg-pink-100 text-pink-800 text-[9px] font-bold px-1 rounded mr-1">H1</span>
                          Main Heading
                        </label>
                        <input
                          type="text"
                          value={form.heading_h1 || ''}
                          onChange={(e) => setForm({ ...form, heading_h1: e.target.value })}
                          placeholder={form.title || 'Category H1'}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">
                          <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1 rounded mr-1">H2</span>
                          Subheading
                        </label>
                        <input
                          type="text"
                          value={form.heading_h2 || ''}
                          onChange={(e) => setForm({ ...form, heading_h2: e.target.value })}
                          placeholder="e.g. Soft Organic Outfits & Sleepsuits"
                          className="w-full px-2.5 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 rounded mr-1">H3</span>
                          Highlights Heading
                        </label>
                        <input
                          type="text"
                          value={form.heading_h3 || ''}
                          onChange={(e) => setForm({ ...form, heading_h3: e.target.value })}
                          placeholder="e.g. Breathable GOTS Cotton"
                          className="w-full px-2.5 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Canonical URL & Meta Robots */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Canonical URL</label>
                      <input
                        type="url"
                        value={form.canonical_url || ''}
                        onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                        placeholder={`https://kidobox.store/collections/${form.slug || 'slug'}`}
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#008060]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Meta Robots Directive</label>
                      <select
                        value={form.meta_robots || 'index, follow'}
                        onChange={(e) => setForm({ ...form, meta_robots: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg font-semibold focus:outline-none focus:border-[#008060]"
                      >
                        <option value="index, follow">index, follow (Standard)</option>
                        <option value="noindex, follow">noindex, follow</option>
                        <option value="noindex, nofollow">noindex, nofollow</option>
                        <option value="index, nofollow">index, nofollow</option>
                      </select>
                    </div>
                  </div>

                  {/* Schema Markup */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#1a1a1a]">Structured Data (JSON-LD Schema)</label>
                      <button
                        type="button"
                        onClick={() => {
                          const schemaObj = {
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            "name": form.title,
                            "description": form.seo?.description || form.description,
                            "url": `https://kidobox.store/collections/${form.slug}`,
                            "image": form.image_url || "https://kidobox.store/logo.png"
                          };
                          setForm({ ...form, schema_markup: JSON.stringify(schemaObj, null, 2) });
                          setSchemaError(null);
                        }}
                        className="text-[11px] text-emerald-800 hover:underline font-semibold"
                      >
                        ⚡ Generate CollectionPage Schema
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={form.schema_markup || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, schema_markup: val });
                        if (!val.trim()) setSchemaError(null);
                        else {
                          try { JSON.parse(val); setSchemaError(null); } catch (err: any) { setSchemaError(err.message); }
                        }
                      }}
                      placeholder='{\n  "@context": "https://schema.org",\n  "@type": "CollectionPage"\n}'
                      className="w-full p-2.5 text-xs bg-[#f8f9fa] border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#008060]"
                    />
                    {schemaError && (
                      <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        JSON Syntax Error: {schemaError}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {saveMutation.isError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs" role="alert">
                  {(saveMutation.error as any)?.message || 'Failed to save collection'}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e1e3e5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending || !form.title.trim()}
                  className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
