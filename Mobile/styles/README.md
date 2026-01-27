/**
 * AthletIA - Guía de Uso del Sistema de Diseño
 * 
 * Este archivo contiene ejemplos de cómo usar correctamente el sistema de diseño
 * para mantener coherencia visual en toda la aplicación.
 */

import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Theme } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';

// ============================================================================
// EJEMPLO 1: Usar colores del tema
// ============================================================================

const Example1Styles = StyleSheet.create({
  // ✅ CORRECTO - Usar constantes del tema
  container: {
    backgroundColor: Colors.background.DEFAULT,
  },
  
  // ❌ INCORRECTO - Hardcodear colores
  // container: {
  //   backgroundColor: '#0F172A',
  // },
});

// ============================================================================
// EJEMPLO 2: Usar tipografía predefinida
// ============================================================================

const Example2Styles = StyleSheet.create({
  // ✅ CORRECTO - Usar estilos de tipografía predefinidos
  title: {
    ...Typography.styles.h1,
  },
  
  // ✅ CORRECTO - Extender con personalización
  titleCustom: {
    ...Typography.styles.h2,
    color: Colors.primary.DEFAULT,
  },
  
  // ❌ INCORRECTO - Definir todo manualmente
  // titleWrong: {
  //   fontSize: 28,
  //   fontWeight: '800',
  //   color: '#F8FAFC',
  // },
});

// ============================================================================
// EJEMPLO 3: Usar espaciado consistente
// ============================================================================

const Example3Styles = StyleSheet.create({
  // ✅ CORRECTO - Usar constantes de espaciado
  content: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  
  // ❌ INCORRECTO - Usar valores arbitrarios
  // content: {
  //   padding: 24,
  //   gap: 20,
  // },
});

// ============================================================================
// EJEMPLO 4: Usar estilos globales
// ============================================================================

// ✅ CORRECTO - Reutilizar estilos globales
const Example4Styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
  },
  card: {
    ...GlobalStyles.cardElevated,
  },
  title: {
    ...GlobalStyles.h2,
  },
});

// ============================================================================
// EJEMPLO 5: Crear componente con el sistema de diseño
// ============================================================================

function ExampleCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Título de Tarjeta</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NUEVO</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>
        Esta es una descripción usando el sistema de diseño.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.styles.h3,
  },
  cardDescription: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  badge: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    ...Typography.styles.tiny,
    color: Colors.background.DEFAULT,
  },
});

// ============================================================================
// EJEMPLO 6: Usar sombras consistentes
// ============================================================================

const Example6Styles = StyleSheet.create({
  // ✅ CORRECTO - Usar sombras predefinidas
  buttonPrimary: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.full,
    padding: Spacing.md,
    ...Shadows.cyan, // Sombra especial para botones primarios
  },
  
  cardSmall: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    ...Shadows.sm, // Sombra sutil
  },
  
  cardLarge: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg, // Sombra prominente
  },
});

// ============================================================================
// EJEMPLO 7: Usar el objeto Theme completo
// ============================================================================

const Example7Styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.DEFAULT,
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.lg,
  },
  text: {
    ...Theme.typography.styles.body,
    color: Theme.colors.text.primary,
  },
});

// ============================================================================
// MEJORES PRÁCTICAS
// ============================================================================

/**
 * 1. SIEMPRE importar desde constants/theme.ts o styles/global.ts
 *    import { Colors, Typography, Spacing } from '@/constants/theme';
 * 
 * 2. NUNCA hardcodear valores de diseño directamente
 *    ❌ color: '#00BBDD'
 *    ✅ color: Colors.primary.DEFAULT
 * 
 * 3. Usar estilos globales cuando sea posible
 *    ✅ ...GlobalStyles.h1
 *    ✅ ...GlobalStyles.card
 * 
 * 4. Para valores personalizados, usar constantes del tema
 *    ✅ padding: Spacing.xl
 *    ✅ fontSize: Typography.fontSize['2xl']
 * 
 * 5. Combinar estilos con spread operator
 *    ✅ ...Typography.styles.h2, color: Colors.primary.DEFAULT
 * 
 * 6. Usar sombras predefinidas para consistencia
 *    ✅ ...Shadows.md
 *    ✅ ...Shadows.cyan (para elementos primary)
 * 
 * 7. Mantener un máximo de 2-3 niveles de jerarquía visual
 *    - Primary: h1, h2
 *    - Secondary: h3, body
 *    - Tertiary: caption, small
 */

// ============================================================================
// PALETA DE COLORES - REFERENCIA RÁPIDA
// ============================================================================

/**
 * COLORES PRINCIPALES:
 * - Colors.primary.DEFAULT      (#00BBDD) - Botones, enlaces, acciones
 * - Colors.primary.light         (#22D3EE) - Estados hover, highlights
 * - Colors.primary.dark          (#0EA5E9) - Variantes oscuras
 * 
 * FONDOS:
 * - Colors.background.DEFAULT    (#0F172A) - Fondo principal
 * - Colors.background.secondary  (#1E293B) - Tarjetas, secciones
 * - Colors.background.input      (#111827) - Inputs, formularios
 * 
 * TEXTOS:
 * - Colors.text.primary          (#F8FAFC) - Títulos principales
 * - Colors.text.secondary        (#E2E8F0) - Texto normal
 * - Colors.text.muted            (#94A3B8) - Texto secundario/deshabilitado
 * 
 * ESTADOS:
 * - Colors.success.DEFAULT       (#10B981) - Éxito, confirmación
 * - Colors.error.DEFAULT         (#EF4444) - Errores, alertas
 * - Colors.warning.DEFAULT       (#F59E0B) - Advertencias
 */

// ============================================================================
// TIPOGRAFÍA - REFERENCIA RÁPIDA
// ============================================================================

/**
 * JERARQUÍA:
 * - h1: 28px, 800 weight - Títulos de página
 * - h2: 24px, 800 weight - Títulos de sección
 * - h3: 20px, 800 weight - Subtítulos
 * - h4: 18px, 700 weight - Títulos pequeños
 * - body: 15px, 400 weight - Texto normal
 * - caption: 14px, 600 weight - Etiquetas, descripciones
 * - small: 12px, 500 weight - Texto muy pequeño
 */

// ============================================================================
// ESPACIADO - REFERENCIA RÁPIDA
// ============================================================================

/**
 * ESCALA:
 * - xs: 4px   - Espacios mínimos
 * - sm: 8px   - Espacios pequeños
 * - md: 12px  - Espacios medianos
 * - base: 16px - Espaciado estándar
 * - lg: 20px  - Espaciado grande
 * - xl: 24px  - Padding de contenedores
 * - 2xl: 32px - Espaciado entre secciones
 * - 3xl: 40px - Espaciado muy grande
 */

export { ExampleCard };
