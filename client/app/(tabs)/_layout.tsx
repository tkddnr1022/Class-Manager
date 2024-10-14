import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const { colors } = useTheme();
  const [userRole, setUserRole] = useState<string[]>();

  const getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    if (role) {
      setUserRole(JSON.parse(role));
    }
  }
  useEffect(() => {
    getUserRole();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.onSurface,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.outline,
          height: 53,
        },
        tabBarLabelStyle: {
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: colors.surfaceVariant,
        },
        headerTintColor: colors.onSurfaceVariant,
      }}
      sceneContainerStyle={{
        backgroundColor: colors.background,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: '수업',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
          href: (userRole?.includes('professor') || userRole?.includes('admin')) ? '/(tabs)/course' : null,
        }}
      />
      <Tabs.Screen
        name="entry"
        options={{
          title: '출석',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'checkmark' : 'checkmark-outline'} color={color} />
          ),
          href: (userRole?.includes('student') || userRole?.includes('admin')) ? '/(tabs)/entry' : null,
        }}
      />
    </Tabs>
  );
}
