import React from 'react';
import Link from 'next/link';

export function HomzyLogo({ className = '', variant = 'dark' }: { className?: string; variant?: 'dark' | 'light' }) {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-[#1e1c1a]';
  const subColor = isLight ? 'text-[#e5d5cb]' : 'text-[#7a746e]';
  const roofColor = '#b85d34';

  return (
    <Link href="/" className={`inline-flex flex-col items-center group select-none ${className}`}>
      {/* Roof Icon */}
      <svg
        className="w-8 h-4 -mb-0.5 text-[#b85d34] transition-transform duration-200 group-hover:-translate-y-0.5"
        viewBox="0 0 40 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Modern Minimalist Gable Roof with Chimney */}
        <path
          d="M3 16L20 3L37 16"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 7.5V3.5H31V10.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Name */}
      <span className={`text-[23px] font-black tracking-tight leading-none ${textColor} transition-colors group-hover:text-[#b85d34]`}>
        HOMZY
      </span>

      {/* Subscript Tagline */}
      <span className={`text-[7.5px] font-extrabold uppercase tracking-[0.26em] leading-none mt-1 ${subColor}`}>
        HOME MADE EASY
      </span>
    </Link>
  );
}
