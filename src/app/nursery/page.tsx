import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Nursery | KIDOBOX',
  description: 'Create a cozy little corner for the sweetest beginnings.',
};

export default function NurseryPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="nursery"
        title="Nursery"
        description="Create a cozy little corner for the sweetest beginnings."
        heroImage="nursery"
        heroColor="pink-bg"
        breadcrumbTitle="Nursery"
      />
    </Suspense>
  );
}
