import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
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
import { useAuth } from '@/context/auth-context';
import { useTranslation } from 'react-i18next';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en-US' ? 'es-419' : 'en-US';
    i18n.changeLanguage(newLang);
    AsyncStorage.setItem('language', newLang);
  };
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorTimeoutRef = useRef<number | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Debes obtener estos IDs en Google Cloud Console
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    //iosClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setLoading(true);
        signInWithGoogle(authentication.accessToken)
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
      }
    }
  }, [response, signInWithGoogle]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMessage('');
    
    try {
      await signIn(email, password);
    } catch (error) {
      let message = 'Error al iniciar sesión. Intenta nuevamente.';
      
      if (error instanceof Error) {
        // Mensajes de error específicos del backend
        if (error.message.includes('Credenciales inválidas') || error.message.includes('Invalid credentials')) {
          message = 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else if (error.message.includes('expirado') || error.message.includes('expired')) {
          message = 'Sesión ha expirado, vuelva a iniciar sesión.';
        } else if (error.message.includes('usuario no encontrado') || error.message.includes('not found')) {
          message = 'El usuario no fue encontrado.';
        } else if (error.message.includes('usuario no verificado') || error.message.includes('not verified')) {
          message = 'Verifica tu email antes de iniciar sesión.';
        } else {
          message = error.message;
        }
      }
      
      setErrorMessage(message);
      
      // Auto-limpiar el error después de 6 segundos
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => {
        setErrorMessage('');
      }, 6000);
    } finally {
      setLoading(false);
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
                <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{t('login.welcome')}</Text>
                  <Text style={styles.caption}>{t('login.signInCaption')}</Text>
                </View>

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
                  <FormInput
                    label={t('login.passwordLabel')}
                    placeholder={t('login.passwordPlaceholder')}
                    iconName="lock"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />

                  <View style={styles.rowBetween}>
                    <Pressable style={styles.rememberRow} onPress={() => setRememberMe((prev) => !prev)}>
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                      <Text style={styles.rememberText}>{t('login.rememberMe')}</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push('/forgot-password')}>
                      <Text style={styles.link}>{t('login.forgotPassword')}</Text>
                    </Pressable>
                  </View>

                  <PrimaryButton
                    label={t('login.loginButton')}
                    onPress={handleLogin}
                    loading={loading}
                    disabled={!email.trim() || !password.trim()}
                  />

                  <View style={styles.dividerRow}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>{t('login.orContinueWith')}</Text>
                    <View style={styles.divider} />
                  </View>

                  <Pressable 
                    style={styles.googleButton}
                    onPress={() => WebBrowser.openBrowserAsync(`${Config.apiUrl}/auth/google`)}
                    disabled={loading}
                  >
                    <View style={styles.googleIconWrapper}>
                      <Image 
                        source={require('@/assets/images/g-logo.png')} 
                        style={{ width: 18, height: 18 }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.googleLabel}>{t('login.google')}</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>{t('login.noAccount')}</Text>
                <Pressable onPress={() => router.push('/signup' as any)} disabled={loading}>
                  <Text style={styles.footerLink}>{t('login.signUp')}</Text>
                </Pressable>
              </View>

              <Pressable onPress={toggleLanguage} style={{ alignSelf: 'center', marginTop: 20, padding: 10 }}>
                <Text style={{ color: '#fff', opacity: 0.6, fontSize: 12 }}>
                  {i18n.language === 'en-US' ? 'Cambiar a Español 🇲🇽' : 'Switch to English 🇺🇸'}
                </Text>
              </Pressable>
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
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 64,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
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
  subtitle: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(24, 32, 46, 0.94)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardHeader: {
    marginBottom: 18,
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
  form: {
    gap: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
  },
  checkboxChecked: {
    backgroundColor: '#00aeef',
    borderColor: '#00aeef',
  },
  rememberText: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '600',
  },
  link: {
    color: '#00aeef',
    fontSize: 15,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
  },
  dividerText: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  googleButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.28)',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  googleIcon: {
    fontWeight: '800',
    color: '#4285F4',
  },
  googleLabel: {
    color: '#e2e8f0',
    fontWeight: '800',
    fontSize: 15,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '500',
  },
  footerLink: {
    color: '#00aeef',
    fontSize: 15,
    fontWeight: '800',
  },
});
