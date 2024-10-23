import { signIn, getProfile } from '@/scripts/api/auth';
import { setStorageProfile, setStorageToken } from '@/scripts/utils/storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Linking from 'expo-linking';

const KAKAO_CLIENT_ID = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleRedirect(url);
            }
        });
        Linking.addEventListener('url', (event) => handleRedirect(event.url));
        return () => {
            // Todo: RemoveEventListener
        };
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        const token = await signIn(email, password);
        if (token) {
            try {
                await setStorageToken(token);
                const profile = await getProfile();
                if (profile) {
                    await setStorageProfile(profile);
                }
                Toast.show({
                    type: 'success',
                    text1: '로그인 성공',
                });
                router.replace('/(tabs)/home');
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: '로그인 실패',
                text2: '이메일 혹은 비밀번호가 올바르지 않습니다.'
            });
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        router.push('/signup');
    }

    const handleKakao = async () => {
        try {
            router.push({
                pathname: 'https://kauth.kakao.com/oauth/authorize',
                params: {
                    client_id: KAKAO_CLIENT_ID,
                    redirect_uri: `${API_URL}/auth/kakao`,
                    response_type: 'code',
                },
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Todo: 구글 로그인과 분리
    const handleRedirect = async (url: string) => {
        setLoading(true);
        const { queryParams } = Linking.parse(url);
        console.log(queryParams);
        const token = {
            access_token: queryParams?.access_token as string,
            refresh_token: queryParams?.refresh_token as string,
        };
        if (token) {
            try {
                await setStorageToken(token);
                const profile = await getProfile();
                if (!profile) {
                    throw new Error('Failed to login');
                }
                await setStorageProfile(profile);
                Toast.show({
                    type: 'success',
                    text1: '로그인 성공',
                })
                if(!profile.username || !profile.studentId){
                    return router.replace('/oauth-profile');
                }
                return router.replace('/(tabs)/home');
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        else {
            Toast.show({
                type: 'error',
                text1: '로그인 실패',
            });
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>로그인</Text>
                    <TextInput
                        label="이메일"
                        disabled={loading}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        label="비밀번호"
                        disabled={loading}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <Button
                        mode="contained"
                        disabled={loading}
                        loading={loading}
                        onPress={handleLogin}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        로그인
                    </Button>
                    <Button
                        mode="contained"
                        disabled={loading}
                        onPress={handleSignUp}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        회원가입
                    </Button>
                    <Button
                        mode="contained"
                        disabled={loading}
                        onPress={handleKakao}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        kakao_test
                    </Button>
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
        padding: 36,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        zIndex: 1,
    },
    card: {
        width: '100%',
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
});