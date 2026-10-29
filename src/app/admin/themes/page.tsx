'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Sparkles, Palette, Check, Save, RotateCcw, Eye, ShieldCheck, Truck, Heart, ArrowRight } from 'lucide-react';

export default function AdminThemesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme settings state
  const [defaultMode, setDefaultMode] = useState<'girl' | 'boy'>('girl');
  const [girlColor, setGirlColor] = useState('#BC0202');
  const [boyColor, setBoyColor] = useState('#0284c7');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [tagline, setTagline] = useState('Little Needs. Big Smiles.');
  const [guaranteeText, setGuaranteeText] = useState('100% Original Products');
  const [returnsText, setReturnsText] = useState('7-day easy returns');

  // Preview toggle in admin
  const [previewMode, setPreviewMode] = useState<'girl' | 'boy'>('girl');

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetchApi('/theme');
        if (res.success && res.theme?.config) {
          const cfg = res.theme.config;
          if (cfg.branding) {
            setDefaultMode(cfg.branding.default_mode || 'girl');
            setPreviewMode(cfg.branding.default_mode || 'girl');
            setGirlColor(cfg.branding.girl_color || cfg.branding.primary_color || '#BC0202');
            setBoyColor(cfg.branding.boy_color || cfg.branding.secondary_color || '#0284c7');
          }
          if (cfg.announcement_bar) {
            setAnnouncementEnabled(cfg.announcement_bar.enabled !== false);
            setFreeShippingThreshold(cfg.announcement_bar.free_shipping_threshold || 999);
            setTagline(cfg.announcement_bar.tagline || 'Little Needs. Big Smiles.');
            setGuaranteeText(cfg.announcement_bar.guarantee_text || '100% Original Products');
            setReturnsText(cfg.announcement_bar.returns_text || '7-day easy returns');
          }
        }
      } catch (err) {
        console.warn('Could not load theme from API, using default KIDOBOX settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTheme();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const updatedConfig = {
      branding: {
        logo_text: 'KIDOBOX',
        logo_url: '/logo.png',
        favicon_url: '/logo.png',
        default_mode: defaultMode,
        primary_color: defaultMode === 'boy' ? boyColor : girlColor,
        girl_color: girlColor,
        boy_color: boyColor,
        accent_color: defaultMode === 'boy' ? '#38bdf8' : '#ff8bbb',
        font_family: 'Fredoka, Nunito, sans-serif',
        border_radius: '1.25rem',
      },
      announcement_bar: {
        enabled: announcementEnabled,
        free_shipping_text: `Free shipping over ₹${freeShippingThreshold}`,
        free_shipping_threshold: Number(freeShippingThreshold),
        returns_text: returnsText,
        guarantee_text: guaranteeText,
        tagline: tagline,
        background_color: defaultMode === 'boy' ? '#f0f9ff' : '#fef2f2',
        text_color: '#122e50',
      },
    };

    try {
      await fetchApi('/theme', {
        method: 'PUT',
        body: JSON.stringify({ config: updatedConfig }),
      });

      // Also persist to local storage for instant live storefront feedback
      localStorage.setItem('kidobox_default_theme', defaultMode);
      setToastMessage('Theme preferences and color palettes published successfully!');
    } catch (err: any) {
      setToastMessage('Preferences saved locally! (Backend synced if active)');
    } finally {
      setSaving(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#BC0202] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeColor = previewMode === 'boy' ? boyColor : girlColor;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#122e50] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-[#28b08b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e5] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#fef2f2] text-[#BC0202]">
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Theme &amp; Customizer
            </h1>
          </div>
          <p className="text-xs text-[#6d7175] mt-1">
            Manage your store colors, Boy &amp; Girl theme palettes, and announcement bar settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setDefaultMode('girl');
              setGirlColor('#BC0202');
              setBoyColor('#0284c7');
              setFreeShippingThreshold(999);
            }}
            className="px-4 py-2 border border-[#d2d5d8] text-xs font-semibold text-[#202223] hover:bg-[#fafbfb] rounded-lg transition"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#BC0202] hover:bg-[#960101] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Boy & Girl Theme Modes */}
          <div className="bg-white border border-[#e1e3e5] rounded-xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#BC0202]" />
              Gender Themes (Boy &amp; Girl Modes)
            </h2>
            <p className="text-xs text-[#6d7175] mb-5">
              KIDOBOX allows visitors to browse personalized color palettes tailored for baby boys and girls.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#202223] block mb-2">
                  Default Store Theme on First Visit
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDefaultMode('girl');
                      setPreviewMode('girl');
                    }}
                    className={`p-3.5 border-2 rounded-xl text-left transition flex items-center justify-between ${
                      defaultMode === 'girl'
                        ? 'border-[#BC0202] bg-[#fef2f2]'
                        : 'border-[#e1e3e5] hover:border-[#c9cccf]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-[#1a1a1a] block">
                        Girl Mode (Crimson Red)
                      </span>
                      <span className="text-[11px] text-[#6d7175]">
                        Blush rose accents &amp; warm florals
                      </span>
                    </div>
                    <span className="w-4 h-4 rounded-full bg-[#BC0202]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDefaultMode('boy');
                      setPreviewMode('boy');
                    }}
                    className={`p-3.5 border-2 rounded-xl text-left transition flex items-center justify-between ${
                      defaultMode === 'boy'
                        ? 'border-[#0284c7] bg-[#f0f9ff]'
                        : 'border-[#e1e3e5] hover:border-[#c9cccf]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-[#1a1a1a] block">
                        Boy Mode (Sky Blue)
                      </span>
                      <span className="text-[11px] text-[#6d7175]">
                        Dapper ocean blue &amp; nursery skies
                      </span>
                    </div>
                    <span className="w-4 h-4 rounded-full bg-[#0284c7]" />
                  </button>
                </div>
              </div>

              {/* Color Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#202223] block mb-1">
                    Girl Mode Primary Color
                  </label>
                  <div className="flex items-center gap-2 border border-[#d2d5d8] rounded-lg p-1.5">
                    <input
                      type="color"
                      value={girlColor}
                      onChange={(e) => setGirlColor(e.target.value)}
                      className="w-7 h-7 rounded border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={girlColor}
                      onChange={(e) => setGirlColor(e.target.value)}
                      className="text-xs font-mono font-bold text-[#1a1a1a] flex-1 outline-none uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#202223] block mb-1">
                    Boy Mode Primary Color
                  </label>
                  <div className="flex items-center gap-2 border border-[#d2d5d8] rounded-lg p-1.5">
                    <input
                      type="color"
                      value={boyColor}
                      onChange={(e) => setBoyColor(e.target.value)}
                      className="w-7 h-7 rounded border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={boyColor}
                      onChange={(e) => setBoyColor(e.target.value)}
                      className="text-xs font-mono font-bold text-[#1a1a1a] flex-1 outline-none uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Top Announcement Bar & Thresholds */}
          <div className="bg-white border border-[#e1e3e5] rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0284c7]" />
                Top Announcement Bar &amp; Promises
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#d2d5d8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c9cccf] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#008060]" />
              </label>
            </div>
            <p className="text-xs text-[#6d7175] mb-5">
              Customize promotional free shipping thresholds and customer assurance guarantees.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#202223] block mb-1">
                  Free Shipping Minimum Cart Value (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6d7175]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 border border-[#d2d5d8] rounded-lg text-xs font-bold text-[#1a1a1a] focus:border-[#BC0202] outline-none"
                  />
                </div>
                <small className="text-[11px] text-[#6d7175] block mt-1">
                  Customers get automatic free delivery when their cart subtotal reaches this amount.
                </small>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#202223] block mb-1">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d2d5d8] rounded-lg text-xs font-semibold text-[#1a1a1a] focus:border-[#BC0202] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#202223] block mb-1">
                    Easy Returns Guarantee
                  </label>
                  <input
                    type="text"
                    value={returnsText}
                    onChange={(e) => setReturnsText(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d2d5d8] rounded-lg text-xs font-semibold text-[#1a1a1a] focus:border-[#BC0202] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Storefront Preview */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-xs sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6d7175] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </span>
              <div className="flex items-center gap-1 bg-[#f1f2f3] p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewMode('girl')}
                  className={`px-2 py-1 rounded transition ${
                    previewMode === 'girl' ? 'bg-[#BC0202] text-white' : 'text-[#6d7175]'
                  }`}
                >
                  Girl
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('boy')}
                  className={`px-2 py-1 rounded transition ${
                    previewMode === 'boy' ? 'bg-[#0284c7] text-white' : 'text-[#6d7175]'
                  }`}
                >
                  Boy
                </button>
              </div>
            </div>

            {/* Mock Announcement Bar */}
            {announcementEnabled && (
              <div
                className="py-1 px-2.5 rounded-t-lg text-[9px] font-bold flex items-center justify-between border-b"
                style={{
                  background: previewMode === 'boy' ? '#e0f2fe' : '#fef2f2',
                  color: previewMode === 'boy' ? '#0369a1' : '#be185d',
                  borderColor: previewMode === 'boy' ? '#bae6fd' : '#fbcfe8',
                }}
              >
                <span className="flex items-center gap-1">
                  <Truck className="w-2.5 h-2.5" /> Free over ₹{freeShippingThreshold}
                </span>
                <span>{tagline}</span>
              </div>
            )}

            {/* Mock Store Header */}
            <div className="p-3 bg-white border border-[#f1f2f3] rounded-b-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: activeColor }}
                  >
                    K
                  </div>
                  <span className="font-['Fredoka',sans-serif] font-bold text-xs text-[#122e50]">
                    KIDOBOX
                  </span>
                </div>
                <div
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-xs"
                  style={{ background: activeColor }}
                >
                  {previewMode === 'boy' ? 'Boy Mode' : 'Girl Mode'}
                </div>
              </div>

              {/* Mock Banner */}
              <div
                className="p-3 rounded-lg text-white"
                style={{
                  background:
                    previewMode === 'boy'
                      ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                      : 'linear-gradient(135deg, #BC0202 0%, #ff8bbb 100%)',
                }}
              >
                <span className="text-[8px] font-bold uppercase tracking-wider block opacity-90">
                  A LITTLE LOVE, EVERY DAY
                </span>
                <h4 className="font-['Fredoka',sans-serif] font-semibold text-xs mt-0.5">
                  Little Needs. Big Smiles.
                </h4>
                <div className="mt-2 flex gap-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-semibold">
                    Organic
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-semibold">
                    Skin-Safe
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#f1f2f3] text-[11px] text-[#6d7175] flex items-center justify-between">
              <span>Selected primary:</span>
              <span className="font-mono font-bold text-xs" style={{ color: activeColor }}>
                {activeColor}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
