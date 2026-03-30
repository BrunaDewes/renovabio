import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  pontuacao: number;
  photoUri?: string | null;
};

type AuthContextValue = {
  isReady: boolean;
  user: AuthUser | null;
  signIn: (nextUser: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (partialUser: Partial<AuthUser>) => Promise<void>;
};

const STORAGE_KEY = 'renovabio:user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getPhotoKey(userId: number) {
  return `renovabio:user-photo:${userId}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadStoredUser() {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue) {
          setUser(JSON.parse(storedValue) as AuthUser);
        }
      } finally {
        setIsReady(true);
      }
    }

    void loadStoredUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      user,
      async signIn(nextUser) {
        const storedPhotoUri = await AsyncStorage.getItem(getPhotoKey(nextUser.id));
        const normalizedUser = {
          ...nextUser,
          photoUri: nextUser.photoUri ?? storedPhotoUri ?? null,
        };
        setUser(normalizedUser);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));
      },
      async signOut() {
        setUser(null);
        await AsyncStorage.removeItem(STORAGE_KEY);
      },
      async updateUser(partialUser) {
        if (!user) {
          return;
        }

        const nextUser = { ...user, ...partialUser };
        setUser(nextUser);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));

        if (Object.prototype.hasOwnProperty.call(partialUser, 'photoUri')) {
          const photoKey = getPhotoKey(user.id);
          if (partialUser.photoUri) {
            await AsyncStorage.setItem(photoKey, partialUser.photoUri);
          } else {
            await AsyncStorage.removeItem(photoKey);
          }
        }
      },
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
