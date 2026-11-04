'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CatalogView } from '@/components/catalog-view';
import { useStorefront } from '@/lib/storefront';
import { SeoHead } from '@/components/seo-head';

export default function DynamicCollectionPage() {
  const { categories } = useStorefront();
  const params = useParams();
  const slug = (params?.slug as string) || 'all';

  const catObj = categories.find((c) => c.slug === slug);
  const title = catObj ? catObj.name : `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection`;
  const desc = catObj ? catObj.description : 'Explore our curated little essentials.';

  const seoTitle = catObj?.seo?.title || title;
  const seoDescription = catObj?.seo?.description || desc;
  const canonicalUrl = catObj?.canonical_url || catObj?.seo?.canonical_url || `https://kidobox.store/collections/${slug}`;
  const metaRobots = catObj?.meta_robots || catObj?.seo?.meta_robots || 'index, follow';
  const headingH1 = catObj?.heading_h1 || title;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": headingH1,
    "description": seoDescription,
    "url": canonicalUrl,
    "image": catObj?.image || "https://kidobox.store/logo.png"
  };

  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading collection...</div>}>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        metaRobots={metaRobots}
        ogImage={catObj?.image}
        ogType="website"
        schemaMarkup={catObj?.schema_markup || defaultSchema}
      />
      <CatalogView
        initialCategory={slug}
        title={headingH1}
        description={desc}
        heroImage={catObj?.image || '/file.svg'}
        heroColor={catObj?.color || 'pink-bg'}
        breadcrumbTitle={title}
      />
    </Suspense>
  );
}
