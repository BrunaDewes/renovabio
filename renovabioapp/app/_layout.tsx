import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from '../context/auth-context';
import { configureNotifications, syncDailyMissionReminder } from '../utils/notifications';

const publicRoutes = ['/login', '/cadastro', '/recuperar'];

function AuthGate() {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady, user } = useAuth();

  useEffect(() => {
    void configureNotifications();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    if (user && isPublicRoute) {
      router.replace('/home');
    }
  }, [isReady, pathname, router, user]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    void syncDailyMissionReminder(user.id);
  }, [user?.id]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1B4332' }}>
        <ActivityIndicator color="#f8f4d9" size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
