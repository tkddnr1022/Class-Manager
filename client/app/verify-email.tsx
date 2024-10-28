import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getStorageProfile, removeStorageToken, setStorageProfile } from '@/scripts/utils/storage';
import eventEmitter from '@/scripts/utils/eventEmitter';
import { verifyEmail, sendEmail } from '@/scripts/api/auth';

export default function VerifyEmailPage() {
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [sendLoading, setSendLoading] = useState<boolean>(true);
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);

    useEffect(() => {
        fetchEmail();
        sendVerification();
        eventEmitter.emit('hide_splash');
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1000) {
                        clearInterval(timer); // 타이머가 0에 도달하면 정지
                        return 0; // 남은 시간을 0으로 설정
                    }
                    return prev - 1000; // 1초 감소
                });
            }, 1000);
        }

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [remainingTime]);

    const fetchEmail = async () => {
        try {
            const profile = await getStorageProfile();
            if (!profile) {
                throw new Error();
            }
            setEmail(profile.email);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: '오류 발생',
                text2: error.toString(),
            });
            console.error(error.toString());
        }
    };

    const sendVerification = async () => {
        setSendLoading(true);
        try {
            const profile = await getStorageProfile();
            if (!profile) {
                throw new Error();
            }
            const result = await sendEmail();
            if (result?.isSuccess) {
                const expiresIn = 10 * 60 * 1000; // 10분
                setRemainingTime(expiresIn);
                Toast.show({
                    type: 'success',
                    text1: '이메일 전송 성공',
                    text2: '인증 코드를 전송하였습니다.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: '이메일 전송 실패',
                    text2: '이메일 전송에 문제가 발생했습니다.',
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: '오류 발생',
                text2: error.toString(),
            });
            console.error(error.toString());
        } finally {
            setSendLoading(false);
        }
    };

    const handleVerify = async () => {
        setVerifyLoading(true);
        try {
            const profile = await getStorageProfile();
            if (!profile) {
                throw new Error();
            }
            const result = await verifyEmail(code);
            if (result?.isSuccess) {
                Toast.show({
                    type: 'success',
                    text1: '가입 성공',
                    text2: '이메일 인증이 완료되었습니다.'
                });
                console.log(profile);
                await setStorageProfile({ ...profile, verified: true });
                return router.replace('/(tabs)/home');
            } else {
                Toast.show({
                    type: 'error',
                    text1: '인증 오류',
                    text2: '인증 코드가 올바르지 않습니다.',
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: '인증 실패',
                text2: error.toString(),
            });
            console.error(error.toString());
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        await removeStorageToken();
        Toast.show({
            type: 'success',
            text1: '로그아웃 되었습니다.'
        });
        setLogoutLoading(false);
        router.replace('/login');
    };

    const isFormValid = (): boolean => {
        return code.length > 0;
    };

    const formatRemainingTime = (time: number): string => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    return (
        <View style={styles.container}>
            <Card mode="contained" style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>이메일 인증</Text>
                    <Text style={styles.email}>{email}</Text>
                    <Text style={styles.message}>위 이메일로 인증 코드를 전송합니다.</Text>
                    <TextInput
                        label="코드"
                        value={code}
                        onChangeText={setCode}
                        disabled={verifyLoading || logoutLoading || sendLoading}
                        style={styles.input}
                        keyboardType='numeric'
                    />
                    <Button
                        mode="contained"
                        onPress={handleVerify}
                        disabled={verifyLoading || logoutLoading || sendLoading || !isFormValid()}
                        loading={verifyLoading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        인증
                    </Button>
                    <Button
                        mode="contained"
                        onPress={sendVerification}
                        disabled={logoutLoading || sendLoading || remainingTime > 0}
                        loading={sendLoading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        인증 코드 받기
                        {remainingTime > 0 && (
                            <Text>({formatRemainingTime(remainingTime)})</Text>
                        )}
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleLogout}
                        disabled={verifyLoading || logoutLoading}
                        loading={logoutLoading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        로그아웃
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
        padding: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        marginVertical: 12,
    },
    button: {
        marginTop: 16,
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    errorMessage: {
        color: 'red',
        textAlign: 'left',
    },
    successMessage: {
        color: 'green',
        textAlign: 'left',
    },
    card: {
        width: '100%',
        padding: 8,
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 18,
    },
    message: {
        textAlign: 'center',
    },
});
