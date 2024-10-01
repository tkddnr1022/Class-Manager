import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [userRole, setUserRole] = useState('');

  const getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }
  useEffect(() => {
    getUserRole();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
        name="mypage"
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
          tabBarButton: (props) => (userRole === 'professor' || userRole === 'admin') ? <TouchableOpacity {...props} /> : null,
        }}
      />
      <Tabs.Screen
        name="entry"
        options={{
          title: '출석',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'checkmark' : 'checkmark-outline'} color={color} />
          ),
          tabBarButton: (props) => (userRole === 'student' || userRole === 'admin') ? <TouchableOpacity {...props} /> : null,
        }}
      />
    </Tabs>
  );
}
