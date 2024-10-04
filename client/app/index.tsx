import { getProfile } from '@/scripts/api/auth';
import { getStorageToken } from '@/scripts/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

export default function Index() {

  useEffect(() => {
    // for dev
    setTimeout(checkLoginStatus, 2000);
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await getStorageToken();
      if (!token) {
        return router.replace('/login');
      }

      // Todo: validateToken 메소드 구현
      const isTokenValid = await getProfile();
      if (isTokenValid) {
        return router.replace('/(tabs)/home');
      }

      router.replace('/login');
    } catch (error) {
      console.error(error);
      router.replace('/login');
    }
  };

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6200ee" />
      <Text>세션 확인중..</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});