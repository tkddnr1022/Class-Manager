import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function Qrcode(){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>출석 QR코드</Text>
      <QRCode 
        value="https://example.com"  // QR 코드에 인코딩할 데이터
        size={200}                   // QR 코드 크기
        color="black"                // QR 코드 색상
        backgroundColor="white"      // 배경 색상
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
