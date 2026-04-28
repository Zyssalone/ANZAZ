import React, { createContext, useContext, useMemo, useState } from 'react';
import { api, clearToken, setToken } from '../utils/api';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  level: number;
  xp: number;
  points: number;
  species_count?: string | number;
  rank?: string | number;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setAuthToken] = useState<string | null>(null);

  const applySession = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setAuthToken(nextToken);
    setUser(nextUser);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    login: async (email, password) => {
      const session = await api.auth.login(email, password);
      applySession(session.token, session.user);
    },
    register: async (name, email, password) => {
      const session = await api.auth.register(name, email, password);
      applySession(session.token, session.user);
    },
    refreshUser: async () => {
      const nextUser = await api.auth.me();
      setUser(nextUser);
    },
    logout: () => {
      clearToken();
      setAuthToken(null);
      setUser(null);
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
