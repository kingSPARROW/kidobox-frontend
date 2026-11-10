'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { mediaUrl } from '@/lib/storefront';
import type { Article } from '@/lib/kidobox-data';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Clock,
  Tag,
  Eye,
  X,
  Check,
  Loader2,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Layers,
  ArrowRight,
  ChevronRight,
  FileText,
  Globe,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Baby Play & Toys', value: '/assets/hd/blog1.webp' },
  { label: 'Sleep & Nursery', value: '/assets/hd/blog2.webp' },
  { label: 'Baby Wellness', value: '/assets/hd/blog3.webp' },
  { label: 'Mother & Baby', value: '/assets/hd/mom.webp' },
  { label: 'Newborn Care', value: '/assets/hd/newborn.webp' },
  { label: 'Toddler Milestones', value: '/assets/hd/toddler.webp' },
];

const PRESET_CATEGORIES = [
  'Milestones',
  'Sleep & Comfort',
  'Gentle Care',
  'Baby Nutrition',
  'Nursery Prep',
  'Play & Learning',
];

export default function AdminGuidesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editorTab, setEditorTab] = useState<'content' | 'seo'>('content');
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const defaultForm: Article = {
    slug: 'gentle-baby-sleep-routine',
    title: '5 Steps to a Gentle, Peaceful Baby Bedtime Routine',
    category: 'Sleep & Comfort',
    image: '/assets/hd/blog2.webp',
    image_alt: 'Cozy baby sleeping peacefully in nursery with gentle ambient lighting',
    minutes: 4,
    author: 'Dr. Neha Sharma, Pediatric Care Advisor',
    published_at: new Date().toISOString().split('T')[0],
    status: 'published',
    is_published: true,
    heading_h1: '',
    seo_title: '5 Steps to a Gentle, Peaceful Baby Bedtime Routine | KIDOBOX',
    seo_description: 'Science-backed, calming night habits that help infants settle faster and sleep through the night with comfort.',
    canonical_url: '',
    meta_robots: 'index, follow',
    schema_markup: '',
    excerpt: 'Science-backed, calming night habits that help infants settle faster and sleep through the night.',
    sections: [
      ['Create a Dim & Quiet Sanctuary', 'Dim nursery lights 30 minutes before bedtime to support natural melatonin production.'],
      ['Warm Bath & Gentle Massage', 'A short lukewarm bath followed by chamomile baby lotion signals that rest is approaching.'],
      ['Soft Nursery Lullabies', 'Consistent ambient noise or white noise creates comforting sleep associations.'],
    ],
  };

  const [form, setForm] = useState<Article>(defaultForm);

  // Fetch full storefront content (which includes articles)
  const { data: contentData, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminContent'],
    queryFn: async () => {
      const res = await fetchApi('/content');
      return res?.data || {};
    },
  });

  const articles: Article[] = contentData?.articles || [];

  // Mutation to save content back to API
  const saveMutation = useMutation({
    mutationFn: async (updatedArticles: Article[]) => {
      const currentContent = contentData || {};
      const payload = {
        content: {
          ages: currentContent.ages || [],
          articles: updatedArticles,
          instagram: currentContent.instagram || [],
          benefits: currentContent.benefits || [],
          hero_promises: currentContent.hero_promises || [],
          newborn: currentContent.newborn || { title: '', description: '', image: '', link: '', cta: '' },
          app: currentContent.app || { title: '', description: '', ios_link: '', android_link: '' },
          copy: currentContent.copy || { announcement: '', instagram_handle: '', instagram_link: '' },
        },
      };

      return fetchApi('/content', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContent'] });
      queryClient.invalidateQueries({ queryKey: ['storefront'] });
      setIsEditorOpen(false);
      setEditingIndex(null);
    },
  });

  // Handle Image File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetchApi('/banners/upload', {
        method: 'POST',
        body: formData,
      });

      if (res?.url) {
        setForm((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      alert('Failed to upload image. Please enter an image URL directly.');
    } finally {
      setIsUploading(false);
    }
  };

  // Open modal for Create
  const handleAddNew = () => {
    setForm({
      slug: `guide-${Date.now().toString().slice(-4)}`,
      title: '',
      category: 'Milestones',
      image: '/assets/hd/blog1.webp',
      image_alt: '',
      minutes: 3,
      author: 'KIDOBOX Editorial Team',
      published_at: new Date().toISOString().split('T')[0],
      status: 'published',
      is_published: true,
      heading_h1: '',
      seo_title: '',
      seo_description: '',
      canonical_url: '',
      meta_robots: 'index, follow',
      schema_markup: '',
      excerpt: '',
      sections: [['Introduction', 'Write key tips and parenting advice here.']],
    });
    setEditingIndex(null);
    setEditorTab('content');
    setSchemaError(null);
    setIsEditorOpen(true);
  };

  // Open modal for Edit
  const handleEdit = (article: Article, index: number) => {
    setForm({
      ...article,
      image_alt: article.image_alt || '',
      status: article.status || (article.is_published === false ? 'draft' : 'published'),
      is_published: article.is_published !== false,
      author: article.author || 'KIDOBOX Editorial Team',
      published_at: article.published_at || new Date().toISOString().split('T')[0],
      heading_h1: article.heading_h1 || article.title || '',
      seo_title: article.seo_title || article.title || '',
      seo_description: article.seo_description || article.excerpt || '',
      canonical_url: article.canonical_url || '',
      meta_robots: article.meta_robots || 'index, follow',
      schema_markup: article.schema_markup || '',
      sections: Array.isArray(article.sections) ? [...article.sections] : [],
    });
    setEditingIndex(index);
    setEditorTab('content');
    setSchemaError(null);
    setIsEditorOpen(true);
  };

  // Quick toggle publication status
  const handleTogglePublish = (index: number) => {
    const updated = [...articles];
    const item = updated[index];
    const isCurrentlyPublished = item.status === 'published' || item.is_published !== false;
    const newStatus = isCurrentlyPublished ? 'draft' : 'published';
    updated[index] = {
      ...item,
      status: newStatus,
      is_published: newStatus === 'published',
    };
    saveMutation.mutate(updated);
  };

  // Delete article
  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to remove this parenting guide?')) return;
    const updated = articles.filter((_, i) => i !== index);
    saveMutation.mutate(updated);
  };

  // Move article up/down in slider
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= articles.length) return;

    const updated = [...articles];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    saveMutation.mutate(updated);
  };

  // Save form
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a guide title.');
      return;
    }

    const updated = [...articles];
    const cleanSlug = form.slug.trim()
      ? form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : form.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);

    const isPublished = form.status === 'published';

    const guidePayload: Article = {
      ...form,
      slug: cleanSlug,
      minutes: Number(form.minutes) || 3,
      status: form.status || 'published',
      is_published: isPublished,
      heading_h1: form.heading_h1 || form.title,
      seo_title: form.seo_title || form.title,
      seo_description: form.seo_description || form.excerpt,
      canonical_url: form.canonical_url || '',
      meta_robots: form.meta_robots || 'index, follow',
      schema_markup: form.schema_markup || '',
      image_alt: form.image_alt || form.title,
      sections: form.sections.length > 0 ? form.sections : [['Overview', 'Guide details.']],
    };

    if (editingIndex !== null && editingIndex >= 0) {
      updated[editingIndex] = guidePayload;
    } else {
      updated.push(guidePayload);
    }

    saveMutation.mutate(updated);
  };

  // Filtered Articles
  const filteredArticles = articles.filter((a) => {
    const isPublished = a.status === 'published' || a.is_published !== false;
    if (statusFilter === 'published' && !isPublished) return false;
    if (statusFilter === 'draft' && isPublished) return false;

    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.slug || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Parenting Guides &amp; Blog CMS</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Create, edit, publish parenting articles, and manage on-page SEO (titles, meta descriptions, slugs, image ALT, headings &amp; Article schema).
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 self-start cursor-pointer admin-btn-dark"
          style={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}
        >
          <Plus className="w-3.5 h-3.5" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          <span style={{ color: '#ffffff' }}>New Article</span>
        </button>
      </div>

      {/* ── FILTER & SEARCH BAR ────────────────────────────────────────── */}
      <div className="bg-white p-3 rounded-xl border border-[#e1e3e5] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides by title, category, slug..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f6f6f7] border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#802f4a] focus:bg-white transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              statusFilter === 'all'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f2f3] text-[#5c5f62] hover:bg-[#e4e5e7]'
            }`}
          >
            All ({articles.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              statusFilter === 'published'
                ? 'bg-emerald-700 text-white'
                : 'bg-[#f1f2f3] text-[#5c5f62] hover:bg-[#e4e5e7]'
            }`}
          >
            Published ({articles.filter((a) => a.status === 'published' || a.is_published !== false).length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              statusFilter === 'draft'
                ? 'bg-amber-700 text-white'
                : 'bg-[#f1f2f3] text-[#5c5f62] hover:bg-[#e4e5e7]'
            }`}
          >
            Drafts ({articles.filter((a) => a.status === 'draft' || a.is_published === false).length})
          </button>
        </div>
      </div>

      {/* ── LIST OF ARTICLES ───────────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-xl border border-[#e1e3e5] text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#802f4a] mx-auto mb-2" />
          <p className="text-xs text-[#6d7175]">Loading parenting guides…</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
          <p className="text-xs text-red-600 font-semibold mb-2">Unable to load guides from backend.</p>
          <button onClick={() => refetch()} className="px-3 py-1 bg-red-600 text-white rounded text-xs">
            Retry
          </button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#e1e3e5] text-center">
          <BookOpen className="w-10 h-10 text-[#c9cccf] mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-bold text-[#1a1a1a]">No articles found</h3>
          <p className="text-xs text-[#6d7175] mt-1 max-w-sm mx-auto">
            {search ? 'Try adjusting your search query.' : 'Create your first guide to publish it on the storefront.'}
          </p>
          {!search && (
            <button
              onClick={handleAddNew}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a1a1a] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Guide</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#e1e3e5] bg-[#fafbfb] text-[#5c5f62] font-semibold">
                  <th className="py-2.5 px-4 w-12 text-center">Order</th>
                  <th className="py-2.5 px-4 w-20">Cover</th>
                  <th className="py-2.5 px-4">Title &amp; URL Slug</th>
                  <th className="py-2.5 px-4">Status &amp; Category</th>
                  <th className="py-2.5 px-4">Image ALT</th>
                  <th className="py-2.5 px-4">SEO Title</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f2f3]">
                {filteredArticles.map((article, index) => {
                  const isPublished = article.status === 'published' || article.is_published !== false;
                  return (
                    <tr key={article.slug || index} className="hover:bg-[#fafbfb] transition group">
                      {/* Order Controls */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0 || saveMutation.isPending}
                            onClick={() => handleMove(index, 'up')}
                            className="p-1 hover:bg-[#e4e5e7] disabled:opacity-30 rounded text-[#5c5f62]"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-bold text-[#8c9196]">#{index + 1}</span>
                          <button
                            type="button"
                            disabled={index === articles.length - 1 || saveMutation.isPending}
                            onClick={() => handleMove(index, 'down')}
                            className="p-1 hover:bg-[#e4e5e7] disabled:opacity-30 rounded text-[#5c5f62]"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Cover Thumbnail */}
                      <td className="py-2.5 px-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-[#e1e3e5] relative">
                          <img
                            src={mediaUrl(article.image)}
                            alt={article.image_alt || article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title & URL Slug */}
                      <td className="py-2.5 px-4 max-w-xs">
                        <div className="font-bold text-[#1a1a1a] text-xs hover:text-[#802f4a] transition line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-[10px] text-[#616161] font-mono mt-0.5">
                          /guides/{article.slug}
                        </div>
                      </td>

                      {/* Status & Category */}
                      <td className="py-2.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(index)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle published / draft"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                        <div className="text-[10px] text-[#616161] mt-1 font-semibold">
                          {article.category} • {article.minutes} min
                        </div>
                      </td>

                      {/* Image ALT */}
                      <td className="py-2.5 px-4">
                        {article.image_alt ? (
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 line-clamp-1">
                            {article.image_alt}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Empty
                          </span>
                        )}
                      </td>

                      {/* SEO Title */}
                      <td className="py-2.5 px-4 text-[#616161] max-w-[160px] truncate">
                        {article.seo_title || article.title}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => setPreviewArticle(article)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          title="Preview Storefront Card"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(article, index)}
                          className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-lg"
                          title="Edit Article & SEO"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT ARTICLE MODAL ─────────────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">
                  {editingIndex !== null ? `Edit Article: ${form.title}` : 'Create New Parenting Guide'}
                </h3>
                <p className="text-[11px] text-gray-500">Manage article content, publication status, and complete on-page SEO.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#e1e3e5] px-6 gap-4 pt-1">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition ${
                  editorTab === 'content'
                    ? 'border-[#802f4a] text-[#802f4a]'
                    : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
                }`}
              >
                Article Content &amp; Sections
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('seo')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                  editorTab === 'seo'
                    ? 'border-[#802f4a] text-[#802f4a]'
                    : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                On-Page SEO &amp; Schema
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {editorTab === 'content' && (
                <div className="space-y-4">
                  {/* Status & Category Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#1a1a1a] mb-1">Publishing Status *</label>
                      <select
                        value={form.status || 'published'}
                        onChange={(e) => setForm({ ...form, status: e.target.value as any, is_published: e.target.value === 'published' })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-semibold focus:outline-none focus:border-[#802f4a]"
                      >
                        <option value="published">Published (Visible on storefront)</option>
                        <option value="draft">Draft (Hidden from storefront)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#1a1a1a] mb-1">Author Name</label>
                      <input
                        type="text"
                        value={form.author || ''}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        placeholder="e.g. Dr. Neha Sharma"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1a1a1a] mb-1">Reading Time (min)</label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        required
                        value={form.minutes}
                        onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          title: newTitle,
                          heading_h1: prev.heading_h1 || newTitle,
                          seo_title: prev.seo_title || `${newTitle} | KIDOBOX`,
                          slug: editingIndex === null ? newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50) : prev.slug,
                        }));
                      }}
                      placeholder="e.g. 5 Simple Steps to Calm a Fussy Newborn"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                    />
                  </div>

                  {/* Category Tag */}
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1">Category Tag</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PRESET_CATEGORIES.map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition ${
                            form.category === cat
                              ? 'bg-pink-50 border-pink-400 text-[#802f4a]'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Or enter custom category..."
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1">Summary / Excerpt</label>
                    <textarea
                      rows={2}
                      value={form.excerpt}
                      onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value, seo_description: prev.seo_description || e.target.value }))}
                      placeholder="Brief preview text displayed on blog cards and search results..."
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                    />
                  </div>

                  {/* Cover Image & Image ALT Text */}
                  <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/50 space-y-3">
                    <div className="font-bold text-[#1a1a1a]">Cover Image &amp; Alt Text</div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          type="button"
                          key={preset.value}
                          onClick={() => setForm((prev) => ({ ...prev, image: preset.value }))}
                          className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition ${
                            form.image === preset.value ? 'border-[#802f4a] shadow-xs' : 'border-transparent hover:opacity-80'
                          }`}
                        >
                          <img src={preset.value} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">Image URL</label>
                        <input
                          type="text"
                          value={form.image}
                          onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                          placeholder="Image URL..."
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1a1a1a] mb-1">Image ALT Text (Image SEO)</label>
                        <input
                          type="text"
                          value={form.image_alt || ''}
                          onChange={(e) => setForm((prev) => ({ ...prev, image_alt: e.target.value }))}
                          placeholder={form.title ? `${form.title} featured image` : 'Descriptive alt text for Google Images...'}
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sections Builder */}
                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-bold text-[#1a1a1a]">Article Sections &amp; Headings</label>
                        <span className="text-[10px] text-gray-500 block">Each section gets an H2/H3 heading and detailed paragraph.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, sections: [...prev.sections, ['New Section Heading', 'Detailed content...']] }))}
                        className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-[#802f4a] font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Section</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {form.sections.map(([heading, body], sIdx) => (
                        <div key={sIdx} className="p-3 bg-white border border-gray-200 rounded-xl space-y-2 shadow-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="bg-pink-100 text-pink-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Section #{sIdx + 1} (H2)
                            </span>
                            <input
                              type="text"
                              value={heading}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm((prev) => ({
                                  ...prev,
                                  sections: prev.sections.map((s, i) => (i === sIdx ? [val, s[1]] : s)),
                                }));
                              }}
                              placeholder="Section Heading..."
                              className="flex-1 font-bold text-xs px-2.5 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#802f4a]"
                            />
                            <button
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== sIdx) }))}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={body}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s, i) => (i === sIdx ? [s[0], val] : s)),
                              }));
                            }}
                            placeholder="Write comprehensive, helpful parenting tips for this section..."
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#802f4a]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {editorTab === 'seo' && (
                <div className="space-y-4">
                  {/* Google SERP Preview */}
                  <div className="p-3.5 bg-[#f8f9fa] border border-[#e1e3e5] rounded-xl space-y-1 font-sans">
                    <div className="text-[10px] text-[#202124] flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#802f4a] text-white flex items-center justify-center text-[8px] font-bold">
                        K
                      </span>
                      <span>kidobox.store &gt; guides &gt; {form.slug || 'guide-slug'}</span>
                    </div>
                    <h4 className="text-[#1a0dab] hover:underline cursor-pointer text-xs font-medium leading-snug line-clamp-1">
                      {form.seo_title || form.title || 'Guide Title'} | KIDOBOX Journal
                    </h4>
                    <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                      {form.seo_description ||
                        form.excerpt ||
                        'Read pediatrician-backed parenting tips and developmental milestones from KIDOBOX.'}
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
                        https://kidobox.store/guides/
                      </span>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#c9cccf] rounded-r-lg font-mono focus:outline-none focus:border-[#802f4a]"
                      />
                    </div>
                  </div>

                  {/* SEO Title & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#1a1a1a]">SEO Title Tag</label>
                        <span className="text-[10px] text-[#616161]">
                          {(form.seo_title || form.title || '').length} / 60
                        </span>
                      </div>
                      <input
                        type="text"
                        value={form.seo_title || ''}
                        onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                        placeholder={form.title || 'Article SEO Title'}
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#802f4a]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#1a1a1a]">Meta Description</label>
                        <span className="text-[10px] text-[#616161]">
                          {(form.seo_description || form.excerpt || '').length} / 160
                        </span>
                      </div>
                      <input
                        type="text"
                        value={form.seo_description || ''}
                        onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                        placeholder="Search snippet summary"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#802f4a]"
                      />
                    </div>
                  </div>

                  {/* Semantic H1 Override */}
                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">
                      <span className="bg-pink-100 text-pink-800 text-[9px] font-bold px-1 rounded mr-1">H1</span>
                      Main Headline Override
                    </label>
                    <input
                      type="text"
                      value={form.heading_h1 || ''}
                      onChange={(e) => setForm({ ...form, heading_h1: e.target.value })}
                      placeholder={form.title || 'Defaults to article title'}
                      className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#802f4a]"
                    />
                  </div>

                  {/* Canonical URL & Meta Robots */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Canonical URL</label>
                      <input
                        type="url"
                        value={form.canonical_url || ''}
                        onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                        placeholder={`https://kidobox.store/guides/${form.slug}`}
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#802f4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Meta Robots Directive</label>
                      <select
                        value={form.meta_robots || 'index, follow'}
                        onChange={(e) => setForm({ ...form, meta_robots: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg font-semibold focus:outline-none focus:border-[#802f4a]"
                      >
                        <option value="index, follow">index, follow (Standard - indexed by Google)</option>
                        <option value="noindex, follow">noindex, follow (Hide from search)</option>
                        <option value="noindex, nofollow">noindex, nofollow (Complete blackout)</option>
                      </select>
                    </div>
                  </div>

                  {/* Schema Markup (JSON-LD Article) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#1a1a1a]">Structured Data (Article JSON-LD Schema)</label>
                      <button
                        type="button"
                        onClick={() => {
                          const articleSchema = {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": form.title,
                            "description": form.seo_description || form.excerpt,
                            "image": form.image || "https://kidobox.store/logo.png",
                            "author": {
                              "@type": "Person",
                              "name": form.author || "KIDOBOX Editorial Team"
                            },
                            "publisher": {
                              "@type": "Organization",
                              "name": "KIDOBOX",
                              "logo": {
                                "@type": "ImageObject",
                                "url": "https://kidobox.store/logo.png"
                              }
                            },
                            "datePublished": form.published_at || new Date().toISOString().split('T')[0],
                            "url": `https://kidobox.store/guides/${form.slug}`
                          };
                          setForm({ ...form, schema_markup: JSON.stringify(articleSchema, null, 2) });
                          setSchemaError(null);
                        }}
                        className="text-[11px] text-pink-700 hover:underline font-semibold"
                      >
                        ⚡ Generate Article Schema
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={form.schema_markup || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, schema_markup: val });
                        if (!val.trim()) setSchemaError(null);
                        else {
                          try { JSON.parse(val); setSchemaError(null); } catch (err: any) { setSchemaError(err.message); }
                        }
                      }}
                      placeholder='{\n  "@context": "https://schema.org",\n  "@type": "Article"\n}'
                      className="w-full p-2.5 text-xs bg-[#f8f9fa] border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#802f4a]"
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

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 bg-[#802f4a] hover:bg-[#802f4a] text-white text-xs font-bold rounded-lg shadow-sm inline-flex items-center gap-1.5"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{form.status === 'published' ? 'Publish Guide' : 'Save as Draft'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LIVE PREVIEW MODAL ─────────────────────────────────────────── */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl w-full max-w-sm p-5 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Storefront Card Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rendered Guide Card representation */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="relative aspect-16/10 bg-gray-100">
                <img
                  src={mediaUrl(previewArticle.image)}
                  alt={previewArticle.image_alt || previewArticle.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-[#802f4a] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {previewArticle.category}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-[#122e50] line-clamp-2">
                  {previewArticle.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {previewArticle.excerpt}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {previewArticle.minutes} min read
                  </span>
                  <span className="text-[#802f4a] font-bold flex items-center gap-0.5">
                    Read Guide →
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewArticle(null)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-lg text-gray-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
