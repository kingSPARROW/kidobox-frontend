import React, { Suspense } from 'react';
import { CatalogView } from '@/components/catalog-view';

export const metadata = {
  title: '2+ Years · Little Explorers | KIDOBOX',
  description: 'Big imaginations start small. Find playful favorites for their next chapter.',
};

export default function AgeKidsPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading...</div>}>
      <CatalogView
        initialAge="2+"
        title="2+ Years · Little Explorers"
        description="Big imaginations start small. Find playful favorites for their next chapter."
        heroImage="kid"
        heroColor="mint-bg"
        breadcrumbTitle="2+ Years"
      />
    </Suspense>
  );
}
