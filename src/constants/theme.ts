import {Platform} from 'react-native';

/**
 * "Kubo Smart Contact" luxury identity — gold on warm charcoal.
 * Adapted from the Claude Design handoff. No gradient/blur native deps:
 * gold is approximated with solid champagne/gold colors + gold borders.
 */
export const colors = {
  // Backgrounds
  background: '#050403',
  backgroundElev: '#0a0908',
  surface: '#16120d',
  surfaceSoft: '#1f1a12',

  // Gold family
  gold: '#d4ad5d',
  goldBright: '#e8c989',
  goldDeep: '#b88a3e',
  champagne: '#f0d9a8',
  ctaText: '#1a140a', // dark ink on gold surfaces

  // Text
  text: '#f5efe0',
  subtle: '#c9c2b0',
  muted: '#8a8470',
  faint: '#56503f',

  // Lines
  border: 'rgba(201,165,90,0.18)',
  borderSoft: 'rgba(245,239,224,0.06)',

  // Status
  success: '#6fd49a',
  danger: '#e08a7a',

  // --- Backwards-compatible aliases (old "emerald" primary -> gold) ---
  emerald: '#d4ad5d',
  emeraldDark: '#b88a3e',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 28,
  pill: 999,
};

export const font = {
  hero: 33,
  title: 22,
  subtitle: 16,
  body: 15,
  small: 13,
};

// Platform serif for the "display" / luxury headings (Cormorant-like feel
// without bundling custom fonts: Android maps 'serif' to Noto Serif).
export const displayFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});
