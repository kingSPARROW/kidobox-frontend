'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  MoveUp,
  MoveDown,
  ChevronDown,
  ChevronRight,
  Link2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Globe,
  Check,
  Loader2,
  Sparkles,
  Eye,
  Layers,
  Layout,
  CornerDownRight,
  HelpCircle,
  FileText,
} from 'lucide-react';

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

interface MenuItem {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
  children?: MenuItem[];
}

interface MenuData {
  _id?: string;
  id?: string;
  title: string;
  handle: string;
  is_active: boolean;
  items: MenuItem[];
}

interface FooterColumn {
  title: string;
  links: { label: string; url: string }[];
}

interface FooterConfig {
  about_text: string;
  copyright_text: string;
  show_newsletter: boolean;
  newsletter_title: string;
  newsletter_subtitle: string;
  social_links: { platform: string; url: string }[];
  columns: FooterColumn[];
  guarantees: { title: string; desc: string }[];
}

export default function AdminNavigationPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'menus' | 'footer' | 'preview'>('menus');
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch navigation data
  const { data, isLoading } = useQuery({
    queryKey: ['adminNavigation'],
    queryFn: () => fetchApi('/navigation'),
  });

  const [menus, setMenus] = useState<MenuData[]>([]);
  const [footer, setFooter] = useState<FooterConfig>({
    about_text: '',
    copyright_text: '',
    show_newsletter: true,
    newsletter_title: '',
    newsletter_subtitle: '',
    social_links: [],
    columns: [],
    guarantees: [],
  });

  // Sync state from query
  useEffect(() => {
    if (data?.success) {
      if (data.menus && data.menus.length > 0) {
        setMenus(data.menus);
      }
      if (data.footer) {
        setFooter(data.footer);
      }
    }
  }, [data]);

  // Mutations
  const saveMenuMutation = useMutation({
    mutationFn: (menu: MenuData) =>
      fetchApi('/navigation/menus', {
        method: 'POST',
        body: JSON.stringify({
          id: menu._id || menu.id,
          title: menu.title,
          handle: menu.handle,
          items: menu.items,
          is_active: menu.is_active,
        }),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminNavigation'] });
      setSaveSuccessMsg(res.message || 'Menu saved successfully.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to save menu.');
      setTimeout(() => setErrorMsg(''), 5000);
    },
  });

  const saveFooterMutation = useMutation({
    mutationFn: (footerConfig: FooterConfig) =>
      fetchApi('/navigation/footer', {
        method: 'POST',
        body: JSON.stringify(footerConfig),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminNavigation'] });
      setSaveSuccessMsg(res.message || 'Footer settings updated.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to save footer settings.');
      setTimeout(() => setErrorMsg(''), 5000);
    },
  });

  const currentMenu = menus[selectedMenuIdx];

  // Helper to add menu item
  const handleAddMenuItem = (parentId?: string) => {
    if (!currentMenu) return;

    const newItem: MenuItem = {
      id: 'item_' + Math.random().toString(36).substr(2, 9),
      label: 'New Link',
      url: '/products',
      target: '_self',
    };

    setMenus((prev) => {
      const updated = [...prev];
      const menu = { ...updated[selectedMenuIdx] };

      if (!parentId) {
        menu.items = [...menu.items, newItem];
      } else {
        menu.items = menu.items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem],
            };
          }
          return item;
        });
      }

      updated[selectedMenuIdx] = menu;
      return updated;
    });
  };

  // Helper to remove menu item
  const handleRemoveMenuItem = (itemId: string, parentId?: string) => {
    if (!currentMenu) return;

    setMenus((prev) => {
      const updated = [...prev];
      const menu = { ...updated[selectedMenuIdx] };

      if (!parentId) {
        menu.items = menu.items.filter((i) => i.id !== itemId);
      } else {
        menu.items = menu.items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: (item.children || []).filter((c) => c.id !== itemId),
            };
          }
          return item;
        });
      }

      updated[selectedMenuIdx] = menu;
      return updated;
    });
  };

  // Helper to update item field
  const handleUpdateMenuItem = (itemId: string, field: string, value: any, parentId?: string) => {
    if (!currentMenu) return;

    setMenus((prev) => {
      const updated = [...prev];
      const menu = { ...updated[selectedMenuIdx] };

      if (!parentId) {
        menu.items = menu.items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i));
      } else {
        menu.items = menu.items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: (item.children || []).map((c) => (c.id === itemId ? { ...c, [field]: value } : c)),
            };
          }
          return item;
        });
      }

      updated[selectedMenuIdx] = menu;
      return updated;
    });
  };

  // Reorder items
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!currentMenu) return;

    setMenus((prev) => {
      const updated = [...prev];
      const menu = { ...updated[selectedMenuIdx] };
      const items = [...menu.items];

      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return prev;

      const [moved] = items.splice(index, 1);
      items.splice(targetIdx, 0, moved);

      menu.items = items;
      updated[selectedMenuIdx] = menu;
      return updated;
    });
  };

  // Create new menu
  const handleCreateNewMenu = () => {
    const title = prompt('Enter Menu Title (e.g. Quick Links):', 'Secondary Menu');
    if (!title) return;
    const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newMenu: MenuData = {
      title,
      handle,
      is_active: true,
      items: [
        { id: 'item_1', label: 'All Products', url: '/products', target: '_self' },
        { id: 'item_2', label: 'Collections', url: '/collections', target: '_self' },
      ],
    };

    setMenus((prev) => [...prev, newMenu]);
    setSelectedMenuIdx(menus.length);
  };

  // Quick link suggestions
  const linkPresets = [
    { label: 'Home Page', url: '/' },
    { label: 'All Products Catalog', url: '/products' },
    { label: 'Curated Collections', url: '/collections' },
    { label: 'Plant Care & Garden', url: '/collections/plant-care' },
    { label: 'Home Organizer', url: '/collections/home-organizer' },
    { label: 'Decor & Planters', url: '/collections/decor-items' },
    { label: 'Baby Care Essentials', url: '/collections/baby-care' },
    { label: 'Order Tracking (Shiprocket)', url: '/tracking' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e5] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Navigation</h1>
            <span className="text-[11px] font-semibold text-[#008060] bg-[#e3f1df] px-2 py-0.5 rounded-full border border-[#aee9d1]">
              Live Storefront
            </span>
          </div>
          <p className="text-xs text-[#616161] mt-0.5">
            Customize header menus, dropdown hierarchies, and dynamic multi-column footer layouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 bg-white hover:bg-[#f7f7f8] text-[#303030] text-xs font-semibold rounded-lg border border-[#c9cccf] transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#616161]" />
            Preview Store
            <ExternalLink className="w-3 h-3 text-[#8c9196]" />
          </Link>

          {activeTab === 'menus' && currentMenu && (
            <button
              onClick={() => saveMenuMutation.mutate(currentMenu)}
              disabled={saveMenuMutation.isPending}
              className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saveMenuMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Menu
                </>
              )}
            </button>
          )}

          {activeTab === 'footer' && (
            <button
              onClick={() => saveFooterMutation.mutate(footer)}
              disabled={saveFooterMutation.isPending}
              className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saveFooterMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Footer
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Mode Tabs */}
      <div className="flex border-b border-[#e1e3e5] gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('menus')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'menus'
              ? 'border-[#1a1a1a] text-[#1a1a1a]'
              : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
          }`}
        >
          <MenuIcon className="w-4 h-4" />
          <span>Menus & Header Links</span>
          <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full font-bold">
            {menus.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'footer'
              ? 'border-[#1a1a1a] text-[#1a1a1a]'
              : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Footer Management</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'preview'
              ? 'border-[#1a1a1a] text-[#1a1a1a]'
              : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Visual Preview</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a] mb-2" />
          <p className="text-xs">Loading navigation settings...</p>
        </div>
      ) : activeTab === 'menus' ? (
        /* ================= TAB 1: MENUS ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Menu Selector (Cols 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#616161]">
                  Store Menus
                </h3>
                <button
                  onClick={handleCreateNewMenu}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add menu
                </button>
              </div>

              <div className="space-y-1.5">
                {menus.map((m, idx) => {
                  const isSelected = selectedMenuIdx === idx;
                  return (
                    <button
                      key={m.handle || idx}
                      onClick={() => setSelectedMenuIdx(idx)}
                      className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#f1f2f4] text-[#1a1a1a] border border-[#c9cccf]'
                          : 'text-[#4a4a4a] hover:bg-[#f7f7f8] border border-transparent'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{m.title}</span>
                          {m.handle === 'main-menu' && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-mono">
                              Header
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#616161] font-mono mt-0.5">
                          handle: {m.handle} • {m.items.length} items
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#1a1a1a]' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Link helper card */}
            <div className="bg-[#f7f7f8] rounded-xl border border-[#e1e3e5] p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#1a1a1a]">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Quick Route Targets</span>
              </div>
              <p className="text-[11px] text-[#616161]">
                Click any shortcut below to auto-fill target links when editing menu items:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {linkPresets.map((lp, idx) => (
                  <span
                    key={idx}
                    onClick={() => navigator.clipboard.writeText(lp.url)}
                    className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] text-gray-700 hover:border-blue-400 cursor-pointer font-mono"
                    title={`Click to copy: ${lp.url}`}
                  >
                    {lp.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Menu Editor (Cols 8) */}
          <div className="lg:col-span-8 space-y-4">
            {currentMenu ? (
              <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-sm p-6 space-y-6">
                {/* Menu Details */}
                <div className="border-b border-[#e1e3e5] pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#1a1a1a] flex items-center gap-2">
                        <span>{currentMenu.title}</span>
                        {currentMenu.handle === 'main-menu' && (
                          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                            Primary Storefront Header
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-[#616161] mt-0.5">
                        Items configured here display in the store header bar with nested dropdown navigation.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentMenu.is_active}
                          onChange={(e) =>
                            setMenus((prev) => {
                              const updated = [...prev];
                              updated[selectedMenuIdx] = { ...updated[selectedMenuIdx], is_active: e.target.checked };
                              return updated;
                            })
                          }
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Title</label>
                      <input
                        type="text"
                        value={currentMenu.title}
                        onChange={(e) =>
                          setMenus((prev) => {
                            const updated = [...prev];
                            updated[selectedMenuIdx] = { ...updated[selectedMenuIdx], title: e.target.value };
                            return updated;
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#c9cccf] rounded-lg text-xs font-medium focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Handle</label>
                      <input
                        type="text"
                        disabled={currentMenu.handle === 'main-menu'}
                        value={currentMenu.handle}
                        onChange={(e) =>
                          setMenus((prev) => {
                            const updated = [...prev];
                            updated[selectedMenuIdx] = { ...updated[selectedMenuIdx], handle: e.target.value };
                            return updated;
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#c9cccf] rounded-lg text-xs font-mono bg-gray-50 disabled:text-gray-400 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Menu Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Menu Items ({currentMenu.items.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleAddMenuItem()}
                      className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add menu item
                    </button>
                  </div>

                  {currentMenu.items.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-500">No links added to this menu yet.</p>
                      <button
                        onClick={() => handleAddMenuItem()}
                        className="mt-3 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                      >
                        Add First Link
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentMenu.items.map((item, index) => (
                        <div key={item.id} className="border border-[#e1e3e5] rounded-xl p-3 bg-white space-y-3 shadow-xs">
                          {/* Main Row */}
                          <div className="flex items-center gap-3">
                            {/* Reorder Buttons */}
                            <div className="flex flex-col gap-0.5 text-gray-400">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveItem(index, 'up')}
                                className="p-0.5 hover:text-black disabled:opacity-20 cursor-pointer"
                              >
                                <MoveUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={index === currentMenu.items.length - 1}
                                onClick={() => handleMoveItem(index, 'down')}
                                className="p-0.5 hover:text-black disabled:opacity-20 cursor-pointer"
                              >
                                <MoveDown className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Label */}
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Link Label"
                                value={item.label}
                                onChange={(e) => handleUpdateMenuItem(item.id, 'label', e.target.value)}
                                className="w-full px-3 py-1.5 border border-[#c9cccf] rounded-lg text-xs font-bold text-gray-900 focus:ring-1 focus:ring-black outline-none"
                              />
                            </div>

                            {/* URL Target */}
                            <div className="flex-1">
                              <div className="relative">
                                <Link2 className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                                <input
                                  type="text"
                                  placeholder="Link Destination (/products, /collections/...)"
                                  value={item.url}
                                  onChange={(e) => handleUpdateMenuItem(item.id, 'url', e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 border border-[#c9cccf] rounded-lg text-xs font-mono text-gray-700 focus:ring-1 focus:ring-black outline-none"
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAddMenuItem(item.id)}
                                title="Add nested dropdown sub-link"
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <CornerDownRight className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-[11px]">Sublink</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveMenuItem(item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Nested Sub-links / Dropdowns */}
                          {item.children && item.children.length > 0 && (
                            <div className="pl-6 border-l-2 border-blue-200 space-y-2 mt-2 pt-1">
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                Dropdown Sub-links under "{item.label}"
                              </span>
                              {item.children.map((child) => (
                                <div key={child.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                  <CornerDownRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                  <input
                                    type="text"
                                    placeholder="Sublink label"
                                    value={child.label}
                                    onChange={(e) => handleUpdateMenuItem(child.id, 'label', e.target.value, item.id)}
                                    className="w-1/3 px-2.5 py-1 border border-gray-300 rounded text-xs font-semibold bg-white"
                                  />
                                  <input
                                    type="text"
                                    placeholder="URL"
                                    value={child.url}
                                    onChange={(e) => handleUpdateMenuItem(child.id, 'url', e.target.value, item.id)}
                                    className="flex-1 px-2.5 py-1 border border-gray-300 rounded text-xs font-mono bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMenuItem(child.id, item.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : activeTab === 'footer' ? (
        /* ================= TAB 2: FOOTER MANAGEMENT ================= */
        <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a]">Footer Branding & Content</h2>
            <p className="text-xs text-[#616161] mt-0.5">
              Customize the brand statement, navigation link columns, trust badges, and social profiles.
            </p>
          </div>

          {/* Section 1: Brand Bio & Copyright */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Storefront Brand Tagline / Bio
              </label>
              <textarea
                rows={3}
                value={footer.about_text}
                onChange={(e) => setFooter({ ...footer, about_text: e.target.value })}
                placeholder="Brief description appearing under store logo..."
                className="w-full p-3 border border-[#c9cccf] rounded-xl text-xs text-gray-800 leading-relaxed outline-none focus:ring-1 focus:ring-black"
              />
              <p className="text-[11px] text-gray-400 mt-1">Appears in Column 1 of the store footer.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Copyright Notice
              </label>
              <textarea
                rows={3}
                value={footer.copyright_text}
                onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
                placeholder="© 2026 KIDOBOX. Safe & Gentle Baby Essentials. All rights reserved."
                className="w-full p-3 border border-[#c9cccf] rounded-xl text-xs text-gray-800 leading-relaxed outline-none focus:ring-1 focus:ring-black"
              />
              <p className="text-[11px] text-gray-400 mt-1">Bottom bar copyright string.</p>
            </div>
          </div>

          {/* Section 2: Newsletter Box Toggle */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Storefront Newsletter Signup Banner</h4>
                <p className="text-[11px] text-gray-500">Collect visitor emails for marketing and new launch updates.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={footer.show_newsletter}
                  onChange={(e) => setFooter({ ...footer, show_newsletter: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {footer.show_newsletter && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={footer.newsletter_title}
                    onChange={(e) => setFooter({ ...footer, newsletter_title: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={footer.newsletter_subtitle}
                    onChange={(e) => setFooter({ ...footer, newsletter_subtitle: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Footer Link Columns (2 Columns) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Navigation Columns ({footer.columns?.length || 0})
                </h3>
                <p className="text-[11px] text-gray-500">Configure link lists displayed across footer columns.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const title = prompt('Enter Column Title:', 'Help & FAQs');
                  if (!title) return;
                  setFooter({
                    ...footer,
                    columns: [
                      ...(footer.columns || []),
                      {
                        title,
                        links: [
                          { label: 'All Products', url: '/products' },
                          { label: 'Order Tracking', url: '/tracking' },
                        ],
                      },
                    ],
                  });
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg flex items-center gap-1 border border-gray-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Column
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(footer.columns || []).map((col, colIdx) => (
                <div key={colIdx} className="p-4 border border-[#e1e3e5] rounded-2xl bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const updatedCols = [...footer.columns];
                        updatedCols[colIdx].title = e.target.value;
                        setFooter({ ...footer, columns: updatedCols });
                      }}
                      className="px-2.5 py-1 text-xs font-bold border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedCols = footer.columns.filter((_, i) => i !== colIdx);
                        setFooter({ ...footer, columns: updatedCols });
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {col.links.map((link, linkIdx) => (
                      <div key={linkIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label}
                          onChange={(e) => {
                            const updatedCols = [...footer.columns];
                            updatedCols[colIdx].links[linkIdx].label = e.target.value;
                            setFooter({ ...footer, columns: updatedCols });
                          }}
                          className="w-1/2 px-2.5 py-1 border border-gray-300 rounded text-xs bg-white"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => {
                            const updatedCols = [...footer.columns];
                            updatedCols[colIdx].links[linkIdx].url = e.target.value;
                            setFooter({ ...footer, columns: updatedCols });
                          }}
                          className="flex-1 px-2.5 py-1 border border-gray-300 rounded text-xs font-mono bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedCols = [...footer.columns];
                            updatedCols[colIdx].links = updatedCols[colIdx].links.filter((_, i) => i !== linkIdx);
                            setFooter({ ...footer, columns: updatedCols });
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedCols = [...footer.columns];
                        updatedCols[colIdx].links.push({ label: 'New Link', url: '/products' });
                        setFooter({ ...footer, columns: updatedCols });
                      }}
                      className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add link to {col.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Social Links */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Social Media Accounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(footer.social_links || []).map((soc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="w-20 text-xs font-bold text-gray-700">{soc.platform}</span>
                  <input
                    type="url"
                    value={soc.url}
                    onChange={(e) => {
                      const updated = [...footer.social_links];
                      updated[idx].url = e.target.value;
                      setFooter({ ...footer, social_links: updated });
                    }}
                    placeholder={`https://${soc.platform.toLowerCase()}.com/yourstore`}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-xs font-mono bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Indian Commerce Guarantees Badges */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Commerce Trust Guarantees (Footer Column 4)
            </h3>
            <div className="space-y-3">
              {(footer.guarantees || []).map((g, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={g.title}
                    onChange={(e) => {
                      const updated = [...footer.guarantees];
                      updated[idx].title = e.target.value;
                      setFooter({ ...footer, guarantees: updated });
                    }}
                    placeholder="Guarantee title"
                    className="w-1/3 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                  />
                  <input
                    type="text"
                    value={g.desc}
                    onChange={(e) => {
                      const updated = [...footer.guarantees];
                      updated[idx].desc = e.target.value;
                      setFooter({ ...footer, guarantees: updated });
                    }}
                    placeholder="Short description"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ================= TAB 3: LIVE PREVIEW ================= */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Live Storefront Header Simulation
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Real-time rendering of your Main Menu links as shoppers will see them.
            </p>

            {/* Header Simulation Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-8">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-[#BC0202] to-[#0284c7] bg-clip-text text-transparent">KIDOBOX</span>
                <nav className="flex items-center gap-6 text-xs font-medium text-gray-600">
                  {currentMenu?.items.map((item) => (
                    <div key={item.id} className="relative group">
                      <Link
                        href={item.url}
                        className="hover:text-blue-600 transition flex items-center gap-1 font-semibold"
                      >
                        {item.label}
                        {item.children && item.children.length > 0 && <ChevronDown className="w-3 h-3 text-gray-400" />}
                      </Link>

                      {item.children && item.children.length > 0 && (
                        <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-2 hidden group-hover:block transition z-50">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.url}
                              className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>[Search]</span>
                <span>[Cart Bag]</span>
              </div>
            </div>
          </div>

          {/* Footer Simulation Box */}
          <div className="bg-slate-950 text-slate-400 rounded-2xl p-8 border border-slate-900 space-y-8">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-400" />
              Live Storefront Footer Simulation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
              {/* Col 1 */}
              <div className="space-y-3">
                <span className="text-base font-bold bg-gradient-to-r from-[#BC0202] to-[#0284c7] bg-clip-text text-transparent">KIDOBOX</span>
                <p className="text-xs leading-relaxed text-slate-400">{footer.about_text}</p>
                <div className="flex items-center gap-3 pt-2 text-white">
                  <InstagramIcon className="w-4 h-4 cursor-pointer hover:text-pink-400" />
                  <FacebookIcon className="w-4 h-4 cursor-pointer hover:text-blue-400" />
                  <TwitterIcon className="w-4 h-4 cursor-pointer hover:text-sky-400" />
                </div>
              </div>

              {/* Dynamic Columns */}
              {(footer.columns || []).map((col, idx) => (
                <div key={idx}>
                  <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">{col.title}</h4>
                  <ul className="space-y-2 text-xs">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <Link href={link.url} className="hover:text-white transition">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Guarantees */}
              <div>
                <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">
                  Guarantees
                </h4>
                <ul className="space-y-2.5 text-xs">
                  {(footer.guarantees || []).map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200 block">{g.title}</span>
                        <span className="text-[11px] text-slate-500">{g.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-6 text-center text-xs text-slate-500">
              <p>{footer.copyright_text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
