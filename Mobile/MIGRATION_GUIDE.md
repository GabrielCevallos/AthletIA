# Guía de Migración al Sistema de Diseño

Esta guía te ayudará a migrar componentes existentes al nuevo sistema de diseño de AthletIA.

## 🔄 Proceso de Migración

### Paso 1: Identificar Valores Hardcodeados

Busca en tu componente valores como:
- Colores hexadecimales: `#00BBDD`, `#0F172A`, etc.
- Tamaños numéricos: `fontSize: 28`, `padding: 24`
- Pesos de fuente: `fontWeight: '800'`

### Paso 2: Importar el Sistema de Diseño

Agrega al inicio del archivo:
```typescript
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
```

### Paso 3: Reemplazar Valores

Use esta tabla de conversión:

## 📋 Tabla de Conversión

### Colores

| Valor Hardcodeado | Reemplazar con |
|-------------------|----------------|
| `#00BBDD` | `Colors.primary.DEFAULT` |
| `#22D3EE` | `Colors.primary.light` |
| `#0EA5E9` | `Colors.primary.dark` |
| `#06b6d4` | `Colors.primary.hover` |
| `#0F172A` | `Colors.background.DEFAULT` |
| `#1E293B` | `Colors.background.secondary` |
| `#2D3748` | `Colors.background.tertiary` |
| `#111827` | `Colors.background.input` |
| `#F8FAFC` | `Colors.text.primary` |
| `#E2E8F0` | `Colors.text.secondary` |
| `#CBD5E1` | `Colors.text.tertiary` |
| `#94A3B8` | `Colors.text.muted` |
| `#334155` | `Colors.border.DEFAULT` |
| `rgba(148, 163, 184, 0.28)` | `Colors.border.subtle` |
| `#10B981` | `Colors.success.DEFAULT` |
| `#EF4444` | `Colors.error.DEFAULT` |
| `#F59E0B` | `Colors.warning.DEFAULT` |

### Tipografía

| Valores Hardcodeados | Reemplazar con |
|---------------------|----------------|
| `fontSize: 28, fontWeight: '800', color: '#F8FAFC'` | `...Typography.styles.h1` |
| `fontSize: 24, fontWeight: '800', color: '#F8FAFC'` | `...Typography.styles.h2` |
| `fontSize: 20, fontWeight: '800', color: '#F8FAFC'` | `...Typography.styles.h3` |
| `fontSize: 18, fontWeight: '700', color: '#F8FAFC'` | `...Typography.styles.h4` |
| `fontSize: 15, fontWeight: '400'` | `...Typography.styles.body` |
| `fontSize: 15, fontWeight: '600'` | `...Typography.styles.bodyBold` |
| `fontSize: 14, fontWeight: '600'` | `...Typography.styles.caption` |
| `fontSize: 12, fontWeight: '500'` | `...Typography.styles.small` |
| `fontSize: 10, fontWeight: '600'` | `...Typography.styles.tiny` |

### Tamaños Individuales

| Hardcoded | Reemplazar con |
|-----------|----------------|
| `fontSize: 10` | `fontSize: Typography.fontSize.xs` |
| `fontSize: 12` | `fontSize: Typography.fontSize.sm` |
| `fontSize: 14` | `fontSize: Typography.fontSize.base` |
| `fontSize: 15` | `fontSize: Typography.fontSize.md` |
| `fontSize: 16` | `fontSize: Typography.fontSize.lg` |
| `fontSize: 18` | `fontSize: Typography.fontSize.xl` |
| `fontSize: 20` | `fontSize: Typography.fontSize['2xl']` |
| `fontSize: 24` | `fontSize: Typography.fontSize['3xl']` |
| `fontSize: 28` | `fontSize: Typography.fontSize['4xl']` |

### Pesos de Fuente

| Hardcoded | Reemplazar con |
|-----------|----------------|
| `fontWeight: '300'` | `fontWeight: Typography.fontWeight.light` |
| `fontWeight: '400'` | `fontWeight: Typography.fontWeight.regular` |
| `fontWeight: '500'` | `fontWeight: Typography.fontWeight.medium` |
| `fontWeight: '600'` | `fontWeight: Typography.fontWeight.semibold` |
| `fontWeight: '700'` | `fontWeight: Typography.fontWeight.bold` |
| `fontWeight: '800'` | `fontWeight: Typography.fontWeight.extrabold` |

