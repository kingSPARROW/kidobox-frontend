'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'policies'>('pages');

  const pages = [
    { title: 'About Our Artisanal Studio', slug: 'about-us', updated: '2 days ago', status: 'Published' },
    { title: 'Contact & Support', slug: 'contact', updated: 'Yesterday', status: 'Published' },
    { title: 'Frequently Asked Questions (FAQ)', slug: 'faq', updated: '3 weeks ago', status: 'Published' },
  ];

  const policies = [
    { title: 'Refund & Returns Policy', key: 'refund', desc: '30-day return window, reverse pickup terms.' },
    { title: 'Privacy Policy', key: 'privacy', desc: 'Customer data collection and cookie policy.' },
    { title: 'Terms of Service', key: 'terms', desc: 'Governing laws and merchant trade terms.' },
    { title: 'Shipping Policy', key: 'shipping', desc: 'Shiprocket domestic surface delivery SLAs.' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Content</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Manage static storefront pages, blog articles, and legal store policies.
          </p>
        </div>

        <button
          onClick={() => alert('New page editor launched.')}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          Add page
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-[0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-[#e1e3e5] px-4 flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'pages'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Pages
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'policies'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
            }`}
          >
            Store Policies
          </button>
        </div>

        {/* Content Table */}
        {activeTab === 'pages' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7f8] border-b border-[#e1e3e5] text-[#616161] font-medium">
                <tr>
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Handle</th>
                  <th className="py-2.5 px-4">Last modified</th>
                  <th className="py-2.5 px-4">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {pages.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#f9fafb] transition">
                    <td className="py-3 px-4 font-bold text-[#1a1a1a]">
                      <span className="hover:underline cursor-pointer">{p.title}</span>
                    </td>
                    <td className="py-3 px-4 text-[#616161] font-mono">
                      /pages/{p.slug}
                    </td>
                    <td className="py-3 px-4 text-[#616161]">{p.updated}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008060]" />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((pol) => (
                <div key={pol.key} className="p-4 bg-[#f9fafb] rounded-xl border border-[#e1e3e5] space-y-1">
                  <div className="font-bold text-xs text-[#1a1a1a] flex items-center justify-between">
                    <span>{pol.title}</span>
                    <span className="text-[10px] text-[#008060] font-semibold bg-[#e3f1df] px-1.5 py-0.5 rounded">
                      Configured
                    </span>
                  </div>
                  <p className="text-[11px] text-[#616161]">{pol.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
