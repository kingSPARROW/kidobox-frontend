'use client';

import React, { useEffect, useState } from 'react';
import { useGenderTheme } from '@/lib/theme-context';

export function GenderThemeModal() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('locked');
    }
  }, []);

  return null;
}

  const handleSelect = (choice: 'boy' | 'girl') => {
    setSelectedPreview(choice);
    // Smooth transition
    setTimeout(() => {
      setGender(choice);
    }, 280);
  };

  return (
    <div
      className="gender-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gender-modal-title"
    >
      <div className="gender-modal-card">
        {/* Close Button if already has gender set */}
        {gender && (
          <button
            type="button"
            className="gender-modal-close"
            onClick={closeThemeModal}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}

        <div className="gender-modal-sparkles" aria-hidden="true">
          <span>✨</span>
          <span>🎈</span>
          <span>🍼</span>
          <span>⭐</span>
        </div>

        <div className="gender-modal-header">
          <span className="gender-badge">Welcome to KIDOBOX</span>
          <h2 id="gender-modal-title">Who are you shopping for?</h2>
          <p>
            Choose your theme to personalize your shopping experience with curated colors and joyful styling!
          </p>
        </div>

        <div className="gender-choice-grid">
          {/* Boy Option */}
          <button
            type="button"
            className={`gender-option boy-option ${selectedPreview === 'boy' ? 'selected' : ''}`}
            onClick={() => handleSelect('boy')}
            aria-label="Select Boy Theme (Sky Blue)"
          >
            <div className="gender-avatar-wrap boy-avatar">
              <span className="gender-emoji">👦</span>
              <span className="gender-sub-icon">🧢</span>
            </div>
            <h3>It’s a Boy!</h3>
            <span className="theme-tag boy-tag">Sky Blue &amp; Ocean</span>
            <p>Dapper blue hues, playful adventure tones &amp; crisp nursery palettes.</p>
            <div className="palette-preview">
              <span style={{ background: '#0284c7' }} />
              <span style={{ background: '#38bdf8' }} />
              <span style={{ background: '#e0f2fe' }} />
              <span style={{ background: '#122e50' }} />
            </div>
            <div className="select-btn-pill boy-btn">
              <span>Select Blue Theme ➔</span>
            </div>
          </button>

          {/* Girl Option */}
          <button
            type="button"
            className={`gender-option girl-option ${selectedPreview === 'girl' ? 'selected' : ''}`}
            onClick={() => handleSelect('girl')}
            aria-label="Select Girl Theme (Sweet Pink)"
          >
            <div className="gender-avatar-wrap girl-avatar">
              <span className="gender-emoji">👧</span>
              <span className="gender-sub-icon">🎀</span>
            </div>
            <h3>It’s a Girl!</h3>
            <span className="theme-tag girl-tag">Rose &amp; Sweet Pink</span>
            <p>Sweet blush tones, delicate pastels &amp; cozy floral nursery colors.</p>
            <div className="palette-preview">
              <span style={{ background: '#ff268b' }} />
              <span style={{ background: '#ff8bbb' }} />
              <span style={{ background: '#fff0f4' }} />
              <span style={{ background: '#122e50' }} />
            </div>
            <div className="select-btn-pill girl-btn">
              <span>Select Pink Theme ➔</span>
            </div>
          </button>
        </div>

        <div className="gender-modal-footer">
          <small>
            💡 You can switch between <strong>Boy</strong> and <strong>Girl</strong> modes anytime from the top bar!
          </small>
          {!gender && (
            <button
              type="button"
              className="skip-theme-btn"
              onClick={() => handleSelect('girl')}
            >
              Default Pink Theme · Explore Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
