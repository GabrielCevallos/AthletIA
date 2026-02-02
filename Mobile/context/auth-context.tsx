import { Config } from '@/constants';
import { clearSessionExpiredCallbacks, onSessionExpired } from '@/services/api-error-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
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
  role: 'auth:role',
};

type AuthUser = {
  token: string;
  hasCompletedProfile: boolean;
  role?: 'user' | 'admin' | 'moderator';
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  setProfileCompleted: () => Promise<void>;
  refresh: () => Promise<void>;
  handleSessionExpired: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSession = useCallback(async () => {
    console.log('🔄 [AuthContext] Iniciando loadSession');
    setLoading(true);
    try {
      const [storedToken, storedProfile, storedRole] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.token),
        AsyncStorage.getItem(STORAGE_KEYS.profile),
        AsyncStorage.getItem(STORAGE_KEYS.role),
      ]);

      console.log('📦 [AuthContext] Datos de AsyncStorage:');
      console.log('  - Token:', storedToken ? `Presente (${storedToken.substring(0, 20)}...)` : 'No presente');
      console.log('  - Profile:', storedProfile);
      console.log('  - Role:', storedRole);

      if (storedToken) {
        const userObj = {
          token: storedToken,
          hasCompletedProfile: storedProfile === 'true',
          role: (storedRole as AuthUser['role']) || undefined,
        };
        console.log('✅ [AuthContext] Usuario cargado:', { hasProfile: userObj.hasCompletedProfile, role: userObj.role });
        setUser(userObj);
      } else {
        console.log('❌ [AuthContext] No hay token guardado');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ [AuthContext] Failed to restore auth session', error);
      setUser(null);
    } finally {
      setLoading(false);
      console.log('✅ [AuthContext] loadSession completado');
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  // Registra el callback para sesión expirada
  useEffect(() => {
    clearSessionExpiredCallbacks();
    const handleSessionExpiredCallback = async () => {
      console.warn('Session expired callback triggered - logging out');
      try {
        await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.profile, STORAGE_KEYS.role]);
        setUser(null);
        router.replace('/login' as any);
      } catch (error) {
        console.error('Error during session expiration cleanup', error);
        setUser(null);
        router.replace('/login' as any);
      }
    };
    
    onSessionExpired(handleSessionExpiredCallback);
    
    return () => {
      clearSessionExpiredCallbacks();
    };
  }, []);

  const handleAuthSuccess = useCallback(async (accessToken: string) => {
     // Obtener información del usuario para verificar si completó el perfil
      const userResponse = await fetch(`${Config.apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const userResult = await userResponse.json();
      
      let hasCompletedProfile = false;
      let role: AuthUser['role'] | undefined;
      
      if (userResult.success && userResult.data) {
        hasCompletedProfile = !!userResult.data.hasProfile;
        const rawRole = typeof userResult.data.role === 'string' ? userResult.data.role : '';
        role = (rawRole.toLowerCase() as AuthUser['role']) || undefined;
      }

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.token, accessToken],
        [STORAGE_KEYS.profile, hasCompletedProfile ? 'true' : 'false'],
        [STORAGE_KEYS.role, role || ''],
      ]);
      setUser({ token: accessToken, hasCompletedProfile, role });
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
      await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.profile, STORAGE_KEYS.role]);
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

  const handleSessionExpired = useCallback(async () => {
    console.warn('Session expired - redirecting to login');
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.profile, STORAGE_KEYS.role]);
      setUser(null);
      router.replace('/login' as any);
    } catch (error) {
      console.error('Failed to handle session expiration', error);
      setUser(null);
      router.replace('/login' as any);
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
      handleSessionExpired,
    }),
    [user, loading, signIn, signInWithGoogle, signOut, setProfileCompleted, loadSession, handleSessionExpired],
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
