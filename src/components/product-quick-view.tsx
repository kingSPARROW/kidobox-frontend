'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Info, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { money, type Product } from '@/lib/kidobox-data';
import { cartItem, mediaUrl } from '@/lib/storefront';
import { useCart } from '@/lib/cart-context';

export function ProductQuickView({ product }: { product: Product }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState(product.variantId);
  const variants = product.variants ?? [];
  const variant = variants.find(option => option.id === variantId);
  const images = product.images?.length ? product.images : [product.image];
  const activeImage = images[imageIndex] ?? images[0];
  const item = cartItem(product, variantId);
  const price = variant?.price ?? product.price;
  const oldPrice = variant ? (variant.compare_at_price ?? 0) : product.old;

  useLayoutEffect(() => {
    if (open && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="product-info-trigger"
        aria-label={`Quick view ${product.name}`}
        aria-haspopup="dialog"
        onClick={() => {
          setImageIndex(0);
          setVariantId(product.variantId);
          setOpen(true);
        }}
      >
        <Info size={18} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className="product-quick-dialog"
        aria-label={`Quick view for ${product.name}`}
        onClose={() => setOpen(false)}
        onClick={event => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {open && (
          <div className="product-quick-content">
            <button className="product-quick-close" type="button" aria-label="Close quick view" onClick={() => dialog.current?.close()}>
              <X size={22} aria-hidden="true" />
            </button>
            <div className="product-quick-gallery">
              <img className="product-quick-main-image" src={mediaUrl(activeImage)} alt={product.imageAlts?.[imageIndex] || product.name} />
              {images.length > 1 && (
                <div className="product-quick-thumbnails" aria-label="Product photos">
                  {images.map((src, index) => (
                    <button key={index} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}>
                      <img src={mediaUrl(src)} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="product-quick-details">
              <span className="product-quick-kicker">{product.brand || 'KIDOBOX'}</span>
              <h2>{product.name}</h2>
              <div className="product-quick-price">
                <strong>{money(price)}</strong>
                {oldPrice > price && <del>{money(oldPrice)}</del>}
              </div>
              {product.reviews > 0 && <p>{product.rating} ★ · {product.reviews} reviews</p>}
              <p>{product.detail}</p>
              {variants.length > 1 && (
                <label>
                  Option
                  <select value={variantId ?? ''} onChange={event => setVariantId(event.target.value)}>
                    {variants.map(option => <option key={option.id} value={option.id}>{option.title}{option.inventory_quantity < 1 ? ' (sold out)' : ''}</option>)}
                  </select>
                </label>
              )}
              <div className="product-quick-actions">
                <button type="button" disabled={!item} onClick={() => {
                  if (!item) return;
                  dialog.current?.close();
                  addItem(item);
                }}>
                  <ShoppingBag size={17} aria-hidden="true" /> {item ? 'Add to Cart' : 'Sold out'}
                </button>
                <Link href={`/products/${product.slug}`} onClick={() => dialog.current?.close()}>
                  Full product details <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
