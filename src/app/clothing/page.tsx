import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Baby Clothing | KIDOBOX',
  description: 'Soft little outfits for cuddles, first steps, and everything in between.',
};

export default function ClothingPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="clothing"
        title="Baby Clothing"
        description="Soft little outfits for cuddles, first steps, and everything in between."
        heroImage="clothing"
        heroColor="pink-bg"
        breadcrumbTitle="Baby Clothing"
      />
    </Suspense>
  );
}
