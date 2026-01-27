/**
 * AthletIA Design System - Source of Truth
 * 
 * Este archivo contiene todas las definiciones de diseño para mantener coherencia
 * visual en toda la aplicación. Basado en los diseños de las pantallas HTML.
 */

import { Platform, TextStyle } from 'react-native';

// ============================================================================
// PALETA DE COLORES
// ============================================================================

export const Colors = {
  // Colores Principales
  primary: {
    DEFAULT: '#00BBDD',      // Electric Cyan - Color principal
    light: '#22D3EE',        // Cyan 400 - Variante clara
    dark: '#0EA5E9',         // Sky 500 - Variante oscura
    hover: '#06b6d4',        // Cyan 500 - Estado hover
  },

  // Fondos
  background: {
    DEFAULT: '#0F172A',      // Deep Navy - Fondo principal
    secondary: '#1E293B',    // Dark Charcoal - Fondo secundario
    tertiary: '#2D3748',     // Slate 800 - Fondo terciario
    input: '#111827',        // Gray 900 - Fondo de inputs
    darker: '#0B1120',       // Sidebar dark - Más oscuro
  },

  // Superficies/Tarjetas
  surface: {
    DEFAULT: '#1E293B',      // Tarjetas principales
    elevated: '#2D3748',     // Tarjetas elevadas
    border: '#334155',       // Slate 700 - Bordes
  },

  // Textos
  text: {
    primary: '#F8FAFC',      // Slate 50 - Texto principal
    secondary: '#E2E8F0',    // Slate 200 - Texto secundario
    tertiary: '#CBD5E1',     // Slate 300 - Texto terciario
    muted: '#94A3B8',        // Slate 400 - Texto deshabilitado
    disabled: '#64748B',     // Slate 500 - Texto muy deshabilitado
  },

  // Bordes
  border: {
    DEFAULT: '#334155',      // Slate 700 - Borde principal
    light: '#475569',        // Slate 600 - Borde claro
    subtle: 'rgba(148, 163, 184, 0.28)', // Borde sutil con opacidad
  },

  // Estados
  success: {
    DEFAULT: '#10B981',      // Green 500
    light: '#34D399',        // Green 400
    dark: '#059669',         // Green 600
  },

  error: {
    DEFAULT: '#EF4444',      // Red 500
    light: '#F87171',        // Red 400
    dark: '#DC2626',         // Red 600
  },

  warning: {
    DEFAULT: '#F59E0B',      // Amber 500
    light: '#FBBF24',        // Amber 400
    dark: '#D97706',         // Amber 600
  },

  info: {
    DEFAULT: '#3B82F6',      // Blue 500
    light: '#60A5FA',        // Blue 400
    dark: '#2563EB',         // Blue 600
  },

  // Acento
  accent: {
    yellow: '#FACC15',       // Yellow 400
    purple: '#A855F7',       // Purple 500
    pink: '#EC4899',         // Pink 500
  },
};

// ============================================================================
// TIPOGRAFÍA
// ============================================================================

export const Typography = {
  // Tamaños de fuente
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
  },

  // Pesos de fuente
  fontWeight: {
    light: '300' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extrabold: '800' as TextStyle['fontWeight'],
  },

  // Alturas de línea
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Estilos predefinidos
  styles: {
    h1: {
      fontSize: 28,
      fontWeight: '800' as TextStyle['fontWeight'],
      color: Colors.text.primary,
      lineHeight: 36,
    },
    h2: {
      fontSize: 24,
      fontWeight: '800' as TextStyle['fontWeight'],
      color: Colors.text.primary,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '800' as TextStyle['fontWeight'],
      color: Colors.text.primary,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: Colors.text.primary,
      lineHeight: 26,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: Colors.text.secondary,
      lineHeight: 22,
    },
    bodyBold: {
      fontSize: 15,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: Colors.text.secondary,
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: Colors.text.muted,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: Colors.text.muted,
      lineHeight: 16,
    },
    tiny: {
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: Colors.text.muted,
      lineHeight: 14,
    },
  },
};

// ============================================================================
// ESPACIADO
// ============================================================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

// ============================================================================
// BORDES Y RADIOS
// ============================================================================

export const BorderRadius = {
  none: 0,
  sm: 8,
  base: 12,
  md: 14,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// ============================================================================
// SOMBRAS
// ============================================================================

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  // Sombra especial para cyan (primary)
  cyan: {
    shadowColor: Colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
};

// ============================================================================
// CONFIGURACIÓN DE FUENTES DEL SISTEMA
// ============================================================================

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Helper para agregar opacidad a colores hexadecimales
 */
export const withOpacity = (hex: string, opacity: number): string => {
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${hex}${alpha}`;
};

/**
 * Tema completo para fácil acceso
 */
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  fonts: Fonts,
};
