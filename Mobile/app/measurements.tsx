import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Config } from '@/constants';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { handleApiError } from '@/services/api-error-handler';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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

type Measurement = {
  id: string;
  weight: number;
  height: number;
  imc: number;
  left_arm: number;
  right_arm: number;
  left_forearm: number;
  right_forearm: number;
  clavicular_width: number;
  neck_diameter: number;
  chest_size: number;
  back_width: number;
  hip_diameter: number;
  left_leg: number;
  right_leg: number;
  left_calve: number;
  right_calve: number;
  checkTime: string;
  createdAt: string;
  updatedAt: string;
};

type MeasurementFormData = {
  weight: string;
  height: string;
  left_arm: string;
  right_arm: string;
  left_forearm: string;
  right_forearm: string;
  clavicular_width: string;
  neck_diameter: string;
  chest_size: string;
  back_width: string;
  hip_diameter: string;
  left_leg: string;
  right_leg: string;
  left_calve: string;
  right_calve: string;
  checkTime: string;
};

type FieldConfig = {
  key: keyof MeasurementFormData;
  label: string;
  unit?: string;
  required?: boolean;
};

// Removed CHECK_TIME_OPTIONS generic declaration to use inside hook
// Removed FIELD_SECTIONS generic declaration

const normalizeCheckTime = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.toUpperCase();
  // Simple validation for the 3 known values
  return ['WEEKLY', 'MONTHLY', 'YEARLY'].includes(normalized) ? normalized : undefined;
};

const formatDate = (value?: string) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(); // Removed hardcoded locale
};

const formatValue = (value: number | string | undefined | null, unit?: string) => {
  if (value === undefined || value === null) return '--';
  return unit ? `${value} ${unit}` : String(value);
};

const measurementToFormData = (measurement: Measurement | null): MeasurementFormData => {
  if (!measurement) {
    return {
      weight: '',
      height: '',
      left_arm: '',
      right_arm: '',
      left_forearm: '',
      right_forearm: '',
      clavicular_width: '',
      neck_diameter: '',
      chest_size: '',
      back_width: '',
      hip_diameter: '',
      left_leg: '',
      right_leg: '',
      left_calve: '',
      right_calve: '',
      checkTime: 'WEEKLY',
    };
  }

  return {
    weight: String(measurement.weight || ''),
    height: String(measurement.height || ''),
    left_arm: String(measurement.left_arm || ''),
    right_arm: String(measurement.right_arm || ''),
    left_forearm: String(measurement.left_forearm || ''),
    right_forearm: String(measurement.right_forearm || ''),
    clavicular_width: String(measurement.clavicular_width || ''),
    neck_diameter: String(measurement.neck_diameter || ''),
    chest_size: String(measurement.chest_size || ''),
    back_width: String(measurement.back_width || ''),
    hip_diameter: String(measurement.hip_diameter || ''),
    left_leg: String(measurement.left_leg || ''),
    right_leg: String(measurement.right_leg || ''),
    left_calve: String(measurement.left_calve || ''),
    right_calve: String(measurement.right_calve || ''),
    checkTime: normalizeCheckTime(measurement.checkTime) || 'WEEKLY',
  };
};

