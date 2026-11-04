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
  Calendar,
  Clock,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  Boxes,
  Eye,
  Plus,
  Search,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
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

  const maxSales = Math.max(...chartData.map((d: any) => d.sales || 0), 1000);

  return (
    <div className="space-y-6">
      {/* 1. Welcoming Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time performance and operations for{' '}
            <span className="font-semibold text-slate-800">{store?.name || 'Kidobox'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg shadow-2xs focus:outline-none transition cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Store</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Action Shortcuts (Simple 1-click access to common tasks) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/products"
          className="p-3 bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">Products</div>
            <div className="text-[10px] text-slate-400 truncate">Add &amp; edit items</div>
          </div>
        </Link>

        <Link
          href="/admin/seo"
          className="p-3 bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <Search className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">SEO &amp; Meta</div>
            <div className="text-[10px] text-slate-400 truncate">Headings &amp; tags</div>
          </div>
        </Link>

        <Link
          href="/admin/banners"
          className="p-3 bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">Hero Banners</div>
            <div className="text-[10px] text-slate-400 truncate">Slider artwork</div>
          </div>
        </Link>

        <Link
          href="/admin/guides"
          className="p-3 bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">Blog Guides</div>
            <div className="text-[10px] text-slate-400 truncate">Publish articles</div>
          </div>
        </Link>
      </div>

      {/* 3. Action Alerts (Only shown if attention is needed) */}
      {(metrics.unfulfilled_orders > 0 || lowStockItems.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.unfulfilled_orders > 0 && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-xs text-amber-900 font-medium truncate">
                  <strong className="font-bold">{metrics.unfulfilled_orders} order(s)</strong> awaiting fulfillment
                </span>
              </div>
              <Link
                href="/admin/orders"
                className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/80 rounded-lg transition inline-flex items-center gap-1 flex-shrink-0"
              >
                <span>Fulfill</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                <span className="text-xs text-rose-900 font-medium truncate">
                  <strong className="font-bold">{lowStockItems.length} product(s)</strong> low on inventory
                </span>
              </div>
              <Link
                href="/admin/inventory"
                className="px-2.5 py-1 text-xs font-semibold text-rose-900 bg-rose-100 hover:bg-rose-200/80 rounded-lg transition inline-flex items-center gap-1 flex-shrink-0"
              >
                <span>Restock</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 4. Four Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Total Sales</span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> {metrics.sales_growth}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{metrics.total_sales?.toLocaleString('en-IN') ?? '0'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Paid &amp; captured revenue</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Orders Placed</span>
            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {metrics.total_orders}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">In selected period</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Avg Order Value</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{metrics.aov?.toLocaleString('en-IN') ?? '0'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Average checkout basket</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Store Visits</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {metrics.sessions_count}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Conv. rate: <span className="font-semibold text-slate-700">{metrics.conversion_rate}%</span>
          </p>
        </div>
      </div>

      {/* 5. Sales Trend Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Revenue Trend</h2>
            <p className="text-xs text-slate-400">Daily gross sales merchandise value</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Peak: ₹{maxSales.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="h-40 flex items-end gap-2 pt-4 border-b border-slate-100">
          {chartData.map((d: any, idx: number) => {
            const heightPercent = maxSales > 0 ? Math.max(10, Math.round((d.sales / maxSales) * 100)) : 10;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md shadow-md whitespace-nowrap z-20">
                  <span className="font-bold">₹{d.sales.toLocaleString('en-IN')}</span> ({d.orders} orders)
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all ${
                    d.sales > 0
                      ? 'bg-slate-900 group-hover:bg-slate-800'
                      : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 pt-2 font-mono">
          {chartData.map((d: any, idx: number) => (
            <span key={idx} className="truncate max-w-[50px] text-center">
              {d.date}
            </span>
          ))}
        </div>
      </div>

      {/* 6. Two Column Section: Recent Orders & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Customer Orders</h2>
              <p className="text-xs text-slate-400">Latest storefront checkouts</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-4">Order</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Fulfillment</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No customer orders yet for this timeframe.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord: any) => (
                    <tr key={ord._id || ord.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <Link href={`/admin/orders?order=${ord._id || ord.id}`} className="hover:underline">
                          #{ord.order_number || '1001'}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {ord.customer?.first_name} {ord.customer?.last_name || ''}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ord.financial_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.financial_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {ord.financial_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ord.fulfillment_status === 'fulfilled'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.fulfillment_status === 'fulfilled' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {ord.fulfillment_status === 'fulfilled' ? 'Shipped' : 'Unfulfilled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        ₹{ord.pricing?.total?.toLocaleString('en-IN') ?? '0'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products & Low Stock */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Selling Items</h2>
            <p className="text-xs text-slate-400 mb-3">Popular organic essentials</p>

            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No product sales yet.</p>
            ) : (
              <div className="space-y-2.5">
                {topProducts.slice(0, 4).map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="truncate max-w-[160px]">
                      <div className="font-medium text-slate-800 truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-400">{p.quantity} units sold</div>
                    </div>
                    <div className="font-bold text-slate-900">
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Stock Alerts</h2>
              <Link href="/admin/inventory" className="text-xs text-slate-600 hover:text-slate-900 font-medium">
                Manage
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700 py-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>All product inventory levels are healthy.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockItems.slice(0, 3).map((v: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                    <div className="truncate max-w-[140px]">
                      <div className="font-medium text-slate-800 truncate">{v.product?.title || 'Product'}</div>
                      <div className="text-[10px] text-slate-400">{v.sku}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 rounded-full">
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
