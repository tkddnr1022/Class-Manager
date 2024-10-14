import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

export default function Qrcode() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>출석 QR코드</Text>

          <QRCode
            value={`class-manager://entry/${id as string}`}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    padding: 8,
  },
});
