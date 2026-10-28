'use client';

import React from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { Camera } from 'lucide-react';

export default function CommunityPage() {
  const moments = [
    { img: 'insta1', caption: 'Little smiles and sweet morning cuddles with @kidobox rompers.' },
    { img: 'insta2', caption: 'First mealtime adventure with the pastel silicone bowl & spoon!' },
    { img: 'insta3', caption: 'Dreamy nursery corner set up and ready for baby arrival.' },
    { img: 'insta4', caption: 'Soft towels and giggles after splashing in the evening bath.' },
    { img: 'insta5', caption: 'Curious little explorer with the floppy-eared cuddle bunny.' },
    { img: 'insta6', caption: 'Newborn days: slow mornings, tiny socks, and endless love.' },
  ];

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
              <img src={`/assets/hd/${m.img}.webp`} alt={m.caption} />
              <figcaption>{m.caption}</figcaption>
            </figure>
          ))}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
