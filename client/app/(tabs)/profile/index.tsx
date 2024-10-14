import User from "@/interfaces/user";
import eventEmitter from "@/scripts/utils/eventEmitter";
import { getStorageProfile } from "@/scripts/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function Mypage() {
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [profile, setProfile] = useState<User>();

    useEffect(() => {
        eventEmitter.on('refresh_profile', fetchProfile);
        fetchProfile();

        return () => {
            eventEmitter.off('refresh_profile', fetchProfile);
        }
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const profile = await getStorageProfile();
            if (profile) {
                setProfile(profile);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const logoutHandler = async () => {
        setLogoutLoading(true);
        await AsyncStorage.clear();
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        Toast.show({
            type: 'success',
            text1: '로그아웃 되었습니다.'
        });
        setLogoutLoading(false);
        router.replace('/login');
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size={'large'} />
                    <Text>불러오는 중..</Text>
                </View>
            ) : (<>
                {profile ? (
                    <>
                        <Avatar.Icon size={120} icon="account" style={styles.avatar} />
                        <Text variant="titleLarge" style={styles.userName}>{profile.username}</Text>
                        <Text variant="bodyMedium" style={styles.userId}>학번: {profile.studentId}</Text>
                    </>
                ) : (
                    <Text>프로필을 불러올 수 없습니다.</Text>
                )}
                <View style={styles.buttonGroup}>
                    <Button
                        mode="contained"
                        onPress={logoutHandler}
                        loading={logoutLoading}
                        disabled={logoutLoading}
                        style={styles.button}
                    >
                        로그아웃
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => router.push({
                            pathname: '/profile/edit',
                        })}
                        style={styles.button}
                    >
                        회원정보 수정
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => router.push('/profile/settings')}
                        style={styles.button}
                    >
                        앱 설정
                    </Button>
                </View>
            </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    avatar: {
        marginBottom: 24,
        backgroundColor: '#6200ee',
    },
    userName: {
        fontSize: 24,
        marginBottom: 4,
        fontWeight: 'bold',
        color: '#333',
    },
    userId: {
        fontSize: 16,
        marginBottom: 24,
        color: '#6b6b6b',
    },
    buttonGroup: {
        width: '100%',
        marginTop: 32,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        marginBottom: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
