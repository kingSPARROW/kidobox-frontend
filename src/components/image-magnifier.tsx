'use client';

import React, { useState, useRef, MouseEvent } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  zoomLevel?: number;
  tag?: string;
  isNew?: boolean;
  onEnlargeClick?: () => void;
}

export function ImageMagnifier({
  src,
  alt,
  zoomLevel = 2.5,
  tag,
  isNew,
  onEnlargeClick,
}: ImageMagnifierProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ left: 0, top: 0 });
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Dimensions for lens and preview
  const LENS_WIDTH = 160;
  const LENS_HEIGHT = 160;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Calculate lens position within image bounds
    let left = clientX - LENS_WIDTH / 2;
    let top = clientY - LENS_HEIGHT / 2;

    const maxLeft = rect.width - LENS_WIDTH;
    const maxTop = rect.height - LENS_HEIGHT;

    // Clamp
    left = Math.max(0, Math.min(left, maxLeft));
    top = Math.max(0, Math.min(top, maxTop));

    setLensPosition({ left, top });

    // Calculate percentage for background zoom preview
    const xPercent = (left / maxLeft) * 100;
    const yPercent = (top / maxTop) * 100;

    setBgPosition({ x: xPercent, y: yPercent });
  };

  return (
    <div className="magnifier-wrapper" style={{ position: 'relative' }}>
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="main-product-image magnifier-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          cursor: isHovered ? 'crosshair' : 'zoom-in',
          overflow: 'hidden',
          borderRadius: '18px',
          background: '#faf7f3',
        }}
      >
        {tag && (
          <span className={`product-tag ${isNew ? 'new-tag' : ''} discount-tag`}>
            {tag}
          </span>
        )}

        <img
          id="detail-photo"
          src={src}
          width={1300}
          height={1300}
          alt={alt}
          fetchPriority="high"
          style={{
            display: 'block',
            width: '100%',
            aspectRatio: '1',
            objectFit: 'contain',
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Amazon-style Magnifier Lens */}
        {isHovered && (
          <div
            className="magnifier-lens"
            style={{
              position: 'absolute',
              left: `${lensPosition.left}px`,
              top: `${lensPosition.top}px`,
              width: `${LENS_WIDTH}px`,
              height: `${LENS_HEIGHT}px`,
              background: 'rgba(255, 38, 139, 0.12)',
              border: '2px solid rgba(255, 38, 139, 0.7)',
              borderRadius: '10px',
              pointerEvents: 'none',
              boxShadow: '0 4px 16px rgba(18, 46, 80, 0.15)',
              zIndex: 10,
            }}
          />
        )}

        {/* Modal Enlarge Button */}
        {onEnlargeClick && (
          <button
            type="button"
            className="image-zoom glow-btn"
            aria-label="Enlarge product image modal"
            onClick={(e) => {
              e.stopPropagation();
              onEnlargeClick();
            }}
          >
            ⊕
          </button>
        )}
      </div>

      {/* Amazon-style Zoom Preview Flyout Window */}
      {isHovered && (
        <aside
          className="magnifier-flyout-preview"
          aria-label="Zoomed Product View"
          style={{
            position: 'absolute',
            left: 'calc(100% + 24px)',
            top: 0,
            width: '540px',
            height: '540px',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
            backgroundSize: `${zoomLevel * 100}%`,
            borderRadius: '20px',
            border: '3px solid #ffffff',
            boxShadow: '0 25px 70px rgba(18, 46, 80, 0.25), 0 0 0 1px rgba(255, 38, 139, 0.15)',
            zIndex: 60,
            backgroundColor: '#ffffff',
            pointerEvents: 'none',
            animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Zoom Level Indicator Pill */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '16px',
              background: 'rgba(18, 46, 80, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <span>🔍</span>
            <span>{zoomLevel}x HD Magnifier</span>
          </div>
        </aside>
      )}
    </div>
  );
}
