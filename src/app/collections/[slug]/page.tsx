'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CatalogView } from '@/components/catalog-view';
import { useStorefront } from '@/lib/storefront';

export default function DynamicCollectionPage() {
  const { categories } = useStorefront();
  const params = useParams();
  const slug = (params?.slug as string) || 'all';

  const catObj = categories.find((c) => c.slug === slug);
  const title = catObj ? catObj.name : `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection`;
  const desc = catObj ? catObj.description : 'Explore our curated little essentials.';

  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading collection...</div>}>
      <CatalogView
        initialCategory={slug}
        title={title}
        description={desc}
        heroImage={catObj?.image || '/file.svg'}
        heroColor={catObj?.color || 'pink-bg'}
        breadcrumbTitle={title}
      />
    </Suspense>
  );
}
