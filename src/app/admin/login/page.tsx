'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShoppingBag, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, token, isLoading: isAuthLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated with valid token, redirect directly to admin dashboard
  useEffect(() => {
    if (!isAuthLoading && token && user) {
      router.replace('/admin');
    }
  }, [isAuthLoading, token, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        router.replace('/admin');
      } else {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f9] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#ff268b] via-[#f43f5e] to-[#0284c7] rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">KIDOBOX Admin</h1>
          <p className="text-xs text-[#616161] mt-1">Single-Store Merchant Console • Secure Sign-in</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#fed7e2] p-6 shadow-sm">
          {errorMsg && (
            <div className="mb-4 p-3 bg-[#fff4f2] border border-[#fedad4] text-[#8c1e0b] rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#303030] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#ff268b] focus:ring-1 focus:ring-[#ff268b] transition"
                  placeholder="admin@kidobox.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#303030]">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#ff268b] focus:ring-1 focus:ring-[#ff268b] transition"
                  placeholder="Enter store password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c9196] hover:text-[#1a1a1a] p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-[#ff268b] to-[#0284c7] hover:opacity-95 text-white text-xs font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying password...
                </>
              ) : (
                <>
                  Sign in to Admin
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-[11px] text-[#8c9196] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#008060]" />
          <span>Encrypted Session • Multi-tenant Password Authentication</span>
        </div>
      </div>
    </div>
  );
}
