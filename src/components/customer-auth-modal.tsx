'use client';

import React, { useState } from 'react';
import { useCustomerAuth } from '@/lib/customer-auth-context';
import {
  X,
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function CustomerAuthModal() {
  const {
    isAuthModalOpen,
    authModalReason,
    pendingCartItem,
    closeAuthModal,
    login,
    register,
  } = useCustomerAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          closeAuthModal();
        } else {
          setErrorMsg(res.message || 'Invalid email or password.');
        }
      } else {
        const res = await register({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password,
        });
        if (res.success) {
          closeAuthModal();
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoCustomer = async () => {
    setEmail('customer@homzy.com');
    setPassword('password123');
    setIsSubmitting(true);
    setErrorMsg('');
    const res = await login('customer@homzy.com', 'password123');
    setIsSubmitting(false);
    if (res.success) {
      closeAuthModal();
    } else {
      setErrorMsg(res.message || 'Demo login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EAE3DB] overflow-hidden z-10 animate-in zoom-in-95">
        {/* Header Ribbon */}
        <div className="p-6 bg-[#1E1C1A] text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-1.5 text-[#8C827A] hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-[#B85D34] flex items-center justify-center text-white shadow-sm">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#EAE3DB]">
              HOMZY Member Account
            </span>
          </div>

          <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
            {mode === 'login' ? 'Sign In to Your Account' : 'Join the HOMZY Family'}
          </h3>

          {/* Context Notice based on reason */}
          {authModalReason === 'cart' && (
            <div className="mt-3 p-3 bg-[#FAF1E8] border border-[#E8D2C4] rounded-xl text-xs text-[#B85D34] flex items-start gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#B85D34] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1E1C1A]">Login required to add to bag</p>
                <p className="text-[11px] text-[#66615C] mt-0.5">
                  {pendingCartItem?.item?.title
                    ? `"${pendingCartItem.item.title}" will be added to your bag immediately once you sign in.`
                    : 'Customer login is mandatory to reserve stock and add items to your cart.'}
                </p>
              </div>
            </div>
          )}

          {authModalReason === 'checkout' && (
            <div className="mt-3 p-3 bg-[#FAF1E8] border border-[#E8D2C4] rounded-xl text-xs text-[#B85D34] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B85D34] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1E1C1A]">Sign-in required to checkout</p>
                <p className="text-[11px] text-[#66615C] mt-0.5">
                  Login is compulsory to process Razorpay payments and calculate Shiprocket delivery rates.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#EAE3DB] text-xs font-bold text-[#8C827A] bg-[#FAF8F5]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3.5 text-center border-b-2 transition ${
              mode === 'login'
                ? 'border-[#B85D34] text-[#B85D34] bg-white font-bold'
                : 'border-transparent hover:text-[#1E1C1A]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3.5 text-center border-b-2 transition ${
              mode === 'register'
                ? 'border-[#B85D34] text-[#B85D34] bg-white font-bold'
                : 'border-transparent hover:text-[#1E1C1A]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 bg-white">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#1E1C1A] mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Priya"
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#EAE3DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D34]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#1E1C1A] mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Sharma"
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#EAE3DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D34]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1E1C1A] mb-1">
                    Phone (10 digits)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9820012345"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#EAE3DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D34]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#1E1C1A] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#EAE3DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D34]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#1E1C1A] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#EAE3DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D34]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#B85D34] hover:bg-[#9C4A24] text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mode === 'login' ? 'Sign In & Continue' : 'Create Account & Continue'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Sign In Button */}
          <div className="mt-4 pt-4 border-t border-[#EAE3DB] text-center">
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              disabled={isSubmitting}
              className="w-full py-2 bg-[#FAF1E8] hover:bg-[#F3E3D6] text-[#B85D34] text-xs font-bold rounded-xl border border-[#E8D2C4] transition inline-flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B85D34]" />
              1-Click Demo Login (Priya Sharma)
            </button>
            <p className="text-[10px] text-[#8C827A] mt-1">
              Test customer credentials pre-configured for verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
