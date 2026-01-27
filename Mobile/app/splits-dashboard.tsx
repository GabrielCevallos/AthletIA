import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const SPLITS = [
  {
    id: '1',
    name: 'Push Pull Legs',
    frequency: '6 días / semana',
    activeDays: [0, 1, 2, 3, 4, 5],
    progress: 75,
    active: true,
  },
  {
    id: '2',
    name: 'Full Body',
    frequency: '3 días / semana',
    activeDays: [0, 2, 4],
    progress: 40,
    active: false,
  },
  {
    id: '3',
    name: 'Upper Lower',
    frequency: '4 días / semana',
    activeDays: [0, 1, 3, 4],
    progress: 60,
    active: false,
  },
];

export default function SplitsDashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Splits</Text>
          <Text style={styles.subtitle}>Gestiona tus planes de entrenamiento</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {SPLITS.map((split) => (
          <Pressable key={split.id} style={styles.splitCard}>
            {split.active && (
              <View style={styles.activeBadge}>
                <View style={styles.activePulse} />
                <Text style={styles.activeBadgeText}>PLAN ACTIVO</Text>
              </View>
            )}

            <View style={styles.splitInfo}>
              <Text style={styles.splitName}>{split.name}</Text>
              <Text style={styles.splitFrequency}>{split.frequency}</Text>
            </View>

            {/* Days Grid */}
            <View style={styles.daysContainer}>
              <View style={styles.daysGrid}>
                {DAYS.map((day, index) => (
                  <View
                    key={index}
                    style={[styles.dayBox, split.activeDays.includes(index) && styles.dayBoxActive]}
                  >
                    <Text
                      style={[styles.dayText, split.activeDays.includes(index) && styles.dayTextActive]}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progreso Semanal</Text>
                <Text style={styles.progressValue}>{split.progress}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${split.progress}%` }]} />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.cardActions}>
              <Pressable style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Ver Detalles</Text>
              </Pressable>
              {!split.active && (
                <Pressable style={styles.activateButton}>
                  <Text style={styles.activateButtonText}>Activar</Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        ))}

        {/* Add New Split Button */}
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/create-split')}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Crear Nuevo Split</Text>
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
    paddingBottom: Spacing['3xl'],
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.styles.h2,
  },
  subtitle: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error.DEFAULT,
    borderWidth: 2,
    borderColor: Colors.background.DEFAULT,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    gap: Spacing.base,
    paddingBottom: Spacing['6xl'],
  },
  splitCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    position: 'relative',
    gap: Spacing.base,
  },
  activeBadge: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.primary.DEFAULT}1A`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: `${Colors.primary.DEFAULT}33`,
  },
  activePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.DEFAULT,
  },
  activeBadgeText: {
    ...Typography.styles.tiny,
    color: Colors.primary.DEFAULT,
    fontWeight: Typography.fontWeight.bold,
  },
  splitInfo: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  splitName: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
  },
  splitFrequency: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
  },
  daysContainer: {
    gap: Spacing.sm,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  dayBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBoxActive: {
    backgroundColor: Colors.primary.DEFAULT,
    ...Shadows.cyan,
  },
  dayText: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
    fontWeight: Typography.fontWeight.bold,
  },
  dayTextActive: {
    color: Colors.text.primary,
  },
  progressSection: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
  },
  progressValue: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.DEFAULT,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.background.DEFAULT,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  viewButton: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  viewButtonText: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  activateButton: {
    flex: 1,
    backgroundColor: Colors.primary.DEFAULT,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  activateButtonText: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.sm,
    color: Colors.background.DEFAULT,
  },
  addButton: {
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.base,
  },
  addIcon: {
    fontSize: Typography.fontSize['4xl'],
    color: Colors.primary.DEFAULT,
  },
  addText: {
    ...Typography.styles.bodyBold,
    color: Colors.primary.DEFAULT,
  },
});
