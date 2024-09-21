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
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      router.replace('/home');
    }
    else{
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