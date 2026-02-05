import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
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
import { handleApiError } from '@/services/api-error-handler';
import { GlobalStyles } from '@/styles/global';
import { Modal } from 'react-native';

type ProfileResponse = {
  name?: string;
  birthDate?: string;
  phoneNumber?: string;
  language?: string;
};

const editProfileSchema = z.object({
  name: z.string().refine((val) => val === '' || val.trim().length >= 2, {
    message: 'El nombre debe tener al menos 2 letras.',
  }),
  birthDate: z.string().refine((val) => val === '' || val.trim().length >= 8, {
    message: 'La fecha debe tener el formato completo (MM/DD/YYYY).',
  }),
  phoneNumber: z.string().refine((val) => val === '' || val.trim().length >= 8, {
    message: 'El teléfono debe tener al menos 8 dígitos.',
  }),
  language: z.enum(['spanish', 'english']).optional(),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

const formatBirthDateForInput = (value?: string) => {
  if (!value) return '';
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, yyyy, mm, dd] = match;
    return `${mm}/${dd}/${yyyy}`;
  }
  return value;
};

const normalizeBirthDate = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  
  // Buscar formato MM/DD/YYYY
  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, mm, dd, yyyy] = match;
    // Formato esperado por la API: YYYY-MM-DD
    const dateStr = `${yyyy}-${mm}-${dd}`;
    console.log('[EditProfile] Fecha convertida:', { original: value, formatted: dateStr });
    return dateStr;
  }
  
  // Si ya está en formato YYYY-MM-DD, dejarlo así
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    console.log('[EditProfile] Fecha ya en formato correcto:', trimmed);
    return trimmed;
  }
  
  console.warn('[EditProfile] Formato de fecha no reconocido:', value);
  return trimmed;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);

  const languageOptions = [
    { label: 'Español (LatAm)', value: 'spanish' },
    { label: 'English (US)', value: 'english' },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      phoneNumber: '',
      language: 'spanish',
    },
  });

  const languageValue = watch('language');

  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const loadProfile = async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${Config.apiUrl}/profiles/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 401) {
        const sessionError = new Error('Sesión expirada');
        (sessionError as any).statusCode = 401;
        throw sessionError;
      }

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'No se pudo cargar el perfil');
      }

      const data: ProfileResponse = result.data || {};
      setValue('name', data.name ?? '');
      setValue('birthDate', formatBirthDateForInput(data.birthDate));
      setValue('phoneNumber', data.phoneNumber ?? '');
      setValue('language', (data.language as 'spanish' | 'english') || 'spanish');
    } catch (error) {
      await handleApiError(error);
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.token) {
      router.replace('/login');
      return;
    }

    void loadProfile();
  }, [user?.token]);

  const onSubmit = async (data: EditProfileForm) => {
    if (!user?.token) {
      Alert.alert('Error', 'Tu sesión expiró. Inicia sesión nuevamente.');
      router.replace('/login');
      return;
    }

    const payload = {
      ...(data.name?.trim() ? { name: data.name.trim() } : {}),
      ...(data.birthDate?.trim() ? { birthDate: normalizeBirthDate(data.birthDate) } : {}),
      ...(data.phoneNumber?.trim() ? { phoneNumber: data.phoneNumber.trim() } : {}),
      ...(data.language ? { language: data.language } : {}),
    };

    console.log('[EditProfile] Payload a enviar:', JSON.stringify(payload, null, 2));

    if (Object.keys(payload).length === 0) {
      Alert.alert('Sin cambios', 'No hay información para actualizar.');
      return;
    }

    try {
      const response = await fetch(`${Config.apiUrl}/profiles`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        const sessionError = new Error('Sesión expirada');
        (sessionError as any).statusCode = 401;
        throw sessionError;
      }

      const result = await response.json();
      console.log('[EditProfile] Respuesta del servidor:', { status: response.status, result });

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'No se pudo actualizar el perfil');
      }

      Alert.alert('Listo', 'Perfil actualizado correctamente.');
      router.replace('/(tabs)/profile');
    } catch (error) {
      await handleApiError(error);
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo actualizar el perfil');
    }
  };

  const submitLabel = useMemo(() => (isSubmitting ? 'Guardando...' : 'Guardar cambios'), [isSubmitting]);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.flex} behavior={behavior}>
        <View style={styles.screen}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
            <Text style={styles.title}>Editar Perfil</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <DumbbellIcon size={26} />
                  <Text style={styles.brand}>AthletIA</Text>
                </View>
                <Text style={styles.heading}>Actualiza tu perfil</Text>
                <Text style={styles.subheading}>Modifica tu información personal cuando lo necesites.</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Información básica</Text>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Nombre"
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
                    label="Fecha de nacimiento"
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
                name="phoneNumber"
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
                name="language"
                render={({ field: { value } }) => (
                  <SelectField
                    label="Idioma / Language"
                    placeholder="Selecciona tu idioma"
                    iconName="language"
                    value={languageOptions.find((o) => o.value === value)?.label}
                    onPress={() => setLanguageSheetOpen(true)}
                  />
                )}
              />
            </View>

            <PrimaryButton
              label={submitLabel}
              onPress={handleSubmit(onSubmit, (errors) => {
                console.log('Validation errors:', errors);
                const firstError = Object.values(errors)[0];
                Alert.alert('Revisa los datos', (firstError?.message as string) || 'Verifica la información ingresada.');
              })}
              loading={isSubmitting}
            />
          </ScrollView>
        </View>

        <Modal
          visible={languageSheetOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setLanguageSheetOpen(false)}
        >
          <Pressable style={styles.sheetBackdrop} onPress={() => setLanguageSheetOpen(false)}>
            <View style={styles.sheet}>
              {languageOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={styles.sheetRow}
                  onPress={() => {
                    setValue('language', option.value as 'spanish' | 'english', { shouldValidate: true });
                    setLanguageSheetOpen(false);
                  }}
                >
                  <Text style={styles.sheetText}>{option.label}</Text>
                  {languageValue === option.value ? <Text style={styles.check}>•</Text> : null}
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
  loadingScreen: {
    ...GlobalStyles.container,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  header: {
    backgroundColor: Colors.background.DEFAULT,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.base,
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
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
  },
  title: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
  },
  headerSpacer: {
    width: 40,
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
  card: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing['3xl'],
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    ...Shadows.base,
  },
  cardTitle: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
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
