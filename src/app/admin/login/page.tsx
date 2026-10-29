'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShoppingBag, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@kidobox.com');
  const [password, setPassword] = useState('admin123');
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
    <div className="min-h-screen bg-[#fcf9f9] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#BC0202] via-[#f43f5e] to-[#0284c7] rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">KIDOBOX Admin</h1>
          <p className="text-xs text-[#616161] mt-1">Baby &amp; Toddler Store Management Console</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#fed7e2] p-6 shadow-sm">
          {errorMsg && (
            <div className="mb-4 p-3 bg-[#fff4f2] border border-[#fedad4] text-[#8c1e0b] rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Demo Hint */}
          <div className="mb-5 p-3 bg-[#fdf2f8] rounded-xl text-xs text-[#303030] border border-[#fbcfe8]">
            <div className="flex items-center gap-1.5 font-semibold text-[#9d174d] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BC0202]" />
              Store Admin Credentials:
            </div>
            <div className="font-mono text-[11px] text-[#4b5563] space-y-0.5">
              <div>Email: <span className="text-[#1a1a1a] font-bold">admin@kidobox.com</span></div>
              <div>Pass: <span className="text-[#1a1a1a] font-bold">admin123</span></div>
              <div className="text-[10px] text-[#9ca3af] pt-1">Alias: merchant@homzy.com / password123</div>
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
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#BC0202] focus:ring-1 focus:ring-[#BC0202] transition"
                  placeholder="admin@kidobox.com"
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
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#c9cccf] rounded-lg focus:outline-none focus:border-[#BC0202] focus:ring-1 focus:ring-[#BC0202] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-[#BC0202] to-[#0284c7] hover:opacity-95 text-white text-xs font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
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
          Protected by KIDOBOX Commerce Engine • Single Store Architecture
        </div>
      </div>
    </div>
  );
}
