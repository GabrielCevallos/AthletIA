import { PrimaryButton } from '@/components/ui/primary-button';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const DAYS_OF_WEEK = [
  { id: 'mon', label: 'L', full: 'Lunes' },
  { id: 'tue', label: 'M', full: 'Martes' },
  { id: 'wed', label: 'X', full: 'Miércoles' },
  { id: 'thu', label: 'J', full: 'Jueves' },
  { id: 'fri', label: 'V', full: 'Viernes' },
  { id: 'sat', label: 'S', full: 'Sábado' },
  { id: 'sun', label: 'D', full: 'Domingo' },
];

export default function CreateSplitScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'thu', 'fri']);

  const toggleDay = (dayId: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>Nuevo Split</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Crea un nuevo plan de entrenamiento personalizado.</Text>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Nombre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Push/Pull/Legs"
            placeholderTextColor={Colors.text.muted}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe tu split..."
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
            Días de entrenamiento <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <Pressable
                key={day.id}
                style={[styles.dayButton, selectedDays.includes(day.id) && styles.dayButtonActive]}
                onPress={() => toggleDay(day.id)}
              >
                <Text
                  style={[styles.dayText, selectedDays.includes(day.id) && styles.dayTextActive]}
                >
                  {day.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Días de entrenamiento:</Text>
            <Text style={styles.summaryValue}>{selectedDays.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Días de descanso:</Text>
            <Text style={styles.summaryValue}>{7 - selectedDays.length}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <PrimaryButton
            label="Crear Split"
            onPress={() => {
              // TODO: Save split
              router.back();
            }}
            disabled={!name || selectedDays.length === 0}
          />
        </View>
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
});
