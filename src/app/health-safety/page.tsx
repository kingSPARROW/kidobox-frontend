import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: 'Health & Safety | KIDOBOX',
  description: 'Thoughtful little helpers for a more comfortable everyday routine.',
};

export default function HealthSafetyPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialCategory="health-safety"
        title="Health & Safety"
        description="Thoughtful little helpers for a more comfortable everyday routine."
        heroImage="health"
        heroColor="blue-bg"
        breadcrumbTitle="Health & Safety"
      />
    </Suspense>
  );
}
