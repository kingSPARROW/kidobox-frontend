import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Shop All Products | KIDOBOX',
  description: 'Explore all baby essentials, clothing, feeding, diapering, toys, and nursery favorites.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading Little Treasures...</div>}>
      <CatalogView
        title="Shop All Products"
        description="Thoughtfully chosen baby essentials for life’s sweetest little moments."
        heroImage="clothing"
        heroColor="pink-bg"
        breadcrumbTitle="All Products"
      />
    </Suspense>
  );
}
