import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type ThemeMode = 'dark' | 'light';
type Language = 'en' | 'ro';

type SettingsState = {
  cameraEnabled: boolean;
  theme: ThemeMode;
  language: Language;
  toggleCamera: () => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(
    () => ({
      cameraEnabled,
      theme,
      language,
      toggleCamera: () => setCameraEnabled((prev) => !prev),
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
      toggleLanguage: () => setLanguage((prev) => (prev === 'en' ? 'ro' : 'en')),
    }),
    [cameraEnabled, theme, language],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
};

