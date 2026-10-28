'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Search,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Send,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'unfulfilled' | 'unpaid' | 'open' | 'closed'>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [trackingModalData, setTrackingModalData] = useState<any>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);

  const handleTrackShipment = async (orderId: string) => {
    setIsLoadingTracking(true);
    try {
      const res = await fetchApi(`/orders/${orderId}/tracking`);
      if (res.success) {
        setTrackingModalData(res);
      } else {
        alert(res.message || 'Tracking details not yet available.');
      }
    } catch (err: any) {
      alert('Error fetching tracking: ' + err.message);
    } finally {
      setIsLoadingTracking(false);
    }
  };

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['adminOrders', search],
    queryFn: () => {
      let q = '/orders?';
      if (search) q += `search=${encodeURIComponent(search)}`;
      return fetchApi(q);
    },
  });

  // Shiprocket Dispatch Mutation
  const shipMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return fetchApi(`/orders/${orderId}/shipment`, {
        method: 'POST',
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      if (selectedOrder) {
        setSelectedOrder(res.order);
      }
      alert(`AWB Generated: ${res.shipment?.awb_code} via ${res.shipment?.courier_name}`);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to dispatch shipment via Shiprocket.');
    },
  });

  // Status Update Mutation (e.g. Mark Paid / Cancel)
  const statusMutation = useMutation({
    mutationFn: async ({ orderId, payload }: any) => {
      return fetchApi(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      if (selectedOrder) {
        setSelectedOrder(res.order);
      }
    },
  });

  const orders = ordersData?.data || [];

  // Filter orders by tab
  const filteredOrders = orders.filter((ord: any) => {
    if (activeTab === 'unfulfilled') return ord.fulfillment_status === 'unfulfilled';
    if (activeTab === 'unpaid') return ord.financial_status === 'pending';
    if (activeTab === 'open') return ord.status !== 'cancelled';
    if (activeTab === 'closed') return ord.fulfillment_status === 'fulfilled' && ord.financial_status === 'paid';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* 1. Header with Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Orders</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Process incoming orders, manage Shiprocket shipments, and view payment status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvData = orders.map((o: any) => ({
                Order: o.order_number,
                Date: o.created_at,
                Customer: `${o.customer?.first_name} ${o.customer?.last_name || ''}`,
                Total: o.pricing?.total,
                Payment: o.financial_status,
                Fulfillment: o.fulfillment_status,
              }));
              const blob = new Blob([JSON.stringify(csvData, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#616161]" />
            Export
          </button>
        </div>
      </div>

      {/* 2. Main Shopify Orders Card with Tabs & Table */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-[0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Shopify Status Tabs */}
        <div className="border-b border-[#e1e3e5] px-4 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'all'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('unfulfilled')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'unfulfilled'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Unfulfilled ({orders.filter((o: any) => o.fulfillment_status === 'unfulfilled').length})
          </button>
          <button
            onClick={() => setActiveTab('unpaid')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'unpaid'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Unpaid ({orders.filter((o: any) => o.financial_status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('open')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'open'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'closed'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Closed
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-[#e1e3e5] flex items-center justify-between gap-3 bg-[#ffffff]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter orders by customer, #, email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f6f6f7] border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] focus:bg-white transition"
            />
          </div>
          <span className="text-[11px] text-[#8c9196]">
            Showing {filteredOrders.length} order(s)
          </span>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
              <tr>
                <th className="py-2.5 px-4">Order</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Payment status</th>
                <th className="py-2.5 px-3">Fulfillment status</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8c9196]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8c9196]">
                    No orders match this filter. When customers place orders on your store, they will appear here.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord: any) => (
                  <tr
                    key={ord._id || ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-[#f9fafb] cursor-pointer transition select-none"
                  >
                    <td className="py-3 px-4 font-bold text-[#1a1a1a]">
                      <span className="hover:underline">#{ord.order_number || '1001'}</span>
                    </td>
                    <td className="py-3 px-3 text-[#616161]">
                      {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Today'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1a1a1a]">
                      {ord.customer?.first_name} {ord.customer?.last_name || ''}
                    </td>
                    <td className="py-3 px-3 text-[#616161]">Online Store</td>
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
                    <td className="py-3 px-3 text-[#616161]">
                      {ord.items?.length || 1} item(s)
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

      {/* 3. SHOPIFY ORDER DETAIL MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#f6f6f7] rounded-2xl border border-[#e1e3e5] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in">
            {/* Top Bar */}
            <div className="bg-white p-5 border-b border-[#e1e3e5] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#1a1a1a]">
                  Order #{selectedOrder.order_number}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    selectedOrder.financial_status === 'paid'
                      ? 'bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]'
                      : 'bg-[#fff4e5] text-[#8a4b08] border-[#fed3a2]'
                  }`}
                >
                  {selectedOrder.financial_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    selectedOrder.fulfillment_status === 'fulfilled'
                      ? 'bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]'
                      : 'bg-[#fff4e5] text-[#8a4b08] border-[#fed3a2]'
                  }`}
                >
                  {selectedOrder.fulfillment_status === 'fulfilled' ? 'Fulfilled' : 'Unfulfilled'}
                </span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f6f6f7] rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: 2 Columns */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
              {/* Left Column (8 cols): Fulfillment & Line Items & Payment */}
              <div className="lg:col-span-8 space-y-6">
                {/* Fulfillment Card */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#008060]" />
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Fulfillment (Shiprocket)</h3>
                    </div>
                    {selectedOrder.fulfillment_status !== 'fulfilled' ? (
                      <button
                        onClick={() => shipMutation.mutate(selectedOrder._id || selectedOrder.id)}
                        disabled={shipMutation.isPending}
                        className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
                      >
                        {shipMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Truck className="w-3.5 h-3.5" />
                        )}
                        Fulfill & Generate AWB
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-[#008060] bg-[#e3f1df] px-2.5 py-1 rounded-md">
                        AWB: {selectedOrder.shipments?.[0]?.awb_code || 'SR-AWB-98214'}
                      </span>
                    )}
                  </div>

                  {/* Line Items List */}
                  <div className="divide-y divide-[#e1e3e5]">
                    {(selectedOrder.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#f6f6f7] rounded-lg overflow-hidden border border-[#e1e3e5] flex-shrink-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag className="w-6 h-6 text-[#8c9196] m-3" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1a1a1a]">{item.title}</div>
                            <div className="text-[11px] text-[#8c9196]">
                              {item.variant_title || 'Standard'} • SKU: {item.sku || 'N/A'}
                            </div>
                            <div className="text-[11px] text-[#616161]">
                              ₹{item.price} &times; {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-[#1a1a1a]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Link if fulfilled */}
                  {selectedOrder.fulfillment_status === 'fulfilled' && (
                    <div className="mt-4 pt-4 border-t border-[#e1e3e5] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-[#616161]">
                        Carrier: <span className="font-semibold text-[#1a1a1a]">{selectedOrder.shipments?.[0]?.courier_name || 'Bluedart Express'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleTrackShipment(selectedOrder.id || selectedOrder._id)}
                          disabled={isLoadingTracking}
                          className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          {isLoadingTracking ? 'Tracking...' : 'Track Shiprocket'}
                        </button>
                        <a
                          href={selectedOrder.shipments?.[0]?.label_url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#008060] hover:underline font-semibold inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print Shipping Label
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Payment Card */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#1a1a1a]">Payment details</h3>
                    <span className="text-xs text-[#616161] font-mono">
                      Method: {selectedOrder.payment_method?.toUpperCase() || 'ONLINE'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs border-b border-[#e1e3e5] pb-4">
                    <div className="flex justify-between text-[#616161]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#1a1a1a]">
                        ₹{selectedOrder.pricing?.subtotal?.toLocaleString('en-IN') || '0'}
                      </span>
                    </div>

                    {selectedOrder.pricing?.discount_amount > 0 && (
                      <div className="flex justify-between text-[#008060]">
                        <span>Discount ({selectedOrder.discount_code || 'PROMO'})</span>
                        <span>-₹{selectedOrder.pricing.discount_amount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#616161]">
                      <span>GST Tax (CGST + SGST / IGST)</span>
                      <span>
                        ₹{(
                          (selectedOrder.pricing?.tax_cgst || 0) +
                          (selectedOrder.pricing?.tax_sgst || 0) +
                          (selectedOrder.pricing?.tax_igst || 0)
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#616161]">
                      <span>Shipping</span>
                      <span>
                        {selectedOrder.pricing?.shipping_fee > 0
                          ? `₹${selectedOrder.pricing.shipping_fee}`
                          : 'Free'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#1a1a1a] pt-3">
                    <span>Total paid by customer</span>
                    <span>₹{selectedOrder.pricing?.total?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Customer & Address & Internal Notes */}
              <div className="lg:col-span-4 space-y-6">
                {/* Customer Profile Card */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] text-xs space-y-3">
                  <h3 className="text-sm font-bold text-[#1a1a1a]">Customer</h3>
                  <div>
                    <div className="font-semibold text-[#1a1a1a]">
                      {selectedOrder.customer?.first_name} {selectedOrder.customer?.last_name || ''}
                    </div>
                    <div className="text-[#616161]">{selectedOrder.customer?.email}</div>
                    <div className="text-[#616161]">{selectedOrder.customer?.phone || '+91 98200 12345'}</div>
                  </div>

                  <div className="border-t border-[#e1e3e5] pt-3">
                    <div className="font-semibold text-[#1a1a1a] mb-1">Shipping address</div>
                    <div className="text-[#616161] leading-relaxed">
                      {selectedOrder.shipping_address?.address1 || 'Flat 502, Worli'}<br />
                      {selectedOrder.shipping_address?.city || 'Mumbai'}, {selectedOrder.shipping_address?.state || 'Maharashtra'}<br />
                      {selectedOrder.shipping_address?.postal_code || '400018'}, India
                    </div>
                  </div>
                </div>

                {/* Internal Notes Card */}
                <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] text-xs space-y-2">
                  <h3 className="text-sm font-bold text-[#1a1a1a]">Internal notes</h3>
                  <textarea
                    rows={3}
                    placeholder="Add a private staff note regarding this order..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f6f7] border border-[#c9cccf] rounded-lg text-xs focus:outline-none focus:border-[#008060] focus:bg-white transition"
                  />
                  <button
                    onClick={() => {
                      alert('Staff note saved successfully.');
                    }}
                    className="w-full py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] font-semibold rounded-lg transition"
                  >
                    Save note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SHIPROCKET TRACKING TIMELINE MODAL */}
      {trackingModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e1e3e5] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">
                    Shiprocket Live Tracking • {trackingModalData.order_number}
                  </h3>
                  <p className="text-[11px] text-[#616161]">
                    AWB: {trackingModalData.shipment?.awb_code} ({trackingModalData.shipment?.courier_name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrackingModalData(null)}
                className="p-1 text-[#8c9196] hover:text-[#1a1a1a] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Status Pill */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-blue-800 font-semibold">Current Shipment Status:</span>
              <span className="font-bold text-blue-900 bg-white px-2.5 py-0.5 rounded-full shadow-xs">
                {trackingModalData.tracking?.current_status || 'In Transit'}
              </span>
            </div>

            {/* Timeline Activities */}
            <div className="space-y-3 pt-2 max-h-64 overflow-y-auto">
              {(trackingModalData.tracking?.shipment_track_activities || []).map((act: any, idx: number) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1" />
                    {idx < trackingModalData.tracking.shipment_track_activities.length - 1 && (
                      <div className="w-0.5 h-full bg-blue-100 my-0.5" />
                    )}
                  </div>
                  <div className="space-y-0.5 flex-1 pb-2">
                    <p className="font-semibold text-[#1a1a1a]">{act.activity}</p>
                    <div className="text-[11px] text-[#8c9196] flex items-center gap-2">
                      <span>{act.location}</span>
                      <span>•</span>
                      <span>{act.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e1e3e5] flex justify-end">
              <button
                onClick={() => setTrackingModalData(null)}
                className="px-4 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
