import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
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

import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAuth } from '@/context/auth-context';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Debes obtener estos IDs en Google Cloud Console
    androidClientId: 'TU_ANDROID_CLIENT_ID',
    iosClientId: 'TU_IOS_CLIENT_ID',
    webClientId: 'TU_WEB_CLIENT_ID',
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
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login failed', error);
      // Aquí podrías mostrar una alerta con el error
    } finally {
      setLoading(false);
    }
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
                <Text style={styles.logo}>ATHLET<Text style={styles.logoAccent}>IA</Text></Text>
                <Text style={styles.subtitle}>¡Comienza tu transformación hoy!</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>Bienvenido</Text>
                  <Text style={styles.caption}>Inicia sesión en tu cuenta</Text>
                </View>

                <View style={styles.form}>
                  <FormInput
                    label="Email o usuario"
                    placeholder="tu@email.com"
                    iconName="mail"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <FormInput
                    label="Contraseña"
                    placeholder="••••••••"
                    iconName="lock"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />

                  <View style={styles.rowBetween}>
                    <Pressable style={styles.rememberRow} onPress={() => setRememberMe((prev) => !prev)}>
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                      <Text style={styles.rememberText}>Recuérdame</Text>
                    </Pressable>
                    <Pressable>
                      <Text style={styles.link}>Olvidé mi contraseña</Text>
                    </Pressable>
                  </View>

                  <PrimaryButton
                    label="ENTRAR"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={!email.trim() || !password.trim()}
                  />

                  <View style={styles.dividerRow}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>o continúa con</Text>
                    <View style={styles.divider} />
                  </View>

                  <Pressable 
                    style={styles.googleButton}
                    onPress={() => promptAsync()}
                    disabled={!request}
                  >
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
                <Text style={styles.footerText}>¿No tienes cuenta?</Text>
                <Pressable>
                  <Text style={styles.footerLink}>Regístrate aquí</Text>
                </Pressable>
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
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  logo: {
    fontSize: 42,
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
