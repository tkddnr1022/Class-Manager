import { useFonts } from 'expo-font';
import { Href, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useState, createContext, useContext } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { getProfile } from '@/scripts/api/auth';
import { healthCheck } from '@/scripts/api/health';
import { getStorageToken, setStorageProfile } from '@/scripts/utils/storage';
import { router } from 'expo-router';
import eventEmitter from '@/scripts/utils/eventEmitter';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => { },
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
  const [targetPage, setTargetPage] = useState<Href>();
  const [isDark, setIsDark] = useState(false);
  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);
  const toggleTheme = () => setIsDark((prev) => !prev); // 테마 전환 함수

  useEffect(() => {
    eventEmitter.on("hide_splash", hideSplash);
    checkSession();

    return () => {
      eventEmitter.off('hide_splash', hideSplash);
    }
  }, []);

  useEffect(() => {
    if (loaded && targetPage) {
      router.replace(targetPage);
    }
  }, [loaded, targetPage]);

  const hideSplash = () => {
    SplashScreen.hideAsync();
  }

  const checkSession = async () => {
    if (await checkServerStatus()) {
      await checkLoginStatus();
    }
  };

  const checkServerStatus = async () => {
    const status = await healthCheck();
    if (!status) {
      setTargetPage('/error');
      return false;
    }
    if (status.info.mongodb.status !== "up") {
      setTargetPage('/error');
      return false;
    }
    if (status.status !== "ok") {
      setTargetPage('/error');
      return false;
    }
    return true;
  };

  const checkLoginStatus = async () => {
    try {
      const token = await getStorageToken();
      if (!token) {
        return setTargetPage('/login');
      }

      const profile = await getProfile();
      if (!profile) {
        return setTargetPage('/login');
      }

      await setStorageProfile(profile);
      if (!profile.username || !profile.studentId) {
        return setTargetPage('/oauth-profile');
      }

      setTargetPage('/(tabs)/home');
    } catch (error) {
      console.error(error);
      setTargetPage('/login');
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
