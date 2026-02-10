import { useEffect } from 'react';
import { storage } from '#imports';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeSyncOptions = {
  storageKey: string;
  theme: ThemeMode;
  setTheme: (next: ThemeMode) => void;
};

export function useThemeSync({ storageKey, theme, setTheme }: ThemeSyncOptions) {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystem = () => {
      root.setAttribute('data-theme', media.matches ? 'dark' : 'light');
    };
    if (theme === 'system') {
      applySystem();
      media.addEventListener('change', applySystem);
      return () => media.removeEventListener('change', applySystem);
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unwatch = storage.watch<{ theme?: ThemeMode }>(`local:${storageKey}`, (next) => {
      if (next?.theme && next.theme !== theme) {
        setTheme(next.theme);
      }
    });
    return () => unwatch();
  }, [storageKey, theme, setTheme]);
}
