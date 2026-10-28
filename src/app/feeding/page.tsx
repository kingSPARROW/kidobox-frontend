import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Feeding | KIDOBOX',
  description: 'Little spoons, happy tummies. Discover thoughtfully chosen mealtime essentials.',
};

export default function FeedingPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="feeding"
        title="Feeding"
        description="Little spoons, happy tummies. Discover thoughtfully chosen mealtime essentials."
        heroImage="feeding"
        heroColor="yellow-bg"
        breadcrumbTitle="Feeding"
      />
    </Suspense>
  );
}