export default function MeasurementsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [formData, setFormData] = useState<MeasurementFormData>(measurementToFormData(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic Options
  const CHECK_TIME_OPTIONS = useMemo(() => [
    { value: 'WEEKLY', label: t('measurements.frequency.options.weekly') },
    { value: 'MONTHLY', label: t('measurements.frequency.options.monthly') },
    { value: 'YEARLY', label: t('measurements.frequency.options.yearly') },
  ], [t]);

  const FIELD_SECTIONS: { title: string; fields: FieldConfig[] }[] = useMemo(() => [
    {
      title: t('measurements.sections.composition'),
      fields: [
        { key: 'weight', label: t('measurements.fields.weight'), unit: 'kg', required: true },
        { key: 'height', label: t('measurements.fields.height'), unit: 'cm', required: true },
      ],
    },
    {
      title: t('measurements.sections.upperBody'),
      fields: [
        { key: 'left_arm', label: t('measurements.fields.left_arm'), unit: 'cm' },
        { key: 'right_arm', label: t('measurements.fields.right_arm'), unit: 'cm' },
        { key: 'left_forearm', label: t('measurements.fields.left_forearm'), unit: 'cm' },
        { key: 'right_forearm', label: t('measurements.fields.right_forearm'), unit: 'cm' },
        { key: 'clavicular_width', label: t('measurements.fields.clavicular_width'), unit: 'cm' },
        { key: 'neck_diameter', label: t('measurements.fields.neck_diameter'), unit: 'cm' },
        { key: 'chest_size', label: t('measurements.fields.chest_size'), unit: 'cm' },
        { key: 'back_width', label: t('measurements.fields.back_width'), unit: 'cm' },
      ],
    },
    {
      title: t('measurements.sections.lowerBody'),
      fields: [
        { key: 'hip_diameter', label: t('measurements.fields.hip_diameter'), unit: 'cm' },
        { key: 'left_leg', label: t('measurements.fields.left_leg'), unit: 'cm' },
        { key: 'right_leg', label: t('measurements.fields.right_leg'), unit: 'cm' },
        { key: 'left_calve', label: t('measurements.fields.left_calve'), unit: 'cm' },
        { key: 'right_calve', label: t('measurements.fields.right_calve'), unit: 'cm' },
      ],
    },
  ], [t]);


  const summaryRows = useMemo(
    () => [
      { label: t('measurements.summary.lastUpdate'), value: formatDate(measurement?.updatedAt) },
      { label: t('measurements.summary.bmi'), value: formatValue(measurement?.imc) },
    ],
    [measurement, t]
  );

  const loadMeasurement = async () => {
    if (!user?.token) {
      setError(t('measurements.errors.session'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${Config.apiUrl}/measurements/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 401) {
        const sessionError = new Error(t('measurements.errors.expired'));
        (sessionError as any).statusCode = 401;
        throw sessionError;
      }

      const result = await response.json();

      if (response.status === 404) {
        setMeasurement(null);
        setFormData(measurementToFormData(null));
        setIsEditing(true);
        return;
      }

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || t('measurements.errors.load'));
      }

      setMeasurement(result.data);
      setFormData(measurementToFormData(result.data));
      setIsEditing(false);
    } catch (err) {
      await handleApiError(err);
      setError(err instanceof Error ? err.message : t('measurements.errors.load'));
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof MeasurementFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.weight || !formData.height || !formData.checkTime) {
      return t('measurements.errors.required');
    }

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (isNaN(weight) || weight <= 0) {
      return t('measurements.errors.invalidWeight');
    }

    if (isNaN(height) || height <= 0) {
      return t('measurements.errors.invalidHeight');
    }

    return null;
  };

  const handleSave = async () => {
    if (!user?.token) return;

    const validationError = validateForm();
    if (validationError) {
      Alert.alert(t('measurements.errors.validation'), validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        checkTime: formData.checkTime,
      };

      // Agregar campos opcionales solo si tienen valor
      const optionalFields = [
        'left_arm',
        'right_arm',
        'left_forearm',
        'right_forearm',
        'clavicular_width',
        'neck_diameter',
        'chest_size',
        'back_width',
        'hip_diameter',
        'left_leg',
        'right_leg',
        'left_calve',
        'right_calve',
      ];

      optionalFields.forEach((field) => {
        const value = formData[field as keyof MeasurementFormData];
        if (value && value.trim() !== '') {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            payload[field] = numValue;
          }
        }
      });

      const isCreating = !measurement;
      const response = await fetch(`${Config.apiUrl}/measurements/me`, {
        method: isCreating ? 'POST' : 'PATCH',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        const sessionError = new Error(t('measurements.errors.expired'));
        (sessionError as any).statusCode = 401;
        throw sessionError;
      }

      const result = await response.json();

      if (response.status === 404 && !isCreating) {
        Alert.alert(
          t('common.error'),
          t('measurements.errors.notFound'),
          [{ text: 'OK', onPress: () => void loadMeasurement() }]
        );
        return;
      }

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || t('measurements.errors.save'));
      }

      setMeasurement(result.data);
      setFormData(measurementToFormData(result.data));
      setIsEditing(false);
      Alert.alert(t('measurements.success.title'), isCreating ? t('measurements.success.created') : t('measurements.success.updated'));
    } catch (err) {
      await handleApiError(err);
      setError(err instanceof Error ? err.message : t('measurements.errors.save'));
      console.error('Error saving measurements:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(measurementToFormData(measurement));
  };

  const handleCancel = () => {
    if (!measurement) {
      router.back();
      return;
    }
    setIsEditing(false);
    setFormData(measurementToFormData(measurement));
    setError(null);
  };

  useEffect(() => {
    void loadMeasurement();
  }, [user?.token]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>{t('measurements.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {measurement ? t('measurements.subtitle.update') : t('measurements.subtitle.create')}
          </Text>
        </View>
        {measurement && !isEditing && (
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editIcon}>✏️</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!measurement && !isEditing ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{t('measurements.empty.title')}</Text>
            <Text style={styles.emptyText}>{t('measurements.empty.text')}</Text>
            <PrimaryButton
              label={t('measurements.empty.button')}
              onPress={() => setIsEditing(true)}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <>
            {measurement && !isEditing && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('measurements.summary.title')}</Text>
                <View style={styles.summaryCard}>
                  {summaryRows.map((row) => (
                    <View key={row.label} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{row.label}</Text>
                      <Text style={styles.summaryValue}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('measurements.frequency.title')}</Text>
              <Text style={styles.sectionHint}>
                {t('measurements.frequency.hint')}
              </Text>
              <View style={styles.optionGroup}>
                {CHECK_TIME_OPTIONS.map((option) => {
                  const isActive = formData.checkTime === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.optionChip, isActive && styles.optionChipActive]}
                      onPress={() => isEditing && handleInputChange('checkTime', option.value)}
                      disabled={!isEditing}
                    >
                      <Text
                        style={[styles.optionChipText, isActive && styles.optionChipTextActive]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {FIELD_SECTIONS.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.card}>
                  {section.fields.map((field) => (
                    <FormInput
                      key={field.key}
                      label={`${field.label}${field.required ? ' *' : ''}`}
                      value={formData[field.key]}
                      onChangeText={(value) => handleInputChange(field.key, value)}
                      keyboardType="numeric"
                      placeholder={field.unit ? t('measurements.placeholders.example', { value: 70, unit: field.unit }) : t('measurements.placeholders.value')}
                      editable={isEditing}
                    />
                  ))}
                </View>
              </View>
            ))}

            {isEditing && (
              <View style={styles.actionButtons}>
                <Pressable style={styles.cancelButton} onPress={handleCancel} disabled={saving}>
                  <Text style={styles.cancelButtonText}>{t('measurements.actions.cancel')}</Text>
                </Pressable>
                <PrimaryButton
                  label={measurement ? t('measurements.actions.save') : t('measurements.actions.create')}
                  onPress={handleSave}
                  loading={saving}
                  style={styles.saveButtonFlex}
                />
              </View>
            )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.DEFAULT,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
  },
  backIcon: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.text.primary,
    marginTop: -2,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.styles.h3,
  },
  headerSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: Spacing['6xl'],
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.error.DEFAULT,
  },
  emptyCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadows.base,
    gap: Spacing.base,
  },
  emptyTitle: {
    ...Typography.styles.h3,
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  emptyButton: {
    marginTop: Spacing.sm,
  },
  section: {
    gap: Spacing.base,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
  },
  sectionHint: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  summaryCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadows.base,
    gap: Spacing.base,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  summaryValue: {
    ...Typography.styles.bodyBold,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.secondary,
  },
  optionChipActive: {
    backgroundColor: Colors.primary.DEFAULT,
    borderColor: Colors.primary.DEFAULT,
  },
  optionChipText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.muted,
  },
  optionChipTextActive: {
    color: Colors.background.DEFAULT,
  },
  card: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadows.base,
    gap: Spacing.base,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.DEFAULT,
  },
  editIcon: {
    fontSize: Typography.fontSize.base,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  cancelButtonText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
  },
  saveButtonFlex: {
    flex: 1,
  },
});
