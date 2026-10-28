import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: '6–12 Months · Growth & Exploration | KIDOBOX',
  description: 'New tastes, new discoveries, and so many firsts. Essentials for a growing little explorer.',
};

export default function AgeBabyPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialAge="6-12"
        title="6–12 Months · Growth & Exploration"
        description="New tastes, new discoveries, and so many firsts. Essentials for a growing little explorer."
        heroImage="baby"
        heroColor="blue-bg"
        breadcrumbTitle="6–12 Months"
      />
    </Suspense>
  );
}
