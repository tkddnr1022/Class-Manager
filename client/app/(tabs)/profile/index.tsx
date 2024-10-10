import eventEmitter from "@/scripts/utils/eventEmitter";
import { getStorageProfile } from "@/scripts/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function Mypage() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        eventEmitter.on('refresh_profile', fetchProfile);
        fetchProfile();

        return () => {
            eventEmitter.off('refresh_profile', fetchProfile);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const profile = await getStorageProfile();
            if (profile) {
                setUsername(profile.username);
                setStudentId(profile.studentId);
                setEmail(profile.email);
            }
        } catch (error) {
            console.error(error);
        }
    }

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
            <Avatar.Icon size={100} icon="account" style={styles.avatar} />
            <Text variant="titleLarge" style={styles.userName}>{username}</Text>
            <Text variant="bodyMedium" style={styles.userId}>학번: {studentId}</Text>
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
                    onPress={() => router.push({
                        pathname: '/profile/edit',
                        params: {
                            username,
                            studentId,
                            email,
                        }
                    })}
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
        backgroundColor: '#6200ee',
    },
    userName: {
        marginBottom: 4,
        fontWeight: 'bold',
    },
    userId: {
        marginBottom: 24,
        color: '#6b6b6b',
    },
    buttonGroup: {
        width: '100%',
        marginTop: 32,
    },
    button: {
        marginBottom: 12,
    },
});
