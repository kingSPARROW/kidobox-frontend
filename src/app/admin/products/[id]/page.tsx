'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import ShopifyProductForm, { ProductFormData } from '@/components/admin/shopify-product-form';
import { Loader2 } from 'lucide-react';

function EditProductContent() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminProduct', id],
    queryFn: async () => {
      return fetchApi(`/products/${id}`);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-xs text-[#616161]">
        <Loader2 className="w-6 h-6 animate-spin text-[#008060]" />
        <span>Loading product details...</span>
      </div>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <div className="py-24 text-center text-xs text-[#616161]">
        Product not found or has been removed.
      </div>
    );
  }

  const primaryVariant = product.variants?.[0];

  const initialData: Partial<ProductFormData> = {
    id: product._id || product.id,
    _id: product._id || product.id,
    title: product.title,
    description: product.description || '',
    vendor: product.vendor || 'Aura Studio',
    product_type: product.product_type || 'Furniture',
    status: product.status || 'active',
    images: product.images || [],
    price: primaryVariant?.price ?? 0,
    compare_at_price: primaryVariant?.compare_at_price ?? null,
    cost_per_item: primaryVariant?.cost_per_item ?? null,
    sku: primaryVariant?.sku || '',
    barcode: primaryVariant?.barcode || '',
    inventory_quantity: primaryVariant?.inventory_quantity ?? 10,
    hsn_code: product.hsn_code || '9403',
    tax_rate: product.tax_rate ?? 18,
    has_variants: product.has_variants ?? ((product.variants?.length ?? 0) > 1),
    options: product.options || [],
    variants: product.variants || [],
    tags: product.tags || [],
    collection_ids: product.collection_ids || [],
    seo_title: product.seo_title || product.seo?.title || product.title,
    seo_description: product.seo_description || product.seo?.description || '',
    slug: product.slug || '',
  };

  return <ShopifyProductForm initialData={initialData} isEdit={true} productId={id} />;
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-xs text-[#616161]">
          <Loader2 className="w-6 h-6 animate-spin text-[#008060]" />
          <span>Loading editor...</span>
        </div>
      }
    >
      <EditProductContent />
    </Suspense>
  );
}
