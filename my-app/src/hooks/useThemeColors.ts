import { useMemo } from 'react';
import { darkColors, lightColors, ColorPalette } from '../../res';
import { useSettings } from '../context/SettingsContext';

export function useThemeColors(): ColorPalette {
  const { theme } = useSettings();
  return useMemo(() => (theme === 'dark' ? darkColors : lightColors), [theme]);
}