### Espaciado

| Hardcoded | Reemplazar con |
|-----------|----------------|
| `4` | `Spacing.xs` |
| `8` | `Spacing.sm` |
| `12` | `Spacing.md` |
| `16` | `Spacing.base` |
| `20` | `Spacing.lg` |
| `24` | `Spacing.xl` |
| `32` | `Spacing['2xl']` |
| `40` | `Spacing['3xl']` |
| `48` | `Spacing['4xl']` |
| `64` | `Spacing['5xl']` |
| `80` | `Spacing['6xl']` |

### Border Radius

| Hardcoded | Reemplazar con |
|-----------|----------------|
| `8` | `BorderRadius.sm` |
| `12` | `BorderRadius.base` |
| `14` | `BorderRadius.md` |
| `16` | `BorderRadius.lg` |
| `18` | `BorderRadius.lg` (aproximado) |
| `20` | `BorderRadius.xl` |
| `24` | `BorderRadius['2xl']` |
| `9999` | `BorderRadius.full` |

### Sombras

Reemplazar objetos de sombra complejos con:

| Uso | Reemplazar con |
|-----|----------------|
| Sombra sutil | `...Shadows.sm` |
| Sombra normal | `...Shadows.base` |
| Sombra mediana | `...Shadows.md` |
| Sombra grande | `...Shadows.lg` |
| Sombra cyan (glow) | `...Shadows.cyan` |

## 🔨 Ejemplo Práctico de Migración

### Antes (Hardcoded):
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    backgroundColor: '#00BBDD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
  },
});
```

### Después (Con Sistema de Diseño):
```typescript
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    padding: Spacing.xl,
  },
  title: {
    ...Typography.styles.h1,
    marginBottom: Spacing.sm,
  },
  card: {
    ...GlobalStyles.cardElevated,
    // Ya incluye todo: backgroundColor, padding, borderRadius, border, shadow
  },
  button: {
    ...GlobalStyles.buttonPrimary,
    // Ya incluye todo: backgroundColor, padding, borderRadius, shadow
  },
});
```

## ✅ Checklist de Migración

Por cada componente:

- [ ] Importar `Colors`, `Typography`, `Spacing` desde `@/constants/theme`
- [ ] Importar `GlobalStyles` desde `@/styles/global`
- [ ] Reemplazar colores hardcodeados con `Colors.*`
- [ ] Reemplazar tamaños de fuente con `Typography.fontSize.*` o `...Typography.styles.*`
- [ ] Reemplazar pesos de fuente con `Typography.fontWeight.*`
- [ ] Reemplazar padding/margin con `Spacing.*`
- [ ] Reemplazar borderRadius con `BorderRadius.*`
- [ ] Reemplazar sombras complejas con `...Shadows.*`
- [ ] Usar `...GlobalStyles.*` cuando exista un estilo global equivalente
- [ ] Verificar que no haya errores de TypeScript
- [ ] Probar visualmente el componente

## 🚨 Casos Especiales

### Componentes con Estilos Muy Personalizados

Si tienes un componente con estilos muy específicos que no encajan en el sistema:

1. Usa las constantes del tema para colores, espaciado, etc.
2. Define estilos personalizados pero basados en el tema
3. Considera agregar el estilo a `GlobalStyles` si será reutilizado

```typescript
const styles = StyleSheet.create({
  customCard: {
    backgroundColor: Colors.surface.DEFAULT,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    // Personalización única
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.DEFAULT,
    ...Shadows.md,
  },
});
```

### Valores que No Están en el Sistema

Si necesitas un valor que no existe:

1. **Evaluá si realmente lo necesitas** - ¿Puedes usar un valor existente?
2. **Si es un caso único** - Úsalo inline pero documenta por qué
3. **Si se repetirá** - Agrégalo al sistema en `constants/theme.ts`

## 📞 Ayuda

Si tienes dudas durante la migración:
1. Consulta `DESIGN_SYSTEM.md` para la guía completa
2. Revisa `styles/README.md` para ejemplos
3. Mira `app/complete-profile.tsx` como referencia migrada
4. Verifica `constants/theme.ts` para todos los valores disponibles

---

¡Feliz migración! 🎨
