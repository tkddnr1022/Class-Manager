import { getProfile } from '@/scripts/api/auth';
import { healthCheck } from '@/scripts/api/health';
import { getStorageToken } from '@/scripts/utils/storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function Index() {
  const [error, setError] = useState(false);

  useEffect(() => {
    // for dev
    initClient(0);
  }, []);

  const initClient = async (tries: number) => {
    if (tries > 3) {
      Toast.show({
        type: "error",
        text1: "연결 실패",
        text2: "서버에 연결할 수 없습니다.",
      });
      setError(true);
      return;
    }
    if (await checkServerStatus()) {
      await checkLoginStatus();
    }
    else {
      initClient(tries + 1);
    }
  }

  const checkServerStatus = async () => {
    const status = await healthCheck();
    if (!status) {
      Toast.show({
        type: "error",
        text1: "서버 오류",
        text2: "서버가 오프라인입니다.",
      });
      return false;
    }
    if (status.info.mongodb.status != "up") {
      Toast.show({
        type: "error",
        text1: "서버 오류",
        text2: "DB 서버에 연결할 수 없습니다.",
      });
      return false;
    }
    if (status.status != "ok") {
      Toast.show({
        type: "error",
        text1: "서버 오류",
        text2: status.error.toString(),
      });
      return false;
    }
    return true;
  }

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

      return router.replace('/login');
    } catch (error) {
      console.error(error);
      return router.replace('/login');
    }
  };

  return (
    error ? (
      <View style={styles.loadingContainer}>
        <Text>서버에 연결할 수 없습니다.</Text>
      </View>
    ) : (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>세션 확인중..</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});