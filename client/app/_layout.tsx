import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useState, createContext, useContext } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { getProfile } from '@/scripts/api/auth';
import { healthCheck } from '@/scripts/api/health';
import { getStorageToken, setStorageProfile } from '@/scripts/utils/storage';
import { router } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(110, 37, 246)',
    background: '#f5f7fa',
    primaryContainer: 'rgb(110, 37, 246)',
    elevation: {
      level0: "transparent",
      level1: "white",
      level2: "white",
      level3: "white",
      level4: "white",
      level5: "white",
    },
    surfaceVariant: "white",
  },
  roundness: 6,
};

const DarkTheme = {
  ...MD3DarkTheme,
  roundness: 6,
};

export function useTheme() {
  return useContext(ThemeContext);
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);
  const toggleTheme = () => setIsDark((prev) => !prev); // 테마 전환 함수

  useEffect(() => {
    const checkSession = async () => {
      const isServerOnline = await checkServerStatus();
      if (!isServerOnline) {
        SplashScreen.hideAsync();
        return;
      }
      await checkLoginStatus();
      setSessionChecked(true);
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (loaded && sessionChecked) {
      SplashScreen.hideAsync();
    }
  }, [loaded, sessionChecked]);

  const checkServerStatus = async () => {
    const status = await healthCheck();
    if (!status) {
      return false;
    }
    if (status.info.mongodb.status !== "up") {
      return false;
    }
    if (status.status !== "ok") {
      return false;
    }
    return true;
  };

  const checkLoginStatus = async () => {
    try {
      const token = await getStorageToken();
      if (!token) {
        return router.replace('/login');
      }

      const profile = await getProfile();
      if (profile) {
        await setStorageProfile(profile);
        if (!profile.username || !profile.studentId) {
          return router.replace('/oauth-profile');
        }
        return router.replace('/(tabs)/home');
      }

      return router.replace('/login');
    } catch (error) {
      console.error(error);
      return router.replace('/login');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast />
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
