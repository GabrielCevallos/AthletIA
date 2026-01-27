# Sistema de Diseño AthletIA - Resumen Visual

## ✅ Archivos Creados

| Archivo | Propósito | Importar con |
|---------|-----------|--------------|
| `constants/theme.ts` | **Source of Truth** - Paleta, tipografía, espaciado | `import { Colors, Typography, Spacing } from '@/constants/theme'` |
| `styles/global.ts` | Estilos reutilizables comunes | `import { GlobalStyles } from '@/styles/global'` |
| `styles/README.md` | Ejemplos de uso y patrones | Documentación |
| `DESIGN_SYSTEM.md` | Guía completa del sistema | Documentación |

---

## 🎨 Paleta de Colores Extraída

Basada en las 8 pantallas HTML analizadas:

### Colores Principales (Primary)
```
#00BBDD  Electric Cyan (DEFAULT)  ⬤ Color principal de marca
#22D3EE  Cyan 400 (Light)         ⬤ Botones seleccionados, highlights
#0EA5E9  Sky 500 (Dark)           ⬤ Variante oscura
#06b6d4  Cyan 500 (Hover)         ⬤ Estados hover
```

### Fondos (Backgrounds)
```
#0F172A  Deep Navy (DEFAULT)      █ Fondo principal de app
#1E293B  Dark Charcoal            █ Tarjetas, superficies
#2D3748  Slate 800                █ Superficies elevadas
#111827  Gray 900                 █ Inputs, campos de formulario
#0B1120  Sidebar Dark             █ Elementos más oscuros
```

### Textos
```
#F8FAFC  Slate 50                 ⚪ Títulos principales (h1, h2)
#E2E8F0  Slate 200                ⚪ Texto normal (body)
#CBD5E1  Slate 300                ⚪ Texto terciario
#94A3B8  Slate 400                ⚪ Texto deshabilitado/muted
#64748B  Slate 500                ⚪ Texto muy deshabilitado
```

### Bordes
```
#334155  Slate 700                ▬ Bordes principales
#475569  Slate 600                ▬ Bordes claros
rgba(148, 163, 184, 0.28)         ▬ Bordes sutiles
```

### Estados
```
#10B981  Green 500                🟢 Success / Activo
#EF4444  Red 500                  🔴 Error / Peligro
#F59E0B  Amber 500                🟡 Warning
#3B82F6  Blue 500                 🔵 Info
```

### Acentos
```
#FACC15  Yellow 400               ⭐ Acento amarillo
#A855F7  Purple 500               💜 Acento morado
#EC4899  Pink 500                 💗 Acento rosa
```

---

## ✍️ Tipografía

### Jerarquía de Texto

| Estilo | Tamaño | Peso | Uso |
|--------|--------|------|-----|
| **H1** | 28px | 800 | Títulos de página principal |
| **H2** | 24px | 800 | Títulos de sección |
| **H3** | 20px | 800 | Subtítulos destacados |
| **H4** | 18px | 700 | Títulos de tarjetas |
| **Body** | 15px | 400 | Texto normal |
| **Body Bold** | 15px | 600 | Texto destacado |
| **Caption** | 14px | 600 | Etiquetas, descripciones |
| **Small** | 12px | 500 | Texto pequeño |
| **Tiny** | 10px | 600 | Badges, tags |

### Familia de Fuentes
- **Web:** Inter
- **iOS/Android:** System Font (San Francisco / Roboto)

---

## 📏 Sistema de Espaciado

Escala basada en múltiplos de 4px:

| Nombre | Valor | Uso típico |
|--------|-------|------------|
| `xs` | 4px | Espacios mínimos internos |
| `sm` | 8px | Gaps pequeños |
| `md` | 12px | Espaciado entre elementos relacionados |
| `base` | 16px | Espaciado estándar (padding de componentes) |
| `lg` | 20px | Espaciado generoso |
| `xl` | 24px | Padding de contenedores principales |
| `2xl` | 32px | Separación entre secciones |
| `3xl` | 40px | Espaciado muy grande |
| `4xl` | 48px | Padding bottom de scrolls |
| `5xl` | 64px | Espaciado extra grande |
| `6xl` | 80px | Espaciado masivo |

---

## 🔲 Border Radius

| Nombre | Valor | Uso |
|--------|-------|-----|
| `sm` | 8px | Elementos pequeños |
| `base` | 12px | Tarjetas estándar |
| `md` | 14px | Inputs, campos |
| `lg` | 16px | Tarjetas grandes |
| `xl` | 20px | Modals, sheets |
| `2xl` | 24px | Botones principales |
| `full` | 9999px | Botones circulares, badges |

