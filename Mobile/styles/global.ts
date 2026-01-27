/**
 * AthletIA - Estilos Globales
 * 
 * Estilos reutilizables comunes en toda la aplicación.
 * Importa desde constants/theme.ts para mantener coherencia.
 */

import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  // ============================================================================
  // CONTENEDORES
  // ============================================================================
  
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },

  containerPadded: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
    padding: Spacing.xl,
  },

  contentContainer: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.lg,
  },

  // ============================================================================
  // TARJETAS
  // ============================================================================

  card: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.base,
  },

  cardElevated: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadows.md,
  },

  cardInteractive: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    ...Shadows.base,
  },

  // ============================================================================
  // TEXTOS
  // ============================================================================

  textPrimary: {
    color: Colors.text.primary,
  },

  textSecondary: {
    color: Colors.text.secondary,
  },

  textMuted: {
    color: Colors.text.muted,
  },

  h1: Typography.styles.h1,
  h2: Typography.styles.h2,
  h3: Typography.styles.h3,
  h4: Typography.styles.h4,
  body: Typography.styles.body,
  bodyBold: Typography.styles.bodyBold,
  caption: Typography.styles.caption,
  small: Typography.styles.small,
  tiny: Typography.styles.tiny,

  // ============================================================================
  // LAYOUTS
  // ============================================================================

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  column: {
    flexDirection: 'column',
  },

  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flex1: {
    flex: 1,
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ============================================================================
  // BOTONES
  // ============================================================================

  buttonPrimary: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.cyan,
  },

  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background.DEFAULT,
  },

  buttonTextSecondary: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.DEFAULT,
  },

  // ============================================================================
  // INPUTS
  // ============================================================================

  input: {
    backgroundColor: Colors.background.input,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },

  inputFocused: {
    borderColor: Colors.primary.DEFAULT,
    borderWidth: 2,
  },

  inputError: {
    borderColor: Colors.error.DEFAULT,
  },

  // ============================================================================
  // BADGES Y TAGS
  // ============================================================================

  badge: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },

  badgePrimary: {
    backgroundColor: Colors.primary.DEFAULT,
  },

  badgeSuccess: {
    backgroundColor: Colors.success.DEFAULT,
  },

  badgeError: {
    backgroundColor: Colors.error.DEFAULT,
  },

  badgeWarning: {
    backgroundColor: Colors.warning.DEFAULT,
  },

  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ============================================================================
  // DIVISORES
  // ============================================================================

  divider: {
    height: 1,
    backgroundColor: Colors.border.DEFAULT,
    marginVertical: Spacing.base,
  },

  dividerVertical: {
    width: 1,
    backgroundColor: Colors.border.DEFAULT,
    marginHorizontal: Spacing.base,
  },

  // ============================================================================
  // MODALS Y SHEETS
  // ============================================================================

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: Colors.background.DEFAULT,
    padding: Spacing.base,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    gap: Spacing.xs,
  },

  modalSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.subtle,
    justifyContent: 'space-between',
  },

  // ============================================================================
  // HEADER
  // ============================================================================

  header: {
    gap: Spacing.md,
  },

  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.hover,
    marginBottom: 6,
  },

  brand: {
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.extrabold,
    fontSize: Typography.fontSize.xl,
  },

  heading: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.extrabold,
    marginTop: 4,
  },

  subheading: {
    color: Colors.text.muted,
    fontSize: Typography.fontSize.md,
    marginTop: 4,
    lineHeight: 22,
    fontWeight: Typography.fontWeight.semibold,
  },

  // ============================================================================
  // SECCIÓN
  // ============================================================================

  sectionHeader: {
    gap: 6,
    marginTop: 4,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sectionIcon: {
    fontSize: 22,
  },

  sectionTitle: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.extrabold,
  },

  sectionSubtitle: {
    color: Colors.text.muted,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: 20,
  },

  // ============================================================================
  // GRIDS
  // ============================================================================

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  gridItem2: {
    width: '48%',
  },

  gridItem3: {
    width: '31%',
  },

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  shadowSm: Shadows.sm,
  shadowBase: Shadows.base,
  shadowMd: Shadows.md,
  shadowLg: Shadows.lg,
  shadowCyan: Shadows.cyan,
});
