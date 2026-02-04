import { PrimaryButton } from '@/components/ui/primary-button';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useSplits, type Split } from '@/hooks/use-splits';
import type { TrainingDay } from '@/services/splits-api';
import { GlobalStyles } from '@/styles/global';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function SplitDetailScreen() {
  const { t } = useTranslation(['splits', 'common']);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchSplitById, updateSplit, loading } = useSplits();

  const daysShort = t('splits.daysShort', { returnObjects: true }) as string[];
  const daysLong = t('splits.daysLong', { returnObjects: true }) as string[];

  const daysOfWeek = useMemo(() => [
    { id: 'Monday', label: daysShort[0], full: daysLong[0] },
    { id: 'Tuesday', label: daysShort[1], full: daysLong[1] },
    { id: 'Wednesday', label: daysShort[2], full: daysLong[2] },
    { id: 'Thursday', label: daysShort[3], full: daysLong[3] },
    { id: 'Friday', label: daysShort[4], full: daysLong[4] },
    { id: 'Saturday', label: daysShort[5], full: daysLong[5] },
    { id: 'Sunday', label: daysShort[6], full: daysLong[6] },
  ], [daysShort, daysLong]);

  const [split, setSplit] = useState<Split | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<TrainingDay[]>([]);

  useEffect(() => {
    if (id) {
      loadSplit();
    }
  }, [id]);

  const loadSplit = async () => {
    if (!id) return;

    const splitData = await fetchSplitById(id);
    if (splitData) {
      setSplit(splitData);
      setName(splitData.name);
      setDescription(splitData.description);
      setSelectedDays(splitData.trainingDays);
    } else {
      Alert.alert(t('common.error'), t('splits.detail.loadError'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    }
  };

  const toggleDay = (dayId: TrainingDay) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleSave = async () => {
    if (!split || !name.trim() || selectedDays.length === 0) {
      Alert.alert(t('common.error'), t('splits.detail.validationError'));
      return;
    }

    const result = await updateSplit(split.id, {
      name: name.trim(),
      description: description.trim(),
      trainingDays: selectedDays,
    });

    if (result) {
      setSplit(result);
      setIsEditing(false);
      Alert.alert(t('common.success'), t('splits.detail.updateSuccess'));
    } else {
      Alert.alert(t('common.error'), t('splits.detail.updateError'));
    }
  };

  const handleCancel = () => {
    if (split) {
      setName(split.name);
      setDescription(split.description);
      setSelectedDays(split.trainingDays);
    }
    setIsEditing(false);
  };

  if (!split && loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        <Text style={styles.loadingText}>{t('splits.detail.loading')}</Text>
      </View>
    );
  }

  if (!split) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorText}>{t('splits.detail.notFound')}</Text>
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
        <Text style={styles.title}>{t('splits.detail.title')}</Text>
        {!isEditing && (
          <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editIcon}>✏️</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isEditing ? (
          <>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('splits.detail.labels.name')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('splits.detail.placeholders.name')}
                placeholderTextColor={Colors.text.muted}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('splits.detail.labels.description')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('splits.detail.placeholders.description')}
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
                {t('splits.detail.labels.days')} <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.daysGrid}>
                {daysOfWeek.map((day) => (
                  <Pressable
                    key={day.id}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day.id as TrainingDay) && styles.dayButtonActive,
                    ]}
                    onPress={() => toggleDay(day.id as TrainingDay)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selectedDays.includes(day.id as TrainingDay) && styles.dayTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    label={loading ? t('common.loading') : t('common.save')}
                    onPress={handleSave}
                    disabled={!name || selectedDays.length === 0 || loading}
                  />
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.splitName}>{split.name}</Text>
              {split.description && (
                <Text style={styles.splitDescription}>{split.description}</Text>
              )}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>{t('splits.detail.labels.days')}:</Text>
                <Text style={styles.metaValue}>
                  {split.trainingDays.length} {split.trainingDays.length === 1 ? t('splits.frequency.day') : t('splits.frequency.days')} / {t('splits.frequency.week')}
                </Text>
              </View>
            </View>

            {/* Days Display */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('splits.detail.labels.days')}</Text>
              <View style={styles.daysDisplayGrid}>
                {daysOfWeek.map((day) => {
                  const isActive = split.trainingDays.includes(day.id as TrainingDay);
                  return (
                    <View key={day.id} style={styles.dayDisplayCard}>
                      <View
                        style={[
                          styles.dayDisplayCircle,
                          isActive && styles.dayDisplayCircleActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayDisplayText,
                            isActive && styles.dayDisplayTextActive,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </View>
                      <Text style={styles.dayDisplayLabel}>{day.full}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Routines Section */}
            {split.routines && split.routines.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('routines.title')}</Text>
                {split.routines.map((routine) => (
                  <View key={routine.id} style={styles.routineCard}>
                    <Text style={styles.routineName}>{routine.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Metadata */}
            <View style={styles.metadataCard}>
              {split.createdAt && (
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>{t('routines.detail.info.created')}</Text>
                  <Text style={styles.metadataValue}>
                    {new Date(split.createdAt).toLocaleDateString(i18n.language)}
                  </Text>
                </View>
              )}
              {split.updatedAt && (
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>{t('routines.detail.info.updated')}</Text>
                  <Text style={styles.metadataValue}>
                    {new Date(split.updatedAt).toLocaleDateString(i18n.language)}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
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
  actions: {
    marginTop: Spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.tertiary,
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
  splitName: {
    ...Typography.styles.h2,
    fontSize: Typography.fontSize['2xl'],
  },
  splitDescription: {
    ...Typography.styles.body,
    color: Colors.text.tertiary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
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
  daysDisplayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  dayDisplayCard: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: 60,
  },
  dayDisplayCircle: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
  },
  dayDisplayCircleActive: {
    backgroundColor: Colors.primary.DEFAULT,
    borderColor: Colors.primary.DEFAULT,
    ...Shadows.cyan,
  },
  dayDisplayText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.muted,
  },
  dayDisplayTextActive: {
    color: Colors.text.primary,
  },
  dayDisplayLabel: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  routineCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  routineName: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
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
