import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

import { DumbbellIcon } from '@/components/ui/dumbbell-icon';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SelectField } from '@/components/ui/select-field';
import { Config } from '@/constants';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { GlobalStyles } from '@/styles/global';

// Schema definition moved inside component for translation
type FormValues = {
  fullName: string;
  birthDate: string;
  phone: string;
  gender: 'male' | 'female';
  goals: string[];
};

export default function CompleteProfileScreen() {
  const { t } = useTranslation();
  const { setProfileCompleted, user } = useAuth();
  const [genderSheetOpen, setGenderSheetOpen] = useState(false);

  const profileSchema = useMemo(() => z.object({
    fullName: z.string().min(2, t('completeProfile.validation.fullName')),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('completeProfile.validation.birthDate')),
    phone: z.string().regex(/^\d{10}$/, t('completeProfile.validation.phone')),
    gender: z.enum(['male', 'female']),
    goals: z.array(z.string()).min(1, t('completeProfile.validation.goals')),
  }), [t]);

  const genderOptions = useMemo(() => [
    { label: t('completeProfile.genderOptions.male'), value: 'male' },
    { label: t('completeProfile.genderOptions.female'), value: 'female' },
  ], [t]);
  
  const goalOptions = useMemo(() => [
    { label: t('completeProfile.goalOptions.weight_loss'), value: 'weight_loss' },
    { label: t('completeProfile.goalOptions.muscle_gain'), value: 'muscle_gain' },
    { label: t('completeProfile.goalOptions.weight_maintenance'), value: 'weight_maintenance' },
    { label: t('completeProfile.goalOptions.endurance'), value: 'endurance' },
    { label: t('completeProfile.goalOptions.flexibility'), value: 'flexibility' },
    { label: t('completeProfile.goalOptions.general_fitness'), value: 'general_fitness' },
    { label: t('completeProfile.goalOptions.rehabilitation'), value: 'rehabilitation' },
    { label: t('completeProfile.goalOptions.improved_posture'), value: 'improved_posture' },
  ], [t]);

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

  const onSubmit = async (data: FormValues) => {
    if (!user?.token) {
      Alert.alert(t('signup.errorTitle'), t('completeProfile.errors.sessionExpired'));
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
          birthDate: data.birthDate.trim(),
          phoneNumber: data.phone.replace(/\D/g, ''),
          gender: data.gender,
          fitGoals: data.goals,
          language: 'spanish',
        }),
      });

      const result = await response.json();

      if (!result?.success) {
        const errorMessage = Array.isArray(result?.message)
          ? result.message.join('\n')
          : result?.message || t('completeProfile.errors.profileIncomplete');
          
        Alert.alert(t('signup.errorTitle'), errorMessage);
        return;
      }

      await setProfileCompleted();
    } catch (error) {
      console.error('Complete profile failed', error);
      Alert.alert(t('signup.errorTitle'), t('completeProfile.errors.profileFailed'));
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <DumbbellIcon size={28} />
                  <Text style={styles.brand}>AthletIA</Text>
                </View>
                <Text style={styles.heading}>{t('completeProfile.title')}</Text>
                <Text style={styles.subheading}>
                  {t('completeProfile.subtitle')}
                </Text>
              </View>
            </View>

            <View style={styles.formBlock}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label={t('completeProfile.fullNameLabel')}
                    placeholder={t('completeProfile.fullNamePlaceholder')}
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
                    label={t('completeProfile.birthDateLabel')}
                    placeholder={t('completeProfile.birthDatePlaceholder')}
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
                    label={t('completeProfile.phoneLabel')}
                    placeholder="5512345678"
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
                    label={t('completeProfile.genderLabel')}
                    placeholder={t('completeProfile.genderPlaceholder')}
                    iconName="wc"
                    value={genderOptions.find((g) => g.value === value)?.label}
                    onPress={() => setGenderSheetOpen(true)}
                  />
                )}
              />
            </View>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionIcon}>🏆</Text>
                <Text style={styles.sectionTitle}>{t('completeProfile.goalsTitle')}</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
              {t('completeProfile.goalsSubtitle')}
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
              label={t('completeProfile.submitButton')}
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
