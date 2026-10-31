'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { Percent, Plus, Trash2, CheckCircle2, X, Loader2, Tag, Copy } from 'lucide-react';

export default function AdminDiscountsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: 'LITTLE15',
    title: 'Little Welcome 15% Off',
    type: 'percentage',
    value: 15,
    min_cart_amount: 999,
    usage_limit: 500,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['adminDiscounts'],
    queryFn: () => fetchApi('/discounts'),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return fetchApi('/discounts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDiscounts'] });
      setIsModalOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/discounts/${id}/toggle`, { method: 'PATCH' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDiscounts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/discounts/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDiscounts'] });
    },
  });

  const discounts = data?.data || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Discounts</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Create coupon codes, percentage discounts, and free shipping promotions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          Create discount
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-[0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-3 border-b border-[#e1e3e5] flex items-center justify-between bg-white text-xs">
          <span className="font-semibold text-[#1a1a1a]">Coupon Codes</span>
          <span className="text-[#8c9196]">{discounts.length} promotion(s)</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
              <tr>
                <th className="py-2.5 px-4">Title / Code</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Requirement</th>
                <th className="py-2.5 px-4">Used</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8c9196]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
                    Loading promotions...
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8c9196]">
                    No discounts created yet. Click "Create discount" to set up promo codes.
                  </td>
                </tr>
              ) : (
                discounts.map((d: any) => (
                  <tr key={d._id || d.id} className="hover:bg-[#f9fafb] transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1a1a1a] flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#f6f6f7] border border-[#d2d5d8] rounded font-mono text-xs">
                          {d.code}
                        </span>
                        <span className="text-xs text-[#616161]">{d.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleMutation.mutate(d._id || d.id)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition ${
                          d.is_active
                            ? 'bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]'
                            : 'bg-[#f6f6f7] text-[#616161] border-[#e1e3e5]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            d.is_active ? 'bg-[#008060]' : 'bg-[#8c9196]'
                          }`}
                        />
                        {d.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1a1a1a]">
                      {d.type === 'percentage' ? `${d.value}% off order` : `₹${d.value} off order`}
                    </td>
                    <td className="py-3 px-4 text-[#616161]">
                      {d.min_cart_amount > 0 ? `Min purchase of ₹${d.min_cart_amount}` : 'None'}
                    </td>
                    <td className="py-3 px-4 text-[#616161]">
                      {d.usage_count ?? 1} / {d.usage_limit || '∞'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete coupon "${d.code}"?`)) {
                            deleteMutation.mutate(d._id || d.id);
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-xl max-w-md w-full p-6 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-3">
              <h3 className="text-sm font-bold text-[#1a1a1a]">Create Discount Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#616161] hover:text-[#1a1a1a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(form);
              }}
              className="space-y-3 text-xs"
            >
              {createMutation.isError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {(createMutation.error as any)?.response?.data?.message || 'Failed to save discount. Please try again.'}
                </div>
              )}
              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">Discount code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">Discount type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_amount">Fixed Amount (INR)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">
                  Discount value {form.type === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">Minimum purchase amount (INR)</label>
                <input
                  type="number"
                  min={0}
                  value={form.min_cart_amount}
                  onChange={(e) => setForm({ ...form, min_cart_amount: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg"
                />
              </div>

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
                  disabled={createMutation.isPending || !form.code.trim()}
                  className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
