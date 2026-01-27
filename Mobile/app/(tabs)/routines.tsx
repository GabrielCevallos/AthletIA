import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ROUTINES = [
  {
    id: '1',
    name: 'Full Body A',
    type: 'Fuerza Hipertrofia',
    duration: '60 min',
    level: 'Intermedio',
    exercises: 8,
    active: true,
  },
  {
    id: '2',
    name: 'Push Day',
    type: 'Hipertrofia',
    duration: '75 min',
    level: 'Avanzado',
    exercises: 10,
    active: false,
  },
  {
    id: '3',
    name: 'Pull Day',
    type: 'Hipertrofia',
    duration: '70 min',
    level: 'Avanzado',
    exercises: 9,
    active: false,
  },
  {
    id: '4',
    name: 'Leg Day',
    type: 'Fuerza',
    duration: '80 min',
    level: 'Intermedio',
    exercises: 7,
    active: false,
  },
];

export default function RoutinesScreen() {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Rutinas</Text>
        <View style={styles.headerButtons}>
          <Pressable style={styles.headerButton}>
            <Text style={styles.buttonIcon}>🔍</Text>
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Text style={styles.buttonIcon}>⋮</Text>
          </Pressable>
        </View>
      </View>

      {/* Routines List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {ROUTINES.map((routine) => (
          <Pressable key={routine.id} style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <View style={styles.routineHeaderLeft}>
                <Text style={styles.routineName}>{routine.name}</Text>
                <Text style={styles.routineType}>{routine.type}</Text>
              </View>
              {routine.active && (
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeBadgeText}>ACTIVA</Text>
                </View>
              )}
            </View>

            <View style={styles.routineMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏱️</Text>
                <Text style={styles.metaText}>{routine.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📊</Text>
                <Text style={styles.metaText}>{routine.level}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>💪</Text>
                <Text style={styles.metaText}>{routine.exercises} Ejercicios</Text>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Add New Button */}
        <Pressable style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Nueva Rutina</Text>
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
    paddingBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  title: {
    ...Typography.styles.h2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  buttonIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text.tertiary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  routineCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadows.md,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  routineHeaderLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  routineName: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.xl,
  },
  routineType: {
    ...Typography.styles.body,
    color: Colors.primary.DEFAULT,
    fontWeight: Typography.fontWeight.medium,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.primary.DEFAULT}33`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.primary.DEFAULT}66`,
  },
  activeDot: {
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
  routineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xl'],
    marginTop: Spacing.base,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaIcon: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.muted,
  },
  metaText: {
    ...Typography.styles.small,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
  addButton: {
    backgroundColor: 'transparent',
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
