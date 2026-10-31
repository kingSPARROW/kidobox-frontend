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
  FileText,
  BarChart3,
  Globe,
  LayoutGrid,
  Settings,
  Search,
  Bell,
  HelpCircle,
  ExternalLink,
  LogOut,
  ChevronRight,
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
    document.title = 'KIDOBOX Admin • Little Needs. Big Smiles.';
  }, []);

  // Authentication Guard: If not loading, not authenticated, and not on /admin/login, redirect to /admin/login
  useEffect(() => {
    if (pathname !== '/admin/login' && !isLoading && (!token || !user)) {
      router.replace('/admin/login');
    }
  }, [pathname, isLoading, token, user, router]);

  // Allow login page to render directly without admin sidebar
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
        message="Verifying store admin authentication..."
        subMessage="KIDOBOX ADMIN"
      />
    );
  }


  const mainNavigation = [
    { name: 'Home', href: '/admin', icon: Home },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '1' },
    { name: 'Products', href: '/admin/products', icon: Tag },
    { name: 'Collections', href: '/admin/collections', icon: FolderTree },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Discounts', href: '/admin/discounts', icon: Percent },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const onlineStoreNav = [
    { name: 'Theme & Customizer', href: '/admin/themes' },
    { name: 'Banners & Hero Slides', href: '/admin/banners' },
    { name: 'Parent Reviews', href: '/admin/testimonials' },
    { name: 'Parenting Guides', href: '/admin/guides' },
    { name: 'Navigation', href: '/admin/navigation' },
    { name: 'Preferences (SEO & Store)', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f7] flex flex-col font-sans text-[#1a1a1a] antialiased">
      {/* 1. TOP NAVIGATION BAR (Shopify Dark Bar) */}
      <header className="h-14 bg-[#1a1a1a] text-white px-4 flex items-center justify-between sticky top-0 z-50 select-none border-b border-[#2d2d2d]">
        {/* Left: Hamburger + Store Logo & Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-[#a6a6a6] hover:text-white hover:bg-[#2d2d2d] rounded-md transition md:hidden"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#ff268b] to-[#0284c7] flex items-center justify-center text-white shadow-sm font-bold text-xs">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-[#ffd6e4] transition">
                {store?.name || 'KIDOBOX'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#008060]" title="Store Online & Active" />
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-lg mx-6 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, customers..."
              className="w-full pl-9 pr-14 py-1.5 text-xs bg-[#303030] text-[#e3e3e3] placeholder-[#8c9196] border border-[#424242] rounded-lg focus:outline-none focus:border-[#008060] focus:bg-[#202020] transition"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#8c9196] bg-[#252525] border border-[#3d3d3d] rounded">
                Ctrl K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Notifications, Help, Storefront Link & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#cccccc] hover:text-white hover:bg-[#2d2d2d] rounded-md transition"
            title="Open Live Public Storefront"
          >
            <span>Online Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8c9196]" />
          </Link>

          <button
            className="p-1.5 text-[#cccccc] hover:text-white hover:bg-[#2d2d2d] rounded-md transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#008060] rounded-full" />
          </button>

          <button
            className="p-1.5 text-[#cccccc] hover:text-white hover:bg-[#2d2d2d] rounded-md transition"
            title="Help & Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Admin Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 hover:bg-[#2d2d2d] rounded-lg transition"
            >
              <div className="w-7 h-7 rounded-full bg-[#303030] border border-[#424242] text-[#e3e3e3] font-bold flex items-center justify-center text-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="text-left hidden lg:block leading-none">
                <span className="text-xs font-medium text-white block">{store?.name || 'KIDOBOX'}</span>
                <span className="text-[10px] text-[#8c9196]">Store Owner</span>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e1e3e5] rounded-xl shadow-lg p-2 z-50 text-xs text-[#1a1a1a]">
                <div className="px-3 py-2 border-b border-[#e1e3e5] mb-1">
                  <div className="font-semibold">{user?.name || 'KIDOBOX Manager'}</div>
                  <div className="text-[11px] text-[#616161] truncate">{user?.email || 'admin@kidobox.com'}</div>
                  <div className="mt-1 text-[10px] font-semibold text-[#ff268b] bg-[#fdf2f8] px-1.5 py-0.5 rounded inline-block">
                    KIDOBOX Store Admin
                  </div>
                </div>

                <Link
                  href="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f6f6f7] rounded-lg transition"
                >
                  <Settings className="w-3.5 h-3.5 text-[#616161]" />
                  Store settings
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f6f6f7] rounded-lg transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#616161]" />
                  View storefront
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setPwError('');
                    setPwSuccess('');
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#1a1a1a] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#616161]" />
                  Change password
                </button>

                <div className="border-t border-[#e1e3e5] my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#d72c0d] hover:bg-[#fff4f2] rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY: LEFT SIDEBAR + MAIN CONTENT CANVAS */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside
          className={`w-60 bg-[#ebebeb] border-r border-[#d2d5d8] flex flex-col justify-between flex-shrink-0 transition-all select-none ${
            sidebarOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="overflow-y-auto flex-1 py-3 px-2 space-y-4">
            {/* Main Navigation Items */}
            <nav className="space-y-0.5">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-[#ffffff] text-[#1a1a1a] font-semibold shadow-[0_1px_0_rgba(0,0,0,0.05)] border border-[#d2d5d8]'
                        : 'text-[#303030] hover:bg-[#e0e2e5] hover:text-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#1a1a1a]' : 'text-[#616161]'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#fff4e5] text-[#8a4b08] border border-[#fed3a2] rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sales Channels Header */}
            <div className="pt-2">
              <div className="px-3 pb-1 text-[11px] font-semibold text-[#616161] uppercase tracking-wider flex items-center justify-between">
                <span>Sales channels</span>
                <Link href="/" target="_blank" title="View Storefront" className="hover:text-[#1a1a1a]">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-0.5 mt-1">
                <Link
                  href="/admin/themes"
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    pathname.startsWith('/admin/themes')
                      ? 'bg-[#ffffff] text-[#1a1a1a] font-semibold shadow-[0_1px_0_rgba(0,0,0,0.05)] border border-[#d2d5d8]'
                      : 'text-[#303030] hover:bg-[#e0e2e5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#616161]" />
                    <span>Online Store</span>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    className="p-1 hover:bg-[#d2d5d8] rounded transition text-[#616161] hover:text-[#1a1a1a]"
                    title="View Online Store"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </Link>

                <div className="pl-8 space-y-0.5">
                  {onlineStoreNav.map((sub) => {
                    const isActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`block px-2.5 py-1 rounded-md text-[11px] transition ${
                          isActive
                            ? 'text-[#1a1a1a] font-semibold'
                            : 'text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e0e2e5]'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apps & Integrations Header */}
            <div className="pt-2">
              <div className="px-3 pb-1 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">
                <span>Apps</span>
              </div>
              <Link
                href="/admin/integrations"
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  pathname.startsWith('/admin/integrations')
                    ? 'bg-[#ffffff] text-[#1a1a1a] font-semibold shadow-[0_1px_0_rgba(0,0,0,0.05)] border border-[#d2d5d8]'
                    : 'text-[#303030] hover:bg-[#e0e2e5]'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-[#616161]" />
                <span>Integrations & Apps</span>
              </Link>
            </div>
          </div>

          {/* Bottom Sticky: Settings */}
          <div className="p-2 border-t border-[#d2d5d8] bg-[#ebebeb]">
            <Link
              href="/admin/settings"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                pathname === '/admin/settings'
                  ? 'bg-[#ffffff] text-[#1a1a1a] font-semibold shadow-[0_1px_0_rgba(0,0,0,0.05)] border border-[#d2d5d8]'
                  : 'text-[#303030] hover:bg-[#e0e2e5] hover:text-[#1a1a1a]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#616161]" />
              <span>Settings</span>
            </Link>
          </div>
        </aside>

        {/* 3. MAIN CONTENT CANVAS (Polaris #f6f6f7 Canvas) */}
        <main className="flex-1 overflow-y-auto bg-[#f6f6f7] p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e1e3e5] shadow-2xl max-w-md w-full p-6 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#fdf2f8] flex items-center justify-center text-[#ff268b]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">Change Store Password</h3>
                  <p className="text-[11px] text-[#616161]">Update your merchant admin sign-in password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pwError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div className="p-2.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-600" />
                <span>{pwSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-8 pr-9 py-2 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#ff268b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c9196] hover:text-[#1a1a1a]"
                  >
                    {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">
                  New Password * (Min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full pl-8 pr-9 py-2 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#ff268b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c9196] hover:text-[#1a1a1a]"
                  >
                    {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1a1a1a] mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#ff268b]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e1e3e5]">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  className="px-4 py-1.5 bg-gradient-to-r from-[#ff268b] to-[#0284c7] hover:opacity-95 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
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
        message="Loading store admin console..."
        subMessage="KIDOBOX ADMIN"
      />
    );
  }

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#f6f6f7]" />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </React.Suspense>
  );
}
