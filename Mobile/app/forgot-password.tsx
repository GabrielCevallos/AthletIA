import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { DumbbellIcon } from '@/components/ui/dumbbell-icon';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Config } from '@/constants';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const errorTimeoutRef = useRef<number | null>(null);

  const handleResetPassword = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${Config.apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage(t('forgotPasswordScreen.successMessage'));
      } else {
        if (response.status === 429) {
             setErrorMessage(t('forgotPasswordScreen.errorTooManyRequests'));
        } else {
             setErrorMessage(t('forgotPasswordScreen.errorGeneric'));
        }
      }
    } catch (error) {
       console.error(error);
       setErrorMessage(t('forgotPasswordScreen.errorGeneric'));
    } finally {
      setLoading(false);
      
      // Auto clear error after 6 seconds if it exists
      if (errorMessage) {
          if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
          errorTimeoutRef.current = setTimeout(() => {
            setErrorMessage('');
          }, 6000);
      }
    }
  };
  
  const clearError = () => {
    setErrorMessage('');
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
  };

  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior={behavior} style={styles.flex}>
        <ImageBackground
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfzNczDkf9uLXuT1nMGjw-cBLfX1oy1gPGgyW5DWQ3gakna78yUDIUVlFR0pN-MEvTHcb815XiqC-3T0SF8B7NzuOR8Bow1YiVoXDGCB_PSkmKCD24KTzf9vtAT15fLKEPItM-CA9rKf3FX0o6Y1o2UjFzYxYncSW0BCThZuLo59shXiKfhxqHngVkIN8PpjDjiEkbj-Riq6aL29LbGFPApEQ5fnRVdxLHOC-TPb2R-V_G7MqyXAljKdYBx3aP4DBnURhoSySSx14',
          }}
          style={styles.background}
          resizeMode="cover">
          <View style={styles.overlay}>
            <View style={styles.container}>
              <View style={styles.header}>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <DumbbellIcon size={32} />
                  <Text style={styles.logo}>ATHLET<Text style={styles.logoAccent}>IA</Text></Text>
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{t('forgotPasswordScreen.title')}</Text>
                  <Text style={styles.caption}>{t('forgotPasswordScreen.caption')}</Text>
                </View>

                 {successMessage ? (
                    <View style={styles.successContainer}>
                        <Text style={styles.successIcon}>✓</Text>
                        <Text style={styles.successTitle}>{t('forgotPasswordScreen.successTitle')}</Text>
                        <Text style={styles.successMessage}>{successMessage}</Text>
                    </View>
                ) : null}

                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <View style={styles.errorContent}>
                      <Text style={styles.errorTitle}>{t('errors.authError')}</Text>
                      <Text style={styles.errorMessage}>{errorMessage}</Text>
                    </View>
                    <Pressable onPress={clearError} style={styles.errorCloseButton}>
                      <Text style={styles.errorCloseIcon}>✕</Text>
                    </Pressable>
                  </View>
                ) : null}

                <View style={styles.form}>
                  <FormInput
                    label={t('login.emailLabel')} 
                    placeholder={t('login.emailPlaceholder')}
                    iconName="mail"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />

                  <PrimaryButton
                    label={t('forgotPasswordScreen.sendButton')}
                    onPress={handleResetPassword}
                    loading={loading}
                    disabled={!email.trim() || loading}
                  />
                  
                  <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{t('forgotPasswordScreen.backToLogin')}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: '#e5e7eb',
    letterSpacing: 0.5,
  },
  logoAccent: {
    color: '#00aeef',
  },
  card: {
    backgroundColor: 'rgba(24, 32, 46, 0.94)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 4,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
  },
  caption: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.5)',
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  errorIcon: {
    fontSize: 20,
    marginTop: 2,
    color: '#ef4444',
  },
  errorContent: {
    flex: 1,
    gap: 4,
  },
  errorTitle: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  errorMessage: {
    color: '#f8d7da',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  errorCloseButton: {
    padding: 4,
    marginTop: -2,
  },
  errorCloseIcon: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    backgroundColor: 'rgba(5, 150, 105, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.4)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  successIcon: {
    fontSize: 24,
    color: '#34d399',
    marginBottom: 4,
  },
  successTitle: {
    color: '#34d399',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  successMessage: {
    color: '#d1fae5',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#00aeef',
    fontSize: 15,
    fontWeight: '800',
  },
});