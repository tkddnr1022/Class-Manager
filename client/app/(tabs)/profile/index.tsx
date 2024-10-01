import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function Mypage() {
    const [loading, setLoading] = useState(false);
    const userName = "홍길동"; // 유저 이름
    const userId = "20240001"; // 학번

    const logoutHandler = async () => {
        setLoading(true);
        await AsyncStorage.clear();
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        Toast.show({
            type: 'success',
            text1: '로그아웃 되었습니다.'
        });
        setLoading(false);
        router.replace('/login');
    }

    return (
        <View style={styles.container}>
            {/* 상단 유저 정보 */}
            <Avatar.Icon size={100} icon="account" style={styles.avatar} />
            <Text variant="titleLarge" style={styles.userName}>{userName}</Text>
            <Text variant="bodyMedium" style={styles.userId}>학번: {userId}</Text>

            {/* 하단 버튼 그룹 */}
            <View style={styles.buttonGroup}>
                <Button
                    mode="contained-tonal"
                    onPress={logoutHandler}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    로그아웃
                </Button>
                <Button
                    mode="contained-tonal"
                    onPress={() => router.push('/profile/edit')}
                    style={styles.button}
                >
                    회원정보 수정
                </Button>
                <Button
                    mode="contained-tonal"
                    onPress={() => router.push('/profile/settings')}
                    style={styles.button}
                >
                    앱 설정
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        marginBottom: 16,
        backgroundColor: '#6200ee', // Material Design Primary 색상
    },
    userName: {
        marginBottom: 4,
        fontWeight: 'bold',
    },
    userId: {
        marginBottom: 24,
        color: '#6b6b6b', // Material Design 중간 톤 색상
    },
    buttonGroup: {
        width: '100%',
        marginTop: 32,
    },
    button: {
        marginBottom: 12,
    },
});
