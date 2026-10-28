'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type GenderTheme = 'boy' | 'girl';

interface ThemeContextType {
  gender: GenderTheme | null;
  setGender: (theme: GenderTheme) => void;
  openThemeModal: () => void;
  closeThemeModal: () => void;
  isModalOpen: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  gender: null,
  setGender: () => {},
  openThemeModal: () => {},
  closeThemeModal: () => {},
  isModalOpen: false,
});

export const GENDER_THEME_KEY = 'kidobox_gender_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [gender, setGenderState] = useState<GenderTheme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(GENDER_THEME_KEY) as GenderTheme | null;
      if (saved === 'boy' || saved === 'girl') {
        setGenderState(saved);
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch (e) {}
  }, []);

  const setGender = (newTheme: GenderTheme) => {
    setGenderState(newTheme);
    try {
      localStorage.setItem(GENDER_THEME_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      window.dispatchEvent(new CustomEvent('gender-theme-changed', { detail: newTheme }));
    } catch (e) {}
    setIsModalOpen(false);
  };

  const openThemeModal = () => setIsModalOpen(true);
  const closeThemeModal = () => setIsModalOpen(false);

  return (
    <ThemeContext.Provider
      value={{
        gender,
        setGender,
        openThemeModal,
        closeThemeModal,
        isModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useGenderTheme() {
  return useContext(ThemeContext);
}
