import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    primaryContainer: '#e8def8',
    secondary: '#03dac6',
    secondaryContainer: '#b2dfdb',
    tertiary: '#ff6d00',
    tertiaryContainer: '#ffe0b2',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#fefbff',
    error: '#b00020',
    errorContainer: '#fdeaea',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#1d1b20',
    onSecondary: '#000000',
    onSecondaryContainer: '#1d1b20',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#1d1b20',
    onSurface: '#1d1b20',
    onSurfaceVariant: '#49454f',
    onError: '#ffffff',
    onErrorContainer: '#410e0b',
    onBackground: '#1d1b20',
    outline: '#79747e',
    outlineVariant: '#cab6f7',
    inverseSurface: '#322f35',
    inverseOnSurface: '#f5eff7',
    inversePrimary: '#d0bcff',
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: 'rgba(29, 27, 32, 0.12)',
    onSurfaceDisabled: 'rgba(29, 27, 32, 0.38)',
    backdrop: 'rgba(73, 69, 79, 0.4)',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#d0bcff',
    primaryContainer: '#4f378b',
    secondary: '#03dac6',
    secondaryContainer: '#004d40',
    tertiary: '#ffb74d',
    tertiaryContainer: '#e65100',
    surface: '#1d1b20',
    surfaceVariant: '#49454f',
    background: '#121212',
    error: '#cf6679',
    errorContainer: '#93000a',
    onPrimary: '#371e73',
    onPrimaryContainer: '#e8def8',
    onSecondary: '#003731',
    onSecondaryContainer: '#b2dfdb',
    onTertiary: '#3e2723',
    onTertiaryContainer: '#ffe0b2',
    onSurface: '#e6e0e9',
    onSurfaceVariant: '#cab6f7',
    onError: '#690005',
    onErrorContainer: '#fdeaea',
    onBackground: '#e6e0e9',
    outline: '#938f99',
    outlineVariant: '#49454f',
    inverseSurface: '#e6e0e9',
    inverseOnSurface: '#322f35',
    inversePrimary: '#6200ee',
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: 'rgba(230, 224, 233, 0.12)',
    onSurfaceDisabled: 'rgba(230, 224, 233, 0.38)',
    backdrop: 'rgba(73, 69, 79, 0.4)',
  },
};

export const theme = lightTheme; // Default theme

// Therapeutic color palette
export const therapeuticColors = {
  // Calming blues
  serenityBlue: '#87CEEB',
  deepBlue: '#4682B4',
  oceanBlue: '#006994',
  
  // Healing greens
  forestGreen: '#228B22',
  mintGreen: '#98FB98',
  sageGreen: '#9CAF88',
  
  // Warm comfort colors
  sunsetOrange: '#FF7F50',
  warmYellow: '#FFD700',
  peachPink: '#FFCCCB',
  
  // Grounding purples
  lavender: '#E6E6FA',
  amethyst: '#9966CC',
  royalPurple: '#7851A9',
  
  // Neutral tones
  warmGray: '#8D8D8D',
  softBeige: '#F5F5DC',
  cloudWhite: '#F8F8FF',
};

// Typography scale for therapeutic UI
export const typography = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400' as const,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400' as const,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400' as const,
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400' as const,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400' as const,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400' as const,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '500' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};
