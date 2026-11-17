'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, MessageSquareHeart } from 'lucide-react';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { SeoHead } from '@/components/seo-head';
import { mediaUrl, useStorefront } from '@/lib/storefront';

export default function MomsStoriesPage() {
  const { testimonials, articles, isLoading, isError, refetch } = useStorefront();
  const publishedArticles = articles.filter(article => article.status !== 'draft' && article.is_published !== false);

  return (
    <div className="min-h-screen flex flex-col" data-page="moms-stories">
      <SeoHead title="Mom Stories & Brand Circle | KIDOBOX" description="Explore parent reviews and the latest stories from the KIDOBOX Brand Circle." canonicalUrl="https://kidobox.store/moms-stories" />
      <StoreNav />
      <main id="main-content" className="container inner-main flex-1 moms-stories-page">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Mom Stories & Brand Circle</span></nav>
        <section className="store-page-hero moms-stories-hero">
          <div className="store-page-hero-copy">
            <span className="mini-eyebrow">LITTLE MOMENTS. SHARED TOGETHER.</span>
            <h1>See what Moms Says</h1>
            <p>Parent stories, everyday discoveries and a little inspiration for your family’s next chapter.</p>
            <div className="moms-stories-links"><a href="#parent-reviews"><MessageSquareHeart size={18} /> Read reviews</a><a href="#brand-circle"><BookOpen size={18} /> Explore blogs</a></div>
          </div>
          <img src="/assets/hd/about-family.webp" alt="A family sharing a gentle moment together" width={1000} height={750} />
        </section>
        {isLoading && <p role="status" className="moms-stories-notice">Loading stories and reviews…</p>}
        {isError && <div role="alert" className="moms-stories-notice">We couldn’t load the latest stories. <button type="button" onClick={() => refetch()}>Try again</button></div>}
        <section id="parent-reviews" className="moms-stories-section" aria-labelledby="parent-reviews-heading">
          <span className="mini-eyebrow">PARENT STORIES</span>
          <h2 id="parent-reviews-heading"><MessageSquareHeart size={24} /> Loved by Parents Everywhere</h2>
          <p>Stories and experiences shared with KIDOBOX.</p>
          <div className="moms-reviews-grid">
            {testimonials.map(review => {
              const legacy = review as typeof review & { name?: string; role?: string; verified?: boolean };
              const name = review.author_name || legacy.name || 'Parent';
              const rating = Math.max(0, Math.min(5, Math.round(review.rating || 0)));
              return (
                <article className="moms-review" key={review.id}>
                  <div className="review-stars-row"><span className="stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>{(review.is_verified ?? legacy.verified) && <span className="review-verified-label">Verified</span>}</div>
                  <blockquote>“{review.content}”</blockquote>
                  <div className="moms-review-author">{review.avatar_url && <img src={mediaUrl(review.avatar_url)} alt="" width={52} height={52} loading="lazy" />}<div><strong>{name}</strong><p>{review.location || legacy.role}</p></div></div>
                </article>
              );
            })}
          </div>
          {!isLoading && !isError && !testimonials.length && <p className="moms-stories-notice">Parent reviews will appear here as they’re shared.</p>}
        </section>
        <section id="brand-circle" className="moms-stories-section" aria-labelledby="brand-circle-heading">
          <span className="mini-eyebrow">READ, DISCOVER & CONNECT</span>
          <h2 id="brand-circle-heading"><BookOpen size={24} /> Brand Circle</h2>
          <p>All our latest articles, in one place.</p>
          <div className="blog-grid journal-grid">
            {publishedArticles.map(article => (
              <Link className="blog-card" href={`/guides/${article.slug}`} key={article.slug}>
                <div className="blog-photo"><img src={mediaUrl(article.image)} alt={article.image_alt || article.title} width={1000} height={650} loading="lazy" /><span>{article.category}</span></div>
                <div className="blog-body"><h3>{article.title}</h3><p>{article.excerpt}</p><div className="moms-article-meta"><span>{article.minutes || 5} min read</span><span>Read story <ArrowRight size={16} /></span></div></div>
              </Link>
            ))}
          </div>
          {!isLoading && !isError && !publishedArticles.length && <p className="moms-stories-notice">New Brand Circle articles are coming soon.</p>}
        </section>
      </main>
      <StoreFooter />
    </div>
  );
}
