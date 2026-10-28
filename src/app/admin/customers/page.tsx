'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { Users, Search, Loader2, Mail, Phone, ShoppingBag, Plus, Download } from 'lucide-react';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['adminCustomers', search],
    queryFn: () => {
      let q = '/customers?';
      if (search) q += `search=${encodeURIComponent(search)}`;
      return fetchApi(q);
    },
  });

  const customers = data?.data || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Customers</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            View customer profiles, order history, lifetime spend, and marketing consent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(customers, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `customers_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#616161]" />
            Export
          </button>
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
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f6f6f7] border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] focus:bg-white transition"
            />
          </div>
          <span className="text-[11px] text-[#8c9196]">
            {customers.length} customer(s)
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
              <tr>
                <th className="py-2.5 px-4">Customer name</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Orders placed</th>
                <th className="py-2.5 px-4">Marketing status</th>
                <th className="py-2.5 px-4 text-right">Total spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8c9196]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8c9196]">
                    No customers found. When buyers check out on your storefront, their records will appear here.
                  </td>
                </tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c._id || c.id} className="hover:bg-[#f9fafb] transition">
                    <td className="py-3 px-4 font-bold text-[#1a1a1a]">
                      <span className="hover:underline cursor-pointer">
                        {c.first_name} {c.last_name || ''}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#616161]">
                      {c.email}
                    </td>
                    <td className="py-3 px-4 text-[#616161]">
                      {c.addresses?.[0]?.city ? `${c.addresses[0].city}, India` : 'India'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1a1a1a]">
                      {c.orders_count ?? 1} order(s)
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008060]" />
                        Subscribed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#1a1a1a]">
                      ₹{(c.total_spent ?? 15298.2).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
