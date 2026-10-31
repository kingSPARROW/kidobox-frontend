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
} from 'lucide-react';

export default function AdminCollectionsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    sort_order: 'best-selling',
    type: 'manual',
    is_published: true,
  });

  const { data: collectionsData, isLoading } = useQuery({
    queryKey: ['adminCollections'],
    queryFn: () => fetchApi('/collections'),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return fetchApi(editingId ? `/collections/${editingId}` : '/collections', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCollections'] });
      setIsModalOpen(false);
      setForm({
        title: '',
        description: '',
        image_url: '',
        sort_order: 'best-selling',
    type: 'manual',
    is_published: true,
      });
    },
  });

  const collections = collectionsData?.data || [];
  const filtered = collections.filter((c: any) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Collections</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Group products to make it easier for customers to find them by category.
          </p>
        </div>

        <button
          onClick={() => { setEditingId(null); setForm({ title: '', description: '', image_url: '', sort_order: 'best-selling', type: 'manual', is_published: true }); setIsModalOpen(true); }}
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
              placeholder="Filter collections by title..."
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
                <th className="py-2.5 px-4">Title</th>
                <th className="py-2.5 px-4">Products</th>
                <th className="py-2.5 px-4">Product conditions</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8c9196]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
                    Loading collections...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8c9196]">
                    No collections found. Click "Create collection" to organize your catalog.
                  </td>
                </tr>
              ) : (
                filtered.map((c: any) => (
                  <tr key={c._id || c.id} className="hover:bg-[#f9fafb] transition">
                    <td className="py-2.5 px-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f6f6f7] border border-[#e1e3e5] overflow-hidden flex-shrink-0">
                        {c.image_url ? (
                          <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FolderTree className="w-5 h-5 text-[#8c9196] m-2.5" />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#1a1a1a]">
                      <button className="hover:underline cursor-pointer" onClick={() => { setEditingId(c.id || c._id); setForm({ title: c.title, description: c.description || "", image_url: c.image_url || "", sort_order: c.sort_order || "best-selling", type: c.type || "manual", is_published: !!c.is_published }); setIsModalOpen(true); }}>{c.title}</button>
                      <div className="text-[11px] text-[#8c9196] font-mono">/{c.slug}</div>
                    </td>
                    <td className="py-2.5 px-4 text-[#616161]">
                      {c.product_count ?? 0} products
                    </td>
                    <td className="py-2.5 px-4 text-[#616161]">
                      Manual collection
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={async () => {
                          if (confirm(`Delete collection "${c.title}"?`)) {
                            await fetchApi(`/collections/${c._id || c.id}`, { method: 'DELETE' });
                            queryClient.invalidateQueries({ queryKey: ['adminCollections'] });
                          }
                        }}
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

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-xl max-w-md w-full p-6 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-3">
              <h3 className="text-sm font-bold text-[#1a1a1a]">{editingId ? "Edit Collection" : "Create Collection"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#616161] hover:text-[#1a1a1a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {createMutation.isError && <p role="alert">{createMutation.error.message}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(form);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Living Essentials"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060]"
                />
              </div>

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

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="rounded border-[#c9cccf] text-[#1a1a1a] focus:ring-0"
                  />
                  <span className="font-medium text-[#1a1a1a]">Published on storefront</span>
                </label>
              </div>

              {createMutation.isError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs" role="alert">
                  {(createMutation.error as any)?.message || 'Failed to save collection'}
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
                  disabled={createMutation.isPending || !form.title.trim()}
                  className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
