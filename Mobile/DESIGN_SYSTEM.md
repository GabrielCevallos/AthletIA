# AthletIA - Sistema de Diseño

Sistema de diseño completo para mantener coherencia visual en toda la aplicación móvil de AthletIA.

## 📁 Estructura de Archivos

```
constants/
  └── theme.ts          # Source of Truth - Paleta, tipografía, espaciado
styles/
  ├── global.ts         # Estilos reutilizables globales
  └── README.md         # Ejemplos de uso y mejores prácticas
```

## 🎨 Paleta de Colores

### Colores Principales
```typescript
import { Colors } from '@/constants/theme';

Colors.primary.DEFAULT      // #00BBDD - Electric Cyan
Colors.primary.light         // #22D3EE - Cyan claro
Colors.primary.dark          // #0EA5E9 - Cyan oscuro
Colors.primary.hover         // #06b6d4 - Estado hover
```

### Fondos
```typescript
Colors.background.DEFAULT    // #0F172A - Deep Navy
Colors.background.secondary  // #1E293B - Dark Charcoal
Colors.background.tertiary   // #2D3748 - Slate 800
Colors.background.input      // #111827 - Inputs
```

### Textos
```typescript
Colors.text.primary          // #F8FAFC - Títulos principales
Colors.text.secondary        // #E2E8F0 - Texto normal
Colors.text.tertiary         // #CBD5E1 - Texto terciario
Colors.text.muted            // #94A3B8 - Texto deshabilitado
```

### Estados
```typescript
Colors.success.DEFAULT       // #10B981 - Verde
Colors.error.DEFAULT         // #EF4444 - Rojo
Colors.warning.DEFAULT       // #F59E0B - Ámbar
Colors.info.DEFAULT          // #3B82F6 - Azul
```

## ✍️ Tipografía

### Estilos Predefinidos
```typescript
import { Typography } from '@/constants/theme';

Typography.styles.h1         // 28px, 800 weight - Títulos de página
Typography.styles.h2         // 24px, 800 weight - Títulos de sección
Typography.styles.h3         // 20px, 800 weight - Subtítulos
Typography.styles.h4         // 18px, 700 weight - Títulos pequeños
Typography.styles.body       // 15px, 400 weight - Texto normal
Typography.styles.bodyBold   // 15px, 600 weight - Texto destacado
Typography.styles.caption    // 14px, 600 weight - Etiquetas
Typography.styles.small      // 12px, 500 weight - Texto pequeño
Typography.styles.tiny       // 10px, 600 weight - Texto muy pequeño
```

### Tamaños y Pesos Individuales
```typescript
Typography.fontSize.xs       // 10
Typography.fontSize.sm       // 12
Typography.fontSize.base     // 14
Typography.fontSize.md       // 15
Typography.fontSize.lg       // 16
Typography.fontSize.xl       // 18
Typography.fontSize['2xl']   // 20
Typography.fontSize['4xl']   // 28

Typography.fontWeight.light      // '300'
Typography.fontWeight.regular    // '400'
Typography.fontWeight.medium     // '500'
Typography.fontWeight.semibold   // '600'
Typography.fontWeight.bold       // '700'
Typography.fontWeight.extrabold  // '800'
```

## 📏 Espaciado

```typescript
import { Spacing } from '@/constants/theme';

Spacing.xs      // 4px
Spacing.sm      // 8px
Spacing.md      // 12px
Spacing.base    // 16px
Spacing.lg      // 20px
Spacing.xl      // 24px
Spacing['2xl']  // 32px
Spacing['3xl']  // 40px
Spacing['4xl']  // 48px
```

## 🔲 Border Radius

```typescript
import { BorderRadius } from '@/constants/theme';

BorderRadius.none    // 0
BorderRadius.sm      // 8
BorderRadius.base    // 12
BorderRadius.md      // 14
BorderRadius.lg      // 16
BorderRadius.xl      // 20
BorderRadius['2xl']  // 24
BorderRadius.full    // 9999
```

## 🌑 Sombras

```typescript
import { Shadows } from '@/constants/theme';

Shadows.sm       // Sombra sutil
Shadows.base     // Sombra estándar
Shadows.md       // Sombra mediana
Shadows.lg       // Sombra grande
Shadows.cyan     // Sombra especial para primary (cyan glow)
```

## 🎯 Uso Recomendado

### Opción 1: Importar Estilos Globales
```typescript
import { GlobalStyles } from '@/styles/global';

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
  },
  title: {
    ...GlobalStyles.h1,
  },
  card: {
    ...GlobalStyles.cardElevated,
  },
});
```

