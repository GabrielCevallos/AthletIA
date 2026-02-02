import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useExerciseSelector } from '@/hooks/use-exercise-selector';
import { Exercise, useExercises } from '@/hooks/use-exercises';
import { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type ExerciseCategory = 'all' | 'chest' | 'back' | 'legs' | 'cardio' | 'arms';

interface ExerciseSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (exercises: Exercise[]) => void;
}

const CATEGORIES: { id: ExerciseCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'chest', label: 'Pecho' },
  { id: 'back', label: 'Espalda' },
  { id: 'legs', label: 'Piernas' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'arms', label: 'Brazos' },
];

export function ExerciseSelectorModal({
  visible,
  onClose,
  onConfirm,
}: ExerciseSelectorModalProps) {
  const { user } = useAuth();
  const { exercises, loading, error } = useExercises();
  const {
    selectedExercises,
    selectedIds,
    toggleExercise,
    clearSelection,
    getSelectedCount,
  } = useExerciseSelector();

  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory>('all');

  // Check admin access
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  // Filter exercises based on search and category
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((ex) => ex.category === activeCategory);
    }

    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(lowerSearch) ||
          ex.description?.toLowerCase().includes(lowerSearch) ||
          ex.muscleTarget?.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [exercises, activeCategory, searchText]);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedExercises);
    setSearchText('');
    setActiveCategory('all');
    clearSelection();
    onClose();
  }, [selectedExercises, onConfirm, clearSelection, onClose]);

  const handleClose = useCallback(() => {
    setSearchText('');
    setActiveCategory('all');
    clearSelection();
    onClose();
  }, [clearSelection, onClose]);

  const renderExerciseItem = useCallback(
    ({ item }: { item: Exercise }) => {
      const isSelected = selectedIds.has(item.id);
      return (
        <Pressable
          style={[
            styles.exerciseItem,
            isSelected && styles.exerciseItemSelected,
          ]}
          onPress={() => toggleExercise(item)}
        >
          <View style={styles.checkbox}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            {item.description && (
              <Text style={styles.exerciseDescription} numberOfLines={1}>
                {item.description}
              </Text>
            )}
            {item.difficulty && (
              <Text style={styles.exerciseDifficulty}>{item.difficulty}</Text>
            )}
          </View>
        </Pressable>
      );
    },
    [selectedIds, toggleExercise]
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Overlay */}
      <Pressable
        style={styles.overlay}
        onPress={handleClose}
      />

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Seleccionar Ejercicios</Text>
            <Text style={styles.subtitle}>
              {getSelectedCount()} ejercicios seleccionados
            </Text>
          </View>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicio..."
            placeholderTextColor={Colors.text.muted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryTab,
                activeCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  activeCategory === category.id &&
                    styles.categoryTabTextActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Exercises List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando ejercicios...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : filteredExercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {exercises.length === 0
                ? 'No hay ejercicios disponibles'
                : 'No se encontraron ejercicios'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            style={styles.exercisesList}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        )}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancelar
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              styles.confirmButton,
              getSelectedCount() === 0 && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={getSelectedCount() === 0}
          >
            <Text style={styles.buttonText}>
              Confirmar ({getSelectedCount()})
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.DEFAULT,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  title: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
  },
  closeIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text.tertiary,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  searchInput: {
    backgroundColor: Colors.background.input,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  categoriesScroll: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  categoryTabActive: {
    backgroundColor: Colors.primary.DEFAULT,
    borderColor: Colors.primary.DEFAULT,
  },
  categoryTabText: {
    ...Typography.styles.tiny,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  categoryTabTextActive: {
    color: Colors.background.DEFAULT,
  },
  exercisesList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.error.DEFAULT,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    gap: Spacing.base,
  },
  exerciseItemSelected: {
    backgroundColor: Colors.background.secondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: Colors.primary.DEFAULT,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
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
    ...Typography.styles.tiny,
    color: Colors.text.muted,
  },
  exerciseDifficulty: {
    ...Typography.styles.tiny,
    color: Colors.primary.DEFAULT,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: Spacing.base,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  cancelButtonText: {
    color: Colors.text.primary,
  },
  confirmButton: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...Typography.styles.bodyBold,
    color: Colors.background.DEFAULT,
  },
});
