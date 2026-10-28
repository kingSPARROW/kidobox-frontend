'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ThemesPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/banners');
  }, [router]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
