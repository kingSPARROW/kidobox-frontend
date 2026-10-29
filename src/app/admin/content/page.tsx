'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import type { HomepageContent } from '@/lib/storefront';

const sections = {
  ages: ['slug', 'title', 'subtitle', 'image', 'age', 'color', 'description'],
  articles: ['slug', 'title', 'category', 'image', 'minutes', 'excerpt', 'sections'],
  instagram: ['image', 'title', 'link'],
  benefits: ['title', 'subtitle'],
  hero_promises: ['title', 'subtitle'],
} as const;
const panels = { newborn: ['title', 'description', 'image', 'link', 'cta'], app: ['title', 'description', 'ios_link', 'android_link'], copy: ['announcement', 'instagram_handle', 'instagram_link'] };
const inputClass = 'w-full border border-[#c9cccf] rounded-lg p-2 text-sm';

export default function AdminContentPage() {
  const [draft, setDraft] = useState<HomepageContent | null>(null);
  const query = useQuery({ queryKey: ['adminContent'], queryFn: () => fetchApi('/content') });
  const content: HomepageContent = draft || query.data?.data || {};
  const save = useMutation({ mutationFn: () => fetchApi('/content', { method: 'PUT', body: JSON.stringify({ content }) }), onSuccess: () => { query.refetch(); } });
  const set = (key: string, value: unknown) => setDraft({ ...content, [key]: value });
  if (query.isLoading) return <p role="status">Loading content…</p>;
  if (query.isError) return <p role="alert">Unable to load content. <button onClick={() => query.refetch()}>Retry</button></p>;
  return <div className="space-y-5">
    <h1 className="text-xl font-bold">Storefront content</h1>
    <p className="text-sm text-gray-600">Edit the existing homepage sections below. Products and brands come from Products; categories from Collections; promotions from Banners; offers from Discounts; reviews from Testimonials; menus and footer from Navigation. Empty sections display no content.</p>
    <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="space-y-5">
      {Object.entries(sections).map(([key, fields]) => {
        const rows = (content[key as keyof HomepageContent] || []) as unknown as Record<string, unknown>[];
        return <section className="bg-white border rounded-xl p-5 space-y-4" key={key}>
          <h2 className="font-bold capitalize">{key.replaceAll('_', ' ')}</h2>
          {rows.map((row, index) => <fieldset className="border rounded-lg p-4 space-y-3" key={index}>
            <legend>Item {index + 1}</legend>
            <div className="grid sm:grid-cols-2 gap-3">{fields.map(field => <label className="text-xs capitalize space-y-1" key={field}>{field.replaceAll('_', ' ')}
              {field === 'sections' ? <textarea className={inputClass} rows={6} value={(row.sections as string[][] || []).map(pair => pair.join(' | ')).join('\n')} onChange={e => set(key, rows.map((r, i) => i === index ? { ...r, sections: e.target.value.split('\n').filter(Boolean).map(line => { const [heading, ...body] = line.split(' | '); return [heading, body.join(' | ')]; }) } : r))} placeholder="Heading | Paragraph (one section per line)" /> :
                <input className={inputClass} type={field === 'minutes' ? 'number' : 'text'} min={1} value={String(row[field] ?? '')} onChange={e => set(key, rows.map((r, i) => i === index ? { ...r, [field]: field === 'minutes' ? Number(e.target.value) : e.target.value } : r))} />}
            </label>)}</div>
            <div className="flex gap-4"><button type="button" disabled={index === 0} onClick={() => { const next = [...rows]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; set(key, next); }}>Move up</button><button type="button" className="text-red-700" onClick={() => set(key, rows.filter((_, i) => i !== index))}>Remove</button></div>
          </fieldset>)}
          <button type="button" className="border rounded-lg px-3 py-2" onClick={() => set(key, [...rows, Object.fromEntries(fields.map(f => [f, f === 'sections' ? [] : f === 'minutes' ? 1 : '']))])}>Add item</button>
        </section>;
      })}
      {Object.entries(panels).map(([key, fields]) => <section key={key} className="bg-white border rounded-xl p-5 space-y-3"><h2 className="font-bold capitalize">{key}</h2><div className="grid sm:grid-cols-2 gap-3">{fields.map(field => <label key={field} className="text-xs capitalize">{field.replaceAll('_', ' ')}<input className={inputClass} value={(content[key as 'newborn' | 'app' | 'copy'] || {})[field] || ''} onChange={e => set(key, { ...content[key as 'newborn' | 'app' | 'copy'], [field]: e.target.value })} /></label>)}</div></section>)}
      {save.isError && <p role="alert" className="text-red-700">{save.error.message}</p>}
      {save.isSuccess && <p role="status">Content saved.</p>}
      <button disabled={save.isPending} className="bg-[#1a1a1a] text-white rounded-lg px-5 py-2">{save.isPending ? 'Saving…' : 'Save content'}</button>
    </form>
  </div>;
}
