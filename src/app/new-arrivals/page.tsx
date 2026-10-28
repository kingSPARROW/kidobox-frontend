import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'New Little Arrivals | KIDOBOX',
  description: 'Fresh little additions to our baby care and toddler essentials collection.',
};

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialMode="new"
        title="New Little Arrivals"
        description="Fresh little additions to brighten your everyday routine."
        heroImage="clothing2"
        heroColor="pink-bg"
        breadcrumbTitle="New Arrivals"
      />
    </Suspense>
  );
}
