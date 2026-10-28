import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Bath & Care | KIDOBOX',
  description: 'A little splash, a little care, and a whole lot of happy bath times.',
};

export default function BathCarePage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="bath-care"
        title="Bath & Care"
        description="A little splash, a little care, and a whole lot of happy bath times."
        heroImage="bath"
        heroColor="pink-bg"
        breadcrumbTitle="Bath & Care"
      />
    </Suspense>
  );
}
