'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Home,
  ShoppingBag,
  Tag,
  FolderTree,
  Boxes,
  Users,
  Percent,
  BarChart3,
  Globe,
  LayoutGrid,
  Settings,
  Search,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Store as StoreIcon,
  BookOpen,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { BrandLoadingScreen } from '@/components/brand-loading-screen';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, isLoading, store, logout, changePassword } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    document.title = 'Kidobox Admin • Management';
  }, []);

  // Auth Guard
  useEffect(() => {
    if (pathname !== '/admin/login' && !isLoading && (!token || !user)) {
      router.replace('/admin/login');
    }
  }, [pathname, isLoading, token, user, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    router.replace('/admin/login');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!currentPassword) {
      setPwError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwSubmitting(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPwSuccess(res.message || 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPwSuccess('');
        }, 1500);
      } else {
        setPwError(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setPwError(err.message || 'Failed to update password.');
    } finally {
      setPwSubmitting(false);
    }
  };

  if (isLoading || (!token || !user)) {
    return (
      <BrandLoadingScreen
        fullScreen={true}
        message="Loading Kidobox Admin..."
        subMessage="AUTHENTICATING"
      />
    );
  }

  // Simplified Navigation Sections (clean, grouped, no confusing sub-indentations)
  const navSections = [
    {
      title: 'Store Operations',
      items: [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '1' },
        { name: 'Products', href: '/admin/products', icon: Tag },
        { name: 'Collections', href: '/admin/collections', icon: FolderTree },
        { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
        { name: 'Customers', href: '/admin/customers', icon: Users },
      ],
    },
    {
      title: 'Content & Marketing',
      items: [
        { name: 'SEO & Meta Tags', href: '/admin/seo', icon: Search },
        { name: 'Hero Banners', href: '/admin/banners', icon: StoreIcon },
        { name: 'Parenting Blog', href: '/admin/guides', icon: BookOpen },
        { name: 'Customer Reviews', href: '/admin/testimonials', icon: MessageSquare },
        { name: 'Theme & Customizer', href: '/admin/themes', icon: LayoutGrid },
      ],
    },
    {
      title: 'Store Settings',
      items: [
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Discounts', href: '/admin/discounts', icon: Percent },
        { name: 'Preferences', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 antialiased">
      {/* 1. TOP HEADER: Clean white modern bar */}
      <header className="h-14 bg-white text-slate-800 px-4 flex items-center justify-between sticky top-0 z-40 select-none border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Left: Mobile Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition md:hidden"
            title="Toggle Menu"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-sky-500 flex items-center justify-center text-white shadow-xs font-bold text-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                {store?.name || 'Kidobox'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" title="Store Live" />
            </div>
          </Link>
        </div>

        {/* Center: Clean Search Bar */}
        <div className="flex-1 max-w-md mx-6 hidden sm:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search products, orders, settings..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
            />
          </div>
        </div>

        {/* Right: View Storefront & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
            title="Open Live Storefront in new tab"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs text-slate-800 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="font-semibold text-slate-900">{user?.name || 'Store Admin'}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@kidobox.com'}</div>
                </div>

                <Link
                  href="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  Store settings
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setPwError('');
                    setPwSuccess('');
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition text-left"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  Change password
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY: CLEAN LIGHT SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between flex-shrink-0 transition-all select-none ${
            sidebarOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="overflow-y-auto flex-1 py-4 px-3 space-y-5">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                          isActive
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && !isActive && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Store Status Pill */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60">
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white text-xs text-slate-600 hover:text-slate-900 transition border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-slate-700">Kidobox Store Online</span>
              </div>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </aside>

        {/* 3. MAIN CONTENT CANVAS */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Change Store Password</h3>
                  <p className="text-[11px] text-slate-500">Update your merchant admin sign-in password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pwError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{pwSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-8 pr-9 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  New Password * (Min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-8 pr-9 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {pwSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <BrandLoadingScreen
        fullScreen={true}
        message="Loading Kidobox Admin..."
        subMessage="AUTHENTICATING"
      />
    );
  }

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </React.Suspense>
  );
}
