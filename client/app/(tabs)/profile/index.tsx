import User from "@/interfaces/user";
import eventEmitter from "@/scripts/utils/eventEmitter";
import { getStorageProfile, removeStorageToken } from "@/scripts/utils/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Text, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function Mypage() {
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [profile, setProfile] = useState<User>();
    const { colors } = useTheme();

    useEffect(() => {
        eventEmitter.on('refresh_profile', fetchProfile);
        fetchProfile();

        return () => {
            eventEmitter.off('refresh_profile', fetchProfile);
        }
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
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
        await removeStorageToken();
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
                <Card mode="contained" style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        {profile ? (
                            <>
                                <Avatar.Icon size={120} icon="account" style={styles.avatar} />
                                <Text variant="titleLarge" style={styles.userName}>{profile.username}</Text>
                                <Text variant="bodyMedium" style={[styles.userId, { color: colors.secondary }]}>학번: {profile.studentId}</Text>
                            </>
                        ) : (
                            <Text>프로필을 불러올 수 없습니다.</Text>
                        )}
                    </Card.Content>
                </Card>
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
                        onPress={() => router.push('/profile/edit',)}
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
        padding: 18,
    },
    avatar: {
        marginBottom: 20,
    },
    userName: {
        fontSize: 24,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    userId: {
        fontSize: 16,
    },
    buttonGroup: {
        width: '100%',
        marginTop: 24,
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
    card: {
        width: "100%",
        padding: 8,
    },
    cardContent: {
        alignItems: 'center',
    },
});
