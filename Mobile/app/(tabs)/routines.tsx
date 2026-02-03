import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useRoutines } from '@/hooks/use-routines';
import { translateRoutineGoal } from '@/services/routines-api';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RoutinesScreen() {
  const router = useRouter();
  const { routines, loading, error } = useRoutines();

  useEffect(() => {
    console.log('🎬 [RoutinesScreen] Componente montado/actualizado');
  }, []);

  console.log('🔍 [RoutinesScreen] Estado actual:');
  console.log('  - routines:', routines?.length || 0, 'items');
  console.log('  - loading:', loading);
  console.log('  - error:', error);
  console.log('  - routines completas:', JSON.stringify(routines, null, 2));

  const routinesUi = useMemo(
    () =>
      routines.map((routine) => ({
        id: routine.id,
        name: routine.name,
        type: routine.routineGoal?.length 
          ? routine.routineGoal.map(translateRoutineGoal).join(' · ') 
          : 'Objetivo general',
        duration: '—',
        level: routine.official ? 'Oficial' : 'Personal',
        exercises: routine.nExercises ?? routine.exercises?.length ?? 0,
        active: routine.official,
      })),
    [routines]
  );

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
        {loading && <Text style={styles.statusText}>Cargando rutinas...</Text>}
        {!loading && error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && routinesUi.length === 0 && (
          <Text style={styles.statusText}>Aún no tienes rutinas.</Text>
        )}

        {routinesUi.map((routine) => (
          <Pressable 
            key={routine.id} 
            style={styles.routineCard}
            onPress={() => router.push(`/routine-detail/${routine.id}`)}
          >
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
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/routine-builder')}
        >
          <IconSymbol size={32} name="plus" color={Colors.primary.DEFAULT} />
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
  statusText: {
    ...Typography.styles.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.base,
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.error?.DEFAULT || '#ef4444',
    textAlign: 'center',
    marginTop: Spacing.base,
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
  addText: {
    ...Typography.styles.bodyBold,
    color: Colors.primary.DEFAULT,
  },
});