### Opción 2: Importar Constantes del Tema
```typescript
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const styles = StyleSheet.create({
  customCard: {
    backgroundColor: Colors.surface.DEFAULT,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  customTitle: {
    ...Typography.styles.h2,
    color: Colors.primary.DEFAULT,
  },
});
```

### Opción 3: Usar el Objeto Theme Completo
```typescript
import { Theme } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.DEFAULT,
    padding: Theme.spacing.xl,
  },
});
```

## ✅ Mejores Prácticas

### DO ✅
```typescript
// Usar constantes del tema
backgroundColor: Colors.background.DEFAULT,
fontSize: Typography.fontSize.lg,
padding: Spacing.xl,

// Reutilizar estilos globales
...GlobalStyles.h1,
...GlobalStyles.card,

// Combinar estilos
...Typography.styles.body,
color: Colors.primary.DEFAULT,
```

### DON'T ❌
```typescript
// Hardcodear valores
backgroundColor: '#0F172A',  // ❌
fontSize: 16,                // ❌
padding: 24,                 // ❌

// Definir todo manualmente cuando existe un estilo global
fontSize: 28,
fontWeight: '800',
color: '#F8FAFC',           // ❌ Usar ...Typography.styles.h1
```

## 📦 Estilos Globales Disponibles

### Contenedores
- `GlobalStyles.container`
- `GlobalStyles.containerPadded`
- `GlobalStyles.contentContainer`

### Tarjetas
- `GlobalStyles.card`
- `GlobalStyles.cardElevated`
- `GlobalStyles.cardInteractive`

### Textos
- `GlobalStyles.h1`, `h2`, `h3`, `h4`
- `GlobalStyles.body`, `bodyBold`
- `GlobalStyles.caption`, `small`, `tiny`
- `GlobalStyles.textPrimary`, `textSecondary`, `textMuted`

### Layouts
- `GlobalStyles.row`, `rowBetween`, `rowCenter`
- `GlobalStyles.column`, `columnCenter`
- `GlobalStyles.flex1`, `centered`

### Botones
- `GlobalStyles.buttonPrimary`
- `GlobalStyles.buttonSecondary`
- `GlobalStyles.buttonText`, `buttonTextSecondary`

### Inputs
- `GlobalStyles.input`
- `GlobalStyles.inputFocused`
- `GlobalStyles.inputError`

### Badges
- `GlobalStyles.badge`
- `GlobalStyles.badgePrimary`, `badgeSuccess`, `badgeError`, `badgeWarning`
- `GlobalStyles.badgeText`

### Modals
- `GlobalStyles.modalBackdrop`
- `GlobalStyles.modalSheet`
- `GlobalStyles.modalSheetRow`

### Headers y Secciones
- `GlobalStyles.header`, `headerIcon`, `brand`, `heading`, `subheading`
- `GlobalStyles.sectionHeader`, `sectionTitle`, `sectionSubtitle`

### Grids
- `GlobalStyles.grid`
- `GlobalStyles.gridItem2` (2 columnas)
- `GlobalStyles.gridItem3` (3 columnas)

## 🔧 Utilidades

### Agregar Opacidad a Colores
```typescript
import { withOpacity } from '@/constants/theme';

const semiTransparent = withOpacity(Colors.primary.DEFAULT, 0.5);
// Resultado: '#00BBDD80'
```

## 📝 Ejemplo Completo

```typescript
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';

export default function MyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Pantalla</Text>
        <Text style={styles.subtitle}>Subtítulo descriptivo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tarjeta de Ejemplo</Text>
        <Text style={styles.cardDescription}>
          Descripción usando el sistema de diseño.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
  },
  header: {
    ...GlobalStyles.header,
    padding: Spacing.xl,
  },
  title: {
    ...GlobalStyles.h1,
  },
  subtitle: {
    ...GlobalStyles.subheading,
  },
  card: {
    ...GlobalStyles.cardElevated,
    margin: Spacing.xl,
  },
  cardTitle: {
    ...Typography.styles.h3,
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
});
```

## 🎨 Paleta Visual de Referencia

```
PRIMARY CYAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
█ #00BBDD  Electric Cyan (DEFAULT)
█ #22D3EE  Cyan 400 (Light)
█ #0EA5E9  Sky 500 (Dark)
█ #06b6d4  Cyan 500 (Hover)

BACKGROUNDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
█ #0F172A  Deep Navy (DEFAULT)
█ #1E293B  Dark Charcoal (Secondary)
█ #2D3748  Slate 800 (Tertiary)

TEXTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
█ #F8FAFC  Slate 50 (Primary)
█ #E2E8F0  Slate 200 (Secondary)
█ #CBD5E1  Slate 300 (Tertiary)
█ #94A3B8  Slate 400 (Muted)
```

## 📖 Ver Más

Para ejemplos detallados de uso, consulta: `styles/README.md`

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0
