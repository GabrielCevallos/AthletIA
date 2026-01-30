import { Config } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEYS = {
  token: 'auth:token',
  profile: 'auth:hasCompletedProfile',
};

type AuthUser = {
  token: string;
  hasCompletedProfile: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  setProfileCompleted: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      const [storedToken, storedProfile] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.token),
        AsyncStorage.getItem(STORAGE_KEYS.profile),
      ]);

      if (storedToken) {
        setUser({
          token: storedToken,
          hasCompletedProfile: storedProfile === 'true',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to restore auth session', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const handleAuthSuccess = useCallback(async (accessToken: string) => {
     // Obtener información del usuario para verificar si completó el perfil
      const userResponse = await fetch(`${Config.apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const userResult = await userResponse.json();
      
      let hasCompletedProfile = false;
      
      if (userResult.success && userResult.data) {
        hasCompletedProfile = !!userResult.data.hasProfile;
      }

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.token, accessToken],
        [STORAGE_KEYS.profile, hasCompletedProfile ? 'true' : 'false'],
      ]);
      setUser({ token: accessToken, hasCompletedProfile });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${Config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Error al iniciar sesión');
      }

      const { accessToken } = result.data;
      await handleAuthSuccess(accessToken);
    } catch (error) {
      console.error('Failed to sign in', error);
      throw error;
    }
  }, [handleAuthSuccess]);

  const signInWithGoogle = useCallback(async (token: string) => {
    try {
      // Necesitarás crear este endpoint en tu backend
      const response = await fetch(`${Config.apiUrl}/auth/google/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Error en Google Login');
      }

      const { accessToken } = result.data;
      await handleAuthSuccess(accessToken);
    } catch (error) {
      console.error('Failed to sign in with Google', error);
      throw error;
    }
  }, [handleAuthSuccess]);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.profile]);
      setUser(null);
    } catch (error) {
      console.error('Failed to sign out', error);
      throw error;
    }
  }, []);

  const setProfileCompleted = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.profile, 'true');
      setUser((current) => (current ? { ...current, hasCompletedProfile: true } : current));
    } catch (error) {
      console.error('Failed to update profile flag', error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signInWithGoogle,
      signOut,
      setProfileCompleted,
      refresh: loadSession,
    }),
    [user, loading, signIn, signInWithGoogle, signOut, setProfileCompleted, loadSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
