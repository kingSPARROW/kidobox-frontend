'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Package,
  Truck,
  Calendar,
  Clock,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  Boxes,
  Eye,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState('7d');

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['adminAnalytics', dateRange],
    queryFn: () => fetchApi(`/dashboard/analytics?range=${dateRange}`),
  });

  const { data: storeData } = useQuery({
    queryKey: ['adminStore'],
    queryFn: () => fetchApi('/store'),
  });

  const metrics = analyticsData?.metrics || {
    total_sales: 0,
    total_orders: 0,
    aov: 0,
    total_customers: 0,
    unfulfilled_orders: 0,
    pending_payments: 0,
    conversion_rate: 0,
    sessions_count: 0,
    sales_growth: '+0%',
  };

  const chartData = analyticsData?.chart_data || [];
  const recentOrders = analyticsData?.recent_orders || [];
  const lowStockItems = analyticsData?.low_stock_items || [];
  const topProducts = analyticsData?.top_products || [];
  const store = storeData?.store || {};

  // Maximum value for SVG chart scaling
  const maxSales = Math.max(...chartData.map((d: any) => d.sales || 0), 1000);

  return (
    <div className="space-y-6">
      {/* 1. Header with Page Title & Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Home</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Real-time sales, order fulfillment, and inventory metrics for <span className="font-semibold text-[#1a1a1a]">{store?.name || 'HOMZY'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg shadow-sm focus:outline-none focus:border-[#008060] transition cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#616161] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Eye className="w-3.5 h-3.5 text-[#616161]" />
            View Store
          </Link>
        </div>
      </div>

      {/* 2. Operational To-Do Queue (Shopify Action Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Unfulfilled Orders To-Do */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8a4b08]" />
              <span className="text-xs font-bold text-[#1a1a1a]">Fulfillment Queue</span>
            </div>
            <p className="text-xs text-[#616161]">
              <span className="font-semibold text-[#1a1a1a]">{metrics.unfulfilled_orders} order(s)</span> are waiting to be fulfilled and dispatched.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1 flex-shrink-0"
          >
            Ship Orders
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Low Stock Alerts To-Do */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d72c0d]" />
              <span className="text-xs font-bold text-[#1a1a1a]">Inventory Alert</span>
            </div>
            <p className="text-xs text-[#616161]">
              <span className="font-semibold text-[#1a1a1a]">{lowStockItems.length} product(s)</span> have low stock levels (&le; 5 remaining).
            </p>
          </div>
          <Link
            href="/admin/inventory"
            className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1 flex-shrink-0"
          >
            Adjust Stock
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 3. Shopify Performance Summary (4 Key Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-xs text-[#616161] font-medium mb-1">
            <span>Total sales</span>
            <span className="text-[11px] text-[#008060] font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {metrics.sales_growth}
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            ₹{metrics.total_sales?.toLocaleString('en-IN') ?? '0'}
          </div>
          <p className="text-[11px] text-[#8c9196] mt-1">From paid & captured orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-xs text-[#616161] font-medium mb-1">
            <span>Total orders</span>
            <ShoppingBag className="w-3.5 h-3.5 text-[#8c9196]" />
          </div>
          <div className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            {metrics.total_orders}
          </div>
          <p className="text-[11px] text-[#8c9196] mt-1">Processed in selected timeframe</p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-xs text-[#616161] font-medium mb-1">
            <span>Average order value</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#8c9196]" />
          </div>
          <div className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            ₹{metrics.aov?.toLocaleString('en-IN') ?? '0'}
          </div>
          <p className="text-[11px] text-[#8c9196] mt-1">Average per transaction</p>
        </div>

        {/* Online Store Sessions */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-xs text-[#616161] font-medium mb-1">
            <span>Online store sessions</span>
            <Users className="w-3.5 h-3.5 text-[#8c9196]" />
          </div>
          <div className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            {metrics.sessions_count}
          </div>
          <p className="text-[11px] text-[#8c9196] mt-1">
            Conv. rate: <span className="font-semibold text-[#1a1a1a]">{metrics.conversion_rate}%</span>
          </p>
        </div>
      </div>

      {/* 4. Sales Over Time Chart (Shopify Crisp Bar Representation) */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#1a1a1a]">Sales over time</h2>
            <p className="text-xs text-[#616161]">Daily gross merchandise value (INR)</p>
          </div>
          <span className="text-xs text-[#616161] font-mono">
            Peak: ₹{maxSales.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Chart Bars */}
        <div className="h-44 flex items-end gap-2 pt-6 border-b border-[#e1e3e5]">
          {chartData.map((d: any, idx: number) => {
            const heightPercent = maxSales > 0 ? Math.max(10, Math.round((d.sales / maxSales) * 100)) : 10;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap z-20">
                  <span className="font-bold">₹{d.sales.toLocaleString('en-IN')}</span> ({d.orders} orders)
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t transition-all ${
                    d.sales > 0
                      ? 'bg-[#008060] group-hover:bg-[#006e52]'
                      : 'bg-[#e1e3e5] group-hover:bg-[#c9cccf]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[10px] text-[#8c9196] pt-2">
          {chartData.map((d: any, idx: number) => (
            <span key={idx} className="truncate max-w-[50px] text-center">
              {d.date}
            </span>
          ))}
        </div>
      </div>

      {/* 5. Two Columns: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#e1e3e5] shadow-[0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-4 border-b border-[#e1e3e5] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a]">Recent orders</h2>
              <p className="text-xs text-[#616161]">Latest incoming customer purchases</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#008060] hover:text-[#006e52] inline-flex items-center gap-1"
            >
              View all orders
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
                <tr>
                  <th className="py-2.5 px-4">Order</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Fulfillment</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#8c9196]">
                      No orders placed in this period yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord: any) => (
                    <tr key={ord._id || ord.id} className="hover:bg-[#f9fafb] transition">
                      <td className="py-3 px-4 font-semibold text-[#1a1a1a]">
                        <Link href={`/admin/orders?order=${ord._id || ord.id}`} className="hover:underline">
                          #{ord.order_number || '1001'}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-[#616161]">
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#1a1a1a]">
                        {ord.customer?.first_name} {ord.customer?.last_name || ''}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            ord.financial_status === 'paid'
                              ? 'bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]'
                              : 'bg-[#fff4e5] text-[#8a4b08] border-[#fed3a2]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.financial_status === 'paid' ? 'bg-[#008060]' : 'bg-[#b98900]'
                            }`}
                          />
                          {ord.financial_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            ord.fulfillment_status === 'fulfilled'
                              ? 'bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]'
                              : 'bg-[#fff4e5] text-[#8a4b08] border-[#fed3a2]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.fulfillment_status === 'fulfilled' ? 'bg-[#008060]' : 'bg-[#b98900]'
                            }`}
                          />
                          {ord.fulfillment_status === 'fulfilled' ? 'Fulfilled' : 'Unfulfilled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#1a1a1a]">
                        ₹{ord.pricing?.total?.toLocaleString('en-IN') ?? '0'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Top Products & Low Stock */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <h2 className="text-sm font-bold text-[#1a1a1a] mb-1">Top products</h2>
            <p className="text-xs text-[#616161] mb-3">By units sold</p>

            {topProducts.length === 0 ? (
              <p className="text-xs text-[#8c9196] py-3">No sales registered yet.</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="truncate max-w-[180px]">
                      <div className="font-semibold text-[#1a1a1a] truncate">{p.title}</div>
                      <div className="text-[11px] text-[#8c9196]">{p.quantity} sold</div>
                    </div>
                    <div className="font-bold text-[#1a1a1a]">
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1a1a1a]">Low stock items</h2>
              <Link href="/admin/inventory" className="text-xs text-[#008060] hover:underline font-semibold">
                Manage
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-[#008060]">
                <CheckCircle2 className="w-4 h-4" />
                <span>All inventory levels are healthy.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockItems.map((v: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-[#f9fafb] rounded-lg border border-[#e1e3e5]">
                    <div>
                      <div className="font-semibold text-[#1a1a1a]">{v.product?.title || 'Product'}</div>
                      <div className="text-[10px] text-[#8c9196]">SKU: {v.sku}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-[#fbeae5] text-[#8c1e0b] border border-[#f7c2b6] rounded-full">
                      {v.inventory_quantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
