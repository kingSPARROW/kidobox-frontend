import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: '1–2 Years · Active Toddlers | KIDOBOX',
  description: 'Made for busy little hands, curious minds, and those very first adventures.',
};

export default function AgeToddlerPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialAge="1-2"
        title="1–2 Years · Active Toddlers"
        description="Made for busy little hands, curious minds, and those very first adventures."
        heroImage="toddler"
        heroColor="yellow-bg"
        breadcrumbTitle="1–2 Years"
      />
    </Suspense>
  );
}
