import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: '0–6 Months · Newborn Care | KIDOBOX',
  description: 'The softest beginnings. Discover little essentials for your very first moments together.',
};

export default function AgeNewbornPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialAge="0-6"
        title="0–6 Months · Newborn Care"
        description="The softest beginnings. Discover little essentials for your very first moments together."
        heroImage="newborn"
        heroColor="yellow-bg"
        breadcrumbTitle="0–6 Months"
      />
    </Suspense>
  );
}
