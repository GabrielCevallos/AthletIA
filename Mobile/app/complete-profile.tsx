import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { z } from 'zod';

import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SelectField } from '@/components/ui/select-field';
import { Config } from '@/constants';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { GlobalStyles } from '@/styles/global';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Ingresa tu nombre'),
  birthDate: z.string().min(4, 'Ingresa tu fecha de nacimiento'),
  phone: z.string().min(8, 'Ingresa tu teléfono'),
  gender: z.enum(['male', 'female']),
  weightKg: z
    .string()
    .refine((val) => Number(val) > 0, { message: 'Ingresa un peso válido' }),
  heightCm: z
    .string()
    .refine((val) => Number(val) > 0, { message: 'Ingresa una altura válida' }),
  goals: z.array(z.string()).min(1, 'Selecciona al menos un objetivo'),
});

type FormValues = z.infer<typeof profileSchema>;

const genderOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
];

const goalOptions = [
  { label: 'Bajar de peso', value: 'weight_loss' },
  { label: 'Ganar músculo', value: 'muscle_gain' },
  { label: 'Mantener peso', value: 'weight_maintenance' },
  { label: 'Resistencia', value: 'endurance' },
  { label: 'Flexibilidad', value: 'flexibility' },
  { label: 'Fitness general', value: 'general_fitness' },
  { label: 'Rehabilitación', value: 'rehabilitation' },
  { label: 'Postura', value: 'improved_posture' },
];

export default function CompleteProfileScreen() {
  const { setProfileCompleted, user } = useAuth();
  const [genderSheetOpen, setGenderSheetOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      phone: '',
      gender: undefined as unknown as FormValues['gender'],
      weightKg: '',
      heightCm: '',
      goals: [],
    },
  });

  const goals = watch('goals');
  const genderValue = watch('gender');

  const toggleGoal = (value: string) => {
    const exists = goals.includes(value);
    const next = exists ? goals.filter((g) => g !== value) : [...goals, value];
    setValue('goals', next, { shouldValidate: true });
  };

  const normalizeBirthDate = (value: string) => {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const [, mm, dd, yyyy] = match;
      return `${yyyy}-${mm}-${dd}`;
    }
    return trimmed;
  };

  const onSubmit = async (data: FormValues) => {
    if (!user?.token) {
      Alert.alert('Error', 'Tu sesión expiró. Inicia sesión nuevamente.');
      router.replace('/login');
      return;
    }

    try {
      const response = await fetch(`${Config.apiUrl}/profiles/complete-setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: data.fullName.trim(),
          birthDate: normalizeBirthDate(data.birthDate),
          phoneNumber: data.phone.trim(),
          gender: data.gender,
          fitGoals: data.goals,
        }),
      });

      const result = await response.json();

      if (!result?.success) {
        Alert.alert('Error', result?.message || 'No se pudo completar el perfil');
        return;
      }

      await setProfileCompleted();
    } catch (error) {
      console.error('Complete profile failed', error);
      Alert.alert('Error', 'No se pudo completar el perfil. Intenta más tarde.');
    }
  };

  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.flex} behavior={behavior}>
        <View style={styles.screen}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon} />
              <View>
                <Text style={styles.brand}>AthletIA</Text>
                <Text style={styles.heading}>Completar Perfil</Text>
                <Text style={styles.subheading}>
                  Ayúdanos a personalizar tu experiencia de entrenamiento.
                </Text>
              </View>
            </View>

            <View style={styles.formBlock}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Nombre Completo"
                    placeholder="Ej. Juan Pérez"
                    iconName="person"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Fecha de Nacimiento"
                    placeholder="mm/dd/yyyy"
                    iconName="calendar-today"
                    keyboardType="numbers-and-punctuation"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Teléfono"
                    placeholder="55 1234 5678"
                    iconName="smartphone"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="gender"
                render={({ field: { value } }) => (
                  <SelectField
                    label="Género"
                    placeholder="Selecciona..."
                    iconName="wc"
                    value={genderOptions.find((g) => g.value === value)?.label}
                    onPress={() => setGenderSheetOpen(true)}
                  />
                )}
              />

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Controller
                    control={control}
                    name="weightKg"
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label="Peso (kg)"
                        placeholder="70"
                        iconName="fitness-center"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
                <View style={styles.rowItem}>
                  <Controller
                    control={control}
                    name="heightCm"
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label="Altura (cm)"
                        placeholder="175"
                        iconName="height"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionIcon}>🏆</Text>
                <Text style={styles.sectionTitle}>Objetivos Fitness</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Selecciona uno o más objetivos para adaptar tus rutinas.
              </Text>
            </View>

            <View style={styles.grid}>
              {goalOptions.map((goal) => {
                const selected = goals.includes(goal.value);
                return (
                  <Pressable
                    key={goal.value}
                    onPress={() => toggleGoal(goal.value)}
                    style={[styles.goalCard, selected && styles.goalCardSelected]}
                  >
                    <Text style={[styles.goalText, selected && styles.goalTextSelected]}>
                      {goal.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <PrimaryButton
              label="Completar Registro"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>

        <Modal visible={genderSheetOpen} transparent animationType="fade" onRequestClose={() => setGenderSheetOpen(false)}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setGenderSheetOpen(false)}>
            <View style={styles.sheet}>
              {genderOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={styles.sheetRow}
                  onPress={() => {
                    setValue('gender', option.value as FormValues['gender'], { shouldValidate: true });
                    setGenderSheetOpen(false);
                  }}>
                  <Text style={styles.sheetText}>{option.label}</Text>
                  {genderValue === option.value ? <Text style={styles.check}>•</Text> : null}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.lg,
  },
  heroHeader: {
    ...GlobalStyles.header,
  },
  heroIcon: {
    ...GlobalStyles.headerIcon,
  },
  brand: {
    ...GlobalStyles.brand,
  },
  heading: {
    ...GlobalStyles.heading,
  },
  subheading: {
    ...GlobalStyles.subheading,
  },
  formBlock: {
    gap: Spacing.base,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  sectionHeader: {
    ...GlobalStyles.sectionHeader,
  },
  sectionTitleRow: {
    ...GlobalStyles.sectionTitleRow,
  },
  sectionIcon: {
    ...GlobalStyles.sectionIcon,
  },
  sectionTitle: {
    ...GlobalStyles.sectionTitle,
  },
  sectionSubtitle: {
    ...GlobalStyles.sectionSubtitle,
  },
  grid: {
    ...GlobalStyles.grid,
  },
  goalCard: {
    width: '48%',
    minHeight: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: Spacing.md,
  },
  goalCardSelected: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.light,
    ...Shadows.cyan,
  },
  goalText: {
    ...Typography.styles.bodyBold,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  goalTextSelected: {
    color: Colors.background.DEFAULT,
  },
  submitButton: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius['2xl'],
  },
  sheetBackdrop: {
    ...GlobalStyles.modalBackdrop,
  },
  sheet: {
    ...GlobalStyles.modalSheet,
  },
  sheetRow: {
    ...GlobalStyles.modalSheetRow,
  },
  sheetText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  check: {
    color: Colors.primary.light,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.extrabold,
  },
});
