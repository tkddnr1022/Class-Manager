import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useState, createContext, useContext } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

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
  components: {
    Card: {
      style: {
        borderRadius: 32,
        elevation: 0,
        shadowOpacity: 0,
      }
    }
  }
};

export function useTheme() {
  return useContext(ThemeContext);
}

export default function RootLayout() {
  const [isDark, setIsDark] = useState(false); // 다크모드 상태 관리
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const theme = useMemo(() => (isDark ? MD3DarkTheme : LightTheme), [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev); // 테마 전환 함수

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

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
