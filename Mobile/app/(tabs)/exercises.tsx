import { Config } from '@/constants';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useExercises } from '@/hooks/use-exercises';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Mapeo de valores del backend (inglés) a etiquetas para la UI (español)
const MUSCLE_TARGETS = [
  { id: 'chest', label: 'Pecho', icon: '💪' },
  { id: 'core', label: 'Core', icon: '🔥' },
  { id: 'trapezius', label: 'Trapecio', icon: '🦾' },
  { id: 'lats', label: 'Dorsales', icon: '🦾' },
  { id: 'deltoids', label: 'Deltoides', icon: '🏋️' },
  { id: 'triceps', label: 'Tríceps', icon: '💪' },
  { id: 'biceps', label: 'Bíceps', icon: '💪' },
  { id: 'forearms', label: 'Antebrazos', icon: '✊' },
  { id: 'quads', label: 'Cuádriceps', icon: '🦵' },
  { id: 'hamstrings', label: 'Isquiotibiales', icon: '🦵' },
  { id: 'glutes', label: 'Glúteos', icon: '🍑' },
  { id: 'adductors', label: 'Aductores', icon: '🦵' },
  { id: 'calves', label: 'Pantorrillas', icon: '🦿' },
  { id: 'neck', label: 'Cuello', icon: '🧍' },
];

