import { router } from 'expo-router';
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Colors } from '@/constants/theme';

export default function VerificationEmailSentScreen() {
  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfzNczDkf9uLXuT1nMGjw-cBLfX1oy1gPGgyW5DWQ3gakna78yUDIUVlFR0pN-MEvTHcb815XiqC-3T0SF8B7NzuOR8Bow1YiVoXDGCB_PSkmKCD24KTzf9vtAT15fLKEPItM-CA9rKf3FX0o6Y1o2UjFzYxYncSW0BCThZuLo59shXiKfhxqHngVkIN8PpjDjiEkbj-Riq6aL29LbGFPApEQ5fnRVdxLHOC-TPb2R-V_G7MqyXAljKdYBx3aP4DBnURhoSySSx14',
      }}
      style={styles.background}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Email Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✉️</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Verifica tu Email</Text>

          {/* Description */}
          <Text style={styles.description}>
            Se ha enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu
            bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
          </Text>

          {/* Additional Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Si no ves el email, revisa tu carpeta de spam o solicita que se envíe nuevamente.
            </Text>
          </View>

          {/* Back to Login Button */}
          <PrimaryButton onPress={handleBackToLogin} label="Volver al Login" />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginVertical: 'auto',
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: 280,
  },
  infoBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    maxWidth: 280,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
