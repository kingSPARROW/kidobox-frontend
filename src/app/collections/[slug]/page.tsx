'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CatalogView } from '@/components/catalog-view';
import { categories } from '@/lib/kidobox-data';

export default function DynamicCollectionPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'all';

  const catObj = categories.find((c) => c.slug === slug);
  const title = catObj ? catObj.name : `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection`;
  const desc = catObj ? catObj.description : 'Explore our curated little essentials.';

  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading collection...</div>}>
      <CatalogView
        initialCategory={catObj ? catObj.slug : 'all'}
        title={title}
        description={desc}
        heroImage={catObj?.image || 'clothing'}
        heroColor={catObj?.color || 'pink-bg'}
        breadcrumbTitle={title}
      />
    </Suspense>
  );
}
