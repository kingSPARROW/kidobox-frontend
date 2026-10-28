'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  MessageSquareQuote,
  Plus,
  Star,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Check,
  Eye,
  UserCheck,
  MapPin,
  Tag,
} from 'lucide-react';

interface TestimonialItem {
  _id?: string;
  id?: string;
  author_name: string;
  avatar_url?: string;
  rating: number;
  content: string;
  location?: string;
  is_verified?: boolean;
  status: 'active' | 'inactive';
  order?: number;
  product_title?: string;
}

const AVATAR_PRESETS = [
  { name: 'Priya', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { name: 'Rahul', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { name: 'Sneha', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { name: 'Vikram', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Ananya', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
  { name: 'Rohan', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
];

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

  const [formData, setFormData] = useState<TestimonialItem>({
    author_name: '',
    avatar_url: AVATAR_PRESETS[0].url,
    rating: 5,
    content: '',
    location: 'Mumbai, MH',
    is_verified: true,
    status: 'active',
    order: 1,
    product_title: 'HOMZY Scented Soy Candle',
  });

  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['adminTestimonials', statusFilter],
    queryFn: () => {
      const url = statusFilter === 'all' ? '/testimonials' : `/testimonials?status=${statusFilter}`;
      return fetchApi(url);
    },
  });

  const testimonials: TestimonialItem[] = testimonialsData?.data || [];

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: (payload: TestimonialItem) => {
      const id = payload._id || payload.id;
      if (id) {
        return fetchApi(`/testimonials/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return fetchApi('/testimonials', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontTestimonials'] });
      setIsEditorOpen(false);
      setEditingItem(null);
    },
  });

  // Toggle Mutation
  const toggleMutation = useMutation({
    mutationFn: (id: string) => {
      return fetchApi(`/testimonials/${id}/toggle`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontTestimonials'] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return fetchApi(`/testimonials/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontTestimonials'] });
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      author_name: '',
      avatar_url: AVATAR_PRESETS[0].url,
      rating: 5,
      content: '',
      location: 'Mumbai, MH',
      is_verified: true,
      status: 'active',
      order: testimonials.length + 1,
      product_title: 'HOMZY Home Essentials',
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      author_name: item.author_name || '',
      avatar_url: item.avatar_url || AVATAR_PRESETS[0].url,
      rating: item.rating || 5,
      content: item.content || '',
      location: item.location || '',
      is_verified: item.is_verified ?? true,
      status: item.status || 'active',
      order: item.order || 1,
      product_title: item.product_title || '',
    });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete testimonial from "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name.trim() || !formData.content.trim()) {
      alert('Please provide both author name and testimonial content.');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1a1a1a]">Testimonials & Reviews</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f1f1f1] text-[#616161]">
              {testimonials.length} total
            </span>
          </div>
          <p className="text-xs text-[#616161] mt-1">
            Manage customer feedback, 5-star ratings, and verified reviews displayed on the storefront homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add testimonial</span>
        </button>
      </div>

      {/* ── Filter Tabs ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#e3e3e3] shadow-sm overflow-hidden">
        <div className="flex border-b border-[#e3e3e3] px-3">
          {(['all', 'active', 'inactive'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-3 text-xs font-semibold capitalize border-b-2 transition ${
                statusFilter === tab
                  ? 'border-[#1a1a1a] text-[#1a1a1a]'
                  : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Testimonials List ──────────────────────────────────────── */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#616161]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#303030]" />
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquareQuote className="w-10 h-10 text-[#8c8c8c] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">No testimonials found</h3>
            <p className="text-xs text-[#616161] mt-1 max-w-sm mx-auto">
              Add verified customer reviews and experiences to build trust and elevate conversions on your homepage.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-[#303030] text-white text-xs font-semibold rounded-lg"
            >
              Add First Testimonial
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#e3e3e3]">
            {testimonials.map((item) => {
              const id = item._id || item.id || '';
              return (
                <div
                  key={id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fafafa] transition"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={item.avatar_url || AVATAR_PRESETS[0].url}
                      alt={item.author_name}
                      className="w-12 h-12 rounded-full object-cover border border-[#e3e3e3] shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-bold text-[#1a1a1a]">{item.author_name}</strong>
                        {item.location && (
                          <span className="text-xs text-[#616161] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#8c8c8c]" />
                            {item.location}
                          </span>
                        )}
                        {item.is_verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Verified Customer
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 my-1 text-[#f28b19]">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="text-xs font-bold text-[#1a1a1a] ml-1">{item.rating}/5</span>
                      </div>

                      <p className="text-xs text-[#4a4a4a] italic line-clamp-2 mt-1">
                        &ldquo;{item.content}&rdquo;
                      </p>

                      {item.product_title && (
                        <div className="flex items-center gap-1 text-[11px] text-[#616161] mt-2">
                          <Tag className="w-3 h-3 text-[#8c8c8c]" />
                          <span>Reviewed: <strong>{item.product_title}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleMutation.mutate(id)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition ${
                        item.status === 'active'
                          ? 'bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9]'
                          : 'bg-[#f5f5f5] text-[#757575] hover:bg-[#e0e0e0]'
                      }`}
                    >
                      ● {item.status === 'active' ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f1f1] rounded-lg transition"
                      title="Edit Testimonial"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(id, item.author_name)}
                      className="p-1.5 text-[#d32f2f] hover:bg-[#ffebee] rounded-lg transition"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#e3e3e3] shadow-2xl overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 border-b border-[#e3e3e3] flex items-center justify-between bg-[#fafafa]">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-[#c55325]" />
                <h2 className="text-base font-bold text-[#1a1a1a]">
                  {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-[#616161] hover:text-[#1a1a1a] rounded-lg hover:bg-[#f1f1f1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Author Name & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e3e3e3] rounded-lg focus:outline-none focus:border-[#c55325]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e3e3e3] rounded-lg focus:outline-none focus:border-[#c55325]"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                  Customer Review / Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share the customer's authentic experience with the product..."
                  className="w-full p-3 text-xs bg-white border border-[#e3e3e3] rounded-lg focus:outline-none focus:border-[#c55325]"
                />
              </div>

              {/* Avatar Preset Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                  Customer Avatar / Photo URL
                </label>
                <input
                  type="url"
                  value={formData.avatar_url || ''}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e3e3e3] rounded-lg focus:outline-none focus:border-[#c55325] mb-2"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#616161]">Quick Presets:</span>
                  <div className="flex gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar_url: preset.url })}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition ${
                          formData.avatar_url === preset.url ? 'border-[#c55325] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location & Product Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                    Customer Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Mumbai, MH"
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e3e3e3] rounded-lg focus:outline-none focus:border-[#c55325]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                    Product Reviewed (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.product_title || ''}
                    onChange={(e) => setFormData({ ...formData, product_title: e.target.value })}
                    placeholder="e.g. Soy Candle (Amber)"
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e3e3e3] rounded-lg focus:outline-none focus:border-[#c55325]"
                  />
                </div>
              </div>

              {/* Status & Verified Checkbox */}
              <div className="pt-2 border-t border-[#e3e3e3] flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="rounded text-[#c55325] focus:ring-[#c55325]"
                  />
                  <span>Show &quot;Verified Customer&quot; badge</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#1a1a1a]">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="h-8 px-2 text-xs bg-white border border-[#e3e3e3] rounded-lg focus:outline-none"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#616161] block mb-1.5">Live Storefront Preview:</span>
                <blockquote className="m-0 border border-[#eee0d3] rounded-md bg-[#fffaf5] p-3 flex items-center gap-3">
                  <img
                    src={formData.avatar_url || AVATAR_PRESETS[0].url}
                    alt={formData.author_name || 'Customer'}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#eee0d3]"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="text-[#f28b19] tracking-tight">
                      {'★ '.repeat(formData.rating || 5)}
                    </span>
                    <p className="m-0 text-[#655b53] italic line-clamp-2">
                      &ldquo;{formData.content || 'Your testimonial quote will appear here...'}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <strong className="text-[#1a1a1a]">{formData.author_name || 'Customer Name'}</strong>
                      {formData.is_verified && (
                        <small className="text-[#347d36] font-semibold text-[10px]">● Verified Purchase</small>
                      )}
                    </div>
                  </div>
                </blockquote>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#e3e3e3] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-[#e3e3e3] rounded-lg text-xs font-semibold text-[#616161] hover:bg-[#f5f5f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 bg-[#303030] hover:bg-[#1a1a1a] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingItem ? 'Save Changes' : 'Publish Testimonial'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
