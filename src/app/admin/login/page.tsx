'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShoppingBag, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('merchant@homzy.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const ok = await login(email, password);
      if (ok) {
        router.push('/admin');
      } else {
        setErrorMsg('Invalid store credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
            <ShoppingBag className="w-6 h-6 text-[#95bf47]" />
          </div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Log in</h1>
          <p className="text-xs text-[#616161] mt-1">Continue to HOMZY Store Admin</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          {errorMsg && (
            <div className="mb-4 p-3 bg-[#fff4f2] border border-[#fedad4] text-[#8c1e0b] rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Demo Hint */}
          <div className="mb-5 p-3 bg-[#f1f2f4] rounded-lg text-xs text-[#303030] border border-[#e1e3e5]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1a1a1a] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008060]" />
              Store Admin Credentials:
            </div>
            <div className="font-mono text-[11px] text-[#616161]">
              <div>Email: <span className="text-[#1a1a1a] font-bold">merchant@homzy.com</span></div>
              <div>Pass: <span className="text-[#1a1a1a] font-bold">password123</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#303030] mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8c9196] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] transition"
                  placeholder="merchant@homzy.com"
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#303030] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-[11px] text-[#8c9196]">
          Protected by HomZy Commerce Engine • Single Store Architecture
        </div>
      </div>
    </div>
  );
}
