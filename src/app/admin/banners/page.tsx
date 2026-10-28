'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  Image as ImageIcon,
  Plus,
  Monitor,
  Smartphone,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
  ArrowRight,
  Loader2,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Link as LinkIcon,
  Check,
} from 'lucide-react';

interface BannerItem {
  _id?: string;
  id?: string;
  title?: string;
  title_tag?: string;
  subtitle?: string;
  desktop_image_url: string;
  mobile_image_url?: string;
  cta_text?: string;
  cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  text_alignment?: 'left' | 'center' | 'right';
  overlay_opacity?: number;
  status: 'active' | 'scheduled' | 'inactive';
  position?: 'hero' | 'promotional_strip' | 'footer_banner';
  order?: number;
}

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'inactive'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Media Source Selection: 'upload' or 'url'
  const [desktopMediaMode, setDesktopMediaMode] = useState<'upload' | 'url'>('upload');
  const [mobileMediaMode, setMobileMediaMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const defaultBannerForm: BannerItem = {
    title: 'Pure Comfort for Delicate Milestones',
    title_tag: 'SAFE & GENTLE • 100% ORGANIC',
    subtitle: 'Thoughtfully designed essentials crafted with organic cotton and hypoallergenic care for every little moment.',
    desktop_image_url: '/assets/hd/hero.webp',
    mobile_image_url: '/assets/hd/hero.webp',
    cta_text: 'Shop Baby Essentials',
    cta_link: '/shop',
    secondary_cta_text: 'Explore Categories',
    secondary_cta_link: '/categories',
    text_alignment: 'left',
    overlay_opacity: 0.6,
    status: 'active',
    position: 'hero',
    order: 1,
  };

  const [form, setForm] = useState<BannerItem>(defaultBannerForm);

  // Fetch Banners
  const { data: bannersData, isLoading } = useQuery({
    queryKey: ['adminBanners', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'all' ? '/banners' : `/banners?status=${statusFilter}`;
      return fetchApi(url);
    },
  });

  const banners: BannerItem[] = bannersData?.data || [];

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: BannerItem) => {
      const isEdit = !!payload._id || !!payload.id;
      const bannerId = payload._id || payload.id;
      if (isEdit) {
        return fetchApi(`/banners/${bannerId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return fetchApi('/banners', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      setIsEditorOpen(false);
      setEditingBanner(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/banners/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
    },
  });

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setForm({
      ...defaultBannerForm,
      order: banners.length + 1,
    });
    setPreviewDevice('desktop');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (banner: BannerItem) => {
    setEditingBanner(banner);
    setForm({
      ...banner,
      title: banner.title || '',
      mobile_image_url: banner.mobile_image_url || banner.desktop_image_url,
      overlay_opacity: banner.overlay_opacity ?? 0.6,
      text_alignment: banner.text_alignment || 'left',
    });
    setPreviewDevice('desktop');
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this promotional banner?')) {
      deleteMutation.mutate(id);
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (file: File, target: 'desktop' | 'mobile') => {
    // 1. Instant local preview
    const localUrl = URL.createObjectURL(file);
    if (target === 'desktop') {
      setForm((prev) => ({ ...prev, desktop_image_url: localUrl }));
      setIsUploadingDesktop(true);
    } else {
      setForm((prev) => ({ ...prev, mobile_image_url: localUrl }));
      setIsUploadingMobile(true);
    }

    // 2. Upload to backend
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetchApi('/banners/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.url) {
        if (target === 'desktop') {
          setForm((prev) => ({ ...prev, desktop_image_url: res.url }));
        } else {
          setForm((prev) => ({ ...prev, mobile_image_url: res.url }));
        }
      }
    } catch (err) {
      console.warn('Backend upload returned error; keeping preview data:', err);
    } finally {
      if (target === 'desktop') setIsUploadingDesktop(false);
      else setIsUploadingMobile(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Banner Management</h1>
            <span className="text-[10px] bg-[#e3f1df] text-[#008060] font-bold px-2 py-0.5 rounded-full">
              Storefront Live
            </span>
          </div>
          <p className="text-xs text-[#616161] mt-0.5">
            Configure promotional hero banners, banner title tags, image uploads, and separate desktop and mobile views.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          Add banner
        </button>
      </div>

      {/* 2. Status Tabs */}
      <div className="flex border-b border-[#e1e3e5] gap-4 text-xs">
        {[
          { key: 'all', label: 'All Banners' },
          { key: 'active', label: 'Active' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'inactive', label: 'Inactive' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as any)}
            className={`pb-2.5 font-medium transition relative ${
              statusFilter === tab.key
                ? 'text-[#1a1a1a] font-bold border-b-2 border-[#1a1a1a]'
                : 'text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Banners List */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-12 text-center shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <Loader2 className="w-6 h-6 animate-spin text-[#616161] mx-auto mb-2" />
          <p className="text-xs text-[#616161]">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-12 text-center shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <div className="w-12 h-12 rounded-full bg-[#f1f2f4] flex items-center justify-center mx-auto mb-3 text-[#616161]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1a1a1a]">No banners created yet</h3>
          <p className="text-xs text-[#616161] max-w-sm mx-auto mt-1 mb-4">
            Upload hero banners with responsive desktop and mobile views and promotional title tags to engage your storefront visitors.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg"
          >
            Create first banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.map((b) => {
            const bannerId = b._id || b.id || '';
            const displayTitle = b.title?.trim() || b.title_tag || 'Untitled Promotional Banner';
            return (
              <div
                key={bannerId}
                className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between"
              >
                {/* Left: Dual Preview Badges & Content */}
                <div className="flex flex-col sm:flex-row gap-4 items-start flex-1 min-w-0">
                  {/* Thumbnails Container */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Desktop Thumbnail */}
                    <div className="relative group">
                      <div className="w-28 h-16 rounded-lg overflow-hidden border border-[#c9cccf] bg-slate-100 relative">
                        <img
                          src={b.desktop_image_url}
                          alt="Desktop View"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm px-1 py-0.5 rounded text-[8px] font-bold text-white flex items-center gap-0.5">
                          <Monitor className="w-2.5 h-2.5" /> Desktop
                        </div>
                      </div>
                    </div>

                    {/* Mobile Thumbnail */}
                    <div className="relative group">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-[#c9cccf] bg-slate-100 relative">
                        <img
                          src={b.mobile_image_url || b.desktop_image_url}
                          alt="Mobile View"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm px-0.5 py-0.5 rounded text-[7px] font-bold text-white">
                          <Smartphone className="w-2 h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1 min-w-0">
                    {/* Title Tag Badge */}
                    {b.title_tag && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                        <Tag className="w-2.5 h-2.5" />
                        {b.title_tag}
                      </span>
                    )}

                    <h3 className="text-sm font-bold text-[#1a1a1a] truncate">
                      {displayTitle}
                    </h3>
                    {b.subtitle && (
                      <p className="text-xs text-[#616161] line-clamp-1 max-w-xl">{b.subtitle}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#616161]">
                      {b.cta_text && (
                        <span className="flex items-center gap-1 font-medium text-[#1a1a1a]">
                          CTA: <span className="underline">{b.cta_text}</span> ({b.cta_link || '/'})
                        </span>
                      )}
                      <span>•</span>
                      <span>Alignment: {b.text_alignment || 'left'}</span>
                      <span>•</span>
                      <span>Priority: #{b.order || 1}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#f1f2f4]">
                  {b.status === 'active' ? (
                    <span className="text-[10px] font-bold text-[#008060] bg-[#e3f1df] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : b.status === 'scheduled' ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#1a1a1a] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-lg transition inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bannerId)}
                      className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full-Featured Banner Editor & Live Dual Viewport Preview Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#f6f6f7] rounded-2xl border border-[#e1e3e5] shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="h-14 bg-white border-b border-[#e1e3e5] px-6 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#1a1a1a]">
                  {editingBanner ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}
                </h2>
              </div>

              {/* Device Preview Toggle */}
              <div className="flex items-center gap-1 bg-[#f1f2f4] p-1 rounded-lg border border-[#e1e3e5]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                    previewDevice === 'desktop'
                      ? 'bg-white text-[#1a1a1a] shadow-sm'
                      : 'text-[#616161] hover:text-[#1a1a1a]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop view
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                    previewDevice === 'mobile'
                      ? 'bg-white text-[#1a1a1a] shadow-sm'
                      : 'text-[#616161] hover:text-[#1a1a1a]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile view
                </button>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Interactive Preview (Top) + Settings Form (Bottom) */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* LIVE VIEWPORT PREVIEW */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#008060]" />
                    Live Viewport Preview ({previewDevice === 'desktop' ? 'Desktop 1920x600' : 'Mobile 375x667'})
                  </span>
                  <span className="text-[11px] text-[#616161]">
                    Changes reflect immediately in real time
                  </span>
                </div>

                {previewDevice === 'desktop' ? (
                  /* DESKTOP BANNER PREVIEW */
                  <div className="w-full rounded-2xl overflow-hidden shadow-md border border-[#dadce0] relative aspect-[21/8] bg-slate-900 flex items-center">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                      style={{ backgroundImage: `url(${form.desktop_image_url})` }}
                    />
                    <div
                      className="absolute inset-0 bg-black transition-opacity"
                      style={{ opacity: form.overlay_opacity ?? 0.6 }}
                    />
                    <div
                      className={`relative w-full p-8 sm:p-12 text-white max-w-2xl ${
                        form.text_alignment === 'center'
                          ? 'mx-auto text-center'
                          : form.text_alignment === 'right'
                          ? 'ml-auto text-right'
                          : 'mr-auto text-left'
                      }`}
                    >
                      {form.title_tag && (
                        <span className="inline-block px-3 py-1 bg-blue-600/30 border border-blue-400/40 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-3 shadow-sm">
                          {form.title_tag}
                        </span>
                      )}
                      {/* Non-mandatory title: only displayed if present */}
                      {form.title && (
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">
                          {form.title}
                        </h2>
                      )}
                      {form.subtitle && (
                        <p className="text-xs sm:text-sm text-slate-200 mb-4 font-light leading-relaxed max-w-xl">
                          {form.subtitle}
                        </p>
                      )}
                      <div
                        className={`flex flex-wrap gap-2.5 ${
                          form.text_alignment === 'center'
                            ? 'justify-center'
                            : form.text_alignment === 'right'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        {form.cta_text && (
                          <div className="px-5 py-2 bg-white text-slate-950 font-bold rounded-lg text-xs shadow inline-flex items-center gap-1.5">
                            {form.cta_text} <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                        {form.secondary_cta_text && (
                          <div className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-lg text-xs">
                            {form.secondary_cta_text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* MOBILE BANNER PREVIEW */
                  <div className="flex justify-center py-2">
                    <div className="w-[320px] rounded-[36px] overflow-hidden border-[8px] border-slate-900 shadow-2xl relative aspect-[9/16] bg-slate-900 flex flex-col justify-between">
                      {/* Mobile Notch Bar */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                      </div>

                      {/* Background Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                        style={{
                          backgroundImage: `url(${form.mobile_image_url || form.desktop_image_url})`,
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-black transition-opacity"
                        style={{ opacity: form.overlay_opacity ?? 0.6 }}
                      />

                      {/* Content Overlay */}
                      <div
                        className={`relative z-10 p-5 mt-auto mb-6 text-white ${
                          form.text_alignment === 'center'
                            ? 'text-center'
                            : form.text_alignment === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {form.title_tag && (
                          <span className="inline-block px-2.5 py-0.5 bg-blue-600/40 border border-blue-400/50 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-wider text-blue-200 mb-2">
                            {form.title_tag}
                          </span>
                        )}
                        {/* Non-mandatory title on mobile */}
                        {form.title && (
                          <h2 className="text-lg font-extrabold tracking-tight leading-tight mb-1.5">
                            {form.title}
                          </h2>
                        )}
                        {form.subtitle && (
                          <p className="text-[11px] text-slate-300 mb-3 font-light leading-snug line-clamp-3">
                            {form.subtitle}
                          </p>
                        )}
                        <div className="space-y-1.5 w-full">
                          {form.cta_text && (
                            <div className="w-full py-2 bg-white text-slate-950 font-bold rounded-lg text-[11px] text-center shadow">
                              {form.cta_text}
                            </div>
                          )}
                          {form.secondary_cta_text && (
                            <div className="w-full py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-lg text-[10px] text-center">
                              {form.secondary_cta_text}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SETTINGS FORM */}
              <form onSubmit={handleSave} className="space-y-5">
                {/* 1. Content Card */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                  <h3 className="font-bold text-[#1a1a1a] text-xs border-b border-[#e1e3e5] pb-2">
                    Banner Content & Tags
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Non-Mandatory Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#1a1a1a]">Banner title (Optional)</label>
                        <span className="text-[10px] text-[#616161]">Non-mandatory</span>
                      </div>
                      <input
                        type="text"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Minimalist Artisanal Living (Optional)"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                      <p className="text-[10px] text-[#616161] mt-0.5">
                        Leave blank if your banner relies solely on artwork or title tags.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#1a1a1a]">
                          Banner title tag (Promotional badge)
                        </label>
                        <span className="text-[10px] text-[#008060] font-bold">Recommended</span>
                      </div>
                      <input
                        type="text"
                        value={form.title_tag || ''}
                        onChange={(e) => setForm({ ...form, title_tag: e.target.value })}
                        placeholder="e.g. LIMITED EDITION • 40% OFF"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                      <p className="text-[10px] text-[#616161] mt-0.5">
                        Appears as a prominent pill badge directly above the main title.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1a1a] mb-1">Subtitle / description</label>
                    <textarea
                      rows={2}
                      value={form.subtitle || ''}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      placeholder="e.g. Elevate your sanctuary with handcrafted ceramics and ambient lighting..."
                      className="w-full p-2.5 bg-white border border-[#c9cccf] rounded-lg text-xs focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Primary button text</label>
                      <input
                        type="text"
                        value={form.cta_text || ''}
                        onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                        placeholder="e.g. Explore Shop"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Primary button link</label>
                      <input
                        type="text"
                        value={form.cta_link || ''}
                        onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                        placeholder="/products"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Secondary button text</label>
                      <input
                        type="text"
                        value={form.secondary_cta_text || ''}
                        onChange={(e) => setForm({ ...form, secondary_cta_text: e.target.value })}
                        placeholder="e.g. View Lookbook"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1">Secondary button link</label>
                      <input
                        type="text"
                        value={form.secondary_cta_link || ''}
                        onChange={(e) => setForm({ ...form, secondary_cta_link: e.target.value })}
                        placeholder="/collections"
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Responsive Images with Upload Option (Desktop & Mobile) */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-5 text-xs">
                  <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-2">
                    <h3 className="font-bold text-[#1a1a1a] text-xs">
                      Responsive Viewport Media (Desktop & Mobile)
                    </h3>
                    <span className="text-[11px] text-[#616161]">
                      Upload file from computer or provide image URL
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* A. Desktop Image Upload & URL */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-[#1a1a1a]">
                          <Monitor className="w-3.5 h-3.5 text-blue-600" />
                          <span>Desktop view image (16:9 / 21:9 Widescreen)</span>
                        </div>
                        {/* Mode Switcher */}
                        <div className="flex items-center gap-1 bg-[#f1f2f4] p-0.5 rounded-md border border-[#e1e3e5]">
                          <button
                            type="button"
                            onClick={() => setDesktopMediaMode('upload')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                              desktopMediaMode === 'upload' ? 'bg-white text-[#1a1a1a] shadow-xs' : 'text-[#616161]'
                            }`}
                          >
                            <Upload className="w-2.5 h-2.5" /> Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setDesktopMediaMode('url')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                              desktopMediaMode === 'url' ? 'bg-white text-[#1a1a1a] shadow-xs' : 'text-[#616161]'
                            }`}
                          >
                            <LinkIcon className="w-2.5 h-2.5" /> URL
                          </button>
                        </div>
                      </div>

                      {desktopMediaMode === 'upload' ? (
                        /* Desktop File Upload Area */
                        <div>
                          <input
                            type="file"
                            ref={desktopFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, 'desktop');
                            }}
                          />
                          <div
                            onClick={() => desktopFileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#c9cccf] hover:border-[#1a1a1a] rounded-xl p-4 text-center cursor-pointer transition bg-[#f8f9fa] hover:bg-white"
                          >
                            {isUploadingDesktop ? (
                              <div className="py-2 flex flex-col items-center gap-1">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                <span className="text-[11px] font-medium text-[#616161]">Uploading desktop image...</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                                  <Upload className="w-4 h-4" />
                                </div>
                                <div className="text-[11px] font-semibold text-[#1a1a1a]">
                                  Click to upload desktop image <span className="text-[#616161] font-normal">or drag & drop</span>
                                </div>
                                <p className="text-[10px] text-[#616161]">
                                  Recommended: 1920×800px (JPG, PNG, WebP)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Desktop Image URL Input */
                        <div>
                          <input
                            type="url"
                            required
                            value={form.desktop_image_url}
                            onChange={(e) => setForm({ ...form, desktop_image_url: e.target.value })}
                            placeholder="https://images.unsplash.com/... (1920x800)"
                            className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                          />
                          <p className="text-[10px] text-[#616161] mt-1">
                            Direct image URL for desktop browsers.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* B. Mobile Image Upload & URL */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-[#1a1a1a]">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Mobile view image (Vertical 4:5 or 1:1)</span>
                        </div>
                        {/* Mode Switcher */}
                        <div className="flex items-center gap-1 bg-[#f1f2f4] p-0.5 rounded-md border border-[#e1e3e5]">
                          <button
                            type="button"
                            onClick={() => setMobileMediaMode('upload')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                              mobileMediaMode === 'upload' ? 'bg-white text-[#1a1a1a] shadow-xs' : 'text-[#616161]'
                            }`}
                          >
                            <Upload className="w-2.5 h-2.5" /> Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileMediaMode('url')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                              mobileMediaMode === 'url' ? 'bg-white text-[#1a1a1a] shadow-xs' : 'text-[#616161]'
                            }`}
                          >
                            <LinkIcon className="w-2.5 h-2.5" /> URL
                          </button>
                        </div>
                      </div>

                      {mobileMediaMode === 'upload' ? (
                        /* Mobile File Upload Area */
                        <div>
                          <input
                            type="file"
                            ref={mobileFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, 'mobile');
                            }}
                          />
                          <div
                            onClick={() => mobileFileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#c9cccf] hover:border-[#1a1a1a] rounded-xl p-4 text-center cursor-pointer transition bg-[#f8f9fa] hover:bg-white"
                          >
                            {isUploadingMobile ? (
                              <div className="py-2 flex flex-col items-center gap-1">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                                <span className="text-[11px] font-medium text-[#616161]">Uploading mobile image...</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                  <Smartphone className="w-4 h-4" />
                                </div>
                                <div className="text-[11px] font-semibold text-[#1a1a1a]">
                                  Click to upload mobile image <span className="text-[#616161] font-normal">or drag & drop</span>
                                </div>
                                <p className="text-[10px] text-[#616161]">
                                  Recommended: 800×1000px vertical aspect ratio
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Mobile Image URL Input */
                        <div>
                          <input
                            type="url"
                            value={form.mobile_image_url || ''}
                            onChange={(e) => setForm({ ...form, mobile_image_url: e.target.value })}
                            placeholder="https://images.unsplash.com/... (800x1000)"
                            className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                          />
                          <p className="text-[10px] text-[#616161] mt-1">
                            Direct image URL for mobile smartphone displays.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Appearance & Positioning */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] space-y-4 text-xs">
                  <h3 className="font-bold text-[#1a1a1a] text-xs border-b border-[#e1e3e5] pb-2">
                    Layout & Overlay Controls
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Text Alignment */}
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1.5">Text alignment</label>
                      <div className="flex items-center gap-1 bg-[#f1f2f4] p-1 rounded-lg border border-[#e1e3e5]">
                        {[
                          { key: 'left', icon: AlignLeft, label: 'Left' },
                          { key: 'center', icon: AlignCenter, label: 'Center' },
                          { key: 'right', icon: AlignRight, label: 'Right' },
                        ].map((align) => {
                          const Icon = align.icon;
                          const isSelected = form.text_alignment === align.key;
                          return (
                            <button
                              type="button"
                              key={align.key}
                              onClick={() => setForm({ ...form, text_alignment: align.key as any })}
                              className={`flex-1 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 transition ${
                                isSelected ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#616161]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {align.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Overlay Darkness */}
                    <div>
                      <div className="flex items-center justify-between font-semibold text-[#1a1a1a] mb-1.5">
                        <span>Background overlay darkness</span>
                        <span className="text-[11px] text-[#616161]">
                          {Math.round((form.overlay_opacity ?? 0.6) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={form.overlay_opacity ?? 0.6}
                        onChange={(e) => setForm({ ...form, overlay_opacity: parseFloat(e.target.value) })}
                        className="w-full accent-[#1a1a1a] cursor-pointer"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block font-semibold text-[#1a1a1a] mb-1.5">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                      >
                        <option value="active">Active (Visible now)</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending || !form.desktop_image_url.trim()}
                    className="px-5 py-2 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
