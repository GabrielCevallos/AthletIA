import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const MEASUREMENTS = [
  { id: 'weight', label: 'Peso', value: '75.2', unit: 'kg', icon: '⚖️', change: '-2.1' },
  { id: 'body_fat', label: 'Grasa Corporal', value: '18.5', unit: '%', icon: '📊', change: '-1.2' },
  { id: 'muscle', label: 'Masa Muscular', value: '32.4', unit: 'kg', icon: '💪', change: '+0.8' },
  { id: 'water', label: 'Agua', value: '58.2', unit: '%', icon: '💧', change: '+0.3' },
];

const BODY_MEASUREMENTS = [
  { id: 'chest', label: 'Pecho', value: '102', unit: 'cm' },
  { id: 'waist', label: 'Cintura', value: '82', unit: 'cm' },
  { id: 'hips', label: 'Cadera', value: '95', unit: 'cm' },
  { id: 'arms', label: 'Brazos', value: '38', unit: 'cm' },
  { id: 'thighs', label: 'Muslos', value: '58', unit: 'cm' },
  { id: 'calves', label: 'Pantorrillas', value: '38', unit: 'cm' },
];

export default function MeasurementsScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <Text style={styles.brandIcon}>💪</Text>
            <Text style={styles.brandText}>AthletIA</Text>
          </View>
          <Pressable style={styles.notificationButton}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Mis Medidas</Text>
          <Text style={styles.subtitle}>Registra y controla tu progreso físico.</Text>
        </View>

        {/* Progress Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleRow}>
              <Text style={styles.chartIcon}>📈</Text>
              <Text style={styles.chartTitle}>Progreso</Text>
            </View>
            <View style={styles.viewModeSelector}>
              <Pressable
                style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
                onPress={() => setViewMode('month')}
              >
                <Text
                  style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}
                >
                  Mes
                </Text>
              </Pressable>
              <Pressable
                style={[styles.viewModeButton, viewMode === 'year' && styles.viewModeButtonActive]}
                onPress={() => setViewMode('year')}
              >
                <Text
                  style={[styles.viewModeText, viewMode === 'year' && styles.viewModeTextActive]}
                >
                  Año
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Simple Chart Placeholder */}
          <View style={styles.chartArea}>
            <View style={styles.chartGrid}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.gridLine} />
              ))}
            </View>
            <View style={styles.chartBars}>
              {[60, 80, 70, 90, 75, 85, 78].map((height, i) => (
                <View key={i} style={styles.barContainer}>
                  <View style={[styles.bar, { height: height }]} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {MEASUREMENTS.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <Text style={styles.metricIcon}>{metric.icon}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>
                {metric.value}
                <Text style={styles.metricUnit}> {metric.unit}</Text>
              </Text>
              <Text style={[styles.metricChange, metric.change.startsWith('-') && styles.metricChangeNegative]}>
                {metric.change} kg
              </Text>
            </View>
          ))}
        </View>

        {/* Body Measurements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medidas Corporales</Text>
          <View style={styles.bodyMeasurementsGrid}>
            {BODY_MEASUREMENTS.map((measurement) => (
              <View key={measurement.id} style={styles.bodyMeasurementCard}>
                <Text style={styles.bodyMeasurementLabel}>{measurement.label}</Text>
                <Text style={styles.bodyMeasurementValue}>
                  {measurement.value} <Text style={styles.bodyMeasurementUnit}>{measurement.unit}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Add Measurement Button */}
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Registrar Nueva Medida</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...GlobalStyles.container,
  },
  header: {
    backgroundColor: Colors.background.DEFAULT,
    paddingHorizontal: Spacing['3xl'],
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandIcon: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.primary.DEFAULT,
  },
  brandText: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.lg,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: Typography.fontSize.lg,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error.DEFAULT,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: Spacing['6xl'],
  },
  titleSection: {
    gap: Spacing.xs,
  },
  title: {
    ...Typography.styles.h1,
    fontSize: Typography.fontSize['4xl'],
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  chartCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing['3xl'],
  },
  chartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chartIcon: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.DEFAULT,
  },
  chartTitle: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.lg,
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.background.DEFAULT,
    borderRadius: BorderRadius.sm,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  viewModeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.border.DEFAULT,
  },
  viewModeText: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
  },
  viewModeTextActive: {
    color: Colors.text.primary,
  },
  chartArea: {
    height: 180,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: Colors.border.DEFAULT,
    opacity: 0.3,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingTop: Spacing.base,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  metricIcon: {
    fontSize: Typography.fontSize['2xl'],
  },
  metricLabel: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  metricValue: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize['2xl'],
  },
  metricUnit: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  metricChange: {
    ...Typography.styles.tiny,
    color: Colors.success.DEFAULT,
    fontWeight: Typography.fontWeight.bold,
  },
  metricChangeNegative: {
    color: Colors.primary.DEFAULT,
  },
  section: {
    gap: Spacing.base,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
  },
  bodyMeasurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  bodyMeasurementCard: {
    width: '48%',
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  bodyMeasurementLabel: {
    ...Typography.styles.small,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  bodyMeasurementValue: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  bodyMeasurementUnit: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
  },
  addButton: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.cyan,
  },
  addButtonIcon: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.background.DEFAULT,
  },
  addButtonText: {
    ...Typography.styles.bodyBold,
    color: Colors.background.DEFAULT,
  },
});
