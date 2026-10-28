'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LazySectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'section' | 'div' | 'article' | 'footer' | 'nav';
  rootMargin?: string;
  threshold?: number;
  className?: string;
  id?: string;
  /** When true, renders immediately without waiting for scroll into view */
  priority?: boolean;
}

export function LazySection({
  children,
  as: Component = 'section',
  rootMargin = '140px 0px',
  threshold = 0.05,
  className = '',
  id,
  priority = false,
  ...rest
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(priority);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (priority || isVisible) return;

    const el = sectionRef.current;
    if (!el) return;

    // Graceful fallback if IntersectionObserver is unavailable in legacy environments
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [priority, isVisible, rootMargin, threshold]);

  return (
    <Component
      ref={sectionRef as any}
      id={id}
      className={`homzy-lazy-section ${isVisible ? 'is-visible' : 'is-loading'} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}
