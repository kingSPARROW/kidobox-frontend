import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Little Prices. Big Smiles. | KIDOBOX',
  description: 'A little more joy, for a little less. Explore our special baby essentials offers.',
};

export default function OffersPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialMode="offers"
        title="Little Prices. Big Smiles."
        description="A little more joy, for a little less. Explore our special baby and toddler offers."
        heroImage="toys"
        heroColor="yellow-bg"
        breadcrumbTitle="Special Offers"
      />
    </Suspense>
  );
}
