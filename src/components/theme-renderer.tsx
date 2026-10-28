'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Truck, ShieldCheck, RotateCcw, Award, ArrowRight, ShoppingBag, Star } from 'lucide-react';

interface ThemeRendererProps {
  themeConfig: any;
  banners?: any[];
  featuredProducts?: any[];
  collections?: any[];
}

export function ThemeRenderer({ themeConfig, banners = [], featuredProducts = [], collections = [] }: ThemeRendererProps) {
  const { addItem } = useCart();
  const [activeBannerIdx, setActiveBannerIdx] = React.useState(0);
  const sections = themeConfig?.sections || [];

  const activeBanners = banners.filter((b: any) => b.status === 'active');
  const heroBanner = activeBanners.length > 0 ? activeBanners[activeBannerIdx % activeBanners.length] : null;

  const iconMap: Record<string, React.ReactNode> = {
    Truck: <Truck className="w-6 h-6 text-blue-600" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    RotateCcw: <RotateCcw className="w-6 h-6 text-amber-600" />,
    Award: <Award className="w-6 h-6 text-purple-600" />,
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {sections.map((section: any) => {
        if (!section.enabled) return null;

        // 1. HERO BANNER
        if (section.type === 'hero_banner') {
          // Use active database banner if configured, otherwise fallback to theme section
          const desktopImage = heroBanner?.desktop_image_url || section.image_url;
          const mobileImage = heroBanner?.mobile_image_url || heroBanner?.desktop_image_url || section.image_url;
          const titleTag = heroBanner?.title_tag || 'New Season Collection 2026';
          const title = heroBanner?.title || section.title;
          const subtitle = heroBanner?.subtitle || section.subtitle;
          const ctaText = heroBanner?.cta_text || section.cta_text || 'Explore Shop';
          const ctaLink = heroBanner?.cta_link || section.cta_link || '/products';
          const secCtaText = heroBanner?.secondary_cta_text || 'View Collections';
          const secCtaLink = heroBanner?.secondary_cta_link || '/collections';
          const alignment = heroBanner?.text_alignment || 'left';
          const overlayOpacity = heroBanner?.overlay_opacity ?? section.overlay_opacity ?? 0.6;

          return (
            <section key={section.id} className="relative rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8">
              {/* Responsive Desktop View Image */}
              <div
                className="hidden md:block absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${desktopImage})` }}
              />
              {/* Responsive Mobile View Image */}
              <div
                className="block md:hidden absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${mobileImage})` }}
              />

              <div
                className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"
                style={{ opacity: overlayOpacity }}
              />

              <div
                className={`relative max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-36 text-white max-w-2xl ${
                  alignment === 'center'
                    ? 'mx-auto text-center'
                    : alignment === 'right'
                    ? 'ml-auto text-right'
                    : 'mr-auto text-left'
                }`}
              >
                {/* Banner Title Tag Badge */}
                {titleTag && (
                  <span className="inline-block px-3.5 py-1.5 bg-blue-600/30 border border-blue-400/40 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase text-blue-300 mb-6 shadow-sm">
                    {titleTag}
                  </span>
                )}

                <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                  {title}
                </h1>
                <p className="text-sm sm:text-lg text-slate-300 mb-8 font-light leading-relaxed">
                  {subtitle}
                </p>

                <div
                  className={`flex flex-wrap gap-4 ${
                    alignment === 'center'
                      ? 'justify-center'
                      : alignment === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <Link
                    href={ctaLink}
                    className="px-8 py-4 bg-white text-slate-950 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition flex items-center gap-2 group"
                  >
                    {ctaText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>

                  {secCtaText && (
                    <Link
                      href={secCtaLink}
                      className="px-7 py-4 bg-slate-900/60 hover:bg-slate-900/90 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-md transition"
                    >
                      {secCtaText}
                    </Link>
                  )}
                </div>

                {/* Multiple Banners Slide Indicator */}
                {activeBanners.length > 1 && (
                  <div className="flex items-center gap-2 mt-8">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBannerIdx(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === activeBannerIdx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        }

        // 2. VALUE PROPS
        if (section.type === 'value_props') {
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(section.items || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-start gap-4"
                  >
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {iconMap[item.icon] || <Award className="w-6 h-6 text-blue-600" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 3. FEATURED PRODUCTS
        if (section.type === 'featured_products') {
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
                </div>
                <Link
                  href="/products"
                  className="mt-4 sm:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
                >
                  View All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.slice(0, section.limit || 6).map((product: any) => {
                  const defaultVariant = product.variants?.[0];
                  const price = defaultVariant?.price ?? 1999;
                  const compareAtPrice = defaultVariant?.compare_at_price;
                  const hasDiscount = compareAtPrice && compareAtPrice > price;

                  return (
                    <div
                      key={product.id || product._id}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            Save ₹{(compareAtPrice - price).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
                          {product.vendor || 'Artisan'}
                        </span>
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">(4.9)</span>
                          </div>
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition truncate">
                              {product.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-black text-gray-900">
                              ₹{price.toLocaleString('en-IN')}
                            </span>
                            {compareAtPrice && (
                              <span className="text-xs text-gray-400 line-through ml-2">
                                ₹{compareAtPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (defaultVariant) {
                                addItem({
                                  variant_id: defaultVariant.id || defaultVariant._id,
                                  product_id: product.id || product._id,
                                  title: product.title,
                                  variant_title: defaultVariant.title,
                                  sku: defaultVariant.sku,
                                  price: defaultVariant.price,
                                  image_url: defaultVariant.image_url || product.images?.[0],
                                });
                              }
                            }}
                            className="p-2.5 bg-gray-900 hover:bg-blue-600 text-white rounded-xl shadow transition flex items-center gap-1.5 text-xs font-semibold"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // 4. CATEGORY GRID
        if (section.type === 'category_grid') {
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {collections.map((col: any) => (
                  <Link
                    key={col.id || col._id}
                    href={`/products?collection=${col.slug}`}
                    className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition block"
                  >
                    <img
                      src={col.image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl font-bold group-hover:translate-x-1 transition duration-300">
                        {col.title}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-1">{col.description}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 mt-2">
                        Browse Collection <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        // 5. NEWSLETTER
        if (section.type === 'newsletter') {
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-14 text-center text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-xl mx-auto">
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    {section.title}
                  </h2>
                  <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                    {section.subtitle}
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('Thank you for subscribing! Your 10% coupon code: WELCOME10');
                    }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className="px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-80"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-500/30"
                    >
                      {section.button_text || 'Subscribe'}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
