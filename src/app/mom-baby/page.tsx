import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Mom & Baby | KIDOBOX',
  description: 'A little comfort for the person who gives so much. Essentials for your new chapter.',
};

export default function MomBabyPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="mom-baby"
        title="Mom & Baby"
        description="A little comfort for the person who gives so much. Essentials for your new chapter."
        heroImage="mom"
        heroColor="pink-bg"
        breadcrumbTitle="Mom & Baby"
      />
    </Suspense>
  );
}
