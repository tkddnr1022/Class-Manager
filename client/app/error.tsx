import eventEmitter from '@/scripts/utils/eventEmitter';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function Error() {

  useEffect(() => {
    eventEmitter.emit('hide_splash');
  }, []);

  return (
    <View style={styles.container}>
      <Text>서버에 연결할 수 없습니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});