import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useRoutines, type Routine } from '@/hooks/use-routines';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface RoutineSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (routineIds: string[]) => void;
  selectedRoutineIds?: string[];
  maxSelection?: number;
}

export function RoutineSelectorModal({
  visible,
  onClose,
  onConfirm,
  selectedRoutineIds = [],
  maxSelection,
}: RoutineSelectorModalProps) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { routines, loading, error } = useRoutines({
    autoFetch: visible && isFocused,
  });
  const [searchText, setSearchText] = useState('');
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedRoutineIds));

  // Filter routines based on search
  const filteredRoutines = useMemo(() => {
    if (!searchText.trim()) return routines;

    const lowerSearch = searchText.toLowerCase();
    return routines.filter(
      (routine) =>
        routine.name.toLowerCase().includes(lowerSearch) ||
        routine.description?.toLowerCase().includes(lowerSearch) ||
        routine.routineGoal?.some(goal => 
          t(`routines.goals.${goal}`).toLowerCase().includes(lowerSearch)
        )
    );
  }, [routines, searchText, t]);

  const toggleRoutine = useCallback(
    (routineId: string) => {
      setLocalSelected((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(routineId)) {
          newSet.delete(routineId);
        } else {
          // Check if we've reached max selection
          if (maxSelection && newSet.size >= maxSelection) {
            return prev; // Don't add more
          }
          newSet.add(routineId);
        }
        return newSet;
      });
    },
    [maxSelection]
  );

  const handleConfirm = useCallback(() => {
    onConfirm(Array.from(localSelected));
    setSearchText('');
    onClose();
  }, [localSelected, onConfirm, onClose]);

  const handleClose = useCallback(() => {
    setLocalSelected(new Set(selectedRoutineIds));
    setSearchText('');
    onClose();
  }, [selectedRoutineIds, onClose]);

  const renderRoutineItem = useCallback(
    ({ item }: { item: Routine }) => {
      const isSelected = localSelected.has(item.id);
      const goals = item.routineGoal?.map(goal => t(`routines.goals.${goal}`)).join(' · ') || t('routines.defaultGoal');
      const exerciseCount = item.nExercises ?? item.exercises?.length ?? 0;

      return (
        <Pressable
          style={[styles.routineItem, isSelected && styles.routineItemSelected]}
          onPress={() => toggleRoutine(item.id)}
        >
          <View style={styles.routineItemContent}>
            <View style={styles.routineHeader}>
              <Text style={[styles.routineName, isSelected && styles.routineNameSelected]}>
                {item.name}
              </Text>
              {item.official && (
                <View style={styles.officialBadge}>
                  <Text style={styles.officialBadgeText}>OFICIAL</Text>
                </View>
              )}
            </View>

            {item.description && (
              <Text style={styles.routineDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <View style={styles.routineMeta}>
              <Text style={styles.metaText}>📊 {goals}</Text>
              <Text style={styles.metaText}>💪 {exerciseCount} {t('routines.exercises').toLowerCase()}</Text>
            </View>
          </View>

          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </Pressable>
      );
    },
    [localSelected, toggleRoutine, t]
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>Seleccionar Rutinas</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>
            {maxSelection && (
              <Text style={styles.subtitle}>
                Selecciona hasta {maxSelection} rutina{maxSelection !== 1 ? 's' : ''} ({localSelected.size}/{maxSelection})
              </Text>
            )}
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar rutinas..."
              placeholderTextColor={Colors.text.muted}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Routines List */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
              <Text style={styles.loadingText}>Cargando rutinas...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          ) : filteredRoutines.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                {searchText ? 'No se encontraron rutinas' : 'No hay rutinas disponibles'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredRoutines}
              renderItem={renderRoutineItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmButton, localSelected.size === 0 && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={localSelected.size === 0}
            >
              <Text style={styles.confirmButtonText}>
                Confirmar {localSelected.size > 0 && `(${localSelected.size})`}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.DEFAULT,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
    paddingTop: Spacing.lg,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    gap: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.xl,
  },
  subtitle: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    height: 48,
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
  clearIcon: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.muted,
    fontWeight: Typography.fontWeight.bold,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    gap: Spacing.base,
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.error.DEFAULT,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  listContent: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  routineItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    gap: Spacing.md,
  },
  routineItemSelected: {
    borderColor: Colors.primary.DEFAULT,
    backgroundColor: 'rgba(0, 174, 239, 0.05)',
  },
  routineItemContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  routineName: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    flex: 1,
  },
  routineNameSelected: {
    color: Colors.primary.DEFAULT,
  },
  officialBadge: {
    backgroundColor: Colors.primary.DEFAULT,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  officialBadgeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  routineDescription: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  routineMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  metaText: {
    ...Typography.styles.small,
    color: Colors.text.muted,
    fontSize: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary.DEFAULT,
    borderColor: Colors.primary.DEFAULT,
  },
  checkmark: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.base,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.tertiary,
  },
  confirmButton: {
    flex: 2,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.background.secondary,
    opacity: 0.5,
  },
  confirmButtonText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
  },
});
