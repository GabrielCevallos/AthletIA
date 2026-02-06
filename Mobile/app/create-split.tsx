import { RoutineSelectorModal } from '@/components/routine-selector-modal';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useRoutines } from '@/hooks/use-routines';
import { useSplits } from '@/hooks/use-splits';
import type { TrainingDay } from '@/services/splits-api';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const DAYS_OF_WEEK = [
  { id: 'Monday', label: 'L', full: 'Lunes' },
  { id: 'Tuesday', label: 'M', full: 'Martes' },
  { id: 'Wednesday', label: 'X', full: 'Miércoles' },
  { id: 'Thursday', label: 'J', full: 'Jueves' },
  { id: 'Friday', label: 'V', full: 'Viernes' },
  { id: 'Saturday', label: 'S', full: 'Sábado' },
  { id: 'Sunday', label: 'D', full: 'Domingo' },
] as const;

export default function CreateSplitScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { createSplit, loading } = useSplits({ autoFetch: false });
  const { routines } = useRoutines();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<TrainingDay[]>(['Monday', 'Tuesday', 'Thursday', 'Friday']);
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<string[]>([]);
  const [showRoutineSelector, setShowRoutineSelector] = useState(false);

  const toggleDay = (dayId: TrainingDay) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleCreateSplit = async () => {
    if (!name.trim() || selectedDays.length === 0) {
      Alert.alert(t('common.error'), t('createSplit.errors.validationDays'));
      return;
    }

    if (selectedRoutineIds.length === 0) {
      Alert.alert(t('common.error'), t('createSplit.errors.validationRoutines'));
      return;
    }

    const result = await createSplit({
      name: name.trim(),
      description: description.trim(),
      trainingDays: selectedDays,
      routineIds: selectedRoutineIds,
      official: false,
    });

    if (result) {
      Alert.alert(t('common.success'), t('createSplit.success.created'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    } else {
      Alert.alert(t('common.error'), t('createSplit.errors.create'));
    }
  };

  const handleRoutineSelection = (routineIds: string[]) => {
    setSelectedRoutineIds(routineIds);
  };

  const selectedRoutines = routines.filter(r => selectedRoutineIds.includes(r.id));

  const removeRoutine = (routineId: string) => {
    setSelectedRoutineIds(prev => prev.filter(id => id !== routineId));
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>X</Text>
        </Pressable>
        <Text style={styles.title}>{t('createSplit.title')}</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{t('createSplit.subtitle')}</Text>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {t('createSplit.form.nameLabel')} <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('createSplit.form.namePlaceholder')}
            placeholderTextColor={Colors.text.muted}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('createSplit.form.descriptionLabel')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('createSplit.form.descriptionPlaceholder')}
            placeholderTextColor={Colors.text.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Days Selection */}
        <View style={styles.daysSection}>
          <Text style={styles.label}>
            {t('createSplit.form.trainingDays')} <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <Pressable
                key={day.id}
                style={[styles.dayButton, selectedDays.includes(day.id as TrainingDay) && styles.dayButtonActive]}
                onPress={() => toggleDay(day.id as TrainingDay)}
              >
                <Text
                  style={[styles.dayText, selectedDays.includes(day.id as TrainingDay) && styles.dayTextActive]}
                >
                  {day.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Routine Selection */}
        <View style={styles.routinesSection}>
          <Text style={styles.label}>
            {t('createSplit.form.routinesLabel')} <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>{t('createSplit.form.routinesHint')}</Text>
          
          {selectedRoutines.length > 0 && (
            <View style={styles.selectedRoutinesList}>
              {selectedRoutines.map((routine) => (
                <View key={routine.id} style={styles.selectedRoutineChip}>
                  <Text style={styles.selectedRoutineText} numberOfLines={1}>
                    {routine.name}
                  </Text>
                  <Pressable onPress={() => removeRoutine(routine.id)} style={styles.removeChipButton}>
                    <Text style={styles.removeChipIcon}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Pressable 
            style={styles.addRoutineButton}
            onPress={() => setShowRoutineSelector(true)}
          >
            <Text style={styles.addRoutineIcon}>+</Text>
            <Text style={styles.addRoutineText}>
              {selectedRoutines.length === 0
                ? t('createSplit.form.addRoutines')
                : t('createSplit.form.addMoreRoutines')}
            </Text>
          </Pressable>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('createSplit.summary.trainingDays')}</Text>
            <Text style={styles.summaryValue}>{selectedDays.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('createSplit.summary.restDays')}</Text>
            <Text style={styles.summaryValue}>{7 - selectedDays.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('createSplit.summary.routinesAssigned')}</Text>
            <Text style={styles.summaryValue}>{selectedRoutineIds.length}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <PrimaryButton
            label={loading ? t('createSplit.actions.creating') : t('createSplit.actions.create')}
            onPress={handleCreateSplit}
            disabled={!name || selectedDays.length === 0 || selectedRoutineIds.length === 0 || loading}
          />
          {loading && (
            <ActivityIndicator size="small" color={Colors.primary.DEFAULT} style={styles.loader} />
          )}
        </View>
      </ScrollView>

      {/* Routine Selector Modal */}
      <RoutineSelectorModal
        visible={showRoutineSelector}
        onClose={() => setShowRoutineSelector(false)}
        onConfirm={handleRoutineSelection}
        selectedRoutineIds={selectedRoutineIds}
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
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    gap: Spacing.xl,
    paddingBottom: Spacing['6xl'],
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.styles.bodyBold,
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
  },
  required: {
    color: Colors.primary.DEFAULT,
  },
  input: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  daysSection: {
    gap: Spacing.md,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: Colors.primary.DEFAULT,
    ...Shadows.cyan,
  },
  dayText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.muted,
  },
  dayTextActive: {
    color: Colors.text.primary,
  },
  routinesSection: {
    gap: Spacing.md,
  },
  helperText: {
    ...Typography.styles.small,
    color: Colors.text.muted,
    marginTop: -Spacing.sm,
  },
  selectedRoutinesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  selectedRoutineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary.DEFAULT,
    gap: Spacing.sm,
    maxWidth: '100%',
  },
  selectedRoutineText: {
    ...Typography.styles.bodyBold,
    color: Colors.primary.DEFAULT,
    fontSize: Typography.fontSize.sm,
    flex: 1,
  },
  removeChipButton: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeChipIcon: {
    color: Colors.text.primary,
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
  },
  addRoutineButton: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  addRoutineIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.primary.DEFAULT,
    fontWeight: Typography.fontWeight.bold,
  },
  addRoutineText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.tertiary,
  },
  summaryCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    gap: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  summaryValue: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
  },
  actions: {
    marginTop: Spacing.md,
  },
  loader: {
    marginTop: Spacing.sm,
  },
});
