import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SaltProviderNext, type Mode } from '@salt-ds/core';

import '@salt-ds/core/css/salt-core.css';
import '@salt-ds/theme/css/theme-next.css';
import '@salt-ds/theme/css/theme.css';

type SaltThemeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const SALT_THEME_STORAGE_KEY = 'salt-theme-mode';

const SaltThemeContext = createContext<SaltThemeContextValue | undefined>(undefined);

export const useSaltTheme = (): SaltThemeContextValue => {
  const context = useContext(SaltThemeContext);
  if (!context) {
    throw new Error('useSaltTheme must be used within a SaltThemeProvider');
  }
  return context;
};

type SaltThemeProviderProps = {
  children: ReactNode;
};

export const SaltThemeProviderNext: React.FC<SaltThemeProviderProps> = ({ children }) => {
  // Initialize mode from localStorage or default to 'dark'
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      const storedMode = window.localStorage.getItem(SALT_THEME_STORAGE_KEY) as Mode | null;
      if (storedMode === 'light' || storedMode === 'dark') {
        return storedMode;
      }
    }
    return 'dark';
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SALT_THEME_STORAGE_KEY, mode);
    }
  }, [mode]);

  // Update iOS PWA status bar style and theme-color based on mode
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const isLightMode = mode === 'light';
    const backgroundColor = isLightMode ? '#fafafa' : '#171e26';
    
    // Update apple-mobile-web-app-status-bar-style for iOS PWA
    // 'black' = black text/icons (for light backgrounds)
    // 'black-translucent' = white text/icons, translucent bar (for dark backgrounds)
    // 'default' = white text/icons (for dark backgrounds, non-translucent)
    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarMeta) {
      // Use 'black' for light mode (black text on light bg) and 'black-translucent' for dark mode (white text on dark bg)
      statusBarMeta.setAttribute('content', isLightMode ? 'black' : 'black-translucent');
    }

    // Update main theme-color meta tag (the one without media query)
    // This is the primary one that iOS PWA uses
    const mainThemeColor = document.getElementById('theme-color-main') || 
      document.querySelector('meta[name="theme-color"]:not([media])');
    if (mainThemeColor) {
      mainThemeColor.setAttribute('content', backgroundColor);
    }

    // Also update the media query variants for browser support
    const themeColorDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
    const themeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    
    if (themeColorDark) {
      themeColorDark.setAttribute('content', '#171e26');
    }
    if (themeColorLight) {
      themeColorLight.setAttribute('content', '#fafafa');
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, toggleMode],
  );

  return (
    <SaltThemeContext.Provider value={contextValue}>
      <SaltProviderNext 
        mode={mode} 
        density="touch" 
        accent="teal"
        headingFont="Amplitude"
        actionFont="Amplitude"
      >
        {children}
      </SaltProviderNext>
    </SaltThemeContext.Provider>
  );
};

