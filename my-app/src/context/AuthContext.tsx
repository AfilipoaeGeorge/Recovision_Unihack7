import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextValue = {
  loggedIn: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEY = 'recovision.auth.loggedIn';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const persisted = await AsyncStorage.getItem(STORAGE_KEY);
        setLoggedIn(persisted === 'true');
      } catch {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, []);

  const login = async () => {
    setLoggedIn(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore persistence errors
    }
  };

  const logout = async () => {
    setLoggedIn(false);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore persistence errors
    }
  };

  const value = useMemo(
    () => ({
      loggedIn,
      loading,
      login,
      logout,
    }),
    [loggedIn, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};


