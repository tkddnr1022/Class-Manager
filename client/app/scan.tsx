import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ScanResult() {
    const { data } = useLocalSearchParams(); // 전달된 데이터 가져오기

    return (
        <View style={styles.container}>
            <Text style={styles.resultText}>{data}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultText: {
        fontSize: 18,
        textAlign: 'center',
    },
});
