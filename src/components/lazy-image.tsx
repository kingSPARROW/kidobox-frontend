'use client';

import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  fallbackSrc?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  aspectRatio,
  fallbackSrc = '/assets/logo.svg',
  style,
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => { setHasError(false); setIsLoaded(false); }, [src]);

  const displaySrc = hasError ? fallbackSrc : src;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [displaySrc]);

  return (
    <div
      className={`lazy-img-container ${isLoaded ? 'loaded' : 'loading'}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: aspectRatio || undefined,
        width: '100%',
        ...style,
      }}
    >
      {/* Shimmer skeleton while loading */}
      {!isLoaded && <div className="lazy-img-skeleton" aria-hidden="true" />}

      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setIsLoaded(true);
          }
        }}
        className={`lazy-img ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: (style?.objectFit as any) || 'cover',
        }}
        {...rest}
      />
    </div>
  );
}
