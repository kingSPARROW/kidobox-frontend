import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Diapering | KIDOBOX',
  description: 'Gentle everyday essentials that make changing time a little easier.',
};

export default function DiaperingPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="diapering"
        title="Diapering"
        description="Gentle everyday essentials that make changing time a little easier."
        heroImage="wipes"
        heroColor="blue-bg"
        breadcrumbTitle="Diapering"
      />
    </Suspense>
  );
}
