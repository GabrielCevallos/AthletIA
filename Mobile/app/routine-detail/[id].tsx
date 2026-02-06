import { PrimaryButton } from '@/components/ui/primary-button';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useRoutines, type Routine } from '@/hooks/use-routines';
import { GlobalStyles } from '@/styles/global';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RoutineDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchRoutineById, deleteRoutine, loading } = useRoutines({ autoFetch: false });

  const [routine, setRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    if (id) {
      loadRoutine();
    }
  }, [id]);

  const loadRoutine = async () => {
    if (!id) return;

    const routineData = await fetchRoutineById(id);
    if (routineData) {
      setRoutine(routineData);
    } else {
      Alert.alert(t('common.error'), t('routines.detail.loadError'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    }
  };

  const handleDelete = () => {
    if (!routine) return;

    Alert.alert(
      t('routines.detail.deleteTitle'),
      t('routines.detail.deleteMessage', { name: routine.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteRoutine(routine.id);
            if (success) {
              router.back();
            } else {
              Alert.alert(t('common.error'), t('routines.detail.deleteError'));
            }
          },
        },
      ]
    );
  };

  if (!routine && loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        <Text style={styles.loadingText}>{t('routines.detail.loading')}</Text>
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorText}>{t('routines.detail.notFound')}</Text>
        <PrimaryButton label={t('common.back')} onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>{t('routines.detail.title')}</Text>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.routineName}>{routine.name}</Text>
          {routine.description && (
            <Text style={styles.routineDescription}>{routine.description}</Text>
          )}
          
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {routine.official ? t('routines.levels.official') : t('routines.levels.personal')}
              </Text>
            </View>
          </View>

          <View style={styles.metaSection}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{t('routines.detail.info.exercises')}</Text>
              <Text style={styles.metaValue}>
                {routine.nExercises ?? routine.exercises?.length ?? 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Goals Section */}
        {routine.routineGoal && routine.routineGoal.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('routines.detail.goalsTitle')}</Text>
            <View style={styles.goalsContainer}>
              {routine.routineGoal.map((goal, index) => (
                <View key={index} style={styles.goalChip}>
                  <Text style={styles.goalChipText}>{t(`routines.goals.${goal}`)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Exercises Section */}
        {routine.exercises && routine.exercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('routines.exercises')}</Text>
            {routine.exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  {exercise.description && (
                    <Text style={styles.exerciseDescription} numberOfLines={2}>
                      {exercise.description}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadataCard}>
          {routine.createdAt && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>{t('routines.detail.info.created')}</Text>
              <Text style={styles.metadataValue}>
                {new Date(routine.createdAt).toLocaleDateString(i18n.language)}
              </Text>
            </View>
          )}
          {routine.updatedAt && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>{t('routines.detail.info.updated')}</Text>
              <Text style={styles.metadataValue}>
                {new Date(routine.updatedAt).toLocaleDateString(i18n.language)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...GlobalStyles.container,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.DEFAULT,
    gap: Spacing.base,
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  errorScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.DEFAULT,
    gap: Spacing.base,
    padding: Spacing.base,
  },
  errorIcon: {
    fontSize: 64,
  },
  errorText: {
    ...Typography.styles.h3,
    color: Colors.text.tertiary,
  },
  header: {
    backgroundColor: Colors.background.DEFAULT,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.text.tertiary,
  },
  title: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.xl,
    flex: 1,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: Typography.fontSize.lg,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    gap: Spacing.xl,
    paddingBottom: Spacing['6xl'],
  },
  infoCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  routineName: {
    ...Typography.styles.h2,
    fontSize: Typography.fontSize['2xl'],
  },
  routineDescription: {
    ...Typography.styles.body,
    color: Colors.text.tertiary,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.primary.DEFAULT + '1A',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.primary.DEFAULT + '33',
  },
  badgeText: {
    ...Typography.styles.tiny,
    color: Colors.primary.DEFAULT,
    fontWeight: Typography.fontWeight.bold,
  },
  metaSection: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  metaValue: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
  },
  section: {
    gap: Spacing.base,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  goalChip: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  goalChipText: {
    ...Typography.styles.small,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  exerciseCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    flexDirection: 'row',
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.sm,
  },
  exerciseInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  exerciseName: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
  },
  exerciseDescription: {
    ...Typography.styles.small,
    color: Colors.text.tertiary,
  },
  metadataCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataLabel: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  metadataValue: {
    ...Typography.styles.small,
    color: Colors.text.tertiary,
  },
});
