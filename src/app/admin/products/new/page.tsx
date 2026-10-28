'use client';

import React from 'react';
import ShopifyProductForm from '@/components/admin/shopify-product-form';

export default function NewProductPage() {
  return <ShopifyProductForm isEdit={false} />;
}