---

## 🌑 Sistema de Sombras

### Sombras Estándar
- **sm:** Sutil (para inputs, pequeños elementos)
- **base:** Estándar (para tarjetas normales)
- **md:** Mediana (para tarjetas elevadas)
- **lg:** Grande (para modals, elementos flotantes)

### Sombra Especial
- **cyan:** Glow effect para elementos primary (botones, elementos activos)
  - Color: `#00BBDD` con opacity 0.25
  - Offset: (0, 10)
  - Radius: 14px

---

## 🎯 Uso en Componentes

### Ejemplo: Tarjeta con Sistema de Diseño

```typescript
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const cardStyle = {
  backgroundColor: Colors.surface.DEFAULT,      // #1E293B
  padding: Spacing.lg,                          // 20px
  borderRadius: BorderRadius.lg,                // 16px
  borderWidth: 1,
  borderColor: Colors.border.subtle,            // rgba(148, 163, 184, 0.28)
  ...Shadows.md,                                // Sombra mediana
};

const titleStyle = {
  ...Typography.styles.h3,                      // 20px, 800 weight
  color: Colors.text.primary,                   // #F8FAFC
  marginBottom: Spacing.sm,                     // 8px
};
```

### Ejemplo: Botón Primary

```typescript
const buttonPrimaryStyle = {
  backgroundColor: Colors.primary.DEFAULT,       // #00BBDD
  borderRadius: BorderRadius.full,               // 9999px (circular)
  paddingVertical: Spacing.md,                   // 12px
  paddingHorizontal: Spacing.xl,                 // 24px
  ...Shadows.cyan,                               // Glow cyan
};

const buttonTextStyle = {
  ...Typography.styles.bodyBold,                 // 15px, 600 weight
  color: Colors.background.DEFAULT,              // #0F172A
};
```

---

## 📊 Coherencia Visual por Pantalla

Validación de uso del sistema en las 8 pantallas HTML:

| Pantalla | Primary Color | Background | Tipografía | ✅ |
|----------|---------------|------------|------------|---|
| Crear Split | #00BBDD | #0F172A | Inter | ✅ |
| Ejercicios | #0EA5E9 | #1A202C | Inter | ✅ |
| Medidas | #22D3EE | #0F172A | Inter | ✅ |
| Rutina Builder | #00BBDD | #0F172A | Inter | ✅ |
| Sign Up | #00BBDD | #0F172A | Inter | ✅ |
| Dashboard Splits | #00BBDD | #0F172A | Inter | ✅ |
| Ver Perfil | #0EA5E9 | #0F172A | Inter | ✅ |
| Rutinas | #0EA5E9 | #1A202C | Inter | ✅ |

**Unificación:** Todas las variantes de cyan (#00BBDD, #0EA5E9, #22D3EE) están consolidadas en `Colors.primary` con variantes.

---

## 🚀 Cómo Empezar

### 1. Importar el Sistema
```typescript
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
```

### 2. Usar Estilos Globales (Recomendado)
```typescript
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

### 3. O Construir Estilos Personalizados
```typescript
const styles = StyleSheet.create({
  customCard: {
    backgroundColor: Colors.surface.DEFAULT,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
});
```

---

## ✅ Beneficios

1. **Coherencia:** Mismos colores y estilos en toda la app
2. **Mantenibilidad:** Cambiar un color en un solo lugar
3. **Productividad:** No reinventar estilos cada vez
4. **Escalabilidad:** Fácil agregar nuevos componentes
5. **Colaboración:** Equipo usa mismo lenguaje de diseño

---

## 📖 Documentación

- **Guía Completa:** `DESIGN_SYSTEM.md`
- **Ejemplos de Uso:** `styles/README.md`
- **Source Code:** `constants/theme.ts` + `styles/global.ts`

---

## 🎨 Pantallas Implementadas

El archivo `complete-profile.tsx` ha sido actualizado para usar el nuevo sistema de diseño como referencia.

**Antes:**
```typescript
backgroundColor: '#0f172a',      // ❌ Hardcoded
fontSize: 28,                     // ❌ Hardcoded
fontWeight: '800',                // ❌ Hardcoded
```

**Después:**
```typescript
backgroundColor: Colors.background.DEFAULT,   // ✅ From theme
...Typography.styles.h1,                      // ✅ From theme
...GlobalStyles.header,                       // ✅ From global
```

---

**🎉 Sistema de Diseño Listo para Producción**

Ahora todas las futuras pantallas deben usar estas constantes para mantener la coherencia visual.
