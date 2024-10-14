import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const LightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: 'rgb(110, 37, 246)',
      onPrimary: 'rgb(255, 255, 255)',
      background: '#f5f7fa',
      primaryContainer: 'rgb(110, 37, 246)',
    },
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={colorScheme === 'dark' ? MD3DarkTheme : LightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark'
              ? MD3DarkTheme.colors.background
              : LightTheme.colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </PaperProvider>
  );
}
