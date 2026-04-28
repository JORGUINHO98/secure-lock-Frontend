export const COLORS = {
  primary: '#006AFF',
  primaryLight: '#E6F0FF',
  secondary: '#1A1F36',
  accent: '#06B6D4', // Modern Cyan for accent
  accentLight: '#ECFEFF',
  
  // Backward compatibility
  background: {
    main: '#F8F9FA',
    surface: '#FFFFFF',
  },
  text: {
    main: '#1A1F36',
    secondary: '#64748B',
    white: '#FFFFFF',
    muted: '#94A3B8',
  },

  status: {
    locked: '#FF3B30',
    unlocked: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
  },

  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1A1F36',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    cardShadow: '#000000',
    accent: '#0891B2', // Slightly darker cyan for text contrast in light mode
  },

  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1', // Slate 300 for WCAG 2.1 AA contrast on #1E293B
    border: '#334155',
    cardShadow: '#000000',
    accent: '#22D3EE', // Lighter cyan for dark mode
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  glow: {
    shadowColor: '#006AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  }
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '500' },
  small: { fontSize: 12, fontWeight: '400' },
};
