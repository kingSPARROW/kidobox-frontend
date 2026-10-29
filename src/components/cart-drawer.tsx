'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { money } from '@/lib/kidobox-data';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, itemCount, discountCode, setDiscountCode } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#10223966] backdrop-blur-[3px] transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col font-['Nunito',sans-serif]">
          {/* Header */}
          <div className="p-5 border-b border-[#edf0f4] bg-[#fef2f2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#ff268b] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-['Fredoka',sans-serif] text-xl font-semibold text-[#122e50]">
                  Your Shopping Bag
                </h2>
                <span className="text-[11px] font-bold text-[#637389]">{itemCount} little treasures</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#637389] hover:text-[#ff268b] rounded-full transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery progress */}
          <div className="px-5 py-3 bg-[#fdf8fa] border-b border-[#edf0f4] text-xs font-bold text-[#637389]">
            {isFreeShipping ? (
              <span className="text-[#28b08b] inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Yay! Your order qualifies for Free Delivery!
              </span>
            ) : (
              <span>Add {money(freeShippingThreshold - subtotal)} more for <b>Free Delivery</b>!</span>
            )}
            <div className="w-full bg-[#fee2e2] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#ff268b] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-[#fef2f2] text-[#ff268b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-7 h-7 text-[#ff268b]" />
                </div>
                <h3 className="font-['Fredoka',sans-serif] text-xl font-semibold text-[#122e50]">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#637389] mt-2 max-w-xs mx-auto leading-relaxed">
                  Discover thoughtfully chosen baby essentials for life’s sweetest moments.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#ff268b] hover:bg-[#960101] text-white rounded-full text-xs font-extrabold transition shadow-md"
                >
                  Explore Little Essentials →
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variant_id}
                  className="flex gap-3.5 p-3 rounded-xl border border-[#edf0f4] bg-white hover:border-[#fecaca] transition"
                >
                  <img
                    src={item.image_url || '/assets/hd/clothing.webp'}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded-lg bg-[#faf7f3] p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-[#122e50] truncate">{item.title}</h4>
                    {item.variant_title && (
                      <p className="text-[10px] text-[#637389] mt-0.5 truncate">{item.variant_title}</p>
                    )}
                    <div className="text-xs font-black text-[#122e50] mt-1.5">{money(item.price)}</div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#edf0f4] rounded-lg overflow-hidden h-6 bg-[#f8fafc]">
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="px-2 text-xs font-bold hover:bg-[#fee2e2] text-[#122e50] h-full flex items-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-black min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          className="px-2 text-xs font-bold hover:bg-[#fee2e2] text-[#122e50] h-full flex items-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.variant_id)}
                        className="text-[#9aa4ad] hover:text-[#ff268b] p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#edf0f4] bg-[#fcfdff] space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#637389]">
                <span>Subtotal</span>
                <span className="font-black text-sm text-[#122e50]">{money(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-[#637389]">
                <span>Estimated Delivery</span>
                <span className={`font-black ${isFreeShipping ? 'text-[#28b08b]' : 'text-[#122e50]'}`}>
                  {isFreeShipping ? 'FREE' : money(79)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#edf0f4] flex justify-between items-center">
                <span className="font-['Fredoka',sans-serif] text-base font-semibold text-[#122e50]">
                  Total
                </span>
                <span className="font-['Fredoka',sans-serif] text-xl font-bold text-[#122e50]">
                  {money(subtotal + (isFreeShipping ? 0 : 79))}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-center border border-[#ff268b] text-[#ff268b] rounded-full text-xs font-black hover:bg-[#fef2f2] transition"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-center bg-[#ff268b] hover:bg-[#960101] text-white rounded-full text-xs font-black flex items-center justify-center gap-1 shadow-md hover:shadow-lg transition"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
