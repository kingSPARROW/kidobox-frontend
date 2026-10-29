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
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const defaultForm: Article = {
    slug: 'gentle-baby-sleep-routine',
    title: '5 Steps to a Gentle, Peaceful Baby Bedtime Routine',
    category: 'Sleep & Comfort',
    image: '/assets/hd/blog2.webp',
    minutes: 4,
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
      minutes: 3,
      excerpt: '',
      sections: [['Introduction', 'Write key tips and parenting advice here.']],
    });
    setEditingIndex(null);
    setIsEditorOpen(true);
  };

  // Open modal for Edit
  const handleEdit = (article: Article, index: number) => {
    setForm({
      ...article,
      sections: Array.isArray(article.sections) ? [...article.sections] : [],
    });
    setEditingIndex(index);
    setIsEditorOpen(true);
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

    const guidePayload: Article = {
      ...form,
      slug: cleanSlug,
      minutes: Number(form.minutes) || 3,
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
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || a.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e1e3e5] shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#ff268b]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a1a1a]">Parenting Tips &amp; Guides</h1>
              <p className="text-xs text-[#6d7175]">
                Manage the articles and milestones showcased in the single-row slider on the storefront.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff268b] hover:bg-[#e01977] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Guide</span>
          </button>
        </div>
      </div>

      {/* ── METRICS & STATS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] shadow-sm">
          <span className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">Total Guides</span>
          <div className="text-2xl font-black text-[#1a1a1a] mt-1">{articles.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Active in Storefront Slider</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] shadow-sm">
          <span className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">Slider Layout</span>
          <div className="text-2xl font-black text-[#0284c7] mt-1">1 Single Row</div>
          <span className="text-[11px] text-[#6d7175]">Smooth Horizontal Carousel</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] shadow-sm">
          <span className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">Categories</span>
          <div className="text-2xl font-black text-[#ff268b] mt-1">
            {new Set(articles.map((a) => a.category)).size}
          </div>
          <span className="text-[11px] text-[#6d7175]">Milestones, Sleep, Care</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] shadow-sm">
          <span className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">Avg Read Time</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {articles.length
              ? Math.round(articles.reduce((acc, a) => acc + (a.minutes || 3), 0) / articles.length)
              : 0}{' '}
            min
          </div>
          <span className="text-[11px] text-[#6d7175]">Quick Parent Reads</span>
        </div>
      </div>

      {/* ── TOOLBAR & FILTERS ──────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides by title or category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#fafbfb] border border-[#d2d5d8] rounded-lg focus:outline-none focus:border-[#ff268b] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f2f3] text-[#5c5f62] hover:bg-[#e4e5e7]'
            }`}
          >
            All Categories ({articles.length})
          </button>
          {Array.from(new Set(articles.map((a) => a.category))).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#ff268b] text-white'
                  : 'bg-[#f1f2f3] text-[#5c5f62] hover:bg-[#e4e5e7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── LIST OF ARTICLES ───────────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-[#e1e3e5] text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#ff268b] mx-auto mb-2" />
          <p className="text-xs text-[#6d7175]">Loading parenting guides…</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
          <p className="text-xs text-red-600 font-semibold mb-2">Unable to load guides from backend.</p>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs"
          >
            Retry
          </button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#e1e3e5] text-center">
          <BookOpen className="w-12 h-12 text-[#c9cccf] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1a1a1a]">No parenting guides found</h3>
          <p className="text-xs text-[#6d7175] mt-1 max-w-sm mx-auto">
            {search ? 'Try adjusting your search criteria.' : 'Create your first guide to showcase it on the storefront.'}
          </p>
          {!search && (
            <button
              onClick={handleAddNew}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff268b] text-white text-xs font-bold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Guide</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e1e3e5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#e1e3e5] bg-[#fafbfb] text-[#5c5f62] font-semibold">
                  <th className="py-3 px-4 w-12 text-center">Order</th>
                  <th className="py-3 px-4 w-28">Cover</th>
                  <th className="py-3 px-4">Title &amp; Excerpt</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Read Time</th>
                  <th className="py-3 px-4">Sections</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f2f3]">
                {filteredArticles.map((article, index) => (
                  <tr key={article.slug || index} className="hover:bg-[#fafbfb] transition">
                    {/* Order Controls */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0 || saveMutation.isPending}
                          onClick={() => handleMove(index, 'up')}
                          className="p-1 hover:bg-[#e4e5e7] disabled:opacity-30 rounded text-[#5c5f62]"
                          title="Move Left in Slider"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold text-[#8c9196]">#{index + 1}</span>
                        <button
                          type="button"
                          disabled={index === articles.length - 1 || saveMutation.isPending}
                          onClick={() => handleMove(index, 'down')}
                          className="p-1 hover:bg-[#e4e5e7] disabled:opacity-30 rounded text-[#5c5f62]"
                          title="Move Right in Slider"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Cover Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 border border-[#e1e3e5] shadow-xs relative">
                        <img
                          src={mediaUrl(article.image)}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title & Excerpt */}
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-bold text-[#1a1a1a] text-sm hover:text-[#ff268b] transition line-clamp-1">
                        {article.title}
                      </div>
                      <p className="text-[11px] text-[#6d7175] line-clamp-1 mt-0.5">
                        {article.excerpt || 'No excerpt provided.'}
                      </p>
                      <div className="text-[10px] text-[#8c9196] font-mono mt-1">
                        slug: /{article.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-[#ff268b] border border-pink-100">
                        {article.category}
                      </span>
                    </td>

                    {/* Read Time */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {article.minutes} min
                      </span>
                    </td>

                    {/* Section Count */}
                    <td className="py-3 px-4">
                      <span className="text-slate-600 font-medium">
                        {(article.sections || []).length} topics
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewArticle(article)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-[#f1f2f3] rounded-lg transition"
                          title="Preview Slider Card"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(article, index)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Guide"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                          title="Delete Guide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT GUIDE ─────────────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden my-auto animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#fafbfb]">
              <div>
                <h3 className="font-bold text-base text-[#1a1a1a]">
                  {editingIndex !== null ? 'Edit Parenting Guide' : 'Add New Parenting Guide'}
                </h3>
                <p className="text-xs text-[#6d7175]">
                  This article will appear as a card in the storefront&apos;s 1-row guides slider.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  Guide Title <span className="text-red-500">*</span>
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
                      slug:
                        editingIndex === null
                          ? newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50)
                          : prev.slug,
                    }));
                  }}
                  placeholder="e.g. 5 Simple Steps to Calm a Fussy Newborn"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff268b] focus:ring-1 focus:ring-[#ff268b]"
                />
              </div>

              {/* Slug & Minutes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. newborn-sleep-tips"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff268b]"
                  />
                  <small className="text-[10px] text-gray-500">Accessible at /guides/{form.slug}</small>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                    Reading Time (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    required
                    value={form.minutes}
                    onChange={(e) => setForm((prev) => ({ ...prev, minutes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff268b]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  Category Tag
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition ${
                        form.category === cat
                          ? 'bg-pink-50 border-pink-400 text-[#ff268b]'
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
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff268b]"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  Card Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief preview text displayed on the slider card..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff268b]"
                />
              </div>

              {/* Cover Image Picker & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1a1a1a]">
                  Cover Image
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.value}
                      onClick={() => setForm((prev) => ({ ...prev, image: preset.value }))}
                      className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition ${
                        form.image === preset.value
                          ? 'border-[#ff268b] shadow-xs'
                          : 'border-transparent hover:opacity-80'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.value} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL or select from presets above"
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff268b]"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Guide Article Sections Builder */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1a1a1a]">
                    Article Paragraphs / Steps ({form.sections.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        sections: [...prev.sections, [`Step ${prev.sections.length + 1}`, 'Description']],
                      }))
                    }
                    className="text-xs font-bold text-[#ff268b] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Section
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {form.sections.map(([heading, body], sIdx) => (
                    <div key={sIdx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between gap-2">
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
                          placeholder={`Section ${sIdx + 1} Heading`}
                          className="flex-1 px-2.5 py-1 text-xs font-bold bg-white border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              sections: prev.sections.filter((_, i) => i !== sIdx),
                            }))
                          }
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={body}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s, i) => (i === sIdx ? [s[0], val] : s)),
                          }));
                        }}
                        placeholder="Content paragraph for this section..."
                        className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 bg-[#ff268b] hover:bg-[#e01977] text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Guide</span>
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
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-gray-200 space-y-4">
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
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="relative aspect-16/10 bg-gray-100">
                <img
                  src={mediaUrl(previewArticle.image)}
                  alt={previewArticle.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-[#ff268b] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
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
                  <span className="text-[#ff268b] font-bold flex items-center gap-0.5">
                    Read Guide →
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewArticle(null)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-xl text-gray-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
