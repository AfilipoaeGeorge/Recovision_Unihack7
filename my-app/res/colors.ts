export type ColorPalette = {
  background: string;
  card: string;
  surface: string;
  primary: string;
  primaryMuted: string;
  accent: string;
  danger: string;
  textPrimary: string;
  textSecondary: string;
  inputBackground: string;
  border: string;
};

export const darkColors: ColorPalette = {
  background: '#050E1F',
  card: '#0F1B32',
  surface: '#162540',
  primary: '#6C63FF',
  primaryMuted: 'rgba(108, 99, 255, 0.15)',
  accent: '#4ADE80',
  danger: '#FB7185',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  inputBackground: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(148, 163, 184, 0.3)',
};

export const lightColors: ColorPalette = {
  background: '#F6F8FB',
  card: '#FFFFFF',
  surface: '#EEF2FF',
  primary: '#6C63FF',
  primaryMuted: 'rgba(108, 99, 255, 0.2)',
  accent: '#0F172A',
  danger: '#E11D48',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  inputBackground: '#F1F5F9',
  border: 'rgba(100, 116, 139, 0.3)',
};

// Temporary fallback for legacy imports until every component is theme-aware.
export const colors = darkColors;

