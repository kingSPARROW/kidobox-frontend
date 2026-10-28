'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  Boxes,
  Plus,
  Minus,
  Search,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  X,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [adjustingVariant, setAdjustingVariant] = useState<any>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(5);
  const [reason, setReason] = useState('restock');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['adminProductsInventory'],
    queryFn: () => fetchApi('/products?per_page=50'),
  });

  const adjustMutation = useMutation({
    mutationFn: async ({ variantId, adjustment, reason }: any) => {
      return fetchApi(`/variants/${variantId}/adjust-stock`, {
        method: 'POST',
        body: JSON.stringify({ adjustment, reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProductsInventory'] });
      setAdjustingVariant(null);
    },
  });

  const products = productsData?.data || [];
  const variants = products
    .flatMap((p: any) =>
      (p.variants || []).map((v: any) => ({
        ...v,
        productTitle: p.title,
        productVendor: p.vendor,
        productImage: p.images?.[0],
      }))
    )
    .filter((v: any) => {
      if (!search) return true;
      return (
        v.productTitle.toLowerCase().includes(search.toLowerCase()) ||
        v.sku?.toLowerCase().includes(search.toLowerCase()) ||
        v.title.toLowerCase().includes(search.toLowerCase())
      );
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Inventory</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Track and adjust stock levels across your warehouse locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c9cccf] text-xs font-semibold text-[#1a1a1a] rounded-lg shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#008060]" />
            <span>Main Warehouse (Mumbai)</span>
          </div>
        </div>
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
              placeholder="Filter inventory by product name or SKU..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f6f6f7] border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] focus:bg-white transition"
            />
          </div>
          <span className="text-[11px] text-[#8c9196]">
            {variants.length} variant(s) tracked
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
              <tr>
                <th className="py-2.5 px-4 w-12"></th>
                <th className="py-2.5 px-4">Product</th>
                <th className="py-2.5 px-4">SKU</th>
                <th className="py-2.5 px-4">When sold out</th>
                <th className="py-2.5 px-4">Committed</th>
                <th className="py-2.5 px-4 text-center">Available stock</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8c9196]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
                    Loading inventory counts...
                  </td>
                </tr>
              ) : variants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8c9196]">
                    No variants found. Add products to begin tracking stock.
                  </td>
                </tr>
              ) : (
                variants.map((v: any) => (
                  <tr key={v._id || v.id} className="hover:bg-[#f9fafb] transition">
                    <td className="py-2.5 px-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f6f6f7] border border-[#e1e3e5] overflow-hidden flex-shrink-0">
                        {v.productImage ? (
                          <img src={v.productImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Boxes className="w-5 h-5 text-[#8c9196] m-2.5" />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-[#1a1a1a]">{v.productTitle}</div>
                      <div className="text-[11px] text-[#8c9196]">{v.title}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#616161]">
                      {v.sku || 'N/A'}
                    </td>
                    <td className="py-2.5 px-4 text-[#616161]">
                      Stop selling
                    </td>
                    <td className="py-2.5 px-4 text-[#616161]">
                      0
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-block font-bold text-xs px-2.5 py-1 rounded-md ${
                          v.inventory_quantity <= 5
                            ? 'bg-[#fff4e5] text-[#8a4b08] border border-[#fed3a2]'
                            : 'bg-[#e3f1df] text-[#0d5921] border border-[#aee9d1]'
                        }`}
                      >
                        {v.inventory_quantity} units
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustingVariant(v);
                          setAdjustmentDelta(5);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-sm transition"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-xl max-w-sm w-full p-6 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">Adjust Available Stock</h3>
                <p className="text-[11px] text-[#616161] truncate max-w-[200px]">
                  {adjustingVariant.productTitle} ({adjustingVariant.sku})
                </p>
              </div>
              <button
                onClick={() => setAdjustingVariant(null)}
                className="text-[#616161] hover:text-[#1a1a1a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#f6f6f7] rounded-lg">
                <span className="text-[#616161]">Current Available:</span>
                <span className="font-bold text-[#1a1a1a]">
                  {adjustingVariant.inventory_quantity} units
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">Adjustment Delta (+/-)</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d - 1)}
                    className="p-2 border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#1a1a1a]" />
                  </button>
                  <input
                    type="number"
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                    className="flex-1 text-center font-bold px-3 py-1.5 border border-[#c9cccf] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d + 1)}
                    className="p-2 border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#1a1a1a]" />
                  </button>
                </div>
                <p className="text-[11px] text-[#616161] mt-1 text-center">
                  New resulting stock:{' '}
                  <span className="font-bold text-[#1a1a1a]">
                    {Math.max(0, adjustingVariant.inventory_quantity + adjustmentDelta)} units
                  </span>
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">Reason for adjustment</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg text-xs"
                >
                  <option value="restock">Restock from supplier</option>
                  <option value="cycle_count">Inventory count correction</option>
                  <option value="damaged">Damaged / Written off</option>
                  <option value="customer_return">Customer return</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e1e3e5]">
                <button
                  type="button"
                  onClick={() => setAdjustingVariant(null)}
                  className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={adjustMutation.isPending}
                  onClick={() =>
                    adjustMutation.mutate({
                      variantId: adjustingVariant._id || adjustingVariant.id,
                      adjustment: adjustmentDelta,
                      reason,
                    })
                  }
                  className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {adjustMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
