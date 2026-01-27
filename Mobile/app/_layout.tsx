import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigation() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const [rootSegment] = segments;
    const isLoginRoute = rootSegment === 'login';
    const isCompleteProfileRoute = rootSegment === 'complete-profile';
    const isAuthRoute = isLoginRoute || isCompleteProfileRoute;
    const isRootPath = segments.length === 0;

    if (!user) {
      if (!isLoginRoute) {
        router.replace('/login');
      }
      return;
    }

    if (!user.hasCompletedProfile) {
      if (!isCompleteProfileRoute) {
        router.replace('/complete-profile');
      }
      return;
    }

    if (isAuthRoute || isRootPath) {
      router.replace('/(tabs)/dashboard');
    }
  }, [loading, router, segments, user]);

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  if (loading) {
    return (
      <ThemeProvider value={theme}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="complete-profile"
          options={{ headerShown: false, title: 'Completar perfil' }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
