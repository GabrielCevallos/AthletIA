import { ExerciseSelectorModal } from '@/components/exercise-selector-modal';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { Exercise } from '@/hooks/use-exercises';
import { type RoutineGoal, createRoutine } from '@/services/routines-api';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

const DEFAULT_ROUTINE_GOALS: RoutineGoal[] = ['general_fitness'];

export default function RoutineBuilderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [routineName, setRoutineName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const exerciseIds = useMemo(
    () => exercises.map((exercise) => exercise.id).filter(Boolean),
    [exercises]
  );

  const updateExercise = (id: string, field: keyof RoutineExercise, value: number) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleSelectExercises = (selectedExercises: Exercise[]) => {
    // Convert selected exercises to routine exercises with default sets/reps/weight
    const newExercises = selectedExercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: ex.maxSets || 3,
      reps: ex.maxReps || 10,
      weight: 0,
    }));
    setExercises((prev) => [...prev, ...newExercises]);
  };

  const handleSave = async () => {
    if (!user?.token) {
      setError('Usuario no autenticado');
      return;
    }

    if (!routineName.trim()) {
      setError('El nombre de la rutina es obligatorio');
      return;
    }

    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createRoutine(
        {
          name: routineName.trim(),
          description: description.trim(),
          routineGoal: DEFAULT_ROUTINE_GOALS,
          official: false,
          exerciseIds: exerciseIds.length ? exerciseIds : undefined,
        },
        { token: user.token }
      );

      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar la rutina';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>Creador de Rutinas</Text>
        <Pressable style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.heading}>Nueva Rutina</Text>
          <Text style={styles.subheading}>
            Crea rutinas personalizadas para tus objetivos.
          </Text>
        </View>

        {/* Routine Info */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la Rutina</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Hipertrofia Pecho/Triceps"
              placeholderTextColor={Colors.text.muted}
              value={routineName}
              onChangeText={(text) => {
                setRoutineName(text);
                if (error) setError(null);
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción breve</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe el objetivo..."
              placeholderTextColor={Colors.text.muted}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (error) setError(null);
              }}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Exercises Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ejercicios</Text>
            <Text style={styles.exerciseCount}>{exercises.length} ejercicios</Text>
          </View>

          {/* Exercise Cards */}
          {exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseHeaderLeft}>
                  <Text style={styles.dragIcon}>☰</Text>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                </View>
                <View style={styles.exerciseActions}>
                  <Pressable style={styles.actionButton}>
                    <Text style={styles.actionIcon}>📝</Text>
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => removeExercise(exercise.id)}
                  >
                    <Text style={[styles.actionIcon, styles.deleteIcon]}>🗑️</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.exerciseInputs}>
                <View style={styles.inputColumn}>
                  <Text style={styles.inputLabel}>SERIES</Text>
                  <TextInput
                    style={styles.numberInput}
                    value={exercise.sets.toString()}
                    onChangeText={(text) =>
                      updateExercise(exercise.id, 'sets', parseInt(text) || 0)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputColumn}>
                  <Text style={styles.inputLabel}>REPS</Text>
                  <TextInput
                    style={styles.numberInput}
                    value={exercise.reps.toString()}
                    onChangeText={(text) =>
                      updateExercise(exercise.id, 'reps', parseInt(text) || 0)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputColumn}>
                  <Text style={styles.inputLabel}>PESO (KG)</Text>
                  <TextInput
                    style={styles.numberInput}
                    value={exercise.weight.toString()}
                    onChangeText={(text) =>
                      updateExercise(exercise.id, 'weight', parseInt(text) || 0)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ))}

          {/* Add Exercise Buttons */}
          {user?.role === 'admin' && (
            <Pressable
              style={styles.addExerciseButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addText}>Agregar Ejercicios Existentes</Text>
            </Pressable>
          )}

          <Pressable style={styles.addExerciseButton}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>Crear Ejercicio Personalizado</Text>
          </Pressable>
        </View>

        {/* Save Button */}
        <PrimaryButton label="Guardar Rutina" onPress={handleSave} loading={saving} />
      </ScrollView>

      {/* Exercise Selector Modal */}
      <ExerciseSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleSelectExercises}
      />
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
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.lg,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.primary.DEFAULT,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: Spacing['6xl'],
  },
  intro: {
    gap: Spacing.xs,
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.error.DEFAULT,
    textAlign: 'center',
  },
  heading: {
    ...Typography.styles.h2,
  },
  subheading: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  section: {
    gap: Spacing.base,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeight.bold,
  },
  input: {
    backgroundColor: Colors.background.input,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
  },
  exerciseCount: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
  },
  exerciseCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    gap: Spacing.base,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  exerciseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  dragIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text.muted,
  },
  exerciseName: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: Typography.fontSize.lg,
  },
  deleteIcon: {
    opacity: 0.6,
  },
  exerciseInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputColumn: {
    flex: 1,
    gap: Spacing.xs,
  },
  inputLabel: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeight.bold,
  },
  numberInput: {
    backgroundColor: Colors.background.input,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    textAlign: 'center',
    color: Colors.text.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  addExerciseButton: {
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  addIcon: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.primary.DEFAULT,
  },
  addText: {
    ...Typography.styles.bodyBold,
    color: Colors.primary.DEFAULT,
  },
});
