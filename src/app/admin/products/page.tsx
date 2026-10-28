'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  ExternalLink,
  Download,
  Upload,
  Loader2,
  Filter,
  CheckSquare,
  Square,
  Copy,
  Tag,
  Boxes,
  Archive,
  Eye,
  Layers,
} from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Fetch Products
  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts', search, activeTab],
    queryFn: () => {
      let q = '/products?';
      if (search) q += `search=${encodeURIComponent(search)}&`;
      if (activeTab !== 'all') q += `status=${encodeURIComponent(activeTab)}`;
      return fetchApi(q);
    },
  });

  const products = data?.data || [];

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/products/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setSelectedIds([]);
    },
  });

  // Duplicate Product Mutation
  const duplicateMutation = useMutation({
    mutationFn: async (product: any) => {
      const payload = {
        title: `${product.title} (Copy)`,
        description: product.description,
        vendor: product.vendor,
        product_type: product.product_type,
        status: 'draft',
        images: product.images,
        price: product.variants?.[0]?.price ?? 1999,
        compare_at_price: product.variants?.[0]?.compare_at_price ?? null,
        cost_per_item: product.variants?.[0]?.cost_per_item ?? null,
        sku: `${product.variants?.[0]?.sku || 'HOM'}-COPY`,
        inventory_quantity: product.variants?.[0]?.inventory_quantity ?? 10,
        tags: product.tags,
        hsn_code: product.hsn_code,
        tax_rate: product.tax_rate,
        collection_ids: product.collection_ids,
        has_variants: product.has_variants,
        options: product.options,
        variants: product.variants?.map((v: any) => ({
          ...v,
          id: undefined,
          _id: undefined,
          sku: `${v.sku || 'SKU'}-COPY`,
        })),
      };
      return fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });

  // Bulk Status Update Mutation
  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      return Promise.all(
        ids.map((id) =>
          fetchApi(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setSelectedIds([]);
    },
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return Promise.all(ids.map((id) => fetchApi(`/products/${id}`, { method: 'DELETE' })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setSelectedIds([]);
    },
  });

  // Filtered Products
  const filteredProducts = products.filter((p: any) => {
    if (activeTab !== 'all' && p.status !== activeTab) return false;
    if (typeFilter !== 'all' && (p.product_type || 'General') !== typeFilter) return false;
    return true;
  });

  // Distinct product types for filter
  const productTypes = Array.from(
    new Set(products.map((p: any) => p.product_type).filter(Boolean))
  ) as string[];

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p: any) => p._id || p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // CSV Export
  const handleExportCsv = () => {
    const token = localStorage.getItem('homzy_token');
    window.open(`http://127.0.0.1:8000/api/v1/products/export/csv?token=${token}`, '_blank');
  };

  // CSV Import
  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const token = localStorage.getItem('homzy_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/products/import/csv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Import successful!');
        queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      } else {
        alert(data.message || 'CSV Import failed.');
      }
    } catch (err: any) {
      alert('Error uploading CSV: ' + err.message);
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Bar: Shopify Actions & Import/Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Products</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Manage your store's merchandise, pricing, stock levels, and Shopify variants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-xs transition inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#616161]" />
            Export CSV
          </button>

          {/* Import CSV */}
          <label className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#616161]" />
            {isImporting ? 'Importing...' : 'Import CSV'}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportCsv}
              disabled={isImporting}
            />
          </label>

          {/* Add Product Button */}
          <Link
            href="/admin/products/new"
            className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add product
          </Link>
        </div>
      </div>

      {/* 2. Main Shopify Products Card */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-[0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Shopify Status Tabs */}
        <div className="border-b border-[#e1e3e5] px-4 flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'all'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'active'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Active ({products.filter((p: any) => p.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'draft'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Draft ({products.filter((p: any) => p.status === 'draft').length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'archived'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Archived ({products.filter((p: any) => p.status === 'archived').length})
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-[#e1e3e5] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#ffffff]">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU, or tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f6f6f7] border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Category / Type Filter */}
            <div className="flex items-center gap-1.5 text-xs text-[#616161]">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2 py-1 text-xs bg-[#f6f6f7] border border-[#c9cccf] rounded-lg focus:outline-none"
              >
                <option value="all">All Product Types</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[11px] text-[#8c9196]">
              {filteredProducts.length} product(s)
            </span>
          </div>
        </div>

        {/* FLOATING BULK ACTIONS BAR */}
        {selectedIds.length > 0 && (
          <div className="bg-[#f1f2f4] border-b border-[#e1e3e5] px-4 py-2 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1a1a1a]">
                {selectedIds.length} product(s) selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  bulkStatusMutation.mutate({ ids: selectedIds, status: 'active' })
                }
                className="px-2.5 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#0d5921] font-semibold rounded-md shadow-xs transition"
              >
                Mark as active
              </button>
              <button
                onClick={() =>
                  bulkStatusMutation.mutate({ ids: selectedIds, status: 'draft' })
                }
                className="px-2.5 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#8a4b08] font-semibold rounded-md shadow-xs transition"
              >
                Mark as draft
              </button>
              <button
                onClick={() =>
                  bulkStatusMutation.mutate({ ids: selectedIds, status: 'archived' })
                }
                className="px-2.5 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#616161] font-semibold rounded-md shadow-xs transition"
              >
                Archive
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.length} selected products?`)) {
                    bulkDeleteMutation.mutate(selectedIds);
                  }
                }}
                className="px-2.5 py-1 bg-[#d72c0d] hover:bg-[#bc2200] text-white font-semibold rounded-md shadow-xs transition"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-[#c9cccf] text-[#008060] focus:ring-[#008060]"
                  />
                </th>
                <th className="py-2.5 px-3 w-12"></th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Inventory</th>
                <th className="py-2.5 px-3">Category / Type</th>
                <th className="py-2.5 px-3">Vendor</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#8c9196]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
                    Loading product catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#8c9196]">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p: any) => {
                  const pId = p._id || p.id;
                  const defaultVariant = p.variants?.[0];
                  const totalStock = p.variants?.reduce(
                    (sum: number, v: any) => sum + (v.inventory_quantity || 0),
                    0
                  ) ?? 0;
                  const variantCount = p.variants?.length || 1;
                  const thumbnail =
                    p.images?.[0] ||
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80';
                  const isSelected = selectedIds.includes(pId);

                  return (
                    <tr
                      key={pId}
                      className={`hover:bg-[#f9fafb] transition ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(pId)}
                          className="rounded border-[#c9cccf] text-[#008060] focus:ring-[#008060]"
                        />
                      </td>

                      {/* Thumbnail */}
                      <td className="py-2.5 px-3">
                        <Link href={`/admin/products/${pId}`}>
                          <div className="w-10 h-10 rounded-lg bg-[#f6f6f7] border border-[#e1e3e5] overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90">
                            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                        </Link>
                      </td>

                      {/* Product Title & Handle */}
                      <td className="py-2.5 px-3 font-semibold text-[#1a1a1a]">
                        <Link
                          href={`/admin/products/${pId}`}
                          className="font-bold text-[#1a1a1a] hover:underline hover:text-[#008060] transition block"
                        >
                          {p.title}
                        </Link>
                        <div className="text-[11px] text-[#8c9196] font-mono flex items-center gap-1.5 mt-0.5">
                          <span>/{p.slug}</span>
                          <span>•</span>
                          <span>HSN {p.hsn_code || '9403'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            p.status === 'active'
                              ? 'bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]'
                              : p.status === 'draft'
                              ? 'bg-[#fff4e5] text-[#8a4b08] border-[#fed3a2]'
                              : 'bg-[#ebebeb] text-[#616161] border-[#d4d4d4]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'active'
                                ? 'bg-[#008060]'
                                : p.status === 'draft'
                                ? 'bg-[#b98900]'
                                : 'bg-[#616161]'
                            }`}
                          />
                          {p.status === 'active'
                            ? 'Active'
                            : p.status === 'draft'
                            ? 'Draft'
                            : 'Archived'}
                        </span>
                      </td>

                      {/* Inventory Count with Variants Breakdown */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-0.5">
                          <span
                            className={`font-semibold ${
                              totalStock <= 0
                                ? 'text-[#d72c0d] font-bold'
                                : totalStock <= 5
                                ? 'text-[#8a4b08]'
                                : 'text-[#1a1a1a]'
                            }`}
                          >
                            {totalStock <= 0 ? 'Out of stock' : `${totalStock} in stock`}
                          </span>
                          {variantCount > 1 && (
                            <span className="block text-[10px] text-[#8c9196]">
                              for {variantCount} variants
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3 text-[#616161]">
                        {p.product_type || 'General'}
                      </td>

                      {/* Vendor */}
                      <td className="py-2.5 px-3 text-[#616161]">
                        {p.vendor || 'HOMZY'}
                      </td>

                      {/* Price with Compare-at strike */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#1a1a1a]">
                          ₹{defaultVariant?.price?.toLocaleString('en-IN') ?? '0'}
                        </div>
                        {defaultVariant?.compare_at_price && (
                          <div className="text-[10px] text-[#8c9196] line-through">
                            ₹{defaultVariant.compare_at_price.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View on Storefront */}
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#8c9196] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-lg transition"
                            title="View product on storefront"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit Product (Shopify 2-column page) */}
                          <Link
                            href={`/admin/products/${pId}`}
                            className="p-1.5 text-[#8c9196] hover:text-[#008060] hover:bg-[#eef8f5] rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Quick Duplicate */}
                          <button
                            onClick={() => duplicateMutation.mutate(p)}
                            disabled={duplicateMutation.isPending}
                            className="p-1.5 text-[#8c9196] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-lg transition"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Product */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete product "${p.title}"?`)) {
                                deleteMutation.mutate(pId);
                              }
                            }}
                            className="p-1.5 text-[#8c9196] hover:text-[#d72c0d] hover:bg-[#fff4f2] rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
