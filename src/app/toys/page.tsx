import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Toys & Play | KIDOBOX',
  description: 'A world of wonder, made for curious little hands and big imaginations.',
};

export default function ToysPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="toys"
        title="Toys & Play"
        description="A world of wonder, made for curious little hands and big imaginations."
        heroImage="toys"
        heroColor="yellow-bg"
        breadcrumbTitle="Toys & Play"
      />
    </Suspense>
  );
}