export default function ExercisesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const muscleTargetsScrollRef = useRef<ScrollView>(null);
  const muscleTargetPositions = useRef<Record<string, number>>({});
  const [selectedMuscleTarget, setSelectedMuscleTarget] = useState('chest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    equipment: 'barbell',
    video: '',
    minSets: '3',
    maxSets: '5',
    minReps: '8',
    maxReps: '12',
    minRestTime: '60',
    maxRestTime: '120',
    muscleTarget: 'chest',
    exerciseType: 'strength',
    instructions: '',
  });

  // Hook personalizado para ejercicios con autenticación
  const { exercises, loading, error, refetch } = useExercises(selectedMuscleTarget);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user?.token) {
      router.replace('/login');
    }
  }, [user?.token, authLoading, router]);

  // Función auxiliar para traducir muscle target del backend al español
  const getMuscleTargetLabel = (muscleTargetId?: string): string => {
    // Try to find the muscle target in the list first
    const target = MUSCLE_TARGETS.find((t) => t.id === muscleTargetId);
    // If not found, use the id itself
    const targetKey = target ? target.id : (muscleTargetId || 'general');
    
    // Use translation key, fallback to label or id
    return t(`exercises.muscleTargets.${targetKey}`, { 
      defaultValue: target?.label || muscleTargetId || 'General' 
    });
  };

  // Filtrar búsqueda localmente
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  const handleMuscleTargetChange = (targetId: string) => {
    setSelectedMuscleTarget(targetId);
    setSearchQuery('');
    const x = muscleTargetPositions.current[targetId];
    if (x !== undefined) {
      muscleTargetsScrollRef.current?.scrollTo({
        x: Math.max(0, x - Spacing.base),
        animated: true,
      });
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: '',
      description: '',
      equipment: 'barbell',
      video: '',
      minSets: '3',
      maxSets: '5',
      minReps: '8',
      maxReps: '12',
      minRestTime: '60',
      maxRestTime: '120',
      muscleTarget: 'chest',
      exerciseType: 'strength',
      instructions: '',
    });
  };

  const handleCreateExercise = async () => {
    if (!user?.token) {
      setCreateError(t('exercises.create.errorAuth'));
      return;
    }

    if (!createForm.name.trim() || !createForm.description.trim() || !createForm.video.trim()) {
      setCreateError(t('exercises.create.errorFields'));
      return;
    }

    const toNumber = (value: string) => Number(value);
    const minSets = toNumber(createForm.minSets);
    const maxSets = toNumber(createForm.maxSets);
    const minReps = toNumber(createForm.minReps);
    const maxReps = toNumber(createForm.maxReps);
    const minRestTime = toNumber(createForm.minRestTime);
    const maxRestTime = toNumber(createForm.maxRestTime);

    if ([minSets, maxSets, minReps, maxReps, minRestTime, maxRestTime].some((v) => Number.isNaN(v))) {
      setCreateError(t('exercises.create.errorNumbers'));
      return;
    }

    const muscleTarget = createForm.muscleTarget
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
      
    const exerciseType = createForm.exerciseType
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (muscleTarget.length === 0 || exerciseType.length === 0) {
      setCreateError(t('exercises.create.errorTargetType'));
      return;
    }

    const instructions = createForm.instructions
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (muscleTarget.length === 0 || exerciseType.length === 0) {
      setCreateError('Agrega al menos un muscleTarget y un exerciseType');
      return;
    }

    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      const response = await fetch(`${Config.apiUrl}/workout/exercises`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name.trim(),
          description: createForm.description.trim(),
          equipment: createForm.equipment.trim(),
          video: createForm.video.trim(),
          minSets,
          maxSets,
          minReps,
          maxReps,
          minRestTime,
          maxRestTime,
          muscleTarget,
          exerciseType,
          instructions: instructions.length > 0 ? instructions : undefined,
        }),
      });

      let result: { message?: string } | null = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (response.status === 401) {
        setCreateError(result?.message || t('completeProfile.errors.sessionExpired'));
        return;
      }

      if (response.status === 403) {
        setCreateError(result?.message || t('exercises.create.errorPermissions'));
        return;
      }

      if (!response.ok) {
        setCreateError(result?.message || `HTTP ${response.status}`);
        return;
      }

      setCreateSuccess(t('exercises.create.success'));
      resetCreateForm();
      void refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('exercises.create.errorGeneric');
      setCreateError(errorMessage);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{t('exercises.title')}</Text>
          {user?.role === 'admin' && (
            <Pressable
              style={styles.addExerciseButton}
              onPress={() => {
                setCreateError(null);
                setCreateSuccess(null);
                setIsCreateModalVisible(true);
              }}
            >
              <Text style={styles.addExerciseButtonText}>{t('exercises.newButton')}</Text>
            </Pressable>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('exercises.searchPlaceholder')}
            placeholderTextColor={Colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.retryText}>{t('exercises.retry')}</Text>
          </Pressable>
        </View>
      )}

      {/* Muscle Targets */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
        ref={muscleTargetsScrollRef}
      >
        {MUSCLE_TARGETS.map((target) => (
          <Pressable
            key={target.id}
            style={[
              styles.categoryPill,
              selectedMuscleTarget === target.id && styles.categoryPillActive,
            ]}
            onLayout={(event) => {
              muscleTargetPositions.current[target.id] = event.nativeEvent.layout.x;
            }}
            onPress={() => handleMuscleTargetChange(target.id)}
          >
            <Text style={styles.muscleIcon}>{target.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedMuscleTarget === target.id && styles.categoryTextActive,
              ]}
            >
              {t(`exercises.muscleTargets.${target.id}`)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Exercise List */}
      {loading && exercises.length === 0 ? (
        <View style={[styles.content, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>{t('exercises.loading')}</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredExercises.length > 0 ? (
            <View style={styles.exerciseList}>
              {filteredExercises.map((exercise) => (
                <Pressable
                  key={exercise.id}
                  style={styles.exerciseCard}
                  onPress={() =>
                    router.push({
                      pathname: '/exercise-detail/[id]',
                      params: { id: exercise.id },
                    })
                  }
                >
                  <View style={styles.exerciseImage}>
                    <Image
                      source={{ uri: exercise.imageUrl }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseMeta}>
                      {getMuscleTargetLabel(exercise.muscleTarget)}{' '}
                      {exercise.difficulty}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏋️</Text>
              <Text style={styles.emptyTitle}>{t('exercises.empty.title')}</Text>
              <Text style={styles.emptyText}>
                {t('exercises.empty.text')}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('exercises.create.title')}</Text>
              <Pressable onPress={() => setIsCreateModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {createError && <Text style={styles.modalError}>{createError}</Text>}
              {createSuccess && <Text style={styles.modalSuccess}>{createSuccess}</Text>}

              <Text style={styles.modalLabel}>{t('exercises.create.labels.name')}</Text>
              <TextInput
                style={styles.modalInput}
                value={createForm.name}
                onChangeText={(value) => setCreateForm((prev) => ({ ...prev, name: value }))}
                placeholder="Bench Press"
                placeholderTextColor={Colors.text.muted}
              />

              <Text style={styles.modalLabel}>{t('exercises.create.labels.description')}</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputMultiline]}
                value={createForm.description}
                onChangeText={(value) => setCreateForm((prev) => ({ ...prev, description: value }))}
                placeholder={t('exercises.create.placeholders.description')}
                placeholderTextColor={Colors.text.muted}
                multiline
              />

              <Text style={styles.modalLabel}>{t('exercises.create.labels.equipment')}</Text>
              <TextInput
                style={styles.modalInput}
                value={createForm.equipment}
                onChangeText={(value) => setCreateForm((prev) => ({ ...prev, equipment: value }))}
                placeholder="barbell"
                placeholderTextColor={Colors.text.muted}
              />

              <Text style={styles.modalLabel}>{t('exercises.create.labels.video')}</Text>
              <TextInput
                style={styles.modalInput}
                value={createForm.video}
                onChangeText={(value) => setCreateForm((prev) => ({ ...prev, video: value }))}
                placeholder="https://example.com/video"
                placeholderTextColor={Colors.text.muted}
              />

              <View style={styles.modalRow}>
                <View style={styles.modalColumn}>
                  <Text style={styles.modalLabel}>{t('exercises.create.labels.minSets')}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={createForm.minSets}
                    onChangeText={(value) => setCreateForm((prev) => ({ ...prev, minSets: value }))}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.modalColumn}>
                  <Text style={styles.modalLabel}>{t('exercises.create.labels.maxSets')}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={createForm.maxSets}
                    onChangeText={(value) => setCreateForm((prev) => ({ ...prev, maxSets: value }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalColumn}>
                  <Text style={styles.modalLabel}>{t('exercises.create.labels.minReps')}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={createForm.minReps}
                    onChangeText={(value) => setCreateForm((prev) => ({ ...prev, minReps: value }))}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.modalColumn}>
                  <Text style={styles.modalLabel}>{t('exercises.create.labels.maxReps')}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={createForm.maxReps}
                    onChangeText={(value) => setCreateForm((prev) => ({ ...prev, maxReps: value }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalColumn}>
                  <Text style={styles.modalLabel}>{t('exercises.create.labels.minRest')}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={createForm.minRestTime}
                    onChangeText={(value) => setCreateForm((prev) => ({ ...prev, minRestTime: value }))}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.modalColumn}>
                  <Text style={styles.modalLabel}>{t('exercises.create.labels.maxRest')}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={createForm.maxRestTime}
                    onChangeText={(value) => setCreateForm((prev) => ({ ...prev, maxRestTime: value }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.modalLabel}>{t('exercises.create.labels.muscleTarget')}</Text>
              <TextInput
                style={styles.modalInput}
                value={createForm.muscleTarget}
                onChangeText={(value) => setCreateForm((prev) => ({ ...prev, muscleTarget: value }))}
                placeholder="chest, triceps"
                placeholderTextColor={Colors.text.muted}
              />

              <Text style={styles.modalLabel}>{t('exercises.create.labels.exerciseType')}</Text>
              <TextInput
                style={styles.modalInput}
                value={createForm.exerciseType}
                onChangeText={(value) => setCreateForm((prev) => ({ ...prev, exerciseType: value }))}
                placeholder="strength"
                placeholderTextColor={Colors.text.muted}
              />

              <Text style={styles.modalLabel}>{t('exercises.create.labels.instructions')}</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputMultiline]}
                value={createForm.instructions}
                onChangeText={(value) => setCreateForm((prev) => ({ ...prev, instructions: value }))}
                placeholder={t('exercises.create.placeholders.instructions')}
                placeholderTextColor={Colors.text.muted}
                multiline
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  resetCreateForm();
                  setCreateError(null);
                  setCreateSuccess(null);
                  setIsCreateModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>{t('exercises.create.buttons.cancel')}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => void handleCreateExercise()}
                disabled={createLoading}
              >
                {createLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.modalButtonTextPrimary}>{t('exercises.create.buttons.create')}</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...GlobalStyles.container,
  },
  header: {
    backgroundColor: Colors.background.DEFAULT,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    gap: Spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addExerciseButton: {
    backgroundColor: Colors.primary.DEFAULT,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  addExerciseButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  title: {
    ...Typography.styles.h2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchIcon: {
    fontSize: Typography.fontSize.lg,
  },
  searchInput: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error.DEFAULT,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  errorIcon: {
    fontSize: Typography.fontSize.lg,
  },
  errorText: {
    flex: 1,
    ...Typography.styles.small,
    color: Colors.text.primary,
  },
  retryText: {
    ...Typography.styles.small,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.bold,
    textDecorationLine: 'underline',
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  muscleIcon: {
    fontSize: Typography.fontSize.base,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.muted,
  },
  categoryTextActive: {
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  exerciseList: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.DEFAULT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  exerciseInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  exerciseName: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.lg,
  },
  exerciseMeta: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  chevron: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.text.muted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.base,
  },
  modalContainer: {
    backgroundColor: Colors.background.DEFAULT,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  modalTitle: {
    ...Typography.styles.h3,
  },
  modalClose: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.muted,
  },
  modalContent: {
    marginBottom: Spacing.base,
  },
  modalLabel: {
    ...Typography.styles.small,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
  },
  modalInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalColumn: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  modalButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  modalButtonSecondary: {
    backgroundColor: Colors.background.secondary,
  },
  modalButtonTextPrimary: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  modalButtonTextSecondary: {
    color: Colors.text.muted,
    fontWeight: Typography.fontWeight.semibold,
  },
  modalError: {
    ...Typography.styles.small,
    color: Colors.error.DEFAULT,
    marginBottom: Spacing.sm,
  },
  modalSuccess: {
    ...Typography.styles.small,
    color: Colors.success.DEFAULT,
    marginBottom: Spacing.sm,
  },
});
