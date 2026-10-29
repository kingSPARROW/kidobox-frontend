'use client';

import { useStorefront, mediaUrl } from '@/lib/storefront';
import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { Camera } from 'lucide-react';

export default function CommunityPage() {
  const { content } = useStorefront();
  const moments = (content.instagram || []).map(p => ({ img: p.image, caption: p.title }));

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="community">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Our Little Community</span>
        </nav>

        <div className="page-intro">
          <span className="mini-eyebrow">FAMILY MOMENTS</span>
          <h1>
            <span className="section-icon-wrap"><Camera size={26} /></span> Our Little Community
          </h1>
          <p>Real memories from families enjoying life’s sweetest little moments with KIDOBOX.</p>
        </div>

        <div className="community-mosaic">
          {moments.map((m, i) => (
            <figure key={i}>
              <img src={mediaUrl(m.img)} alt={m.caption} />
              <figcaption>{m.caption}</figcaption>
            </figure>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
