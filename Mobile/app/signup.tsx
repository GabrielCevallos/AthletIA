import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ImageBackground,
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

import { DumbbellIcon } from '@/components/ui/dumbbell-icon';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Config } from '@/constants';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleSignup(authentication.accessToken);
      }
    }
  }, [response]);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      setPasswordStrength('weak');
    } else if (pass.length < 12 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };

  const isPasswordValid = (): boolean => {
    if (password.length < 8) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${Config.apiUrl}/auth/register-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        Alert.alert('Error', result.message || 'Error al crear la cuenta');
        return;
      }

      // Redirigir a pantalla de verificación enviada
      router.push('/verification-email-sent');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (googleToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${Config.apiUrl}/auth/google/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const result = await response.json();

      if (!result.success) {
        Alert.alert('Error', result.message || 'Error con Google Sign Up');
        return;
      }

      // Redirigir a pantalla de verificación enviada
      router.push('/verification-email-sent');
    } catch (error) {
      console.error('Google signup error:', error);
      Alert.alert('Error', 'No se pudo registrar con Google. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'strong':
        return '#10b981';
      default:
        return 'transparent';
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'Débil';
      case 'medium':
        return 'Media';
      case 'strong':
        return 'Fuerte';
      default:
        return '';
    }
  };

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
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <DumbbellIcon size={32} />
                    <Text style={styles.logo}>ATHLET<Text style={styles.logoAccent}>IA</Text></Text>
                  </View>
                  <Text style={styles.subtitle}>¡Comienza tu transformación hoy!</Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.caption}>Crea una cuenta nueva</Text>
                  </View>

                  <View style={styles.form}>
                    <FormInput
                      label="Email"
                      placeholder="tu@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      editable={!loading}
                    />

                    <View>
                      <FormInput
                        label="Contraseña"
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={handlePasswordChange}
                        editable={!loading}
                      />
                      {password.length > 0 && (
                        <View style={styles.passwordStrengthContainer}>
                          <View style={styles.strengthBars}>
                            {[1, 2, 3].map((i) => (
                              <View
                                key={i}
                                style={[
                                  styles.strengthBar,
                                  {
                                    backgroundColor:
                                      (passwordStrength === 'weak' && i <= 1) ||
                                      (passwordStrength === 'medium' && i <= 2) ||
                                      (passwordStrength === 'strong' && i <= 3)
                                        ? getPasswordStrengthColor()
                                        : 'rgba(148, 163, 184, 0.2)',
                                  },
                                ]}
                              />
                            ))}
                          </View>
                          <Text
                            style={[
                              styles.strengthLabel,
                              { color: getPasswordStrengthColor() },
                            ]}>
                            {getPasswordStrengthLabel()}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.passwordHint}>
                        Mínimo 8 caracteres. Incluye mayúsculas y números para mayor seguridad.
                      </Text>
                    </View>

                    <View>
                      <FormInput
                        label="Confirmar Contraseña"
                        placeholder="••••••••"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        editable={!loading}
                      />
                      {confirmPassword.length > 0 && password !== confirmPassword && (
                        <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
                      )}
                      {confirmPassword.length > 0 && password === confirmPassword && (
                        <Text style={styles.successText}>✓ Las contraseñas coinciden</Text>
                      )}
                    </View>

                    <Pressable
                      style={styles.termsRow}
                      onPress={() => setTermsAccepted((prev) => !prev)}
                      disabled={loading}>
                      <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]} />
                      <Text style={styles.termsText}>
                        Acepto los <Text style={styles.link}>términos y condiciones</Text> de servicio
                      </Text>
                    </Pressable>

                    <PrimaryButton
                      label="CREAR CUENTA"
                      onPress={handleSignup}
                      loading={loading}
                      disabled={!email.trim() || !isPasswordValid() || !termsAccepted || loading}
                    />

                    <View style={styles.dividerRow}>
                      <View style={styles.divider} />
                      <Text style={styles.dividerText}>o regístrate con</Text>
                      <View style={styles.divider} />
                    </View>

                    <Pressable
                      style={styles.googleButton}
                      onPress={() => WebBrowser.openBrowserAsync(`${Config.frontendWebUrl}/signup`)}
                      disabled={loading}>
                      <View style={styles.googleIconWrapper}>
                        <Image
                          source={require('@/assets/images/g-logo.png')}
                          style={{ width: 18, height: 18 }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.googleLabel}>Google</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                  <Pressable onPress={() => router.push('/login')} disabled={loading}>
                    <Text style={styles.footerLink}>Inicia sesión</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 48,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.7)',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: '#00aeef',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardHeader: {
    marginBottom: 20,
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
  form: {
    gap: 16,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    minWidth: 40,
  },
  passwordHint: {
    color: '#7c8fa3',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  successText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#00aeef',
    borderColor: '#00aeef',
  },
  termsText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  link: {
    color: '#00aeef',
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
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
  googleLabel: {
    color: '#e2e8f0',
    fontWeight: '800',
    fontSize: 15,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
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
