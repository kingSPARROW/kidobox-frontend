import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Loved by Little Ones | KIDOBOX',
  description: 'Our most-loved baby rompers, soft wipes, feeding bowls, and cuddle plush favorites.',
};

export default function BestsellersPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialMode="bestsellers"
        title="Loved by Little Ones"
        description="Our most popular baby essentials, trusted by families across India."
        heroImage="toys"
        heroColor="yellow-bg"
        breadcrumbTitle="Bestsellers"
      />
    </Suspense>
  );
}
