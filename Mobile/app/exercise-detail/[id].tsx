import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import type { Exercise } from '@/hooks/use-exercises';
import { useExercises } from '@/hooks/use-exercises';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ExerciseDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getExerciseById } = useExercises(undefined, { autoFetch: false });
  const scrollViewRef = useRef<ScrollView>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExercise() {
      if (!id || !user?.token) {
        router.back();
        return;
      }

      setLoading(true);
      const data = await getExerciseById(id);
      if (!data) {
        setError(t('exercises.detail.loadError'));
      }
      setExercise(data);
      setLoading(false);
    }

    void loadExercise();
  }, [id, user?.token]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || t('exercises.detail.notFound')}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView ref={scrollViewRef} style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Imagen del Ejercicio */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: exercise.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <Pressable style={styles.backIconButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      </View>

      {/* Contenido Principal */}
      <View style={styles.content}>
        {/* Header del Ejercicio */}
        <View style={styles.exerciseHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Text style={styles.category}>
              {exercise.muscleTarget 
                ? t(`exercises.muscleTargets.${exercise.muscleTarget}`, { defaultValue: exercise.muscleTarget }) 
                : exercise.muscleGroups?.[0] || t('exercises.muscleTargets.general')}
            </Text>
          </View>
          <View style={[styles.badge, styles[`badge${exercise.difficulty}`]]}>
            <Text style={styles.badgeText}>{exercise.difficulty}</Text>
          </View>
        </View>

        {/* Descripción */}
        {exercise.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('exercises.detail.description')}</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>
        )}

        {/* Músculos Trabajados */}
        {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('exercises.detail.muscleGroups')}</Text>
            <View style={styles.muscleGroupsContainer}>
              {exercise.muscleGroups.map((muscle) => (
                <View key={muscle} style={styles.muscleTag}>
                  <Text style={styles.muscleTagText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Equipo Necesario */}
        {exercise.equipment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('exercises.detail.equipment')}</Text>
            <View style={styles.equipmentContainer}>
              {(Array.isArray(exercise.equipment) ? exercise.equipment : [exercise.equipment])
                .filter(item => item)
                .map((item) => (
                  <View key={item} style={styles.equipmentItem}>
                    <Text style={styles.equipmentIcon}>⚙️</Text>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Instrucciones Paso a Paso */}
        {exercise.instructions && exercise.instructions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('exercises.detail.instructions')}</Text>
            <View style={styles.instructionsContainer}>
              {exercise.instructions.map((instruction, idx) => (
                <View key={idx} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.instruction}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Variantes del Ejercicio */}
        {exercise.variants && exercise.variants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('exercises.detail.variants')}</Text>
            <View style={styles.variantsContainer}>
              {exercise.variants.map((variant) => (
                <Pressable
                  key={variant.id}
                  style={styles.variantCard}
                  onPress={() => {
                    setExercise(variant);
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                >
                  <Text style={styles.variantName}>{variant.name}</Text>
                  <Text style={styles.variantDifficulty}>{variant.difficulty}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Botón de Acción */}
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>+ {t('exercises.detail.addToRoutine')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.DEFAULT,
    padding: Spacing.base,
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.error.DEFAULT,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    ...Typography.styles.body,
    color: Colors.background.DEFAULT,
    fontWeight: Typography.fontWeight.bold,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: Colors.background.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backIconButton: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.base,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.lg,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.base,
  },
  titleSection: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.styles.h2,
    fontSize: Typography.fontSize.xl,
  },
  category: {
    ...Typography.styles.small,
    color: Colors.text.muted,
    textTransform: 'capitalize',
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgePrincipiante: {
    backgroundColor: Colors.info.DEFAULT,
  },
  badgeIntermedio: {
    backgroundColor: Colors.warning.DEFAULT,
  },
  badgeAvanzado: {
    backgroundColor: Colors.error.DEFAULT,
  },
  badgeText: {
    ...Typography.styles.tiny,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  description: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  muscleTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.full,
  },
  muscleTagText: {
    ...Typography.styles.small,
    color: Colors.background.DEFAULT,
    fontWeight: Typography.fontWeight.semibold,
  },
  equipmentContainer: {
    gap: Spacing.md,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.DEFAULT,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.DEFAULT,
  },
  equipmentIcon: {
    fontSize: Typography.fontSize['2xl'],
  },
  equipmentText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    flex: 1,
  },
  instructionsContainer: {
    gap: Spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    ...Typography.styles.body,
    color: Colors.background.DEFAULT,
    fontWeight: Typography.fontWeight.bold,
  },
  instruction: {
    flex: 1,
    ...Typography.styles.body,
    color: Colors.text.secondary,
    lineHeight: 22,
    paddingTop: Spacing.sm,
  },
  variantsContainer: {
    gap: Spacing.md,
  },
  variantCard: {
    backgroundColor: Colors.surface.DEFAULT,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  variantName: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  variantDifficulty: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  addButton: {
    backgroundColor: Colors.primary.DEFAULT,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.base,
    marginBottom: Spacing.lg,
  },
  addButtonText: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background.DEFAULT,
  },
});
