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
  signIn: (token: string, hasCompletedProfile: boolean) => Promise<void>;
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

  const signIn = useCallback(async (token: string, hasCompletedProfile: boolean) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.token, token],
        [STORAGE_KEYS.profile, hasCompletedProfile ? 'true' : 'false'],
      ]);
      setUser({ token, hasCompletedProfile });
    } catch (error) {
      console.error('Failed to sign in', error);
      throw error;
    }
  }, []);

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
      signOut,
      setProfileCompleted,
      refresh: loadSession,
    }),
    [user, loading, signIn, signOut, setProfileCompleted, loadSession],
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
